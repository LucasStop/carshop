'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Pagination,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  AdminService,
  AdminAddress,
  AdminListResponse,
} from '@/services/admin';
import { usePermissions } from '@/hooks/use-permissions';

export default function AdminAddressesPage() {
  const { canViewAddresses } = usePermissions();
  const [addresses, setAddresses] = useState<AdminAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [selectedAddress, setSelectedAddress] = useState<AdminAddress | null>(
    null
  );
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const perPage = 10;
  const brazilianStates = [
    'AC',
    'AL',
    'AP',
    'AM',
    'BA',
    'CE',
    'DF',
    'ES',
    'GO',
    'MA',
    'MT',
    'MS',
    'MG',
    'PA',
    'PB',
    'PR',
    'PE',
    'PI',
    'RJ',
    'RN',
    'RS',
    'RO',
    'RR',
    'SC',
    'SP',
    'SE',
    'TO',
  ];

  const loadAddresses = async (
    currentPage = page,
    currentSearch = search,
    currentCity = cityFilter,
    currentState = stateFilter
  ) => {
    try {
      setLoading(true);
      const response: AdminListResponse<AdminAddress> =
        await AdminService.getAddresses({
          page: currentPage,
          per_page: perPage,
          search: currentSearch || undefined,
          city: currentCity || undefined,
          state: currentState || undefined,
        });

      setAddresses(response.data);
      setTotalPages(response.meta.last_page);
      setTotal(response.meta.total);
    } catch (error) {
      console.error('Erro ao carregar endereços:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canViewAddresses()) {
      loadAddresses();
    }
  }, [page, canViewAddresses]);

  const handleSearch = () => {
    setPage(1);
    loadAddresses(1, search, cityFilter, stateFilter);
  };

  const handleView = (address: AdminAddress) => {
    setSelectedAddress(address);
    setIsViewDialogOpen(true);
  };

  if (!canViewAddresses()) {
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
      <Box mb={3}>
        <Typography variant="h4" component="h1">
          Gerenciar Endereços
        </Typography>
      </Box>

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Buscar endereços"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por endereço, usuário..."
                onKeyPress={e => e.key === 'Enter' && handleSearch()}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Cidade"
                value={cityFilter}
                onChange={e => setCityFilter(e.target.value)}
                placeholder="Filtrar por cidade"
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={stateFilter}
                  label="Estado"
                  onChange={e => setStateFilter(e.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {brazilianStates.map(state => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
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
            <Grid item xs={12} md={1}>
              <Typography variant="body2" color="textSecondary">
                Total: {total}
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
              <TableCell>Usuário</TableCell>
              <TableCell>Endereço</TableCell>
              <TableCell>Número</TableCell>
              <TableCell>Complemento</TableCell>
              <TableCell>Cidade</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>CEP</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : addresses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  Nenhum endereço encontrado
                </TableCell>
              </TableRow>
            ) : (
              addresses.map(address => (
                <TableRow key={address.id}>
                  <TableCell>{address.id}</TableCell>
                  <TableCell>
                    {address.user ? (
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {address.user.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {address.user.email}
                        </Typography>
                      </Box>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>{address.address}</TableCell>
                  <TableCell>{address.number}</TableCell>
                  <TableCell>{address.complement || '-'}</TableCell>
                  <TableCell>{address.city}</TableCell>
                  <TableCell>{address.state}</TableCell>
                  <TableCell>{address.zip_code}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleView(address)}
                      title="Visualizar"
                    >
                      <ViewIcon />
                    </IconButton>
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

      {/* Dialog de Visualização */}
      <Dialog
        open={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Detalhes do Endereço</DialogTitle>
        <DialogContent>
          {selectedAddress && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Informações do Endereço
                </Typography>
                <Typography>
                  <strong>ID:</strong> {selectedAddress.id}
                </Typography>
                <Typography>
                  <strong>Endereço:</strong> {selectedAddress.address}
                </Typography>
                <Typography>
                  <strong>Número:</strong> {selectedAddress.number}
                </Typography>
                {selectedAddress.complement && (
                  <Typography>
                    <strong>Complemento:</strong> {selectedAddress.complement}
                  </Typography>
                )}
                <Typography>
                  <strong>Cidade:</strong> {selectedAddress.city}
                </Typography>
                <Typography>
                  <strong>Estado:</strong> {selectedAddress.state}
                </Typography>
                <Typography>
                  <strong>CEP:</strong> {selectedAddress.zip_code}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Informações do Usuário
                </Typography>
                {selectedAddress.user ? (
                  <Box>
                    <Typography>
                      <strong>Nome:</strong> {selectedAddress.user.name}
                    </Typography>
                    <Typography>
                      <strong>Email:</strong> {selectedAddress.user.email}
                    </Typography>
                    <Typography>
                      <strong>Telefone:</strong> {selectedAddress.user.phone}
                    </Typography>
                  </Box>
                ) : (
                  <Typography color="textSecondary">
                    Usuário não encontrado
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Endereço Completo
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography>
                    {selectedAddress.address}, {selectedAddress.number}
                    {selectedAddress.complement &&
                      `, ${selectedAddress.complement}`}
                  </Typography>
                  <Typography>
                    {selectedAddress.city} - {selectedAddress.state}
                  </Typography>
                  <Typography>CEP: {selectedAddress.zip_code}</Typography>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsViewDialogOpen(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
