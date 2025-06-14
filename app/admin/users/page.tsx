'use client';

import { useState, useEffect } from 'react';
import {
  AdminService,
  AdminUser,
  AdminListResponse,
  AdminRole,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Filter,
  UserPlus,
} from 'lucide-react';
import { UserFormDialog } from '@/components/admin/user-form-dialog';
import { usePermissions } from '@/hooks/use-permissions';
import { useAdminLoading } from '@/components/admin/admin-loading-provider';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
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
  const [selectedRole, setSelectedRole] = useState('');
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [userToEdit, setUserToEdit] = useState<AdminUser | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { canManageUsers, canViewUsers } = usePermissions();
  const { setIsLoading: setGlobalLoading, setLoadingMessage } =
    useAdminLoading();

  // Carregar roles no primeiro carregamento
  useEffect(() => {
    loadRoles();
  }, []);

  useEffect(() => {
    loadUsers();
  }, [pagination.current_page, searchTerm, selectedRole]);

  const loadRoles = async () => {
    try {
      setIsLoadingRoles(true);
      const rolesData = await AdminService.getRoles();
      setRoles(rolesData);
    } catch (error) {
      console.error('Erro ao carregar roles:', error);
    } finally {
      setIsLoadingRoles(false);
    }
  };

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await AdminService.getUsers({
        page: pagination.current_page,
        per_page: pagination.per_page,
        search: searchTerm || undefined,
        role: selectedRole || undefined,
      });

      console.log('DADOS RECEBIDOS DA API:', response);

      if (response && response.data) {
        setUsers(response.data);

        // Atualizar paginação com base na resposta da API
        setPagination({
          current_page: response.current_page,
          last_page: response.last_page,
          per_page: response.per_page,
          total: response.total,
          from: response.from,
          to: response.to,
        });
      } else {
        console.warn(
          'A resposta da API não continha a estrutura esperada:',
          response
        );
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };
  const handleRoleFilter = (role: string) => {
    setSelectedRole(role);
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const getRoleName = (slug: string) => {
    switch (slug) {
      case 'admin':
        return 'Administrador';
      case 'employee':
        return 'Funcionário';
      case 'client':
        return 'Cliente';
      default:
        return slug;
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete || !canManageUsers()) return;

    try {
      setGlobalLoading(true);
      setLoadingMessage('Excluindo usuário...');

      await AdminService.deleteUser(userToDelete.id);
      await loadUsers();
      setUserToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleEditUser = (user: AdminUser) => {
    setUserToEdit(user);
    setIsFormOpen(true);
  };

  const handleCreateUser = () => {
    setUserToEdit(null);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setUserToEdit(null);
    loadUsers();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-100 text-red-800">Administrador</Badge>;
      case 'client':
        return <Badge className="bg-blue-100 text-blue-800">Cliente</Badge>;
      case 'employee':
        return (
          <Badge className="bg-green-100 text-green-800">Funcionário</Badge>
        );
      default:
        return <Badge variant="outline">{getRoleName(role)}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  if (isLoading && users.length === 0) {
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
                  <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
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
          <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
          <p className="mt-2 text-gray-600">
            Gerencie todos os usuários do sistema
          </p>
        </div>{' '}
        {canManageUsers() && (
          <Button onClick={handleCreateUser}>
            <UserPlus className="mr-2 h-4 w-4" />
            Novo Usuário
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Use os filtros abaixo para encontrar usuários específicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={e => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>{' '}
            <div className="w-full sm:w-48">
              <select
                value={selectedRole}
                onChange={e => handleRoleFilter(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                disabled={isLoadingRoles}
              >
                <option value="">
                  {isLoadingRoles ? 'Carregando...' : 'Todas as funções'}
                </option>
                {roles.map(role => (
                  <option key={role.id} value={role.slug}>
                    {getRoleName(role.slug)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários ({pagination.total})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback className="text-xs">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role.slug)}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    {user.address
                      ? `${user.address.city}, ${user.address.state}`
                      : '-'}
                  </TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell className="text-center">
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
                        {canManageUsers() && (
                          <DropdownMenuItem
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {canManageUsers() && (
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => setUserToDelete(user)}
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

          {users.length === 0 && !isLoading && (
            <div className="py-12 text-center">
              <div className="text-gray-500">
                <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">
                  Nenhum usuário encontrado
                </h3>
                <p className="mt-2">
                  {searchTerm || selectedRole
                    ? 'Tente ajustar os filtros de busca.'
                    : 'Comece criando o primeiro usuário.'}
                </p>
              </div>
            </div>
          )}

          {/* Pagination */}
          {pagination.last_page > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Mostrando {pagination.from} a {pagination.to} de{' '}
                {pagination.total} usuários
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

      {/* User Form Dialog */}
      <UserFormDialog
        user={userToEdit}
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!userToDelete}
        onOpenChange={() => setUserToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o usuário "{userToDelete?.name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
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
