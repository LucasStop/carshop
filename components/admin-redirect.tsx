'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export function AdminRedirect() {
  const { user, isAuthenticated, isLoading, shouldRedirectToAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Aguardar carregamento da autenticação
    if (isLoading) return;

    // Se estiver autenticado e for usuário administrativo, redirecionar
    if (isAuthenticated && shouldRedirectToAdmin()) {
      console.log('Redirecionando usuário administrativo para /admin/users');
      router.push('/admin/users');
    }
  }, [isAuthenticated, isLoading, shouldRedirectToAdmin, router]);

  // Não renderizar nada, é apenas para redirecionamento
  return null;
}
