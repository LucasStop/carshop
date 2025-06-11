'use client';

import { useState, useEffect } from 'react';
import { AdminService, AdminBrand, AdminListResponse } from '@/services/admin';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Package,
} from 'lucide-react';
import { usePermissions } from '@/hooks/use-permissions';
import { useAdminLoading } from '@/components/admin/admin-loading-provider';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function BrandsPage() {
  const [brands, setBrands] = useState<AdminBrand[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [brandToDelete, setBrandToDelete] = useState<AdminBrand | null>(null);
  const [brandToEdit, setBrandToEdit] = useState<AdminBrand | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [brandName, setBrandName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { hasPermission } = usePermissions();
  const { setIsLoading: setGlobalLoading, setLoadingMessage } =
    useAdminLoading();

  useEffect(() => {
    loadBrands();
  }, [pagination.current_page, searchTerm]);

  const loadBrands = async () => {
    try {
      setIsLoading(true);
      const response = await AdminService.getBrands({
        page: pagination.current_page,
        per_page: pagination.per_page,
        search: searchTerm || undefined,
      });

      setBrands(response.data);
      setPagination(response.meta);
    } catch (error) {
      console.error('Erro ao carregar marcas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handleDeleteBrand = async () => {
    if (!brandToDelete || !hasPermission(['delete_brands'])) return;

    try {
      setGlobalLoading(true);
      setLoadingMessage('Excluindo marca...');

      await AdminService.deleteBrand(brandToDelete.id);
      await loadBrands();
      setBrandToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir marca:', error);
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleEditBrand = (brand: AdminBrand) => {
    setBrandToEdit(brand);
    setBrandName(brand.name);
    setIsFormOpen(true);
  };

  const handleCreateBrand = () => {
    setBrandToEdit(null);
    setBrandName('');
    setIsFormOpen(true);
  };

  const handleSubmitForm = async () => {
    if (!brandName.trim()) return;

    setIsSubmitting(true);
    setGlobalLoading(true);
    setLoadingMessage(
      brandToEdit ? 'Atualizando marca...' : 'Criando marca...'
    );

    try {
      if (brandToEdit) {
        await AdminService.updateBrand(brandToEdit.id, { name: brandName });
      } else {
        await AdminService.createBrand({ name: brandName });
      }

      setIsFormOpen(false);
      setBrandToEdit(null);
      setBrandName('');
      await loadBrands();
    } catch (error) {
      console.error('Erro ao salvar marca:', error);
    } finally {
      setIsSubmitting(false);
      setGlobalLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  if (isLoading && brands.length === 0) {
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
                  <div className="h-8 w-8 animate-pulse rounded bg-gray-200" />
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
          <h1 className="text-3xl font-bold text-gray-900">Marcas</h1>
          <p className="mt-2 text-gray-600">
            Gerencie as marcas de veículos disponíveis
          </p>
        </div>
        {hasPermission(['create_brands']) && (
          <Button onClick={handleCreateBrand}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Marca
          </Button>
        )}
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Use o campo abaixo para buscar marcas específicas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder="Buscar marcas..."
                  value={searchTerm}
                  onChange={e => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Brands Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Marcas ({pagination.total})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Modelos</TableHead>
                <TableHead>Veículos</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.map(brand => (
                <TableRow key={brand.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100">
                        <Package className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="font-medium">{brand.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{brand.slug}</Badge>
                  </TableCell>
                  <TableCell>{brand.models_count || 0}</TableCell>
                  <TableCell>{brand.cars_count || 0}</TableCell>
                  <TableCell>{formatDate(brand.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        {hasPermission(['edit_brands']) && (
                          <DropdownMenuItem
                            onClick={() => handleEditBrand(brand)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {hasPermission(['delete_brands']) && (
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => setBrandToDelete(brand)}
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

          {brands.length === 0 && !isLoading && (
            <div className="py-12 text-center">
              <div className="text-gray-500">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">
                  Nenhuma marca encontrada
                </h3>
                <p className="mt-2">
                  {searchTerm
                    ? 'Tente ajustar o termo de busca.'
                    : 'Comece criando a primeira marca.'}
                </p>
              </div>
            </div>
          )}

          {/* Pagination */}
          {pagination.last_page > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Mostrando {pagination.from} a {pagination.to} de{' '}
                {pagination.total} marcas
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

      {/* Brand Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {brandToEdit ? 'Editar Marca' : 'Nova Marca'}
            </DialogTitle>
            <DialogDescription>
              {brandToEdit
                ? 'Atualize o nome da marca abaixo.'
                : 'Digite o nome da nova marca.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome da Marca</label>
              <Input
                placeholder="Digite o nome da marca"
                value={brandName}
                onChange={e => setBrandName(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsFormOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmitForm}
              disabled={!brandName.trim() || isSubmitting}
            >
              {isSubmitting
                ? 'Salvando...'
                : brandToEdit
                  ? 'Atualizar'
                  : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!brandToDelete}
        onOpenChange={() => setBrandToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a marca "{brandToDelete?.name}"?
              Esta ação não pode ser desfeita e todos os modelos e veículos
              associados serão afetados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBrand}
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
