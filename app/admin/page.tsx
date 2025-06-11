'use client';

import { useEffect, useState } from 'react';
import { AdminService, AdminStats } from '@/services/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  Car,
  DollarSign,
  TrendingUp,
  Package,
  MapPin,
  ShoppingCart,
  UserCheck,
} from 'lucide-react';
import { AdminStatsCharts } from '@/components/admin/admin-stats-charts';
import { AdminRecentActivity } from '@/components/admin/admin-recent-activity';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  //   useEffect(() => {
  //     loadStats();
  //   }, []);

  //   const loadStats = async () => {
  //     try {
  //       setIsLoading(true);
  //       const data = await AdminService.getStats();
  //       setStats(data);
  //     } catch (error) {
  //       console.error('Erro ao carregar estatísticas:', error);
  //       setError('Erro ao carregar estatísticas');
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 animate-pulse rounded bg-gray-200" />
                <div className="mt-2 h-3 w-24 animate-pulse rounded bg-gray-200" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">
            Erro ao carregar dashboard
          </h3>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={loadStats}
            className="mt-4 rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Visão geral do sistema de gerenciamento
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Usuários
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats.total_users)}
            </div>
            <p className="text-xs text-muted-foreground">
              +{formatNumber(stats.new_users_this_month)} este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Veículos
            </CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats.total_cars)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(stats.active_listings)} ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita do Mês
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.revenue_this_month)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(stats.sales_this_month)} vendas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Vendas
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats.total_sales)}
            </div>
            <p className="text-xs text-muted-foreground">
              Todas as vendas realizadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marcas</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats.total_brands)}
            </div>
            <p className="text-xs text-muted-foreground">Marcas cadastradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modelos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats.total_models)}
            </div>
            <p className="text-xs text-muted-foreground">Modelos disponíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Anúncios Ativos
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats.active_listings)}
            </div>
            <p className="text-xs text-muted-foreground">Veículos em venda</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AdminStatsCharts />
        <AdminRecentActivity />
      </div>
    </div>
  );
}
