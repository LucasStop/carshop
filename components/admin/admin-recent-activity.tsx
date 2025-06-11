'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { User, Car, ShoppingCart, UserPlus } from 'lucide-react';

// Dados fictícios - em produção viriam da API
const recentActivities = [
  {
    id: 1,
    type: 'user_registered',
    title: 'Novo usuário registrado',
    description: 'João Silva se registrou na plataforma',
    user: {
      name: 'João Silva',
      email: 'joao@email.com',
      avatar: null,
    },
    timestamp: new Date(2025, 5, 10, 14, 30),
    icon: UserPlus,
    color: 'text-green-600',
  },
  {
    id: 2,
    type: 'car_listed',
    title: 'Novo veículo anunciado',
    description: 'Honda Civic 2023 foi anunciado por Maria Santos',
    user: {
      name: 'Maria Santos',
      email: 'maria@email.com',
      avatar: null,
    },
    timestamp: new Date(2025, 5, 10, 13, 15),
    icon: Car,
    color: 'text-blue-600',
  },
  {
    id: 3,
    type: 'sale_completed',
    title: 'Venda concluída',
    description: 'Toyota Corolla 2022 vendido por R$ 85.000',
    user: {
      name: 'Carlos Oliveira',
      email: 'carlos@email.com',
      avatar: null,
    },
    timestamp: new Date(2025, 5, 10, 11, 45),
    icon: ShoppingCart,
    color: 'text-purple-600',
  },
  {
    id: 4,
    type: 'user_updated',
    title: 'Perfil atualizado',
    description: 'Ana Costa atualizou seu perfil',
    user: {
      name: 'Ana Costa',
      email: 'ana@email.com',
      avatar: null,
    },
    timestamp: new Date(2025, 5, 10, 10, 20),
    icon: User,
    color: 'text-orange-600',
  },
  {
    id: 5,
    type: 'car_sold',
    title: 'Veículo marcado como vendido',
    description: 'BMW X3 2021 foi marcado como vendido',
    user: {
      name: 'Roberto Lima',
      email: 'roberto@email.com',
      avatar: null,
    },
    timestamp: new Date(2025, 5, 10, 9, 10),
    icon: Car,
    color: 'text-green-600',
  },
];

export function AdminRecentActivity() {
  const [activities, setActivities] = useState(recentActivities);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getActivityBadge = (type: string) => {
    switch (type) {
      case 'user_registered':
        return (
          <Badge variant="outline" className="border-green-200 text-green-600">
            Novo Usuário
          </Badge>
        );
      case 'car_listed':
        return (
          <Badge variant="outline" className="border-blue-200 text-blue-600">
            Novo Anúncio
          </Badge>
        );
      case 'sale_completed':
        return (
          <Badge
            variant="outline"
            className="border-purple-200 text-purple-600"
          >
            Venda
          </Badge>
        );
      case 'user_updated':
        return (
          <Badge
            variant="outline"
            className="border-orange-200 text-orange-600"
          >
            Atualização
          </Badge>
        );
      case 'car_sold':
        return (
          <Badge variant="outline" className="border-green-200 text-green-600">
            Vendido
          </Badge>
        );
      default:
        return <Badge variant="outline">Atividade</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividade Recente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map(activity => {
            const Icon = activity.icon;

            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div
                  className={`rounded-full p-2 ${activity.color} bg-gray-50`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    {getActivityBadge(activity.type)}
                  </div>

                  <p className="text-sm text-gray-600">
                    {activity.description}
                  </p>

                  <div className="flex items-center space-x-2 pt-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={activity.user.avatar || ''} />
                      <AvatarFallback className="text-xs">
                        {getInitials(activity.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-500">
                      {activity.user.name}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(activity.timestamp, {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-800">
            Ver todas as atividades
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
