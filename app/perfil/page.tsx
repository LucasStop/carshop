'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  ValidatedInput,
  validators,
  masks,
} from '@/components/validated-input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { AuthService } from '@/services/auth';
import {
  User,
  Edit,
  Lock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Camera,
  Upload,
} from 'lucide-react';
import Image from 'next/image';

interface UpdateProfileData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  rg: string;
  birth_date: string;
  path?: string;
  address: {
    address: string;
    number: string;
    complement?: string;
    city: string;
    state: string;
    zip_code: string;
  };
}

interface ChangePasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [profileData, setProfileData] = useState<UpdateProfileData>({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    rg: '',
    birth_date: '',
    path: '',
    address: {
      address: '',
      number: '',
      complement: '',
      city: '',
      state: '',
      zip_code: '',
    },
  });

  const [passwordData, setPasswordData] = useState<ChangePasswordData>({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  // Redirecionar se não autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Carregar dados do usuário
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        cpf: user.cpf || '',
        rg: user.rg || '',
        birth_date: user.birth_date ? user.birth_date.split('T')[0] : '',
        path: user.path || '',
        address: {
          address: user.address?.address || '',
          number: user.address?.number || '',
          complement: user.address?.complement || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zip_code: user.address?.zip_code || '',
        },
      });
    }
  }, [user]);

  const handleProfileChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.replace('address.', '');
      setProfileData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handlePasswordChange = (
    field: keyof ChangePasswordData,
    value: string
  ) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Erro',
        description: 'Por favor, selecione apenas arquivos de imagem.',
        variant: 'destructive',
      });
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Erro',
        description: 'A imagem deve ter no máximo 5MB.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await AuthService.uploadProfileImage(formData);

      setProfileData(prev => ({
        ...prev,
        path: response.path,
      }));

      toast({
        title: 'Imagem enviada',
        description: 'Sua foto de perfil foi atualizada com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao enviar imagem',
        description: 'Ocorreu um erro ao enviar sua foto. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await AuthService.updateProfile(profileData);

      toast({
        title: 'Perfil atualizado',
        description: 'Seus dados foram atualizados com sucesso.',
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'Erro ao atualizar perfil',
        description: 'Ocorreu um erro ao salvar seus dados. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.password !== passwordData.password_confirmation) {
      toast({
        title: 'Erro',
        description: 'As senhas não coincidem.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      await AuthService.changePassword(passwordData);

      toast({
        title: 'Senha alterada',
        description: 'Sua senha foi alterada com sucesso.',
      });
      setIsChangingPassword(false);
      setPasswordData({
        current_password: '',
        password: '',
        password_confirmation: '',
      });
    } catch (error) {
      toast({
        title: 'Erro ao alterar senha',
        description:
          'Ocorreu um erro ao alterar sua senha. Verifique a senha atual.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Função para buscar endereço pelo CEP
  const handleCepChange = async (cep: string) => {
    handleProfileChange('address.zip_code', cep);

    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cleanCep}/json/`
        );
        const data = await response.json();

        if (!data.erro) {
          handleProfileChange('address.address', data.logradouro || '');
          handleProfileChange('address.city', data.localidade || '');
          handleProfileChange('address.state', data.uf || '');
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  // Função para obter URL completa da imagem
  const getImageUrl = (path: string | undefined) => {
    if (!path) return null;
    return `${process.env.NEXT_PUBLIC_IMAGE_URL}${path}`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-1/4 rounded bg-gray-200"></div>
            <div className="h-96 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="mt-2 text-gray-600">
            Gerencie suas informações pessoais e configurações da conta
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-full bg-gray-200">
                      {profileData.path && getImageUrl(profileData.path) ? (
                        <Image
                          src={getImageUrl(profileData.path)!}
                          alt={user.name || 'Foto do usuário'}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <User className="h-10 w-10 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1">
                      <label
                        htmlFor="profile-image"
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700"
                      >
                        {isUploadingImage ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        ) : (
                          <Camera className="h-4 w-4" />
                        )}
                      </label>
                      <input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isUploadingImage}
                      />
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {user.name}
                  </h2>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="mt-2 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                    {user.role.name}
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{user.phone || 'Não informado'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {user.birth_date
                        ? new Date(user.birth_date).toLocaleDateString('pt-BR')
                        : 'Não informado'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <CreditCard className="h-4 w-4" />
                    <span>{user.cpf || 'Não informado'}</span>
                  </div>
                  {user.address && (
                    <div className="flex items-start gap-3 text-gray-600">
                      <MapPin className="mt-0.5 h-4 w-4" />
                      <span className="text-xs leading-relaxed">
                        {user.address.address}, {user.address.number}
                        {user.address.complement &&
                          `, ${user.address.complement}`}
                        <br />
                        {user.address.city} - {user.address.state}
                        <br />
                        CEP: {user.address.zip_code}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="space-y-6 md:col-span-2">
            {/* Informações Pessoais */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informações Pessoais
                  </CardTitle>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={e =>
                        handleProfileChange('name', e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <ValidatedInput
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={value => handleProfileChange('email', value)}
                      disabled={!isEditing}
                      validator={validators.email}
                      validationMessage="Email inválido"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <ValidatedInput
                      id="phone"
                      value={profileData.phone}
                      onChange={value => handleProfileChange('phone', value)}
                      disabled={!isEditing}
                      mask={masks.phone}
                      validator={validators.phone}
                      validationMessage="Telefone deve ter 10 ou 11 dígitos"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div>
                    <Label htmlFor="birth_date">Data de Nascimento</Label>
                    <Input
                      id="birth_date"
                      type="date"
                      value={profileData.birth_date}
                      onChange={e =>
                        handleProfileChange('birth_date', e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cpf">CPF</Label>
                    <ValidatedInput
                      id="cpf"
                      value={profileData.cpf}
                      onChange={value => handleProfileChange('cpf', value)}
                      disabled={!isEditing}
                      mask={masks.cpf}
                      validator={validators.cpf}
                      validationMessage="CPF inválido"
                      placeholder="000.000.000-00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rg">RG</Label>
                    <Input
                      id="rg"
                      value={profileData.rg}
                      onChange={e => handleProfileChange('rg', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSaveProfile} disabled={isSaving}>
                      {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                    >
                      Cancelar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Endereço */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Endereço
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Logradouro</Label>
                    <Input
                      id="address"
                      value={profileData.address.address}
                      onChange={e =>
                        handleProfileChange('address.address', e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="number">Número</Label>
                    <Input
                      id="number"
                      value={profileData.address.number}
                      onChange={e =>
                        handleProfileChange('address.number', e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="complement">Complemento</Label>
                    <Input
                      id="complement"
                      value={profileData.address.complement}
                      onChange={e =>
                        handleProfileChange(
                          'address.complement',
                          e.target.value
                        )
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={profileData.address.city}
                      onChange={e =>
                        handleProfileChange('address.city', e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={profileData.address.state}
                      onChange={e =>
                        handleProfileChange('address.state', e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip_code">CEP</Label>
                    <ValidatedInput
                      id="zip_code"
                      value={profileData.address.zip_code}
                      onChange={handleCepChange}
                      disabled={!isEditing}
                      mask={masks.cep}
                      validator={validators.cep}
                      validationMessage="CEP deve ter 8 dígitos"
                      placeholder="00000-000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alterar Senha */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Segurança
                  </CardTitle>
                  {!isChangingPassword && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsChangingPassword(true)}
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      Alterar Senha
                    </Button>
                  )}
                </div>
              </CardHeader>
              {isChangingPassword && (
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="current_password">Senha Atual</Label>
                    <Input
                      id="current_password"
                      type="password"
                      value={passwordData.current_password}
                      onChange={e =>
                        handlePasswordChange('current_password', e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Nova Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      value={passwordData.password}
                      onChange={e =>
                        handlePasswordChange('password', e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="password_confirmation">
                      Confirmar Nova Senha
                    </Label>
                    <Input
                      id="password_confirmation"
                      type="password"
                      value={passwordData.password_confirmation}
                      onChange={e =>
                        handlePasswordChange(
                          'password_confirmation',
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleChangePassword} disabled={isSaving}>
                      {isSaving ? 'Alterando...' : 'Alterar Senha'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({
                          current_password: '',
                          password: '',
                          password_confirmation: '',
                        });
                      }}
                      disabled={isSaving}
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
