'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, Car, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TestDriveBookingProps {
  trigger?: React.ReactNode;
}

export function TestDriveBooking({ trigger }: TestDriveBookingProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    carModel: '',
    preferredTime: '',
    hasDriverLicense: 'yes',
  });

  const availableTimes = [
    '09:00',
    '10:00',
    '11:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ];

  const carModels = [
    'Mercedes-Benz S-Class',
    'BMW X7',
    'Audi A8',
    'Porsche Cayenne',
    'Jaguar F-Pace',
    'Land Rover Range Rover',
    'Volvo XC90',
    'Lexus LS',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !date ||
      !formData.preferredTime
    ) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular agendamento
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: 'Test Drive Agendado!',
        description: `Seu test drive foi agendado para ${format(date, 'dd/MM/yyyy', { locale: ptBR })} às ${formData.preferredTime}. Entraremos em contato para confirmar.`,
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        carModel: '',
        preferredTime: '',
        hasDriverLicense: 'yes',
      });
      setDate(undefined);
      setIsOpen(false);
    } catch (error) {
      toast({
        title: 'Erro ao agendar',
        description:
          'Ocorreu um erro. Tente novamente ou entre em contato por telefone.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultTrigger = (
    <Button className="bg-green-600 text-white hover:bg-green-700">
      <Car className="mr-2 h-4 w-4" />
      Agendar Test Drive
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Agendar Test Drive
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="td-name">Nome Completo *</Label>
              <Input
                id="td-name"
                value={formData.name}
                onChange={e =>
                  setFormData(prev => ({ ...prev, name: e.target.value }))
                }
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div>
              <Label htmlFor="td-email">Email *</Label>
              <Input
                id="td-email"
                type="email"
                value={formData.email}
                onChange={e =>
                  setFormData(prev => ({ ...prev, email: e.target.value }))
                }
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="td-phone">Telefone *</Label>
              <Input
                id="td-phone"
                value={formData.phone}
                onChange={e =>
                  setFormData(prev => ({ ...prev, phone: e.target.value }))
                }
                placeholder="(11) 99999-9999"
                required
              />
            </div>

            <div>
              <Label htmlFor="td-car">Modelo do Carro</Label>
              <Select
                value={formData.carModel}
                onValueChange={value =>
                  setFormData(prev => ({ ...prev, carModel: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o modelo" />
                </SelectTrigger>
                <SelectContent>
                  {carModels.map(model => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Data Preferida *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date
                      ? format(date, 'dd/MM/yyyy', { locale: ptBR })
                      : 'Selecione a data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={date => date < new Date() || date.getDay() === 0} // Não permite domingos
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="td-time">Horário Preferido *</Label>
              <Select
                value={formData.preferredTime}
                onValueChange={value =>
                  setFormData(prev => ({ ...prev, preferredTime: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimes.map(time => (
                    <SelectItem key={time} value={time}>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {time}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="td-license">Possui CNH válida? *</Label>
            <Select
              value={formData.hasDriverLicense}
              onValueChange={value =>
                setFormData(prev => ({ ...prev, hasDriverLicense: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Sim, tenho CNH válida</SelectItem>
                <SelectItem value="no">Não tenho CNH</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg bg-blue-50 p-4">
            <h4 className="mb-2 font-semibold text-blue-900">
              Informações importantes:
            </h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• CNH obrigatória para realizar o test drive</li>
              <li>• Duração aproximada: 30 minutos</li>
              <li>• Confirmação por telefone em até 24h</li>
              <li>• Test drive gratuito e sem compromisso</li>
            </ul>
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Agendando...
              </>
            ) : (
              <>
                <Car className="mr-2 h-4 w-4" />
                Confirmar Agendamento
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
