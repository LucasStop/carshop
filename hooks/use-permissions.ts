'use client';

import { useAuth } from './use-auth';

export interface PermissionConfig {
  roles: string[];
  fallback?: () => void;
}

export function usePermissions() {
  const { user, isAuthenticated } = useAuth();

  const hasRole = (requiredRoles: string[]): boolean => {
    if (!user?.role?.slug) return false;
    return requiredRoles.includes(user.role.slug);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user?.role) return false;

    // Super admin tem todas as permissões
    if (user.role.slug === 'admin') {
      return true;
    }

    // Verifica se a role tem a permissão específica
    return user.role.permissions?.includes(permission) || false;
  };

  const canAccessAdmin = (): boolean => {
    if (!user?.role?.slug) return false;
    return ['admin', 'employee'].includes(user.role.slug);
  };

  const canManageUsers = (): boolean => {
    return hasPermission('manage_users') || user?.role?.slug === 'admin';
  };

  const canManageCars = (): boolean => {
    return hasPermission('manage_cars') || user?.role?.slug === 'admin';
  };
  const canManageBrands = (): boolean => {
    return hasPermission('manage_brands') || user?.role?.slug === 'admin';
  };

  const canManageModels = (): boolean => {
    return hasPermission('manage_models') || user?.role?.slug === 'admin';
  };

  const canViewBrands = (): boolean => {
    return (
      hasPermission('view_brands') ||
      canManageBrands() ||
      user?.role?.slug === 'employee'
    );
  };

  const canViewModels = (): boolean => {
    return (
      hasPermission('view_models') ||
      canManageModels() ||
      user?.role?.slug === 'employee'
    );
  };

  const canManageSales = (): boolean => {
    return hasPermission('manage_sales') || user?.role?.slug === 'admin';
  };

  const canViewUsers = (): boolean => {
    return hasPermission('view_users') || canManageUsers();
  };

  const canViewCars = (): boolean => {
    return hasPermission('view_cars') || canManageCars();
  };

  const canViewSales = (): boolean => {
    return hasPermission('view_sales') || canManageSales();
  };

  const canViewAddresses = (): boolean => {
    return hasPermission('view_addresses') || user?.role?.slug === 'admin';
  };

  const canViewStats = (): boolean => {
    return hasPermission('view_stats') || user?.role?.slug === 'admin';
  };

  const isAdmin = (): boolean => {
    return user?.role?.slug === 'admin';
  };

  const isEmployee = (): boolean => {
    return user?.role?.slug === 'employee';
  };

  const isClient = (): boolean => {
    return user?.role?.slug === 'client';
  };
  return {
    user,
    hasRole,
    hasPermission,
    canAccessAdmin,
    canManageUsers,
    canManageCars,
    canManageBrands,
    canManageModels,
    canManageSales,
    canViewUsers,
    canViewCars,
    canViewBrands,
    canViewModels,
    canViewSales,
    canViewAddresses,
    canViewStats,
    isAdmin,
    isEmployee,
    isClient,
  };
}
