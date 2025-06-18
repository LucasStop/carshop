'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import {
  toastSuccess,
  toastError,
  toastWarning,
  toastInfo,
  toastLoading,
} from '@/hooks/use-toast';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  CheckCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const router = useRouter();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    itemCount,
  } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    installments: '1',
  });

  const shippingCost = 0; // Frete grátis para carros
  const finalTotal = total + shippingCost;

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };
  const handleRemoveItem = (id: number, itemName: string) => {
    removeFromCart(id);
    // O toast já é exibido pelo hook useCart
  };
  const handleCheckout = () => {
    if (!isAuthenticated) {
      toastWarning('Login necessário', 'Faça login para finalizar sua compra.');
      router.push('/login?redirect=/carrinho');
      return;
    }

    toastInfo(
      'Iniciando checkout',
      'Preencha os dados do cartão para finalizar sua compra'
    );

    setShowCheckout(true);
  };
  const handlePayment = async () => {
    if (
      !paymentData.cardNumber ||
      !paymentData.expiryDate ||
      !paymentData.cvv ||
      !paymentData.cardName
    ) {
      toastError(
        'Dados incompletos',
        'Por favor, preencha todos os dados do cartão.'
      );
      return;
    }

    setIsProcessing(true);

    // Toast de carregamento para o pagamento
    const loadingToast = toastLoading(
      'Processando pagamento...',
      'Estamos verificando os dados do seu cartão. Aguarde...'
    );

    try {
      // Simular processamento do pagamento
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Fechar toast de carregamento
      loadingToast.dismiss();

      // Limpar carrinho após compra
      clearCart();

      toastSuccess(
        '🎉 Compra realizada com sucesso!',
        `Parabéns! Sua compra de ${itemCount} ${itemCount === 1 ? 'veículo' : 'veículos'} foi processada. Em breve entraremos em contato para finalizar a documentação.`
      );

      router.push('/compra-finalizada');
    } catch (error) {
      // Fechar toast de carregamento
      loadingToast.dismiss();

      toastError(
        'Erro no pagamento',
        'Ocorreu um erro ao processar seu pagamento. Verifique os dados do cartão e tente novamente.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-2xl text-center">
            <ShoppingCart className="mx-auto mb-6 h-24 w-24 text-gray-400" />
            <h1 className="mb-4 text-3xl font-bold text-gray-900">
              Seu carrinho está vazio
            </h1>
            <p className="mb-8 text-gray-600">
              Explore nossa seleção de carros premium e encontre o veículo dos
              seus sonhos.
            </p>
            <Link href="/carros">
              <Button className="bg-black hover:bg-gray-800">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continuar Comprando
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getImageUrl = (path: string | undefined) => {
    if (!path) return null;
    return `${process.env.NEXT_PUBLIC_IMAGE_URL}${path}`;
  };

  if (showCheckout) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => setShowCheckout(false)}
                className="mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Carrinho
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">
                Finalizar Compra
              </h1>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Dados de Pagamento */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Dados de Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cardName">Nome no Cartão</Label>
                    <Input
                      id="cardName"
                      value={paymentData.cardName}
                      onChange={e =>
                        setPaymentData(prev => ({
                          ...prev,
                          cardName: e.target.value,
                        }))
                      }
                      placeholder="Como aparece no cartão"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardNumber">Número do Cartão</Label>
                    <Input
                      id="cardNumber"
                      value={paymentData.cardNumber}
                      onChange={e =>
                        setPaymentData(prev => ({
                          ...prev,
                          cardNumber: e.target.value,
                        }))
                      }
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Validade</Label>
                      <Input
                        id="expiryDate"
                        value={paymentData.expiryDate}
                        onChange={e =>
                          setPaymentData(prev => ({
                            ...prev,
                            expiryDate: e.target.value,
                          }))
                        }
                        placeholder="MM/AA"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        value={paymentData.cvv}
                        onChange={e =>
                          setPaymentData(prev => ({
                            ...prev,
                            cvv: e.target.value,
                          }))
                        }
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="installments">Parcelamento</Label>
                    <select
                      id="installments"
                      value={paymentData.installments}
                      onChange={e =>
                        setPaymentData(prev => ({
                          ...prev,
                          installments: e.target.value,
                        }))
                      }
                      className="w-full rounded-md border border-gray-300 p-2"
                    >
                      <option value="1">À vista</option>
                      <option value="2">2x sem juros</option>
                      <option value="3">3x sem juros</option>
                      <option value="6">6x sem juros</option>
                      <option value="12">12x com juros</option>
                      <option value="24">24x com juros</option>
                    </select>
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {isProcessing ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Processando...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Finalizar Compra
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Resumo da Compra */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Resumo da Compra</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {cartItems.map(item => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="relative h-12 w-16 flex-shrink-0">
                            <Image
                              src={getImageUrl(item.path) || '/placeholder.svg'}
                              alt={item.name}
                              fill
                              className="rounded object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium">{item.name}</h4>
                            <p className="text-xs text-gray-600">
                              {item.year} • {item.color}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              R${' '}
                              {item.price.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>
                          Subtotal ({itemCount}{' '}
                          {itemCount === 1 ? 'item' : 'itens'})
                        </span>
                        <span>
                          R${' '}
                          {total.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Frete e documentação</span>
                        <span className="text-green-600">Grátis</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>
                          R${' '}
                          {finalTotal.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      {paymentData.installments !== '1' && (
                        <p className="text-sm text-gray-600">
                          {paymentData.installments}x de R${' '}
                          {(
                            finalTotal / parseInt(paymentData.installments)
                          ).toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Garantias */}
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-green-600" />
                        <span className="text-sm">Garantia de procedência</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5 text-blue-600" />
                        <span className="text-sm">
                          Entrega e documentação gratuitas
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-purple-600" />
                        <span className="text-sm">Suporte pós-venda</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">
                Carrinho de Compras
              </h1>
              <Link href="/carros">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continuar Comprando
                </Button>
              </Link>
            </div>
            <p className="mt-2 text-gray-600">
              {itemCount} {itemCount === 1 ? 'item' : 'itens'} no seu carrinho
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Lista de Itens */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {cartItems.map(item => (
                      <div key={item.id} className="p-6">
                        <div className="flex gap-4">
                          <div className="relative h-24 w-32 flex-shrink-0">
                            <Image
                              src={getImageUrl(item.path) || '/placeholder.svg'}
                              alt={item.path}
                              fill
                              className="rounded-lg object-cover"
                            />
                          </div>

                          <div className="flex-1">
                            <div className="mb-2 flex items-start justify-between">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {item.name}
                                </h3>
                                <p className="text-gray-600">
                                  {item.year} • {item.color} •{' '}
                                  {item.mileage?.toLocaleString()} km
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleRemoveItem(item.id, item.name)
                                }
                                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600">
                                  Quantidade:
                                </span>
                                <div className="flex items-center rounded border">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleQuantityChange(
                                        item.id,
                                        (item.quantity || 1) - 1
                                      )
                                    }
                                    className="h-8 w-8 p-0"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="px-3 py-1 text-sm font-medium">
                                    {item.quantity || 1}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleQuantityChange(
                                        item.id,
                                        (item.quantity || 1) + 1
                                      )
                                    }
                                    className="h-8 w-8 p-0"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>

                              <div className="text-right">
                                <p className="text-xl font-bold text-gray-900">
                                  R${' '}
                                  {(
                                    item.price * (item.quantity || 1)
                                  ).toLocaleString('pt-BR', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </p>
                                {(item.quantity || 1) > 1 && (
                                  <p className="text-sm text-gray-600">
                                    R${' '}
                                    {item.price.toLocaleString('pt-BR', {
                                      minimumFractionDigits: 2,
                                    })}{' '}
                                    cada
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="mt-4 flex justify-between">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Limpar Carrinho
                </Button>
              </div>
            </div>

            {/* Resumo */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>
                        Subtotal ({itemCount}{' '}
                        {itemCount === 1 ? 'item' : 'itens'})
                      </span>
                      <span>
                        R${' '}
                        {total.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frete e documentação</span>
                      <span className="font-medium text-green-600">Grátis</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>
                        R${' '}
                        {finalTotal.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Finalizar Compra
                  </Button>

                  <div className="space-y-3 border-t pt-4">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-gray-600">
                        Compra 100% segura
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Truck className="h-5 w-5 text-blue-600" />
                      <span className="text-sm text-gray-600">
                        Entrega grátis
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-purple-600" />
                      <span className="text-sm text-gray-600">
                        Suporte especializado
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
