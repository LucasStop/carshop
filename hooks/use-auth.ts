'use client';

import { useState, useEffect } from 'react';
import { AuthService } from '@/services';

export interface User {
  id: number;
  role_id: number;
  path?: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  rg: string;
  birth_date: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  role: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    permissions: string[] | null;
    created_at: string;
    updated_at: string;
  };
  address: {
    id: number;
    user_id: number;
    address: string;
    number: string;
    complement?: string;
    city: string;
    state: string;
    zip_code: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const isAuth = AuthService.isAuthenticated();
        const currentUser = AuthService.getCurrentUser();

        setIsAuthenticated(isAuth);
        setUser(currentUser);
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Verificar mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token' || e.key === 'user') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const logout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erro no logout:', error);
      // Mesmo com erro, limpar estado local
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const getRedirectUrl = () => {
    if (!user?.role?.slug) return '/';

    // Admins e funcionários vão para área administrativa
    if (user.role.slug === 'admin' || user.role.slug === 'employee') {
      return '/admin';
    }

    // Clientes vão para a página inicial
    return '/';
  };

  const shouldRedirectToAdmin = () => {
    return user?.role?.slug === 'admin' || user?.role?.slug === 'employee';
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
    getRedirectUrl,
    shouldRedirectToAdmin,
  };
}
