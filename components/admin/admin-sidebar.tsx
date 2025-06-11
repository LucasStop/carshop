'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  Users,
  Car,
  Package,
  MapPin,
  ShoppingCart,
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart3,
} from 'lucide-react';
import { usePermissions } from '@/hooks/use-permissions';

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    permissions: [],
  },
  {
    name: 'Usuários',
    href: '/admin/users',
    icon: Users,
    permissions: ['view_users'],
  },
  {
    name: 'Veículos',
    href: '/admin/cars',
    icon: Car,
    permissions: ['view_cars'],
  },
  {
    name: 'Marcas',
    href: '/admin/brands',
    icon: Package,
    permissions: ['view_brands'],
  },
  {
    name: 'Modelos',
    href: '/admin/models',
    icon: ShoppingCart,
    permissions: ['view_models'],
  },
  {
    name: 'Vendas',
    href: '/admin/sales',
    icon: BarChart3,
    permissions: ['view_sales'],
  },
  {
    name: 'Endereços',
    href: '/admin/addresses',
    icon: MapPin,
    permissions: ['view_addresses'],
  },
  {
    name: 'Configurações',
    href: '/admin/settings',
    icon: Settings,
    permissions: ['manage_settings'],
  },
];

export function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const permissions = usePermissions();

  if (!permissions.canAccessAdmin()) {
    return null;
  }
  const filteredNavigation = navigation.filter(item => {
    if (item.permissions.length === 0) return true;

    // Mapear permissões específicas para as funções do hook
    if (item.permissions.includes('view_users')) {
      return permissions.canViewUsers();
    }
    if (item.permissions.includes('view_cars')) {
      return permissions.canViewCars();
    }
    if (item.permissions.includes('view_brands')) {
      return permissions.canViewBrands();
    }
    if (item.permissions.includes('view_models')) {
      return permissions.canViewModels();
    }
    if (item.permissions.includes('view_sales')) {
      return permissions.canViewSales();
    }
    if (item.permissions.includes('view_addresses')) {
      return permissions.canViewAddresses();
    }
    if (item.permissions.includes('manage_settings')) {
      return permissions.isAdmin();
    }

    return false;
  });

  return (
    <div
      className={cn(
        'flex h-full flex-col border-r bg-white',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isCollapsed && (
          <Link href="/admin" className="flex items-center space-x-2">
            <Car className="h-6 w-6" />
            <span className="text-lg font-semibold">Admin</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn('h-8 w-8 p-0', isCollapsed && 'mx-auto')}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {filteredNavigation.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                  isCollapsed && 'justify-center px-2'
                )}
              >
                <Icon className={cn('h-5 w-5', isCollapsed && 'h-6 w-6')} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      {!isCollapsed && (
        <div className="border-t p-4">
          <div className="text-xs text-gray-500">Sistema de Administração</div>
        </div>
      )}
    </div>
  );
}
