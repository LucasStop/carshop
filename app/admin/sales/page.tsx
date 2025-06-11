'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AdminService, AdminSale, AdminListResponse } from '@/services/admin';
import { usePermissions } from '@/hooks/use-permissions';
import { SaleFormDialog } from '@/components/admin/sale-form-dialog';

export default function AdminSalesPage() {
  const { canManageSales, canViewSales } = usePermissions();
  const [sales, setSales] = useState<AdminSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedSale, setSelectedSale] = useState<AdminSale | null>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState<AdminSale | null>(null);

  const perPage = 10;

  const loadSales = async (
    currentPage = page,
    currentSearch = search,
    currentStatus = statusFilter
  ) => {
    try {
      setLoading(true);
      const response: AdminListResponse<AdminSale> =
        await AdminService.getSales({
          page: currentPage,
          per_page: perPage,
          search: currentSearch || undefined,
          status: currentStatus || undefined,
        });

      setSales(response.data);
      setTotalPages(response.meta.last_page);
      setTotal(response.meta.total);
    } catch (error) {
      console.error('Erro ao carregar vendas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canViewSales()) {
      loadSales();
    }
  }, [page, canViewSales]);

  const handleSearch = () => {
    setPage(1);
    loadSales(1, search, statusFilter);
  };

  const handleEdit = (sale: AdminSale) => {
    setSelectedSale(sale);
    setIsFormDialogOpen(true);
  };

  const handleView = (sale: AdminSale) => {
    setSelectedSale(sale);
    setIsViewDialogOpen(true);
  };

  const handleDelete = (sale: AdminSale) => {
    setSaleToDelete(sale);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!saleToDelete) return;

    try {
      await AdminService.deleteSale(saleToDelete.id);
      await loadSales();
      setDeleteDialogOpen(false);
      setSaleToDelete(null);
    } catch (error) {
      console.error('Erro ao deletar venda:', error);
    }
  };

  const handleFormSubmit = async () => {
    setIsFormDialogOpen(false);
    setSelectedSale(null);
    await loadSales();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluída';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  if (!canViewSales()) {
    return (
      <Box p={3}>
        <Typography variant="h5" color="error">
          Acesso negado
        </Typography>
        <Typography>
          Você não tem permissão para acessar esta página.
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1">
          Gerenciar Vendas
        </Typography>
        {canManageSales() && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsFormDialogOpen(true)}
          >
            Nova Venda
          </Button>
        )}
      </Box>

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Buscar vendas"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por comprador, vendedor ou veículo..."
                onKeyPress={e => e.key === 'Enter' && handleSearch()}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="pending">Pendente</MenuItem>
                  <MenuItem value="completed">Concluída</MenuItem>
                  <MenuItem value="cancelled">Cancelada</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
              >
                Buscar
              </Button>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="textSecondary">
                Total: {total} vendas
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabela */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Veículo</TableCell>
              <TableCell>Comprador</TableCell>
              <TableCell>Vendedor</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Data da Venda</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : sales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Nenhuma venda encontrada
                </TableCell>
              </TableRow>
            ) : (
              sales.map(sale => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.id}</TableCell>
                  <TableCell>
                    {sale.car ? (
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {sale.car.brand?.name} {sale.car.model?.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {sale.car.year} - {sale.car.color}
                        </Typography>
                      </Box>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>
                    {sale.buyer ? (
                      <Box>
                        <Typography variant="body2">
                          {sale.buyer.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {sale.buyer.email}
                        </Typography>
                      </Box>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>
                    {sale.seller ? (
                      <Box>
                        <Typography variant="body2">
                          {sale.seller.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {sale.seller.email}
                        </Typography>
                      </Box>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      R$ {sale.price.toLocaleString('pt-BR')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(sale.status)}
                      color={getStatusColor(sale.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {format(new Date(sale.sale_date), 'dd/MM/yyyy', {
                      locale: ptBR,
                    })}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleView(sale)}
                      title="Visualizar"
                    >
                      <ViewIcon />
                    </IconButton>
                    {canManageSales() && (
                      <>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(sale)}
                          title="Editar"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(sale)}
                          title="Excluir"
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginação */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      {/* Dialog de Formulário */}
      <SaleFormDialog
        open={isFormDialogOpen}
        onClose={() => {
          setIsFormDialogOpen(false);
          setSelectedSale(null);
        }}
        onSubmit={handleFormSubmit}
        sale={selectedSale}
      />

      {/* Dialog de Visualização */}
      <Dialog
        open={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Detalhes da Venda</DialogTitle>
        <DialogContent>
          {selectedSale && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Informações da Venda
                </Typography>
                <Typography>
                  <strong>ID:</strong> {selectedSale.id}
                </Typography>
                <Typography>
                  <strong>Preço:</strong> R${' '}
                  {selectedSale.price.toLocaleString('pt-BR')}
                </Typography>
                <Typography>
                  <strong>Status:</strong>{' '}
                  <Chip
                    label={getStatusLabel(selectedSale.status)}
                    color={getStatusColor(selectedSale.status) as any}
                    size="small"
                  />
                </Typography>
                <Typography>
                  <strong>Data da Venda:</strong>{' '}
                  {format(
                    new Date(selectedSale.sale_date),
                    'dd/MM/yyyy HH:mm',
                    {
                      locale: ptBR,
                    }
                  )}
                </Typography>
                {selectedSale.notes && (
                  <Typography>
                    <strong>Observações:</strong> {selectedSale.notes}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Veículo
                </Typography>
                {selectedSale.car && (
                  <Box>
                    <Typography>
                      <strong>Marca:</strong> {selectedSale.car.brand?.name}
                    </Typography>
                    <Typography>
                      <strong>Modelo:</strong> {selectedSale.car.model?.name}
                    </Typography>
                    <Typography>
                      <strong>Ano:</strong> {selectedSale.car.year}
                    </Typography>
                    <Typography>
                      <strong>Cor:</strong> {selectedSale.car.color}
                    </Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Comprador
                </Typography>
                {selectedSale.buyer && (
                  <Box>
                    <Typography>
                      <strong>Nome:</strong> {selectedSale.buyer.name}
                    </Typography>
                    <Typography>
                      <strong>Email:</strong> {selectedSale.buyer.email}
                    </Typography>
                    <Typography>
                      <strong>Telefone:</strong> {selectedSale.buyer.phone}
                    </Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Vendedor
                </Typography>
                {selectedSale.seller && (
                  <Box>
                    <Typography>
                      <strong>Nome:</strong> {selectedSale.seller.name}
                    </Typography>
                    <Typography>
                      <strong>Email:</strong> {selectedSale.seller.email}
                    </Typography>
                    <Typography>
                      <strong>Telefone:</strong> {selectedSale.seller.phone}
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsViewDialogOpen(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir esta venda? Esta ação não pode ser
            desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
