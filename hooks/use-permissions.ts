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

    // Admin tem todas as permissões
    if (user.role.slug === 'admin') {
      return true;
    }

    // Employee tem permissões específicas
    if (user.role.slug === 'employee') {
      const employeePermissions = [
        'view_users',
        'view_cars',
        'view_sales',
        'manage_cars',
        'view_brands',
        'view_models',
        'manage_sales',
      ];
      return employeePermissions.includes(permission);
    }

    // Client não tem permissões administrativas
    return false;
  };

  const canAccessAdmin = (): boolean => {
    if (!user?.role?.slug) return false;
    return ['admin', 'employee'].includes(user.role.slug);
  };

  const canManageUsers = (): boolean => {
    return user?.role?.slug === 'admin';
  };

  const canManageCars = (): boolean => {
    return ['admin', 'employee'].includes(user?.role?.slug || '');
  };

  const canManageBrands = (): boolean => {
    return user?.role?.slug === 'admin';
  };

  const canManageModels = (): boolean => {
    return user?.role?.slug === 'admin';
  };

  const canViewBrands = (): boolean => {
    return ['admin', 'employee'].includes(user?.role?.slug || '');
  };

  const canViewModels = (): boolean => {
    return ['admin', 'employee'].includes(user?.role?.slug || '');
  };

  const canManageSales = (): boolean => {
    return ['admin', 'employee'].includes(user?.role?.slug || '');
  };

  const canViewUsers = (): boolean => {
    return ['admin', 'employee'].includes(user?.role?.slug || '');
  };

  const canViewCars = (): boolean => {
    return ['admin', 'employee'].includes(user?.role?.slug || '');
  };

  const canViewSales = (): boolean => {
    return ['admin', 'employee'].includes(user?.role?.slug || '');
  };

  const canViewAddresses = (): boolean => {
    return user?.role?.slug === 'admin';
  };

  const canViewStats = (): boolean => {
    return ['admin', 'employee'].includes(user?.role?.slug || '');
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
