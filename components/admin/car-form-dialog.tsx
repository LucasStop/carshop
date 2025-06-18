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
  AdminBrand,
  AdminModel,
  CreateCarRequest,
  UpdateCarRequest,
} from '@/services/admin';
import { useAdminLoading } from './admin-loading-provider';
import { toastSuccess, toastError } from '@/hooks/use-toast';

const carFormSchema = z.object({
  model_id: z.number().min(1, 'Modelo é obrigatório'),
  vin: z
    .string()
    .min(17, 'VIN deve ter 17 caracteres')
    .max(17, 'VIN deve ter 17 caracteres'),
  color: z.string().min(1, 'Cor é obrigatória'),
  manufacture_year: z
    .number()
    .min(1990, 'Ano deve ser maior que 1990')
    .max(new Date().getFullYear() + 1, 'Ano inválido'),
  mileage: z.number().min(0, 'Quilometragem não pode ser negativa'),
  price: z.string().min(1, 'Preço é obrigatório'),
  status: z.enum(['available', 'reserved', 'maintenance']),
  inclusion_date: z.string().min(1, 'Data de inclusão é obrigatória'),
});

type CarFormData = z.infer<typeof carFormSchema>;

interface CarFormDialogProps {
  car?: AdminCar | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

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
  'Azul Escuro',
  'Cinza Escuro',
  'Verde Escuro',
  'Vermelho Escuro',
];

export function CarFormDialog({
  car,
  open,
  onClose,
  onSuccess,
}: CarFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brands, setBrands] = useState<AdminBrand[]>([]);
  const [models, setModels] = useState<AdminModel[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<number>(0);
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const { setIsLoading, setLoadingMessage } = useAdminLoading();

  const form = useForm<CarFormData>({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      model_id: 0,
      vin: '',
      color: '',
      manufacture_year: new Date().getFullYear(),
      mileage: 0,
      price: '',
      status: 'available',
      inclusion_date: new Date().toISOString().split('T')[0],
    },
  });

  // Carregar marcas
  useEffect(() => {
    const loadBrands = async () => {
      try {
        setIsLoadingBrands(true);
        const brandsData = await AdminService.getAllBrands();
        setBrands(brandsData);
      } catch (error) {
        console.error('Erro ao carregar marcas:', error);
      } finally {
        setIsLoadingBrands(false);
      }
    };

    if (open) {
      loadBrands();
    }
  }, [open]);

  // Carregar modelos quando marca é selecionada
  useEffect(() => {
    const loadModels = async () => {
      if (selectedBrand > 0) {
        try {
          setIsLoadingModels(true);
          const response = await AdminService.getModels({
            brand: selectedBrand.toString(),
          });
          setModels(response.data);
        } catch (error) {
          console.error('Erro ao carregar modelos:', error);
        } finally {
          setIsLoadingModels(false);
        }
      } else {
        setModels([]);
      }
    };

    loadModels();
  }, [selectedBrand]);

  useEffect(() => {
    if (car) {
      // Edição - preencher formulário
      form.reset({
        model_id: car.model_id,
        vin: car.vin,
        color: car.color,
        manufacture_year: car.manufacture_year,
        mileage: car.mileage,
        price: car.price,
        status: car.status === 'sold' ? 'available' : car.status, // Não permitir criar como vendido
        inclusion_date: car.inclusion_date.split('T')[0],
      });

      // Se temos o modelo, buscar a marca
      if (car.model?.brand_id) {
        setSelectedBrand(car.model.brand_id);
      }
    } else {
      // Criação - formulário vazio
      form.reset({
        model_id: 0,
        vin: '',
        color: '',
        manufacture_year: new Date().getFullYear(),
        mileage: 0,
        price: '',
        status: 'available',
        inclusion_date: new Date().toISOString().split('T')[0],
      });
      setSelectedBrand(0);
    }
  }, [car, form]);

  const handleBrandChange = (brandId: number) => {
    setSelectedBrand(brandId);
    form.setValue('model_id', 0); // Reset model when brand changes
  };

  const onSubmit = async (data: CarFormData) => {
    setIsSubmitting(true);
    setIsLoading(true);
    setLoadingMessage(car ? 'Atualizando veículo...' : 'Criando veículo...');

    try {
      if (car) {
        // Atualização
        const updateData: UpdateCarRequest = {
          model_id: data.model_id,
          vin: data.vin,
          color: data.color,
          manufacture_year: data.manufacture_year,
          mileage: data.mileage,
          price: data.price,
          status: data.status,
          inclusion_date: data.inclusion_date,
        };
        await AdminService.updateCar(car.id, updateData);

        toastSuccess(
          'Veículo atualizado com sucesso!',
          `${data.color} ${models.find(m => m.id === data.model_id)?.brand?.name || ''} ${models.find(m => m.id === data.model_id)?.name || ''} foi atualizado.`
        );
      } else {
        // Criação
        const createData: CreateCarRequest = {
          model_id: data.model_id,
          vin: data.vin,
          color: data.color,
          manufacture_year: data.manufacture_year,
          mileage: data.mileage,
          price: data.price,
          status: data.status,
          inclusion_date: data.inclusion_date,
        };

        await AdminService.createCar(createData);

        toastSuccess(
          'Veículo criado com sucesso!',
          `${data.color} ${models.find(m => m.id === data.model_id)?.brand?.name || ''} ${models.find(m => m.id === data.model_id)?.name || ''} foi adicionado ao sistema.`
        );
      }

      onSuccess();
    } catch (error: any) {
      console.error('Erro ao salvar veículo:', error);

      toastError(
        car ? 'Erro ao atualizar veículo' : 'Erro ao criar veículo',
        'Verifique os dados e tente novamente.'
      );

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{car ? 'Editar Veículo' : 'Novo Veículo'}</DialogTitle>
          <DialogDescription>
            {car
              ? 'Atualize as informações do veículo abaixo.'
              : 'Preencha as informações para criar um novo veículo.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações do Veículo */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informações do Veículo</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="model_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marca</FormLabel>
                      <Select
                        value={selectedBrand ? selectedBrand.toString() : ''}
                        onValueChange={value =>
                          handleBrandChange(parseInt(value))
                        }
                        disabled={isLoadingBrands}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                isLoadingBrands
                                  ? 'Carregando...'
                                  : 'Selecione uma marca'
                              }
                            />
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
                        value={field.value ? field.value.toString() : ''}
                        onValueChange={value => field.onChange(parseInt(value))}
                        disabled={isLoadingModels || selectedBrand === 0}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                selectedBrand === 0
                                  ? 'Selecione uma marca primeiro'
                                  : isLoadingModels
                                    ? 'Carregando...'
                                    : 'Selecione um modelo'
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {models.map(model => (
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

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="vin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>VIN (Número do Chassi)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: VINVW001AAA12345"
                          {...field}
                          onChange={e =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          maxLength={17}
                        />
                      </FormControl>
                      <FormDescription>
                        Código de identificação único do veículo (17 caracteres)
                      </FormDescription>
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
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma cor" />
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

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="manufacture_year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ano de Fabricação</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1990}
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
                  name="mileage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quilometragem</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="Ex: 15000"
                          {...field}
                          onChange={e =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Quilometragem atual do veículo
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Preço e Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Preço e Status</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: 180000"
                          {...field}
                          onChange={e => {
                            // Permitir apenas números
                            const value = e.target.value.replace(/\D/g, '');
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Preço em reais (apenas números)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="available">Disponível</SelectItem>
                          <SelectItem value="reserved">Reservado</SelectItem>
                          <SelectItem value="maintenance">
                            Manutenção
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="inclusion_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Inclusão</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      Data em que o veículo foi incluído no estoque
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
