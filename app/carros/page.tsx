'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useToast } from '@/hooks/use-toast';
import { AdminService, AdminCar, AdminBrand } from '@/services/admin';
import { useCart } from '@/hooks/use-cart';
import {
  Search,
  Filter,
  ShoppingCart,
  Heart,
  Eye,
  Fuel,
  Calendar,
  Gauge,
  MapPin,
  Star,
  Grid3X3,
  List,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CarFilters {
  search: string;
  brand: string;
  minPrice: string;
  maxPrice: string;
  minYear: string;
  maxYear: string;
  status: string;
}

function CarsPageContent() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart, cartItems } = useCart();

  const [cars, setCars] = useState<AdminCar[]>([]);
  const [brands, setBrands] = useState<AdminBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCars, setTotalCars] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [filters, setFilters] = useState<CarFilters>({
    search: searchParams.get('search') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minYear: searchParams.get('minYear') || '',
    maxYear: searchParams.get('maxYear') || '',
    status: '',
  });

  const [tempFilters, setTempFilters] = useState<CarFilters>(filters);

  // Carregar marcas
  useEffect(() => {
    async function loadBrands() {
      try {
        const brandsData = await AdminService.getAllBrands();
        setBrands(brandsData);
      } catch (error) {
        console.error('Erro ao carregar marcas:', error);
      }
    }
    loadBrands();
  }, []);

  // Carregar carros
  useEffect(() => {
    loadCars();
  }, [currentPage, filters]);

  const loadCars = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        per_page: 12,
        status: filters.status,
      };

      if (filters.search) params.search = filters.search;
      if (filters.brand) params.brand = filters.brand;

      const response = await AdminService.getCars(params);

      // Filtrar por preço e ano no frontend
      let filteredCars = response.data;

      if (filters.minPrice || filters.maxPrice) {
        filteredCars = filteredCars.filter(car => {
          const price = parseFloat(car.price);
          const minPriceMatch =
            !filters.minPrice || price >= parseFloat(filters.minPrice);
          const maxPriceMatch =
            !filters.maxPrice || price <= parseFloat(filters.maxPrice);
          return minPriceMatch && maxPriceMatch;
        });
      }

      if (filters.minYear || filters.maxYear) {
        filteredCars = filteredCars.filter(car => {
          const year = car.manufacture_year;
          const minYearMatch =
            !filters.minYear || year >= parseInt(filters.minYear);
          const maxYearMatch =
            !filters.maxYear || year <= parseInt(filters.maxYear);
          return minYearMatch && maxYearMatch;
        });
      }

      setCars(filteredCars);
      setTotalPages(response.last_page);
      setTotalCars(response.total);
    } catch (error) {
      console.error('Erro ao carregar carros:', error);
      toast({
        title: 'Erro ao carregar carros',
        description: 'Ocorreu um erro ao carregar a lista de carros.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof CarFilters, value: string) => {
    setTempFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setCurrentPage(1);

    // Atualizar URL com filtros
    const params = new URLSearchParams();
    Object.entries(tempFilters).forEach(([key, value]) => {
      if (value && key !== 'status') {
        params.set(key, value);
      }
    });
    router.push(`/carros?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    const resetFilters = {
      search: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      minYear: '',
      maxYear: '',
      status: '',
    };
    setTempFilters(resetFilters);
    setFilters(resetFilters);
    setCurrentPage(1);
    router.push('/carros', { scroll: false });
  };

  const handleAddToCart = (car: AdminCar) => {
    addToCart({
      id: car.id,
      name: `${car.model?.brand?.name} ${car.model?.name}`,
      price: parseFloat(car.price),
      path: getImageUrl(car.path) || '/placeholder.svg',
      year: car.manufacture_year,
      color: car.color,
      mileage: car.mileage,
    });

    // toast({
    //   title: 'Adicionado ao carrinho!',
    //   description: `${car.model?.brand?.name} ${car.model?.name} foi adicionado ao seu carrinho.`,
    // });
  };

  const isInCart = (carId: number) => {
    return cartItems.some(item => item.id === carId);
  };

  const getImageUrl = (path: string | undefined) => {
    if (!path) return null;
    return `${process.env.NEXT_PUBLIC_IMAGE_URL}${path}`;
  };

  const renderCarCard = (car: AdminCar) => (
    <Card
      key={car.id}
      className="group overflow-hidden transition-shadow duration-300 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={getImageUrl(car.path) || '/placeholder-user.jpg'}
          alt={`${car.model?.brand?.name} ${car.model?.name}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <Badge
            className={
              car.status === 'available'
                ? 'bg-green-600'
                : car.status === 'reserved'
                  ? 'bg-yellow-600'
                  : car.status === 'sold'
                    ? 'bg-red-600'
                    : 'bg-orange-600'
            }
          >
            {car.status === 'available'
              ? 'Disponível'
              : car.status === 'reserved'
                ? 'Reservado'
                : car.status === 'sold'
                  ? 'Vendido'
                  : 'Manutenção'}
          </Badge>
        </div>
        <div className="absolute right-3 top-3 flex gap-2">
          <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
            <Heart className="h-4 w-4" />
          </Button>
          <Link href={`/carros/${car.id}`}>
            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="line-clamp-1 text-lg font-bold text-gray-900">
            {car.model?.brand?.name} {car.model?.name}
          </h3>
          <p className="text-sm text-gray-600">
            {car.manufacture_year} • {car.color}
          </p>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Gauge className="h-3 w-3" />
            <span>{car.mileage?.toLocaleString()} km</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="h-3 w-3" />
            <span>{car.model?.engine}</span>
          </div>
          {car.model?.power && (
            <div className="col-span-2 flex items-center gap-1">
              <Star className="h-3 w-3" />
              <span>{car.model.power} cv</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-gray-900">
              R${' '}
              {parseFloat(car.price).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAddToCart(car)}
              disabled={car.status !== 'available' || isInCart(car.id)}
              className="flex items-center gap-1"
            >
              <ShoppingCart className="h-4 w-4" />
              {isInCart(car.id) ? 'No Carrinho' : 'Comprar'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCarList = (car: AdminCar) => (
    <Card key={car.id} className="mb-4">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative h-32 w-48 flex-shrink-0 overflow-hidden rounded-lg">
            <Image
              src={getImageUrl(car.path) || '/placeholder.svg'}
              alt={`${car.model?.brand?.name} ${car.model?.name}`}
              fill
              className="object-cover"
            />
            <Badge
              className={`absolute left-2 top-2 ${
                car.status === 'available'
                  ? 'bg-green-600'
                  : car.status === 'reserved'
                    ? 'bg-yellow-600'
                    : car.status === 'sold'
                      ? 'bg-red-600'
                      : 'bg-orange-600'
              }`}
            >
              {car.status === 'available'
                ? 'Disponível'
                : car.status === 'reserved'
                  ? 'Reservado'
                  : car.status === 'sold'
                    ? 'Vendido'
                    : 'Manutenção'}
            </Badge>
          </div>

          <div className="flex-1">
            <div className="mb-2 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {car.model?.brand?.name} {car.model?.name}
                </h3>
                <p className="text-gray-600">
                  {car.manufacture_year} • {car.color}
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">
                  R${' '}
                  {parseFloat(car.price).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            <div className="mb-4 flex gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Gauge className="h-4 w-4" />
                <span>{car.mileage?.toLocaleString()} km</span>
              </div>
              <div className="flex items-center gap-1">
                <Fuel className="h-4 w-4" />
                <span>{car.model?.engine}</span>
              </div>
              {car.model?.power && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>{car.model.power} cv</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Heart className="mr-1 h-4 w-4" />
                  Favoritar
                </Button>
                <Link href={`/carros/${car.id}`}>
                  <Button size="sm" variant="outline">
                    <Eye className="mr-1 h-4 w-4" />
                    Ver Detalhes
                  </Button>
                </Link>
              </div>
              <Button
                onClick={() => handleAddToCart(car)}
                disabled={car.status !== 'available' || isInCart(car.id)}
                className="bg-black hover:bg-gray-800"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {isInCart(car.id) ? 'No Carrinho' : 'Adicionar ao Carrinho'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Carros Disponíveis
          </h1>
          <p className="text-gray-600">
            Encontre o carro dos seus sonhos em nossa seleção premium
          </p>
        </div>

        {/* Filtros */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Buscar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    placeholder="Buscar por marca, modelo..."
                    value={tempFilters.search}
                    onChange={e => handleFilterChange('search', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Marca
                </label>
                <Select
                  value={tempFilters.brand}
                  onValueChange={value => handleFilterChange('brand', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as marcas" />
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

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Preço Mínimo
                </label>
                <Input
                  type="number"
                  placeholder="R$ 0"
                  value={tempFilters.minPrice}
                  onChange={e => handleFilterChange('minPrice', e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Preço Máximo
                </label>
                <Input
                  type="number"
                  placeholder="R$ 999.999"
                  value={tempFilters.maxPrice}
                  onChange={e => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Ano Mínimo
                </label>
                <Input
                  type="number"
                  placeholder="2015"
                  value={tempFilters.minYear}
                  onChange={e => handleFilterChange('minYear', e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Ano Máximo
                </label>
                <Input
                  type="number"
                  placeholder="2025"
                  value={tempFilters.maxYear}
                  onChange={e => handleFilterChange('maxYear', e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Button
                onClick={applyFilters}
                className="bg-black hover:bg-gray-800"
              >
                <Filter className="mr-2 h-4 w-4" />
                Aplicar Filtros
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Controles de Visualização e Resultados */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="text-gray-600">
              {loading ? 'Carregando...' : `${totalCars} carros encontrados`}
            </p>
            <div className="flex rounded-lg border">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Link href="/carrinho">
            <Button variant="outline" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Carrinho ({cartItems.length})
            </Button>
          </Link>
        </div>

        {/* Lista de Carros */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
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
            ))}
          </div>
        ) : cars.length === 0 ? (
          <div className="py-12 text-center">
            <MapPin className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Nenhum carro encontrado
            </h3>
            <p className="mb-4 text-gray-600">
              Tente ajustar os filtros para encontrar mais opções
            </p>
            <Button onClick={clearFilters} variant="outline">
              Limpar Filtros
            </Button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cars.map(renderCarCard)}
          </div>
        ) : (
          <div>{cars.map(renderCarList)}</div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={
                      currentPage === 1
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente com loading fallback
function CarsPageLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-20 rounded bg-gray-200" />
          <div className="h-40 rounded bg-gray-200" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 rounded bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente principal exportado
export default function CarsPage() {
  return (
    <Suspense fallback={<CarsPageLoading />}>
      <CarsPageContent />
    </Suspense>
  );
}
