'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminCar, AdminService } from '@/services/admin';

export function FeaturedCars() {
  const [cars, setCars] = useState<AdminCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<{
    brand?: string;
    model?: string;
    yearFrom?: string;
    yearTo?: string;
    priceMin?: number;
    priceMax?: number;
  }>({});
  // Função para carregar carros com filtros
  const loadCars = async (appliedFilters: any = {}) => {
    setLoading(true);
    try {
      const searchParams: any = {
        page: 1,
        per_page: 12,
      };

      // Aplicar filtros se existirem
      if (appliedFilters.brand) {
        searchParams.brand = appliedFilters.brand;
      }
      if (appliedFilters.model) {
        searchParams.model = appliedFilters.model;
      }

      const response = await AdminService.getCars(searchParams);

      // Filtrar por ano e preço no frontend (se a API não suportar esses filtros)
      let filteredCars = response.data;

      if (appliedFilters.yearFrom || appliedFilters.yearTo) {
        filteredCars = filteredCars.filter(car => {
          const carYear = car.manufacture_year;
          const yearFromMatch =
            !appliedFilters.yearFrom ||
            carYear >= parseInt(appliedFilters.yearFrom);
          const yearToMatch =
            !appliedFilters.yearTo ||
            carYear <= parseInt(appliedFilters.yearTo);
          return yearFromMatch && yearToMatch;
        });
      }

      if (appliedFilters.priceMin || appliedFilters.priceMax) {
        filteredCars = filteredCars.filter(car => {
          const carPrice = parseFloat(car.price);
          const priceMinMatch =
            !appliedFilters.priceMin || carPrice >= appliedFilters.priceMin;
          const priceMaxMatch =
            !appliedFilters.priceMax || carPrice <= appliedFilters.priceMax;
          return priceMinMatch && priceMaxMatch;
        });
      }

      setCars(filteredCars);
    } catch (error) {
      console.error('Erro ao carregar carros:', error);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  // Carregar carros inicialmente
  useEffect(() => {
    loadCars();
  }, []);

  // Escutar eventos de filtro
  useEffect(() => {
    const handleApplyFilters = (event: CustomEvent) => {
      const newFilters = event.detail;
      setFilters(newFilters);
      loadCars(newFilters);
    };

    const handleClearFilters = () => {
      setFilters({});
      loadCars();
    };

    window.addEventListener(
      'applyFilters',
      handleApplyFilters as EventListener
    );
    window.addEventListener('clearFilters', handleClearFilters);

    return () => {
      window.removeEventListener(
        'applyFilters',
        handleApplyFilters as EventListener
      );
      window.removeEventListener('clearFilters', handleClearFilters);
    };
  }, []);

  return (
    <section>
      {' '}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Carros em Destaque
          </h2>
          {!loading && (
            <p className="mt-1 text-sm text-gray-600">
              {cars.length}{' '}
              {cars.length === 1 ? 'carro encontrado' : 'carros encontrados'}
            </p>
          )}
        </div>
        <Link
          href="/carros"
          className="text-sm font-medium text-gray-600 hover:text-black"
        >
          Ver todos →
        </Link>
      </div>{' '}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-[4/3] animate-pulse bg-gray-200" />
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="h-5 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
                  <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : cars.length === 0 ? (
          <div className="col-span-3 py-12 text-center">
            <p className="text-lg text-gray-500">
              Nenhum carro disponível no momento
            </p>
          </div>
        ) : (
          cars.map(car => (
            <Card
              key={car.id}
              className="group overflow-hidden transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={car.images?.[0] || '/placeholder.svg'}
                  alt={`${car.model?.brand?.name} ${car.model?.name} ${car.manufacture_year}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3">
                  {car.status === 'available' && (
                    <Badge className="bg-green-600 text-white">
                      Disponível
                    </Badge>
                  )}
                  {car.status === 'reserved' && (
                    <Badge className="bg-yellow-600 text-white">
                      Reservado
                    </Badge>
                  )}
                  {car.status === 'sold' && (
                    <Badge className="bg-red-600 text-white">Vendido</Badge>
                  )}
                  {car.status === 'maintenance' && (
                    <Badge className="bg-orange-600 text-white">
                      Manutenção
                    </Badge>
                  )}
                </div>
                <div className="absolute right-3 top-3 flex gap-2">
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-gray-900">
                    {car.model?.brand?.name} {car.model?.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {car.manufacture_year} • {car.color}
                  </p>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <span>{car.mileage.toLocaleString()} km</span>
                  <span>{car.model?.engine}</span>
                  {car.model?.power && (
                    <span className="col-span-2">{car.model.power} cv</span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900">
                    R${' '}
                    {parseFloat(car.price).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <Link href={`/carros/${car.id}`}>
                    <Button
                      size="sm"
                      className="bg-black text-white hover:bg-gray-800"
                      disabled={car.status !== 'available'}
                    >
                      Ver Detalhes
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </section>
  );
}
