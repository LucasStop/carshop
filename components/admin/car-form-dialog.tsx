'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AdminService,
  AdminCar,
  CreateCarRequest,
  UpdateCarRequest,
} from '@/services/admin';
import { useAdminLoading } from './admin-loading-provider';

const carFormSchema = z.object({
  brand_id: z.number().min(1, 'Marca é obrigatória'),
  model_id: z.number().min(1, 'Modelo é obrigatório'),
  year: z
    .number()
    .min(1990, 'Ano deve ser maior que 1990')
    .max(new Date().getFullYear() + 1, 'Ano inválido'),
  price: z.number().min(1, 'Preço deve ser maior que zero'),
  mileage: z.number().min(0, 'Quilometragem não pode ser negativa'),
  fuel_type: z.string().min(1, 'Tipo de combustível é obrigatório'),
  transmission: z.string().min(1, 'Transmissão é obrigatória'),
  body_type: z.string().min(1, 'Tipo de carroceria é obrigatório'),
  color: z.string().min(1, 'Cor é obrigatória'),
  doors: z
    .number()
    .min(2, 'Número de portas deve ser pelo menos 2')
    .max(5, 'Número de portas não pode ser maior que 5'),
  description: z
    .string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  featured: z.boolean().default(false),
  status: z.enum(['active', 'inactive']),
  user_id: z.number().optional(),
});

type CarFormData = z.infer<typeof carFormSchema>;

interface CarFormDialogProps {
  car?: AdminCar | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Dados fictícios - em produção viriam da API
const brands = [
  { id: 1, name: 'Toyota' },
  { id: 2, name: 'Honda' },
  { id: 3, name: 'Volkswagen' },
  { id: 4, name: 'Chevrolet' },
  { id: 5, name: 'Ford' },
  { id: 6, name: 'Nissan' },
  { id: 7, name: 'Hyundai' },
  { id: 8, name: 'BMW' },
  { id: 9, name: 'Mercedes-Benz' },
  { id: 10, name: 'Audi' },
];

const models = [
  { id: 1, name: 'Corolla', brand_id: 1 },
  { id: 2, name: 'Camry', brand_id: 1 },
  { id: 3, name: 'Civic', brand_id: 2 },
  { id: 4, name: 'Accord', brand_id: 2 },
  { id: 5, name: 'Golf', brand_id: 3 },
  { id: 6, name: 'Jetta', brand_id: 3 },
  { id: 7, name: 'Onix', brand_id: 4 },
  { id: 8, name: 'Cruze', brand_id: 4 },
  { id: 9, name: 'Fiesta', brand_id: 5 },
  { id: 10, name: 'Focus', brand_id: 5 },
];

const fuelTypes = [
  'Flex',
  'Gasolina',
  'Etanol',
  'Diesel',
  'Híbrido',
  'Elétrico',
  'GNV',
];

const transmissionTypes = ['Manual', 'Automático', 'CVT', 'Automatizado'];

const bodyTypes = [
  'Sedan',
  'Hatch',
  'SUV',
  'Pickup',
  'Wagon',
  'Coupe',
  'Conversível',
];

const colors = [
  'Branco',
  'Preto',
  'Prata',
  'Cinza',
  'Azul',
  'Vermelho',
  'Verde',
  'Dourado',
  'Bege',
  'Marrom',
];

export function CarFormDialog({
  car,
  open,
  onClose,
  onSuccess,
}: CarFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<number>(0);
  const { setIsLoading, setLoadingMessage } = useAdminLoading();

  const form = useForm<CarFormData>({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      brand_id: 0,
      model_id: 0,
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      fuel_type: '',
      transmission: '',
      body_type: '',
      color: '',
      doors: 4,
      description: '',
      featured: false,
      status: 'active',
      user_id: undefined,
    },
  });

  useEffect(() => {
    if (car) {
      // Edição - preencher formulário
      form.reset({
        brand_id: car.brand_id,
        model_id: car.model_id,
        year: car.year,
        price: car.price,
        mileage: car.mileage,
        fuel_type: car.fuel_type,
        transmission: car.transmission,
        body_type: car.body_type,
        color: car.color,
        doors: car.doors,
        description: car.description,
        featured: car.featured,
        status: car.status === 'sold' ? 'active' : car.status, // Não permitir criar como vendido
        user_id: car.user_id,
      });
      setSelectedBrand(car.brand_id);
    } else {
      // Criação - formulário vazio
      form.reset({
        brand_id: 0,
        model_id: 0,
        year: new Date().getFullYear(),
        price: 0,
        mileage: 0,
        fuel_type: '',
        transmission: '',
        body_type: '',
        color: '',
        doors: 4,
        description: '',
        featured: false,
        status: 'active',
        user_id: undefined,
      });
      setSelectedBrand(0);
    }
  }, [car, form]);

  const handleBrandChange = (brandId: number) => {
    setSelectedBrand(brandId);
    form.setValue('brand_id', brandId);
    form.setValue('model_id', 0); // Reset model when brand changes
  };

  const getAvailableModels = () => {
    return models.filter(model => model.brand_id === selectedBrand);
  };

  const onSubmit = async (data: CarFormData) => {
    setIsSubmitting(true);
    setIsLoading(true);
    setLoadingMessage(car ? 'Atualizando veículo...' : 'Criando veículo...');

    try {
      if (car) {
        // Atualização
        const updateData: UpdateCarRequest = {
          brand_id: data.brand_id,
          model_id: data.model_id,
          year: data.year,
          price: data.price,
          mileage: data.mileage,
          fuel_type: data.fuel_type,
          transmission: data.transmission,
          body_type: data.body_type,
          color: data.color,
          doors: data.doors,
          description: data.description,
          featured: data.featured,
          status: data.status,
          user_id: data.user_id,
        };

        await AdminService.updateCar(car.id, updateData);
      } else {
        // Criação
        const createData: CreateCarRequest = {
          brand_id: data.brand_id,
          model_id: data.model_id,
          year: data.year,
          price: data.price,
          mileage: data.mileage,
          fuel_type: data.fuel_type,
          transmission: data.transmission,
          body_type: data.body_type,
          color: data.color,
          doors: data.doors,
          description: data.description,
          featured: data.featured,
          status: data.status,
          user_id: data.user_id,
        };

        await AdminService.createCar(createData);
      }

      onSuccess();
    } catch (error: any) {
      console.error('Erro ao salvar veículo:', error);

      // Tratar erros de validação da API
      if (error.response?.data?.errors) {
        const apiErrors = error.response.data.errors;
        Object.keys(apiErrors).forEach(field => {
          const message = Array.isArray(apiErrors[field])
            ? apiErrors[field][0]
            : apiErrors[field];
          form.setError(field as any, { message });
        });
      }
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    // Remove tudo que não é número
    const numericValue = value.replace(/\D/g, '');

    // Converte para número e formata
    const numberValue = parseFloat(numericValue) / 100;

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(numberValue);
  };

  const parseCurrency = (formattedValue: string): number => {
    const numericValue = formattedValue.replace(/[^\d]/g, '');
    return parseFloat(numericValue) / 100;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{car ? 'Editar Veículo' : 'Novo Veículo'}</DialogTitle>
          <DialogDescription>
            {car
              ? 'Atualize as informações do veículo abaixo.'
              : 'Preencha as informações para criar um novo anúncio de veículo.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informações Básicas</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="brand_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marca</FormLabel>
                      <Select
                        onValueChange={value =>
                          handleBrandChange(parseInt(value))
                        }
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a marca" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {brands.map(brand => (
                            <SelectItem
                              key={brand.id}
                              value={brand.id.toString()}
                            >
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="model_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo</FormLabel>
                      <Select
                        onValueChange={value => field.onChange(parseInt(value))}
                        value={field.value?.toString()}
                        disabled={!selectedBrand}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o modelo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getAvailableModels().map(model => (
                            <SelectItem
                              key={model.id}
                              value={model.id.toString()}
                            >
                              {model.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ano</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1990"
                          max={new Date().getFullYear() + 1}
                          {...field}
                          onChange={e =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="doors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Portas</FormLabel>
                      <Select
                        onValueChange={value => field.onChange(parseInt(value))}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Nº de portas" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="2">2 portas</SelectItem>
                          <SelectItem value="3">3 portas</SelectItem>
                          <SelectItem value="4">4 portas</SelectItem>
                          <SelectItem value="5">5 portas</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a cor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {colors.map(color => (
                            <SelectItem key={color} value={color}>
                              {color}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="fuel_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Combustível</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Tipo de combustível" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {fuelTypes.map(fuel => (
                            <SelectItem key={fuel} value={fuel}>
                              {fuel}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="transmission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transmissão</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Tipo de transmissão" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {transmissionTypes.map(transmission => (
                            <SelectItem key={transmission} value={transmission}>
                              {transmission}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="body_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carroceria</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Tipo de carroceria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {bodyTypes.map(body => (
                            <SelectItem key={body} value={body}>
                              {body}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Preço e Quilometragem */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Preço e Quilometragem</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="R$ 0,00"
                          value={
                            field.value
                              ? formatCurrency(field.value.toString() + '00')
                              : ''
                          }
                          onChange={e => {
                            const value = parseCurrency(e.target.value);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mileage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quilometragem</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field}
                          onChange={e =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Descrição</h3>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva o veículo, suas características, histórico de manutenção, etc."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Uma boa descrição ajuda a atrair mais compradores.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Configurações */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Configurações</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Status do anúncio" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Ativo</SelectItem>
                          <SelectItem value="inactive">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Destaque</FormLabel>
                        <FormDescription>
                          Marcar como anúncio em destaque
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : car ? 'Atualizar' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
