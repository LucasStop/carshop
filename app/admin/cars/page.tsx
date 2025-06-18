'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  AdminService,
  AdminCar,
  AdminListResponse,
  AdminBrand,
} from '@/services/admin';
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
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Car as CarIcon,
  Filter,
} from 'lucide-react';
import { CarFormDialog } from '@/components/admin/car-form-dialog';
import { usePermissions } from '@/hooks/use-permissions';
import { useAdminLoading } from '@/components/admin/admin-loading-provider';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function CarsPage() {
  const [cars, setCars] = useState<AdminCar[]>([]);
  const [brands, setBrands] = useState<AdminBrand[]>([]);
  const [isLoadingBrands, setIsLoadingBrands] = useState(true);
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
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [carToDelete, setCarToDelete] = useState<AdminCar | null>(null);
  const [carToEdit, setCarToEdit] = useState<AdminCar | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { canManageCars, canViewCars } = usePermissions();
  const { setIsLoading: setGlobalLoading, setLoadingMessage } =
    useAdminLoading();

  // Carregar marcas no primeiro carregamento
  useEffect(() => {
    loadBrands();
  }, []);

  useEffect(() => {
    loadCars();
  }, [pagination.current_page, searchTerm, selectedStatus, selectedBrand]);
  const loadBrands = async () => {
    try {
      setIsLoadingBrands(true);
      const brands = await AdminService.getAllBrands();
      console.log('Marcas carregadas:', brands); // Debug
      setBrands(brands);
    } catch (error) {
      console.error('Erro ao carregar marcas:', error);
    } finally {
      setIsLoadingBrands(false);
    }
  };

  const loadCars = async () => {
    try {
      setIsLoading(true);
      const response = await AdminService.getCars({
        page: pagination.current_page,
        per_page: pagination.per_page,
        search: searchTerm || undefined,
        status: selectedStatus || undefined,
        brand: selectedBrand || undefined,
      });
      setCars(response.data);

      // Atualizar paginação com base na resposta da API
      setPagination({
        current_page: response.current_page,
        last_page: response.last_page,
        per_page: response.per_page,
        total: response.total,
        from: response.from,
        to: response.to,
      });
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handleBrandFilter = (brand: string) => {
    setSelectedBrand(brand);
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };
  const handleDeleteCar = async () => {
    if (!carToDelete || !canManageCars()) return;

    try {
      setGlobalLoading(true);
      setLoadingMessage('Excluindo veículo...');

      await AdminService.deleteCar(carToDelete.id);
      await loadCars();
      setCarToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir veículo:', error);
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleEditCar = (car: AdminCar) => {
    setCarToEdit(car);
    setIsFormOpen(true);
  };

  const handleCreateCar = () => {
    setCarToEdit(null);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setCarToEdit(null);
    loadCars();
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return (
          <Badge className="bg-green-100 text-green-800">Disponível</Badge>
        );
      case 'sold':
        return <Badge className="bg-blue-100 text-blue-800">Vendido</Badge>;
      case 'reserved':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Reservado</Badge>
        );
      case 'maintenance':
        return (
          <Badge className="bg-orange-100 text-orange-800">Manutenção</Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusName = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponível';
      case 'sold':
        return 'Vendido';
      case 'reserved':
        return 'Reservado';
      case 'maintenance':
        return 'Manutenção';
      default:
        return status;
    }
  };

  const formatCurrency = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numValue);
  };

  const formatMileage = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value) + ' km';
  };
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  // Debug: log do estado das marcas
  console.log('Estado das marcas:', { brands, isLoadingBrands });
  if (isLoading && cars.length === 0) {
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

  const getImageUrl = (path: string | undefined) => {
    if (!path) return null;
    return `${process.env.NEXT_PUBLIC_IMAGE_URL}${path}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Veículos</h1>
          <p className="mt-2 text-gray-600">
            Gerencie todos os veículos anunciados
          </p>
        </div>{' '}
        {canManageCars() && (
          <Button onClick={handleCreateCar}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Veículo
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Use os filtros abaixo para encontrar veículos específicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder="Buscar por marca, modelo ou cor..."
                  value={searchTerm}
                  onChange={e => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>{' '}
            <div className="w-full sm:w-48">
              {' '}
              <select
                value={selectedStatus}
                onChange={e => handleStatusFilter(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value="">Todos os status</option>
                <option value="available">Disponível</option>
                <option value="sold">Vendido</option>
                <option value="reserved">Reservado</option>
                <option value="maintenance">Manutenção</option>
              </select>
            </div>
            <div className="w-full sm:w-48">
              {' '}
              <select
                value={selectedBrand}
                onChange={e => handleBrandFilter(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                disabled={isLoadingBrands}
              >
                <option value="">
                  {isLoadingBrands ? 'Carregando...' : 'Todas as marcas'}
                </option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id.toString()}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cars Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Veículos ({pagination.total})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            {' '}
            <TableHeader>
              <TableRow>
                <TableHead>Veículo</TableHead>
                <TableHead>VIN</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Quilometragem</TableHead>
                <TableHead>Ano</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Inclusão</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>{' '}
            <TableBody>
              {cars.map(car => (
                <TableRow key={car.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="relative h-16 w-24">
                        <Image
                          src={getImageUrl(car.path) || '/placeholder.svg'}
                          alt={`${car.model?.brand?.name} ${car.model?.name}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">
                          {car.model?.brand?.name} {car.model?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {car.color} • {car.model?.engine} • {car.model?.power}
                          cv
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{car.vin}</TableCell>
                  <TableCell className="font-medium">
                    {car.price ? formatCurrency(car.price) : 'Em avaliação'}
                  </TableCell>
                  <TableCell>{formatMileage(car.mileage)}</TableCell>
                  <TableCell>{car.manufacture_year}</TableCell>
                  <TableCell>{getStatusBadge(car.status)}</TableCell>
                  <TableCell>{formatDate(car.inclusion_date)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </DropdownMenuItem>{' '}
                        {canManageCars() && (
                          <DropdownMenuItem onClick={() => handleEditCar(car)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {canManageCars() && (
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => setCarToDelete(car)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {cars.length === 0 && !isLoading && (
            <div className="py-12 text-center">
              <div className="text-gray-500">
                <CarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">
                  Nenhum veículo encontrado
                </h3>
                <p className="mt-2">
                  {searchTerm || selectedStatus || selectedBrand
                    ? 'Tente ajustar os filtros de busca.'
                    : 'Comece criando o primeiro anúncio de veículo.'}
                </p>
              </div>
            </div>
          )}

          {/* Pagination */}
          {pagination.last_page > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Mostrando {pagination.from} a {pagination.to} de{' '}
                {pagination.total} veículos
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.current_page === 1}
                  onClick={() =>
                    setPagination(prev => ({
                      ...prev,
                      current_page: prev.current_page - 1,
                    }))
                  }
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.current_page === pagination.last_page}
                  onClick={() =>
                    setPagination(prev => ({
                      ...prev,
                      current_page: prev.current_page + 1,
                    }))
                  }
                >
                  Próximo
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Car Form Dialog */}
      <CarFormDialog
        car={carToEdit}
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!carToDelete}
        onOpenChange={() => setCarToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>{' '}
            <AlertDialogDescription>
              Tem certeza que deseja excluir o veículo "
              {carToDelete?.model?.brand?.name} {carToDelete?.model?.name}"
              (VIN: {carToDelete?.vin})? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCar}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
