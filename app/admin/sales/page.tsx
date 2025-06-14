'use client';

import { useState, useEffect } from 'react';
import { AdminService, AdminSale, AdminListResponse } from '@/services/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  DollarSign,
} from 'lucide-react';
import { usePermissions } from '@/hooks/use-permissions';
import { useAdminLoading } from '@/components/admin/admin-loading-provider';
import { SaleFormDialog } from '@/components/admin/sale-form-dialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function SalesPage() {
  const [sales, setSales] = useState<AdminSale[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    from: 0,
    to: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [saleToDelete, setSaleToDelete] = useState<AdminSale | null>(null);
  const [saleToView, setSaleToView] = useState<AdminSale | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [saleToEdit, setSaleToEdit] = useState<AdminSale | null>(null);
  const { canManageSales, canViewSales } = usePermissions();
  const { setIsLoading: setGlobalLoading, setLoadingMessage } =
    useAdminLoading();

  useEffect(() => {
    loadSales();
  }, [pagination.current_page, searchTerm]);

  const loadSales = async () => {
    try {
      setIsLoading(true);
      // Como a API retorna array direto, usar getAllSales
      const salesData = await AdminService.getAllSales();
      setSales(salesData);

      // Simular paginação local (você pode implementar paginação no backend depois)
      setPagination(prev => ({
        ...prev,
        total: salesData.length,
        from: 1,
        to: salesData.length,
        last_page: 1,
      }));
    } catch (error) {
      console.error('Erro ao carregar vendas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handleDeleteSale = async () => {
    if (!saleToDelete || !canManageSales()) return;

    try {
      setGlobalLoading(true);
      setLoadingMessage('Excluindo venda...');

      await AdminService.deleteSale(saleToDelete.id);
      await loadSales();
      setSaleToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir venda:', error);
    } finally {
      setGlobalLoading(false);
    }
  };
  const handleViewSale = (sale: AdminSale) => {
    setSaleToView(sale);
    setIsViewDialogOpen(true);
  };

  const handleEditSale = (sale: AdminSale) => {
    setSaleToEdit(sale);
    setIsFormDialogOpen(true);
  };

  const handleNewSale = () => {
    setSaleToEdit(null);
    setIsFormDialogOpen(true);
  };

  const handleFormSubmit = () => {
    loadSales();
    setIsFormDialogOpen(false);
    setSaleToEdit(null);
  };

  const handleFormClose = () => {
    setIsFormDialogOpen(false);
    setSaleToEdit(null);
  };

  const formatCurrency = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numValue);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  // Filtrar vendas com base no termo de busca
  const filteredSales = sales.filter(
    sale =>
      sale.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.employee?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.car?.model?.brand?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      sale.car?.model?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!canViewSales()) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
        <p className="mt-2 text-gray-600">
          Você não tem permissão para acessar esta página.
        </p>
      </div>
    );
  }

  if (isLoading && sales.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-16 w-24 animate-pulse rounded bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendas</h1>
          <p className="mt-2 text-gray-600">
            Gerencie todas as vendas realizadas
          </p>
        </div>{' '}
        {canManageSales() && (
          <Button onClick={handleNewSale}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Venda
          </Button>
        )}
      </div>
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Use os filtros abaixo para encontrar vendas específicas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder="Buscar por cliente, funcionário, veículo..."
                  value={searchTerm}
                  onChange={e => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Vendas ({filteredSales.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Funcionário</TableHead>
                <TableHead>Preço Final</TableHead>
                <TableHead>Data da Venda</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map(sale => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">#{sale.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="flex h-12 w-16 items-center justify-center rounded bg-gray-100">
                        <DollarSign className="h-6 w-6 text-gray-400" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {sale.car?.model?.brand?.name} {sale.car?.model?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {sale.car?.manufacture_year} • {sale.car?.color}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {sale.customer ? (
                      <div>
                        <div className="font-medium">{sale.customer.name}</div>
                        <div className="text-sm text-gray-500">
                          {sale.customer.email}
                        </div>
                      </div>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {sale.employee ? (
                      <div>
                        <div className="font-medium">{sale.employee.name}</div>
                        <div className="text-sm text-gray-500">
                          {sale.employee.email}
                        </div>
                      </div>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(sale.final_price)}
                  </TableCell>
                  <TableCell>{formatDate(sale.sale_date)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewSale(sale)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </DropdownMenuItem>
                        {canManageSales() && (
                          <>
                            {' '}
                            <DropdownMenuItem
                              onClick={() => handleEditSale(sale)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => setSaleToDelete(sale)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredSales.length === 0 && !isLoading && (
            <div className="py-12 text-center">
              <div className="text-gray-500">
                <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">
                  Nenhuma venda encontrada
                </h3>
                <p className="mt-2">
                  {searchTerm
                    ? 'Tente ajustar os filtros de busca.'
                    : 'Ainda não há vendas registradas.'}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {/* View Sale Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Venda</DialogTitle>
            <DialogDescription>
              Informações completas sobre a venda selecionada
            </DialogDescription>
          </DialogHeader>

          {saleToView && (
            <div className="grid gap-6">
              {/* Informações da Venda */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="mb-2 font-semibold">Informações da Venda</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">ID:</span> #{saleToView.id}
                    </div>
                    <div>
                      <span className="font-medium">Data da Venda:</span>{' '}
                      {formatDate(saleToView.sale_date)}
                    </div>
                    <div>
                      <span className="font-medium">Preço Final:</span>{' '}
                      {formatCurrency(saleToView.final_price)}
                    </div>
                    {saleToView.car && (
                      <div>
                        <span className="font-medium">Preço Original:</span>{' '}
                        {formatCurrency(saleToView.car.price)}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">Veículo</h3>
                  {saleToView.car && (
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Marca/Modelo:</span>{' '}
                        {saleToView.car.model?.brand?.name}{' '}
                        {saleToView.car.model?.name}
                      </div>
                      <div>
                        <span className="font-medium">Ano:</span>{' '}
                        {saleToView.car.manufacture_year}
                      </div>
                      <div>
                        <span className="font-medium">Cor:</span>{' '}
                        {saleToView.car.color}
                      </div>
                      <div>
                        <span className="font-medium">VIN:</span>{' '}
                        {saleToView.car.vin}
                      </div>
                      <div>
                        <span className="font-medium">Quilometragem:</span>{' '}
                        {new Intl.NumberFormat('pt-BR').format(
                          saleToView.car.mileage
                        )}{' '}
                        km
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Cliente e Funcionário */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="mb-2 font-semibold">Cliente</h3>
                  {saleToView.customer && (
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Nome:</span>{' '}
                        {saleToView.customer.name}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span>{' '}
                        {saleToView.customer.email}
                      </div>
                      <div>
                        <span className="font-medium">Telefone:</span>{' '}
                        {saleToView.customer.phone}
                      </div>
                      <div>
                        <span className="font-medium">CPF:</span>{' '}
                        {saleToView.customer.cpf}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">
                    Funcionário Responsável
                  </h3>
                  {saleToView.employee && (
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Nome:</span>{' '}
                        {saleToView.employee.name}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span>{' '}
                        {saleToView.employee.email}
                      </div>
                      <div>
                        <span className="font-medium">Telefone:</span>{' '}
                        {saleToView.employee.phone}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Observações */}
              {saleToView.notes && (
                <div>
                  <h3 className="mb-2 font-semibold">Observações</h3>
                  <p className="rounded bg-gray-50 p-3 text-sm text-gray-600">
                    {saleToView.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>{' '}
      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!saleToDelete}
        onOpenChange={() => setSaleToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a venda #{saleToDelete?.id}? Esta
              ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSale}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Sale Form Dialog */}
      <SaleFormDialog
        open={isFormDialogOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        sale={saleToEdit}
      />
    </div>
  );
}
