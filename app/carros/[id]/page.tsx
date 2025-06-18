'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AdminService, AdminCar } from '@/services/admin';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { toastSuccess, toastError, toastWarning } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Heart,
  Share2,
  ShoppingCart,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  MapPin,
  Star,
  Phone,
  Mail,
  MessageCircle,
  Shield,
  CheckCircle,
  Clock,
  Camera,
  ChevronLeft,
  ChevronRight,
  Car,
  Eye,
  Zap,
} from 'lucide-react';

interface CarDetailsProps {
  params: { id: string };
}

export default function CarDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, cartItems } = useCart();
  const { isAuthenticated, user } = useAuth();

  const [car, setCar] = useState<AdminCar | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [relatedCars, setRelatedCars] = useState<AdminCar[]>([]);

  useEffect(() => {
    if (params.id) {
      loadCarDetails();
    }
  }, [params.id]);

  const loadCarDetails = async () => {
    try {
      setLoading(true);
      const carData = await AdminService.getCar(Number(params.id));
      setCar(carData);

      // Carregar carros relacionados da mesma marca
      if (carData.model?.brand_id) {
        const relatedResponse = await AdminService.getCars({
          brand: carData.model.brand_id.toString(),
          per_page: 4,
        });
        const filtered = relatedResponse.data.filter(
          relatedCar => relatedCar.id !== carData.id
        );
        setRelatedCars(filtered);
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes do carro:', error);
      toastError(
        'Erro ao carregar veículo',
        'Não foi possível carregar os detalhes do carro.'
      );
      router.push('/carros');
    } finally {
      setLoading(false);
    }
  };
  const handleAddToCart = () => {
    if (!car) return;

    if (!isAuthenticated) {
      toastWarning(
        'Login necessário',
        'Faça login para adicionar ao carrinho.'
      );
      router.push(`/login?redirect=/carros/${car.id}`);
      return;
    }

    addToCart({
      id: car.id,
      name: `${car.model?.brand?.name} ${car.model?.name}`,
      price: parseFloat(car.price),
      path: car.path || '/placeholder.svg',
      year: car.manufacture_year,
      color: car.color,
      mileage: car.mileage,
    });

    // O toast já é exibido pelo hook useCart
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = car
      ? `${car.model?.brand?.name} ${car.model?.name} ${car.manufacture_year}`
      : 'Carro na LuxuryCars';

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
      }
    } else {
      // Fallback: copiar para área de transferência
      navigator.clipboard.writeText(url);
      toastSuccess(
        'Link copiado!',
        'O link foi copiado para sua área de transferência.'
      );
    }
  };
  const toggleFavorite = () => {
    if (!isAuthenticated) {
      toastWarning('Login necessário', 'Faça login para favoritar carros.');
      router.push(`/login?redirect=/carros/${car?.id}`);
      return;
    }

    setIsFavorited(!isFavorited);

    if (isFavorited) {
      toastWarning(
        'Removido dos favoritos',
        'Carro removido da sua lista de favoritos.'
      );
    } else {
      toastSuccess(
        '❤️ Adicionado aos favoritos!',
        'Carro adicionado à sua lista de favoritos.'
      );
    }
  };

  const isInCart = () => {
    return car ? cartItems.some(item => item.id === car.id) : false;
  };

  // const nextImage = () => {
  //   if (car?.images && car.images.length > 0) {
  //     setCurrentImageIndex(prev => (prev + 1) % (car.images?.length || 1));
  //   }
  // };

  // const prevImage = () => {
  //   if (car?.images && car.images.length > 0) {
  //     setCurrentImageIndex(
  //       prev =>
  //         (prev - 1 + (car.images?.length || 1)) % (car.images?.length || 1)
  //     );
  //   }
  // };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numPrice);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: { label: 'Disponível', className: 'bg-green-600' },
      reserved: { label: 'Reservado', className: 'bg-yellow-600' },
      sold: { label: 'Vendido', className: 'bg-red-600' },
      maintenance: { label: 'Manutenção', className: 'bg-orange-600' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      className: 'bg-gray-600',
    };

    return (
      <Badge className={`${config.className} text-white`}>{config.label}</Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 grid gap-8 lg:grid-cols-2">
              {/* Image Skeleton */}
              <div className="space-y-4">
                <div className="aspect-[4/3] animate-pulse rounded-lg bg-gray-200" />
                <div className="flex gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-20 w-20 animate-pulse rounded-lg bg-gray-200"
                    />
                  ))}
                </div>
              </div>

              {/* Details Skeleton */}
              <div className="space-y-6">
                <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200" />
                <div className="h-10 w-1/3 animate-pulse rounded bg-gray-200" />
                <div className="space-y-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-4 w-full animate-pulse rounded bg-gray-200"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getImageUrl = (path: string | undefined) => {
    if (!path) return null;
    return `${process.env.NEXT_PUBLIC_IMAGE_URL}${path}`;
  };

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-2xl text-center">
            <Car className="mx-auto mb-6 h-24 w-24 text-gray-400" />
            <h1 className="mb-4 text-3xl font-bold text-gray-900">
              Carro não encontrado
            </h1>
            <p className="mb-8 text-gray-600">
              O carro que você está procurando não existe ou foi removido.
            </p>
            <Link href="/carros">
              <Button className="bg-black hover:bg-gray-800">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar aos Carros
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-black">
              Início
            </Link>
            <span className="mx-2">/</span>
            <Link href="/carros" className="hover:text-black">
              Carros
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">
              {car.model?.brand?.name} {car.model?.name}
            </span>
          </div>

          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </div>

          {/* Main Content */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-white">
                <Image
                  src={getImageUrl(car.path) || '/placeholder-user.jpg'}
                  alt={`${car.model?.brand?.name} ${car.model?.name}`}
                  fill
                  className="object-cover"
                  priority
                />

                {/* Navigation Arrows */}
                {/* {car.path && car.path.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute left-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full p-0"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute right-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full p-0"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )} */}

                {/* Image Counter */}
                {/* {car.path && car.path.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
                    <Camera className="mr-1 inline h-3 w-3" />
                    {currentImageIndex + 1} / {car.path.length}
                  </div>
                )} */}

                {/* Status Badge */}
                <div className="absolute left-4 top-4">
                  {getStatusBadge(car.status)}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {car.path && car.path.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {/* {car.path.map((path, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                        index === currentImageIndex
                          ? 'border-black'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <Image
                        src={getImageUrl(path) || '/placeholder-user.jpg'}
                        alt={`Imagem ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))} */}
                </div>
              )}
            </div>

            {/* Car Details */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {car.model?.brand?.name} {car.model?.name}
                    </h1>
                    <p className="text-lg text-gray-600">
                      {car.manufacture_year} • {car.color}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleFavorite}
                      className={isFavorited ? 'text-red-600' : ''}
                    >
                      <Heart
                        className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`}
                      />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-3xl font-bold text-gray-900">
                  {formatPrice(car.price)}
                </div>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Gauge className="h-5 w-5" />
                  <span>{car.mileage?.toLocaleString()} km</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-5 w-5" />
                  <span>{car.manufacture_year}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Fuel className="h-5 w-5" />
                  <span>{car.model?.engine}</span>
                </div>
                {car.model?.power && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Zap className="h-5 w-5" />
                    <span>{car.model.power} cv</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={car.status !== 'available' || isInCart()}
                  className="w-full bg-black hover:bg-gray-800"
                  size="lg"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {isInCart()
                    ? 'No Carrinho'
                    : car.status !== 'available'
                      ? 'Não Disponível'
                      : 'Adicionar ao Carrinho'}
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" size="lg">
                    <Phone className="mr-2 h-4 w-4" />
                    Ligar
                  </Button>
                  <Button variant="outline" size="lg">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp
                  </Button>
                </div>
              </div>

              {/* Security Features */}
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-gray-600">
                        Compra 100% segura
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <span className="text-sm text-gray-600">
                        Documentação verificada
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-purple-600" />
                      <span className="text-sm text-gray-600">
                        Suporte especializado
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Detailed Specifications */}
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Especificações Técnicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Marca:</span>
                        <span className="font-medium">
                          {car.model?.brand?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Modelo:</span>
                        <span className="font-medium">{car.model?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ano:</span>
                        <span className="font-medium">
                          {car.manufacture_year}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cor:</span>
                        <span className="font-medium">{car.color}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quilometragem:</span>
                        <span className="font-medium">
                          {car.mileage?.toLocaleString()} km
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Motor:</span>
                        <span className="font-medium">{car.model?.engine}</span>
                      </div>
                      {car.model?.power && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Potência:</span>
                          <span className="font-medium">
                            {car.model.power} cv
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">VIN:</span>
                        <span className="font-mono text-sm font-medium">
                          {car.vin}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-medium">
                          {getStatusBadge(car.status)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Inclusão:</span>
                        <span className="font-medium">
                          {new Date(car.inclusion_date).toLocaleDateString(
                            'pt-BR'
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Sidebar */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Fale Conosco</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">(11) 3333-4444</p>
                        <p className="text-sm text-gray-600">
                          Segunda à Sexta, 8h às 18h
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">vendas@luxurycars.com.br</p>
                        <p className="text-sm text-gray-600">
                          Resposta em até 2h
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Av. Paulista, 1234</p>
                        <p className="text-sm text-gray-600">São Paulo - SP</p>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Agendar Test Drive
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Related Cars */}
          {relatedCars.length > 0 && (
            <div className="mt-12">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Carros Relacionados
                </h2>
                <p className="text-gray-600">
                  Outros carros da marca {car.model?.brand?.name}
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {relatedCars.map(relatedCar => (
                  <Card
                    key={relatedCar.id}
                    className="group overflow-hidden transition-shadow hover:shadow-lg"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={
                          getImageUrl(relatedCar.path) ||
                          '/placeholder-user.jpg'
                        }
                        alt={`${relatedCar.model?.brand?.name} ${relatedCar.model?.name}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="mb-1 font-bold text-gray-900">
                        {relatedCar.model?.brand?.name} {relatedCar.model?.name}
                      </h3>
                      <p className="mb-2 text-sm text-gray-600">
                        {relatedCar.manufacture_year} • {relatedCar.color}
                      </p>
                      <p className="mb-3 text-lg font-bold text-gray-900">
                        {formatPrice(relatedCar.price)}
                      </p>
                      <Link href={`/carros/${relatedCar.id}`}>
                        <Button size="sm" className="w-full">
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Detalhes
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
