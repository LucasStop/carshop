'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle,
  Car,
  Calendar,
  CreditCard,
  Mail,
  Phone,
  FileText,
  ArrowLeft,
  Home,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface PurchaseData {
  orderId: string;
  items: Array<{
    id: number;
    name: string;
    price: number;
    path: string;
    year: number;
    color: string;
    mileage: number;
  }>;
  total: number;
  paymentMethod: string;
  installments: number;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  deliveryDate: string;
}

function PurchaseCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [purchaseData, setPurchaseData] = useState<PurchaseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento dos dados da compra
    const orderId = searchParams.get('orderId');
    if (!orderId) {
      router.push('/carros');
      return;
    }

    // Simular dados da compra finalizada
    setTimeout(() => {
      setPurchaseData({
        orderId: orderId,
        items: [
          {
            id: 1,
            name: 'BMW X7 M50i',
            price: 850000,
            path: '/bmw-x7-2024.png',
            year: 2024,
            color: 'Preto',
            mileage: 0,
          },
        ],
        total: 850000,
        paymentMethod: 'Cartão de Crédito',
        installments: 12,
        customerInfo: {
          name: 'João Silva',
          email: 'joao@example.com',
          phone: '(11) 99999-9999',
        },
        deliveryDate: '2024-01-20',
      });
      setIsLoading(false);
    }, 1000);
  }, [searchParams, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-black" />
          <p className="text-gray-600">Processando sua compra...</p>
        </div>
      </div>
    );
  }

  if (!purchaseData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Compra não encontrada
          </h1>
          <Button asChild>
            <Link href="/carros">Voltar aos Carros</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getImageUrl = (path: string | undefined) => {
    if (!path) return null;
    return `${process.env.NEXT_PUBLIC_IMAGE_URL}${path}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header de Sucesso */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Compra Realizada com Sucesso!
          </h1>
          <p className="text-lg text-gray-600">
            Parabéns! Sua compra foi processada e confirmada.
          </p>
        </div>
        {/* Informações do Pedido */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Detalhes do Pedido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Número do Pedido
                    </span>
                    <p className="text-lg font-semibold">
                      #{purchaseData.orderId}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Data da Compra
                    </span>
                    <p className="text-gray-900">
                      {new Date().toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Previsão de Entrega
                    </span>
                    <p className="flex items-center gap-2 text-gray-900">
                      <Calendar className="h-4 w-4" />
                      {new Date(purchaseData.deliveryDate).toLocaleDateString(
                        'pt-BR'
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Forma de Pagamento
                    </span>
                    <p className="flex items-center gap-2 text-gray-900">
                      <CreditCard className="h-4 w-4" />
                      {purchaseData.paymentMethod}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Parcelamento
                    </span>
                    <p className="text-gray-900">
                      {purchaseData.installments}x de R${' '}
                      {(
                        purchaseData.total / purchaseData.installments
                      ).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Total
                    </span>
                    <p className="text-2xl font-bold text-green-600">
                      R${' '}
                      {purchaseData.total.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Itens Comprados */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Veículos Adquiridos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {purchaseData.items.map(item => (
                <div key={item.id} className="flex gap-4 rounded-lg border p-4">
                  <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={getImageUrl(item.path) || '/placeholder.svg'}
                      alt={item.name}
                      fill
                      className="rounded object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      {item.year} • {item.color} •{' '}
                      {item.mileage?.toLocaleString()} km
                    </p>
                    <p className="mt-2 text-lg font-semibold text-gray-900">
                      R${' '}
                      {item.price.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Confirmado
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Próximos Passos */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Próximos Passos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                  <span className="text-sm font-bold text-blue-600">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Confirmação por E-mail
                  </h4>
                  <p className="text-sm text-gray-600">
                    Enviamos um e-mail de confirmação para{' '}
                    {purchaseData.customerInfo.email} com todos os detalhes da
                    sua compra.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                  <span className="text-sm font-bold text-blue-600">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Documentação</h4>
                  <p className="text-sm text-gray-600">
                    Nossa equipe entrará em contato em até 24h para orientar
                    sobre a documentação necessária.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                  <span className="text-sm font-bold text-blue-600">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Entrega</h4>
                  <p className="text-sm text-gray-600">
                    Seu veículo será entregue na data prevista. Entraremos em
                    contato para confirmar o horário.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Contato e Suporte */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Precisa de Ajuda?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Telefone</p>
                  <p className="text-sm text-gray-600">(11) 3000-0000</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">E-mail</p>
                  <p className="text-sm text-gray-600">
                    suporte@luxurycars.com
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Ações */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button variant="outline" asChild className="flex items-center gap-2">
            <Link href="/carros">
              <ArrowLeft className="h-4 w-4" />
              Continuar Comprando
            </Link>
          </Button>

          <Button variant="outline" asChild className="flex items-center gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Ir para Início
            </Link>
          </Button>

          <Button
            asChild
            className="flex items-center gap-2 bg-black hover:bg-gray-800"
          >
            <Link href="/contato">
              <MessageSquare className="h-4 w-4" />
              Falar com Suporte
            </Link>
          </Button>
        </div>
        {/* Nota Importante */}
        <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            <strong>Importante:</strong> Guarde o número do seu pedido #
            {purchaseData.orderId} para futuras consultas. Em caso de dúvidas,
            nossa equipe está disponível para ajudá-lo.
          </p>
        </div>{' '}
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-black" />
        <p className="text-gray-600">Carregando...</p>
      </div>
    </div>
  );
}

export default function PurchaseCompletePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PurchaseCompleteContent />
    </Suspense>
  );
}
