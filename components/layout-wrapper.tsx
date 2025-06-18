'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CartProvider } from '@/hooks/use-cart';
import { Toaster } from '@/components/ui/toaster';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  return (
    <CartProvider>
      {!isAdminRoute && <Header />}
      {children}
      {!isAdminRoute && <Footer />}
      <Toaster />
    </CartProvider>
  );
}
