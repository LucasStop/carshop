'use client';

import { useState, useEffect } from 'react';
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
import { AdminService, AdminBrand, AdminModel } from '@/services/admin';

export function CarFilters() {
  const [priceRange, setPriceRange] = useState([50000, 500000]);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [yearFrom, setYearFrom] = useState<string>('');
  const [yearTo, setYearTo] = useState<string>('');
  const [brands, setBrands] = useState<AdminBrand[]>([]);
  const [models, setModels] = useState<AdminModel[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar marcas do backend
  useEffect(() => {
    async function loadBrands() {
      try {
        const brandsData = await AdminService.getAllBrands();
        setBrands(brandsData);
      } catch (error) {
        console.error('Erro ao carregar marcas:', error);
      } finally {
        setLoading(false);
      }
    }
    loadBrands();
  }, []);

  // Buscar modelos quando uma marca é selecionada
  useEffect(() => {
    async function loadModels() {
      if (!selectedBrand) {
        setModels([]);
        return;
      }

      try {
        const modelsResponse = await AdminService.getModels({
          brand: selectedBrand,
          per_page: 100,
        });
        setModels(modelsResponse.data);
      } catch (error) {
        console.error('Erro ao carregar modelos:', error);
      }
    }
    loadModels();
  }, [selectedBrand]);

  // Função para aplicar filtros
  const handleApplyFilters = () => {
    const filters = {
      brand: selectedBrand,
      model: selectedModel,
      yearFrom,
      yearTo,
      priceMin: priceRange[0],
      priceMax: priceRange[1],
    };

    // Emitir evento personalizado com os filtros
    window.dispatchEvent(new CustomEvent('applyFilters', { detail: filters }));
  };

  // Função para limpar filtros
  const handleClearFilters = () => {
    setSelectedBrand('');
    setSelectedModel('');
    setYearFrom('');
    setYearTo('');
    setPriceRange([50000, 2000000]);

    // Emitir evento para limpar filtros
    window.dispatchEvent(new CustomEvent('clearFilters'));
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>{' '}
      <CardContent className="space-y-6">
        {/* Marca */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Marca</Label>
          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a marca" />
            </SelectTrigger>
            <SelectContent>
              {brands.map(brand => (
                <SelectItem key={brand.id} value={brand.name}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Modelo */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Modelo</Label>
          <Select
            value={selectedModel}
            onValueChange={setSelectedModel}
            disabled={!selectedBrand}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  selectedBrand
                    ? 'Selecione o modelo'
                    : 'Selecione uma marca primeiro'
                }
              />
            </SelectTrigger>
            <SelectContent>
              {models.map(model => (
                <SelectItem key={model.id} value={model.name}>
                  {model.name}
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
              max={500000}
              min={50000}
              step={10000}
              className="w-full"
            />
            <div className="mt-2 flex justify-between text-sm text-gray-500">
              <span>R$ {priceRange[0].toLocaleString('pt-BR')}</span>
              <span>R$ {priceRange[1].toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </div>

        {/* Ano */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Ano</Label>
          <div className="grid grid-cols-2 gap-2">
            <Select value={yearFrom} onValueChange={setYearFrom}>
              <SelectTrigger>
                <SelectValue placeholder="De" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 15 }, (_, i) => 2025 - i).map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={yearTo} onValueChange={setYearTo}>
              <SelectTrigger>
                <SelectValue placeholder="Até" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 15 }, (_, i) => 2025 - i).map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Botões */}
        <div className="space-y-2 pt-4">
          <Button
            className="w-full bg-black text-white hover:bg-gray-800"
            onClick={handleApplyFilters}
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Aplicar Filtros'}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleClearFilters}
          >
            Limpar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
