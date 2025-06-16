'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Bell, LogOut, Settings, User, Home } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { usePermissions } from '@/hooks/use-permissions';

export function AdminHeader() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const permissions = usePermissions();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const getUserRole = () => {
    if (permissions.hasRole(['super_admin'])) return 'super_admin';
    if (permissions.hasRole(['admin'])) return 'admin';
    if (permissions.hasRole(['manager'])) return 'manager';
    return 'user';
  };

  const userRole = getUserRole();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      setIsLoggingOut(false);
    }
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

  const getRoleName = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'admin':
        return 'Administrador';
      case 'manager':
        return 'Gerente';
      default:
        return 'Usuário';
    }
  };

  if (!user) return null;

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-semibold text-gray-900">
          Painel Administrativo
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500"></span>
        </Button>

        {/* Back to Site */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/')}
          className="hidden sm:flex"
        >
          <Home className="mr-2 h-4 w-4" />
          Ver Site
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder-user.jpg" alt={user.name} />
                <AvatarFallback className="bg-black text-sm text-white">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium leading-none">
                    {user.name}
                  </p>
                  {userRole && (
                    <div className="ml-2">{getRoleBadge(userRole)}</div>
                  )}
                </div>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
                {user.phone && (
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.phone}
                  </p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <button
                className="w-full cursor-pointer"
                onClick={() => router.push('/perfil')}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Meu Perfil</span>
              </button>
            </DropdownMenuItem>
            {/* <DropdownMenuItem asChild>
              <button
                className="w-full cursor-pointer"
                onClick={() => router.push('/admin/settings')}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </button>
            </DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-600"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{isLoggingOut ? 'Saindo...' : 'Logout'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
