'use client';

import { useState, useEffect } from 'react';
import {
  AdminService,
  AdminModel,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  ShoppingCart,
} from 'lucide-react';
import { usePermissions } from '@/hooks/use-permissions';
import { useAdminLoading } from '@/components/admin/admin-loading-provider';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ModelsPage() {
  const [models, setModels] = useState<AdminModel[]>([]);
  const [brands, setBrands] = useState<AdminBrand[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [modelToDelete, setModelToDelete] = useState<AdminModel | null>(null);
  const [modelToEdit, setModelToEdit] = useState<AdminModel | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [modelName, setModelName] = useState('');
  const [modelBrandId, setModelBrandId] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { hasPermission } = usePermissions();
  const { setIsLoading: setGlobalLoading, setLoadingMessage } =
    useAdminLoading();

  useEffect(() => {
    loadModels();
    loadBrands();
  }, [pagination.current_page, searchTerm, selectedBrand]);

  const loadModels = async () => {
    try {
      setIsLoading(true);
      const response = await AdminService.getModels({
        page: pagination.current_page,
        per_page: pagination.per_page,
        search: searchTerm || undefined,
        brand: selectedBrand || undefined,
      });

      setModels(response.data);
      setPagination(response.meta);
    } catch (error) {
      console.error('Erro ao carregar modelos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadBrands = async () => {
    try {
      const response = await AdminService.getBrands({ per_page: 100 });
      setBrands(response.data);
    } catch (error) {
      console.error('Erro ao carregar marcas:', error);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handleBrandFilter = (brand: string) => {
    setSelectedBrand(brand);
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handleDeleteModel = async () => {
    if (!modelToDelete || !hasPermission(['delete_models'])) return;

    try {
      setGlobalLoading(true);
      setLoadingMessage('Excluindo modelo...');

      await AdminService.deleteModel(modelToDelete.id);
      await loadModels();
      setModelToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir modelo:', error);
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleEditModel = (model: AdminModel) => {
    setModelToEdit(model);
    setModelName(model.name);
    setModelBrandId(model.brand_id);
    setIsFormOpen(true);
  };

  const handleCreateModel = () => {
    setModelToEdit(null);
    setModelName('');
    setModelBrandId(0);
    setIsFormOpen(true);
  };

  const handleSubmitForm = async () => {
    if (!modelName.trim() || !modelBrandId) return;

    setIsSubmitting(true);
    setGlobalLoading(true);
    setLoadingMessage(
      modelToEdit ? 'Atualizando modelo...' : 'Criando modelo...'
    );

    try {
      if (modelToEdit) {
        await AdminService.updateModel(modelToEdit.id, {
          name: modelName,
          brand_id: modelBrandId,
        });
      } else {
        await AdminService.createModel({
          name: modelName,
          brand_id: modelBrandId,
        });
      }

      setIsFormOpen(false);
      setModelToEdit(null);
      setModelName('');
      setModelBrandId(0);
      await loadModels();
    } catch (error) {
      console.error('Erro ao salvar modelo:', error);
    } finally {
      setIsSubmitting(false);
      setGlobalLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  if (isLoading && models.length === 0) {
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
          <h1 className="text-3xl font-bold text-gray-900">Modelos</h1>
          <p className="mt-2 text-gray-600">
            Gerencie os modelos de veículos por marca
          </p>
        </div>
        {hasPermission(['create_models']) && (
          <Button onClick={handleCreateModel}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Modelo
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Use os filtros abaixo para encontrar modelos específicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder="Buscar modelos..."
                  value={searchTerm}
                  onChange={e => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <select
                value={selectedBrand}
                onChange={e => handleBrandFilter(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value="">Todas as marcas</option>
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

      {/* Models Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Modelos ({pagination.total})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Veículos</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models.map(model => (
                <TableRow key={model.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100">
                        <ShoppingCart className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="font-medium">{model.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {model.brand ? (
                      <Badge className="bg-blue-100 text-blue-800">
                        {model.brand.name}
                      </Badge>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{model.slug}</Badge>
                  </TableCell>
                  <TableCell>{model.cars_count || 0}</TableCell>
                  <TableCell>{formatDate(model.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        {hasPermission(['edit_models']) && (
                          <DropdownMenuItem
                            onClick={() => handleEditModel(model)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {hasPermission(['delete_models']) && (
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => setModelToDelete(model)}
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

          {models.length === 0 && !isLoading && (
            <div className="py-12 text-center">
              <div className="text-gray-500">
                <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">
                  Nenhum modelo encontrado
                </h3>
                <p className="mt-2">
                  {searchTerm || selectedBrand
                    ? 'Tente ajustar os filtros de busca.'
                    : 'Comece criando o primeiro modelo.'}
                </p>
              </div>
            </div>
          )}

          {/* Pagination */}
          {pagination.last_page > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Mostrando {pagination.from} a {pagination.to} de{' '}
                {pagination.total} modelos
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

      {/* Model Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {modelToEdit ? 'Editar Modelo' : 'Novo Modelo'}
            </DialogTitle>
            <DialogDescription>
              {modelToEdit
                ? 'Atualize as informações do modelo abaixo.'
                : 'Digite as informações do novo modelo.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome do Modelo</label>
              <Input
                placeholder="Digite o nome do modelo"
                value={modelName}
                onChange={e => setModelName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Marca</label>
              <Select
                value={modelBrandId.toString()}
                onValueChange={value => setModelBrandId(parseInt(value))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione a marca" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map(brand => (
                    <SelectItem key={brand.id} value={brand.id.toString()}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              disabled={!modelName.trim() || !modelBrandId || isSubmitting}
            >
              {isSubmitting
                ? 'Salvando...'
                : modelToEdit
                  ? 'Atualizar'
                  : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!modelToDelete}
        onOpenChange={() => setModelToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o modelo "{modelToDelete?.name}"?
              Esta ação não pode ser desfeita e todos os veículos associados
              serão afetados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteModel}
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
