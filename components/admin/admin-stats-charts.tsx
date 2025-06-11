'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Dados fictícios para os gráficos - em produção viriam da API
const salesData = [
  { month: 'Jan', sales: 45, revenue: 125000 },
  { month: 'Fev', sales: 52, revenue: 145000 },
  { month: 'Mar', sales: 48, revenue: 135000 },
  { month: 'Abr', sales: 61, revenue: 172000 },
  { month: 'Mai', sales: 55, revenue: 155000 },
  { month: 'Jun', sales: 67, revenue: 189000 },
];

const carStatusData = [
  { name: 'Ativos', value: 245, color: '#10B981' },
  { name: 'Vendidos', value: 123, color: '#3B82F6' },
  { name: 'Inativos', value: 34, color: '#F59E0B' },
  { name: 'Em Análise', value: 12, color: '#EF4444' },
];

const userGrowthData = [
  { month: 'Jan', users: 1250 },
  { month: 'Fev', users: 1340 },
  { month: 'Mar', users: 1420 },
  { month: 'Abr', users: 1580 },
  { month: 'Mai', users: 1720 },
  { month: 'Jun', users: 1890 },
];

export function AdminStatsCharts() {
  const [activeChart, setActiveChart] = useState('sales');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise de Dados</CardTitle>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveChart('sales')}
            className={`rounded px-3 py-1 text-sm ${
              activeChart === 'sales'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Vendas
          </button>
          <button
            onClick={() => setActiveChart('users')}
            className={`rounded px-3 py-1 text-sm ${
              activeChart === 'users'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Usuários
          </button>
          <button
            onClick={() => setActiveChart('cars')}
            className={`rounded px-3 py-1 text-sm ${
              activeChart === 'cars'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Veículos
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {activeChart === 'sales' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    name === 'revenue'
                      ? formatCurrency(value as number)
                      : value,
                    name === 'sales' ? 'Vendas' : 'Receita',
                  ]}
                />
                <Bar dataKey="sales" fill="#3B82F6" name="sales" />
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeChart === 'users' && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={value => [value, 'Usuários']} />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: '#10B981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}

          {activeChart === 'cars' && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={carStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {carStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {activeChart === 'cars' && (
          <div className="mt-4 flex justify-center space-x-4">
            {carStatusData.map(item => (
              <div key={item.name} className="flex items-center space-x-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
