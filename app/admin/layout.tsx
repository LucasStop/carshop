'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/hooks/use-permissions';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { AdminLoadingProvider } from '@/components/admin/admin-loading-provider';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  //   const router = useRouter();
  //   const { canAccessAdmin } = usePermissions();

  //   useEffect(() => {
  //     if (!canAccessAdmin()) {
  //       router.push('/login');
  //     }
  //   }, [canAccessAdmin, router]);

  //   if (!canAccessAdmin()) {
  //     return (
  //       <div className="flex min-h-screen items-center justify-center">
  //         <div className="text-center">
  //           <h1 className="text-2xl font-bold text-gray-900">Acesso Negado</h1>
  //           <p className="mt-2 text-gray-600">
  //             Você não tem permissão para acessar esta área.
  //           </p>
  //         </div>
  //       </div>
  //     );
  //   }

  return (
    <AdminLoadingProvider>
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-auto bg-gray-50 p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminLoadingProvider>
  );
}
