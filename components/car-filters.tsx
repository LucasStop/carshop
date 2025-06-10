'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export function CarFilters() {
  const [priceRange, setPriceRange] = useState([100000, 2000000]);

  const brands = [
    'Mercedes-Benz',
    'BMW',
    'Audi',
    'Porsche',
    'Jaguar',
    'Land Rover',
    'Volvo',
    'Lexus',
  ];

  const carTypes = [
    'Sedan',
    'SUV',
    'Hatchback',
    'Coupé',
    'Conversível',
    'Wagon',
  ];

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Marca */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Marca</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a marca" />
            </SelectTrigger>
            <SelectContent>
              {brands.map(brand => (
                <SelectItem key={brand} value={brand.toLowerCase()}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Faixa de Preço */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Faixa de Preço</Label>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={2000000}
              min={50000}
              step={10000}
              className="w-full"
            />
            <div className="mt-2 flex justify-between text-sm text-gray-500">
              <span>R$ {priceRange[0].toLocaleString()}</span>
              <span>R$ {priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Ano */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Ano</Label>
          <div className="grid grid-cols-2 gap-2">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="De" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => 2024 - i).map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Até" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => 2024 - i).map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tipo de Carro */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Tipo de Carro</Label>
          <div className="space-y-2">
            {carTypes.map(type => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox id={type} />
                <Label htmlFor={type} className="text-sm font-normal">
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Botões */}
        <div className="space-y-2 pt-4">
          <Button className="w-full bg-black text-white hover:bg-gray-800">
            Aplicar Filtros
          </Button>
          <Button variant="outline" className="w-full">
            Limpar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
