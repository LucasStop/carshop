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
  AdminUser,
  AdminRole,
  CreateUserRequest,
  UpdateUserRequest,
} from '@/services/admin';
import { UtilsService } from '@/services/utils';
import { useAdminLoading } from './admin-loading-provider';
import { toastSuccess, toastError, toastInfo } from '@/hooks/use-toast';

const userFormSchema = z
  .object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z
      .string()
      .min(6, 'Senha deve ter pelo menos 6 caracteres')
      .optional(),
    password_confirmation: z.string().optional(),
    phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
    cpf: z.string().min(11, 'CPF deve ter 11 dígitos'),
    rg: z.string().min(7, 'RG deve ter pelo menos 7 caracteres'),
    birth_date: z.string().min(1, 'Data de nascimento é obrigatória'),
    role_id: z.number().min(1, 'Função é obrigatória'),
    address: z.object({
      address: z.string().min(1, 'Endereço é obrigatório'),
      number: z.string().min(1, 'Número é obrigatório'),
      complement: z.string().optional(),
      city: z.string().min(1, 'Cidade é obrigatória'),
      state: z.string().min(2, 'Estado é obrigatório'),
      zip_code: z.string().min(8, 'CEP deve ter 8 dígitos'),
    }),
  })
  .refine(
    data => {
      if (data.password && data.password_confirmation) {
        return data.password === data.password_confirmation;
      }
      return true;
    },
    {
      message: 'Senhas não coincidem',
      path: ['password_confirmation'],
    }
  );

type UserFormData = z.infer<typeof userFormSchema>;

interface UserFormDialogProps {
  user?: AdminUser | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UserFormDialog({
  user,
  open,
  onClose,
  onSuccess,
}: UserFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const { setIsLoading, setLoadingMessage } = useAdminLoading();

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      phone: '',
      cpf: '',
      rg: '',
      birth_date: '',
      role_id: 1,
      address: {
        address: '',
        number: '',
        complement: '',
        city: '',
        state: '',
        zip_code: '',
      },
    },
  });

  // Carregar roles do backend
  useEffect(() => {
    const loadRoles = async () => {
      try {
        setIsLoadingRoles(true);
        const rolesData = await AdminService.getRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error('Erro ao carregar roles:', error);
      } finally {
        setIsLoadingRoles(false);
      }
    };

    if (open) {
      loadRoles();
    }
  }, [open]);

  const getRoleName = (slug: string) => {
    switch (slug) {
      case 'admin':
        return 'Administrador';
      case 'employee':
        return 'Funcionário';
      case 'client':
        return 'Cliente';
      default:
        return slug;
    }
  };

  useEffect(() => {
    if (user) {
      // Edição - preencher formulário
      form.reset({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        phone: user.phone,
        cpf: user.cpf,
        rg: user.rg,
        birth_date: user.birth_date,
        role_id: user.role_id,
        address: {
          address: user.address.address,
          number: user.address.number,
          complement: user.address.complement || '',
          city: user.address.city,
          state: user.address.state,
          zip_code: user.address.zip_code,
        },
      });
    } else {
      // Criação - formulário vazio
      form.reset({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        cpf: '',
        rg: '',
        birth_date: '',
        role_id: 1,
        address: {
          address: '',
          number: '',
          complement: '',
          city: '',
          state: '',
          zip_code: '',
        },
      });
    }
  }, [user, form]);
  const handleCepChange = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');

    if (cleanCep.length === 8) {
      setIsLoadingCep(true);

      toastInfo('Buscando endereço...', `Consultando CEP ${cep}`);

      try {
        const addressData = await UtilsService.getAddressByCep(cleanCep);
        if (addressData) {
          form.setValue('address.address', addressData.address);
          form.setValue('address.city', addressData.city);
          form.setValue('address.state', addressData.state);

          toastSuccess(
            'Endereço encontrado!',
            'Os campos foram preenchidos automaticamente.'
          );
        } else {
          toastError('CEP não encontrado', 'Verifique se o CEP está correto.');
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        toastError(
          'Erro ao buscar CEP',
          'Não foi possível consultar o endereço. Preencha manualmente.'
        );
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  const onSubmit = async (data: UserFormData) => {
    setIsSubmitting(true);
    setIsLoading(true);
    setLoadingMessage(user ? 'Atualizando usuário...' : 'Criando usuário...');

    try {
      if (user) {
        // Atualização
        const updateData: UpdateUserRequest = {
          name: data.name,
          email: data.email,
          phone: data.phone,
          cpf: data.cpf,
          rg: data.rg,
          birth_date: data.birth_date,
          role_id: data.role_id,
          address: data.address,
        };

        if (data.password) {
          // Se a senha foi fornecida, incluir na atualização
          (updateData as any).password = data.password;
          (updateData as any).password_confirmation =
            data.password_confirmation;
        }
        await AdminService.updateUser(user.id, updateData);

        toastSuccess(
          'Usuário atualizado com sucesso!',
          `Os dados de ${data.name} foram atualizados.`
        );
      } else {
        // Criação
        const createData: CreateUserRequest = {
          name: data.name,
          email: data.email,
          password: data.password!,
          password_confirmation: data.password_confirmation!,
          phone: data.phone,
          cpf: data.cpf,
          rg: data.rg,
          birth_date: data.birth_date,
          role_id: data.role_id,
          address: data.address,
        };

        await AdminService.createUser(createData);

        toastSuccess(
          'Usuário criado com sucesso!',
          `${data.name} foi adicionado ao sistema.`
        );
      }

      onSuccess();
    } catch (error: any) {
      console.error('Erro ao salvar usuário:', error);

      toastError(
        user ? 'Erro ao atualizar usuário' : 'Erro ao criar usuário',
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

  const formatCpf = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
    }
    return value;
  };

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  };

  const formatCep = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{5})(\d{3})$/);
    if (match) {
      return `${match[1]}-${match[2]}`;
    }
    return value;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{user ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
          <DialogDescription>
            {user
              ? 'Atualize as informações do usuário abaixo.'
              : 'Preencha as informações para criar um novo usuário.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Dados Pessoais */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Dados Pessoais</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="email@exemplo.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {user ? 'Nova Senha (opcional)' : 'Senha'}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={
                            user ? 'Deixe vazio para manter atual' : 'Senha'
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirme a senha"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="(11) 99999-9999"
                          {...field}
                          onChange={e => {
                            const formatted = formatPhone(e.target.value);
                            field.onChange(formatted);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="000.000.000-00"
                          {...field}
                          onChange={e => {
                            const formatted = formatCpf(e.target.value);
                            field.onChange(formatted);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RG</FormLabel>
                      <FormControl>
                        <Input placeholder="12.345.678-9" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="birth_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Nascimento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Função</FormLabel>
                      <Select
                        onValueChange={value => field.onChange(parseInt(value))}
                        value={field.value?.toString()}
                        disabled={isLoadingRoles}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                isLoadingRoles
                                  ? 'Carregando funções...'
                                  : 'Selecione a função'
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roles.map(role => (
                            <SelectItem
                              key={role.id}
                              value={role.id.toString()}
                            >
                              {getRoleName(role.slug)}
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

            {/* Endereço */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Endereço</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address.zip_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="00000-000"
                            {...field}
                            onChange={e => {
                              const formatted = formatCep(e.target.value);
                              field.onChange(formatted);
                              handleCepChange(formatted);
                            }}
                          />
                          {isLoadingCep && (
                            <div className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="Rua, avenida..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="address.number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input placeholder="123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.complement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complemento</FormLabel>
                      <FormControl>
                        <Input placeholder="Apto, sala..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="São Paulo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address.state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Input placeholder="SP" {...field} />
                    </FormControl>
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
                {isSubmitting ? 'Salvando...' : user ? 'Atualizar' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
