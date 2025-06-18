'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AdminService,
  AdminSale,
  CreateSaleRequest,
  UpdateSaleRequest,
  AdminCar,
  AdminUser,
} from '@/services/admin';
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { toastSuccess, toastError, toastLoading } from '@/hooks/use-toast';

const saleSchema = z.object({
  car_id: z.string().min(1, 'Selecione um veículo'),
  customer_user_id: z.string().min(1, 'Selecione um cliente'),
  employee_user_id: z.string().min(1, 'Selecione um funcionário'),
  final_price: z.string().min(1, 'Informe o preço final'),
  sale_date: z.string().min(1, 'Informe a data da venda'),
  notes: z.string().optional(),
});

type SaleFormData = z.infer<typeof saleSchema>;

interface SaleFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  sale?: AdminSale | null;
}

export function SaleFormDialog({
  open,
  onClose,
  onSubmit,
  sale,
}: SaleFormDialogProps) {
  const [cars, setCars] = useState<AdminCar[]>([]);
  const [customers, setCustomers] = useState<AdminUser[]>([]);
  const [employees, setEmployees] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      car_id: '',
      customer_user_id: '',
      employee_user_id: '',
      final_price: '',
      sale_date: format(new Date(), 'yyyy-MM-dd'),
      notes: '',
    },
  });

  useEffect(() => {
    if (open) {
      loadFormData();
      if (sale) {
        form.reset({
          car_id: sale.car_id.toString(),
          customer_user_id: sale.customer_user_id.toString(),
          employee_user_id: sale.employee_user_id.toString(),
          final_price: sale.final_price,
          sale_date: sale.sale_date.split('T')[0], // Formato YYYY-MM-DD
          notes: sale.notes || '',
        });
      } else {
        form.reset({
          car_id: '',
          customer_user_id: '',
          employee_user_id: '',
          final_price: '',
          sale_date: format(new Date(), 'yyyy-MM-dd'),
          notes: '',
        });
      }
    }
  }, [open, sale, form]);
  const loadFormData = async () => {
    try {
      const [carsResponse, usersData] = await Promise.all([
        AdminService.getCars(),
        AdminService.getUsers(),
      ]);

      // Filtrar carros disponíveis
      const availableCars = carsResponse.data.filter(
        (car: AdminCar) =>
          car.status === 'available' || (sale && car.id === sale.car_id)
      );
      setCars(availableCars);

      // Separar usuários por role (assumindo que temos essa informação)
      const customerUsers = usersData.data.filter(
        (user: AdminUser) =>
          user.role.slug === 'client' || user.role.slug === 'user'
      );
      const employeeUsers = usersData.data.filter(
        (user: AdminUser) =>
          user.role.slug === 'employee' || user.role.slug === 'admin'
      );

      setCustomers(customerUsers);
      setEmployees(employeeUsers);
    } catch (error) {
      console.error('Erro ao carregar dados do formulário:', error);
      toastError(
        'Erro ao carregar dados',
        'Erro ao carregar dados do formulário'
      );
    }
  };
  const handleSubmit = async (data: SaleFormData) => {
    const loadingToast = toastLoading(
      sale ? 'Atualizando venda...' : 'Criando venda...',
      'Processando dados da venda'
    );

    try {
      setIsLoading(true);

      const saleData: CreateSaleRequest | UpdateSaleRequest = {
        car_id: parseInt(data.car_id),
        customer_user_id: parseInt(data.customer_user_id),
        employee_user_id: parseInt(data.employee_user_id),
        final_price: data.final_price,
        sale_date: data.sale_date,
        notes: data.notes || undefined,
      };

      if (sale) {
        await AdminService.updateSale(sale.id, saleData as UpdateSaleRequest);

        loadingToast.dismiss();
        toastSuccess(
          'Venda atualizada com sucesso!',
          'Os dados da venda foram atualizados.'
        );
      } else {
        await AdminService.createSale(saleData as CreateSaleRequest);

        loadingToast.dismiss();
        toastSuccess(
          'Venda criada com sucesso!',
          'A venda foi registrada no sistema.'
        );
      }

      onSubmit();
      onClose();
    } catch (error: any) {
      console.error('Erro ao salvar venda:', error);

      loadingToast.dismiss();
      toastError(
        'Erro ao salvar venda',
        error?.response?.data?.message ||
          'Erro ao salvar venda. Tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleClose = () => {
    form.reset();
    onClose();
  };

  const formatPrice = (value: string) => {
    // Remove caracteres não numéricos exceto ponto e vírgula
    const numericValue = value.replace(/[^\d.,]/g, '');

    // Converte vírgula para ponto se necessário
    const normalizedValue = numericValue.replace(',', '.');

    // Valida se é um número válido
    const floatValue = parseFloat(normalizedValue);
    if (isNaN(floatValue)) return '';

    // Retorna o valor formatado
    return floatValue.toFixed(2);
  };

  const formatCurrency = (value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '';

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numValue);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{sale ? 'Editar Venda' : 'Nova Venda'}</DialogTitle>
          <DialogDescription>
            {sale
              ? 'Atualize as informações da venda.'
              : 'Preencha as informações para cadastrar uma nova venda.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="car_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Veículo *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um veículo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cars.map(car => (
                          <SelectItem key={car.id} value={car.id.toString()}>
                            {car.model?.brand?.name} {car.model?.name} -{' '}
                            {car.color} ({car.manufacture_year})
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
                name="customer_user_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.map(customer => (
                          <SelectItem
                            key={customer.id}
                            value={customer.id.toString()}
                          >
                            {customer.name} - {customer.email}
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
                name="employee_user_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Funcionário *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um funcionário" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employees.map(employee => (
                          <SelectItem
                            key={employee.id}
                            value={employee.id.toString()}
                          >
                            {employee.name} - {employee.role.name}
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
                name="final_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço Final *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: 25000.00"
                        type="number"
                        step="0.01"
                        min="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sale_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data da Venda *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observações sobre a venda..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : sale ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
