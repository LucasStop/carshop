'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Car,
  Calculator,
  Users,
  Headphones,
  Star,
} from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        {/* Header Section - Simplified */}
        <div className="mb-20 text-center">
          <div className="mb-8 inline-flex items-center justify-center rounded-full bg-gray-900 p-4">
            <Headphones className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-6 text-5xl font-light text-gray-900 lg:text-6xl">
            Entre em Contato
          </h1>
          <div className="mx-auto max-w-2xl">
            <p className="text-xl text-gray-600">
              Estamos aqui para ajudar. Entre em contato conosco para tirar suas
              dúvidas ou agendar uma visita.
            </p>
          </div>
        </div>

        {/* Contact Grid - Simplified */}
        <div className="mb-20 grid gap-12 lg:grid-cols-2">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 bg-gray-50">
                <CardTitle className="flex items-center gap-3 text-xl font-medium text-gray-900">
                  <Headphones className="h-5 w-5 text-gray-700" />
                  Informações de Contato
                </CardTitle>
              </CardHeader>{' '}
              <CardContent className="p-8">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="text-center">
                    <div className="mx-auto mb-4 w-fit rounded-lg bg-gray-900 p-3">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="mb-2 font-medium text-gray-900">Endereço</h3>
                    <p className="text-sm text-gray-600">
                      Av. Paulista, 1234
                      <br />
                      Bela Vista, São Paulo - SP
                      <br />
                      CEP: 01310-100
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="mx-auto mb-4 w-fit rounded-lg bg-gray-900 p-3">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="mb-2 font-medium text-gray-900">
                      Telefones
                    </h3>
                    <div className="space-y-1">
                      <a
                        href="tel:+551133334444"
                        className="block text-sm text-gray-600 hover:text-gray-900"
                      >
                        (11) 3333-4444
                      </a>
                      <a
                        href="tel:+5511999998888"
                        className="block text-sm text-gray-600 hover:text-gray-900"
                      >
                        (11) 99999-8888
                      </a>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="mx-auto mb-4 w-fit rounded-lg bg-gray-900 p-3">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="mb-2 font-medium text-gray-900">Email</h3>
                    <div className="space-y-1">
                      <a
                        href="mailto:contato@carshop.com.br"
                        className="block text-sm text-gray-600 hover:text-gray-900"
                      >
                        contato@carshop.com.br
                      </a>
                      <a
                        href="mailto:vendas@carshop.com.br"
                        className="block text-sm text-gray-600 hover:text-gray-900"
                      >
                        vendas@carshop.com.br
                      </a>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="mx-auto mb-4 w-fit rounded-lg bg-gray-900 p-3">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="mb-2 font-medium text-gray-900">Horário</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>Segunda a Sexta: 8h às 18h</div>
                      <div>Sábado: 8h às 16h</div>
                      <div>Domingo: Fechado</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Departments - Simplified */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 bg-gray-50">
                <CardTitle className="flex items-center gap-3 text-xl font-medium text-gray-900">
                  <Users className="h-5 w-5 text-gray-700" />
                  Departamentos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <Car className="h-5 w-5 text-gray-700" />
                      <div>
                        <h4 className="font-medium text-gray-900">Vendas</h4>
                        <p className="text-sm text-gray-600">
                          Consultores especializados
                        </p>
                      </div>
                    </div>
                    <a
                      href="tel:+551133334444"
                      className="text-gray-900 hover:underline"
                    >
                      (11) 3333-4444
                    </a>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <Calculator className="h-5 w-5 text-gray-700" />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Financiamento
                        </h4>
                        <p className="text-sm text-gray-600">
                          Melhores condições
                        </p>
                      </div>
                    </div>
                    <a
                      href="tel:+551133334455"
                      className="text-gray-900 hover:underline"
                    >
                      (11) 3333-4455
                    </a>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <Headphones className="h-5 w-5 text-gray-700" />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Atendimento
                        </h4>
                        <p className="text-sm text-gray-600">
                          Suporte e pós-venda
                        </p>
                      </div>
                    </div>
                    <a
                      href="tel:+551133334466"
                      className="text-gray-900 hover:underline"
                    >
                      (11) 3333-4466
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map & FAQ - Simplified */}
          <div className="space-y-8">
            {/* Map */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 bg-gray-50">
                <CardTitle className="flex items-center gap-3 text-xl font-medium text-gray-900">
                  <MapPin className="h-5 w-5 text-gray-700" />
                  Localização
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex aspect-video items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="mb-4 inline-flex items-center justify-center rounded-full bg-gray-900 p-4">
                      <MapPin className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="mb-2 text-lg font-medium text-gray-900">
                      Av. Paulista, 1234
                    </h3>
                    <p className="mb-4 text-gray-600">
                      Bela Vista, São Paulo - SP
                    </p>
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open(
                          'https://maps.google.com?q=Av.+Paulista+1234+São+Paulo',
                          '_blank'
                        )
                      }
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Ver no Maps
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 bg-gray-50">
                <CardTitle className="flex items-center gap-3 text-xl font-medium text-gray-900">
                  <MessageCircle className="h-5 w-5 text-gray-700" />
                  Perguntas Frequentes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="border-l-2 border-gray-900 pl-4">
                    <h4 className="mb-2 font-medium text-gray-900">
                      Como posso agendar um test drive?
                    </h4>
                    <p className="text-gray-600">
                      Entre em contato pelo telefone (11) 3333-4444 ou envie um
                      email para vendas@carshop.com.br
                    </p>
                  </div>

                  <div className="border-l-2 border-gray-900 pl-4">
                    <h4 className="mb-2 font-medium text-gray-900">
                      Vocês aceitam meu carro como entrada?
                    </h4>
                    <p className="text-gray-600">
                      Sim! Fazemos avaliação gratuita do seu veículo e
                      oferecemos as melhores condições de troca.
                    </p>
                  </div>

                  <div className="border-l-2 border-gray-900 pl-4">
                    <h4 className="mb-2 font-medium text-gray-900">
                      Oferecem financiamento?
                    </h4>
                    <p className="text-gray-600">
                      Trabalhamos com os principais bancos e financeiras do
                      mercado. Ligue para (11) 3333-4455 para mais informações.
                    </p>
                  </div>

                  <div className="border-l-2 border-gray-900 pl-4">
                    <h4 className="mb-2 font-medium text-gray-900">
                      Qual o prazo de resposta?
                    </h4>
                    <p className="text-gray-600">
                      Respondemos todas as mensagens em até 4 horas durante dias
                      úteis.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Testimonials - Simplified */}
        <div className="mb-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-light text-gray-900">
              O que nossos clientes dizem
            </h2>
            <p className="text-gray-600">
              Mais de 500 clientes satisfeitos escolheram nossos serviços
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="flex text-gray-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="mb-8 leading-relaxed text-gray-700">
                  "Excelente atendimento! Comprei meu BMW X7 aqui e foi uma
                  experiência incrível. A equipe foi muito profissional."
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-sm font-medium text-white">
                    MR
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Maria Rodriguez</p>
                    <p className="text-sm text-gray-500">Cliente desde 2024</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="flex text-gray-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="mb-8 leading-relaxed text-gray-700">
                  "Venderam meu carro por um preço justo e me ajudaram a
                  encontrar o Mercedes perfeito. Recomendo para todos!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-sm font-medium text-white">
                    JS
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">João Silva</p>
                    <p className="text-sm text-gray-500">Cliente desde 2023</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="flex text-gray-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="mb-8 leading-relaxed text-gray-700">
                  "Processo de financiamento muito tranquilo. A equipe explicou
                  tudo e conseguiram as melhores condições."
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-sm font-medium text-white">
                    AC
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Ana Costa</p>
                    <p className="text-sm text-gray-500">Cliente desde 2024</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats - Simplified */}
          <div className="mt-16 grid grid-cols-2 gap-8 lg:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-3xl font-light text-gray-900">500+</div>
              <div className="text-sm text-gray-600">Clientes Satisfeitos</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-light text-gray-900">98%</div>
              <div className="text-sm text-gray-600">Taxa de Satisfação</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-light text-gray-900">15+</div>
              <div className="text-sm text-gray-600">Anos de Mercado</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-light text-gray-900">4h</div>
              <div className="text-sm text-gray-600">Tempo de Resposta</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
