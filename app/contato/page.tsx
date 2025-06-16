'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ValidatedInput,
  validators,
  masks,
} from '@/components/validated-input';
import { TestDriveBooking } from '@/components/test-drive-booking';
import { useToast } from '@/hooks/use-toast';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  Car,
  Calculator,
  Users,
  Headphones,
} from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  contactReason: string;
}

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    contactReason: '',
  });

  const contactReasons = [
    { value: 'vendas', label: 'Interesse em comprar um carro' },
    { value: 'venda', label: 'Quero vender meu carro' },
    { value: 'financiamento', label: 'Informações sobre financiamento' },
    { value: 'suporte', label: 'Suporte técnico' },
    { value: 'outros', label: 'Outros assuntos' },
  ];

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações básicas
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha nome, email e mensagem.',
        variant: 'destructive',
      });
      return;
    }

    if (!validators.email(formData.email)) {
      toast({
        title: 'Email inválido',
        description: 'Por favor, insira um email válido.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular envio do formulário
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: 'Mensagem enviada!',
        description: 'Obrigado pelo contato. Responderemos em breve.',
      });

      // Limpar formulário
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        contactReason: '',
      });
    } catch (error) {
      toast({
        title: 'Erro ao enviar',
        description:
          'Ocorreu um erro. Tente novamente ou entre em contato por telefone.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Entre em Contato
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Estamos aqui para ajudar! Entre em contato conosco para tirar suas
            dúvidas, solicitar informações ou agendar uma visita.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Informações de Contato */}
          <div className="space-y-6 lg:col-span-1">
            {/* Cartão Principal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="h-5 w-5" />
                  Fale Conosco
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Endereço</h3>
                    <p className="text-sm text-gray-600">
                      Av. Paulista, 1234
                      <br />
                      Bela Vista, São Paulo - SP
                      <br />
                      CEP: 01310-100
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="mt-1 h-5 w-5 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Telefones</h3>
                    <p className="text-sm text-gray-600">
                      (11) 3333-4444
                      <br />
                      (11) 99999-8888
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="mt-1 h-5 w-5 text-red-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-sm text-gray-600">
                      contato@carshop.com.br
                      <br />
                      vendas@carshop.com.br
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="mt-1 h-5 w-5 text-orange-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Horário</h3>
                    <p className="text-sm text-gray-600">
                      Segunda a Sexta: 8h às 18h
                      <br />
                      Sábado: 8h às 16h
                      <br />
                      Domingo: Fechado
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Departamentos */}
            <Card>
              <CardHeader>
                <CardTitle>Departamentos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3">
                  <Car className="h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Vendas</h4>
                    <p className="text-sm text-gray-600">(11) 3333-4444</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3">
                  <Calculator className="h-5 w-5 text-green-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Financiamento</h4>
                    <p className="text-sm text-gray-600">(11) 3333-4455</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg bg-purple-50 p-3">
                  <Users className="h-5 w-5 text-purple-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Atendimento</h4>
                    <p className="text-sm text-gray-600">(11) 3333-4466</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulário de Contato */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Envie sua Mensagem
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={e =>
                          handleInputChange('name', e.target.value)
                        }
                        placeholder="Seu nome completo"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <ValidatedInput
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={value => handleInputChange('email', value)}
                        validator={validators.email}
                        validationMessage="Email inválido"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <ValidatedInput
                        id="phone"
                        value={formData.phone}
                        onChange={value => handleInputChange('phone', value)}
                        mask={masks.phone}
                        validator={validators.phone}
                        validationMessage="Telefone inválido"
                        placeholder="(11) 99999-9999"
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactReason">Motivo do Contato</Label>
                      <Select
                        value={formData.contactReason}
                        onValueChange={value =>
                          handleInputChange('contactReason', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o motivo" />
                        </SelectTrigger>
                        <SelectContent>
                          {contactReasons.map(reason => (
                            <SelectItem key={reason.value} value={reason.value}>
                              {reason.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Assunto</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={e =>
                        handleInputChange('subject', e.target.value)
                      }
                      placeholder="Assunto da sua mensagem"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Mensagem *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={e =>
                        handleInputChange('message', e.target.value)
                      }
                      placeholder="Escreva sua mensagem aqui..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-black hover:bg-gray-800"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar Mensagem
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mapa e Informações Adicionais */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Mapa */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Nossa Localização
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex aspect-video items-center justify-center rounded-lg bg-gray-200">
                <div className="text-center">
                  <MapPin className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                  <p className="text-gray-500">
                    Av. Paulista, 1234
                    <br />
                    Bela Vista, São Paulo - SP
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() =>
                      window.open(
                        'https://maps.google.com?q=Av.+Paulista+1234+São+Paulo',
                        '_blank'
                      )
                    }
                  >
                    Ver no Google Maps
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ / Informações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Perguntas Frequentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-900">
                  Como posso agendar um test drive?
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  Entre em contato pelo telefone (11) 3333-4444 ou preencha o
                  formulário selecionando "Interesse em comprar um carro".
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-gray-900">
                  Vocês aceitam meu carro como entrada?
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  Sim! Fazemos avaliação gratuita do seu veículo. Agende uma
                  visita ou entre em contato para mais informações.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-gray-900">
                  Oferecem financiamento?
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  Sim, trabalhamos com diversos bancos e financeiras. Fale com
                  nosso departamento de financiamento: (11) 3333-4455.
                </p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-gray-900">
                  Qual o prazo de resposta?
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  Respondemos todas as mensagens em até 24 horas durante dias
                  úteis.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Depoimentos e Avaliações */}
        <div className="mt-12">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              O que nossos clientes dizem
            </h2>
            <p className="text-gray-600">
              Veja alguns depoimentos de quem já confiou em nossos serviços
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="h-4 w-4 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="mb-4 italic text-gray-600">
                  "Excelente atendimento! Comprei meu BMW X7 aqui e foi uma
                  experiência incrível. A equipe foi muito profissional e me
                  ajudou em todo o processo."
                </p>
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <span className="font-semibold text-blue-600">MR</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Maria Rodriguez
                    </p>
                    <p className="text-sm text-gray-500">Cliente desde 2024</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="h-4 w-4 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="mb-4 italic text-gray-600">
                  "Venderam meu carro antigo por um preço justo e me ajudaram a
                  encontrar o Mercedes perfeito. Recomendo para todos!"
                </p>
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <span className="font-semibold text-green-600">JS</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">João Silva</p>
                    <p className="text-sm text-gray-500">Cliente desde 2023</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="h-4 w-4 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="mb-4 italic text-gray-600">
                  "Processo de financiamento super tranquilo. A equipe explicou
                  tudo detalhadamente e conseguiram as melhores condições para
                  mim."
                </p>
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                    <span className="font-semibold text-purple-600">AC</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Ana Costa</p>
                    <p className="text-sm text-gray-500">Cliente desde 2024</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="mt-12">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Ações Rápidas
            </h2>
            <p className="text-gray-600">
              Acesso rápido aos nossos principais serviços
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="text-center">
              <CardContent className="p-6">
                <Car className="mx-auto mb-4 h-12 w-12 text-green-600" />
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Test Drive
                </h3>
                <p className="mb-4 text-gray-600">
                  Agende um test drive e experimente o carro dos seus sonhos
                </p>
                <TestDriveBooking />
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Calculator className="mx-auto mb-4 h-12 w-12 text-blue-600" />
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Financiamento
                </h3>
                <p className="mb-4 text-gray-600">
                  Simule seu financiamento e descubra as melhores condições
                </p>
                <Button variant="outline" className="w-full">
                  Simular Financiamento
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Phone className="mx-auto mb-4 h-12 w-12 text-purple-600" />
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Ligação Direta
                </h3>
                <p className="mb-4 text-gray-600">
                  Fale diretamente com nossos consultores especializados
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open('tel:+551133334444')}
                >
                  (11) 3333-4444
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
