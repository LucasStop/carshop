'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Car, Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { AuthService, ApiError } from '@/services';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');

    try {
      // Testar localStorage antes do login
      AuthService.testLocalStorage();

      const result = await AuthService.login(data);
      console.log('Login bem-sucedido:', result);

      // Verificar se o token foi salvo no localStorage
      const savedToken = localStorage.getItem('auth_token');
      if (savedToken) {
        console.log('✅ Token salvo no localStorage com sucesso');
        console.log('Token info:', {
          length: savedToken.length,
          starts_with: savedToken.substring(0, 20) + '...',
          key_used: 'auth_token',
        });
      } else {
        console.warn('❌ Token não foi salvo no localStorage');
      }

      // Verificar se o usuário foi salvo
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        console.log('✅ Usuário salvo no localStorage com sucesso');
        try {
          const user = JSON.parse(savedUser);
          console.log('Usuário:', {
            id: user.id,
            name: user.name,
            email: user.email,
          });
        } catch (e) {
          console.warn('❌ Erro ao parsear dados do usuário:', e);
        }
      }

      // Verificar se o usuário está autenticado
      if (AuthService.isAuthenticated()) {
        console.log('✅ Usuário autenticado com sucesso');

        // Debug completo do localStorage
        AuthService.debugLocalStorage();

        // Verificar se é admin ou employee e redirecionar apropriadamente
        const currentUser = AuthService.getCurrentUser();
        const userRole = currentUser?.role?.slug;

        if (userRole === 'admin' || userRole === 'employee') {
          console.log(
            '🔄 Usuário administrativo detectado, redirecionando para admin...'
          );
          router.push('/admin');
        } else {
          console.log('🔄 Redirecionando para a página inicial...');
          router.push('/');
        }

        // Trigger storage event para atualizar outros componentes
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'auth_token',
            newValue: savedToken,
          })
        );
      } else {
        throw new Error('Falha na autenticação após login');
      }
    } catch (error) {
      console.error('❌ Erro no login:', error);
      const apiError = error as ApiError;
      setError(apiError.message || 'Erro ao fazer login. Tente novamente.');

      // Debug em caso de erro
      console.log('🔍 Debug após erro:');
      AuthService.debugLocalStorage();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="mb-4 flex justify-center">
          <Car className="h-12 w-12 text-black" />
        </div>
        <CardTitle className="text-2xl font-bold">
          Bem-vindo de volta!
        </CardTitle>
        <CardDescription>Entre na sua conta para continuar</CardDescription>
      </CardHeader>{' '}
      <CardContent>
        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="seu.email@exemplo.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="••••••••"
                        type={showPassword ? 'text' : 'password'}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <Link
                href="/esqueci-senha"
                className="text-sm text-gray-600 transition-colors hover:text-black"
              >
                Esqueci minha senha
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-800"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </Form>

        <div className="mt-6">
          <Separator className="my-4" />

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{' '}
              <Link
                href="/registro"
                className="font-medium text-black hover:underline"
              >
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
