'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, Phone, Mail, X } from 'lucide-react';

interface QuickContactProps {
  trigger?: React.ReactNode;
}

export function QuickContact({ trigger }: QuickContactProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha nome, email e mensagem.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular envio
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: 'Mensagem enviada!',
        description: 'Entraremos em contato em breve.',
      });

      setFormData({ name: '', email: '', phone: '', message: '' });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: 'Erro ao enviar',
        description: 'Tente novamente ou entre em contato por telefone.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultTrigger = (
    <Button className="bg-blue-600 text-white hover:bg-blue-700">
      <MessageCircle className="mr-2 h-4 w-4" />
      Contato Rápido
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Contato Rápido
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="quick-name">Nome</Label>
            <Input
              id="quick-name"
              value={formData.name}
              onChange={e =>
                setFormData(prev => ({ ...prev, name: e.target.value }))
              }
              placeholder="Seu nome"
              required
            />
          </div>

          <div>
            <Label htmlFor="quick-email">Email</Label>
            <Input
              id="quick-email"
              type="email"
              value={formData.email}
              onChange={e =>
                setFormData(prev => ({ ...prev, email: e.target.value }))
              }
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="quick-phone">Telefone (opcional)</Label>
            <Input
              id="quick-phone"
              value={formData.phone}
              onChange={e =>
                setFormData(prev => ({ ...prev, phone: e.target.value }))
              }
              placeholder="(11) 99999-9999"
            />
          </div>

          <div>
            <Label htmlFor="quick-message">Mensagem</Label>
            <Textarea
              id="quick-message"
              value={formData.message}
              onChange={e =>
                setFormData(prev => ({ ...prev, message: e.target.value }))
              }
              placeholder="Como podemos ajudar?"
              rows={3}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </form>

        <div className="mt-4 border-t pt-4">
          <p className="mb-3 text-sm text-gray-600">
            Ou entre em contato diretamente:
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => window.open('tel:+551133334444')}
            >
              <Phone className="mr-1 h-4 w-4" />
              Ligar
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => window.open('mailto:contato@carshop.com.br')}
            >
              <Mail className="mr-1 h-4 w-4" />
              Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
