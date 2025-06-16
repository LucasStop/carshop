import { ApiService } from './api';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
} from './types';

export class AuthService {
  /**
   * Realiza o login do usuário
   */ static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await ApiService.post<LoginResponse>(
        '/auth/login',
        credentials
      );

      // Verificar se recebemos a estrutura correta de resposta
      if (!response.authorization || !response.authorization.token) {
        throw new Error('Token não recebido do servidor na estrutura esperada');
      }

      // Armazenar token e dados do usuário
      console.log('Salvando token no localStorage...');
      const token = response.authorization.token;
      ApiService.setAuthToken(token);

      // Verificar se o token foi salvo
      const savedToken = ApiService.getAuthToken();
      if (savedToken !== token) {
        throw new Error('Falha ao salvar token no localStorage');
      }

      if (response.user) {
        console.log('Salvando dados do usuário...');
        ApiService.setUser(response.user);
      }
      console.log('Login processado com sucesso - Token salvo no localStorage');
      console.log('Token info:', {
        type: response.authorization.type,
        expires_in: response.authorization.expires_in,
        token_length: token.length,
      });

      return response;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  /**
   * Realiza o registro de um novo usuário
   */
  static async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await ApiService.post<RegisterResponse>(
        '/auth/register',
        userData
      );
      return response;
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  }

  /**
   * Solicita recuperação de senha
   */
  //   static async forgotPassword(email: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
  //     try {
  //       const response = await ApiService.post<ForgotPasswordResponse>('/forgot-password', email);
  //       return response;
  //     } catch (error) {
  //       console.error('Erro ao solicitar recuperação de senha:', error);
  //       throw error;
  //     }
  //   }

  /**
   * Realiza o logout do usuário
   */
  static async logout(): Promise<void> {
    try {
      // Tentar fazer logout no servidor
      await ApiService.post('/logout');
    } catch (error) {
      console.error('Erro no logout do servidor:', error);
    } finally {
      // Sempre limpar dados locais
      ApiService.logout();
    }
  }

  /**
   * Verifica se o usuário está autenticado
   */
  static isAuthenticated(): boolean {
    const token = ApiService.getAuthToken();
    const user = ApiService.getUser();
    return !!(token && user);
  }

  /**
   * Obtém os dados do usuário atual
   */
  static getCurrentUser() {
    return ApiService.getUser();
  }
  /**
   * Verifica se o token ainda é válido
   */
  static async validateToken(): Promise<boolean> {
    try {
      await ApiService.get('/user/profile');
      return true;
    } catch (error) {
      // Token inválido, fazer logout
      ApiService.logout();
      return false;
    }
  }
  /**
   * Debug: Verifica o estado atual do localStorage
   */
  static debugLocalStorage(): void {
    console.log('=== Debug Auth LocalStorage ===');

    const token = ApiService.getAuthToken();
    const user = ApiService.getUser();

    console.log('Token:', token ? 'Existe' : 'Não encontrado');
    if (token) {
      console.log('Valor do token:', token);
      console.log('Tamanho do token:', token.length);
      console.log('Começa com:', token.substring(0, 20) + '...');
    }

    console.log('Usuário:', user ? 'Existe' : 'Não encontrado');
    if (user) {
      console.log('Dados do usuário:', {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role?.name,
      });
    }

    console.log('Está autenticado:', this.isAuthenticated());

    console.log('Todos os itens no localStorage:');
    if (typeof window !== 'undefined') {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          console.log(
            `- ${key}: ${value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : 'null'}`
          );
        }
      }
    }

    console.log('===============================');
  }

  /**
   * Testa se o localStorage está funcionando corretamente
   */
  static testLocalStorage(): boolean {
    if (typeof window === 'undefined') {
      console.warn('localStorage não disponível (SSR)');
      return false;
    }

    try {
      const testKey = 'test_auth_token';
      const testValue = 'test_value_123';

      // Tentar salvar
      localStorage.setItem(testKey, testValue);

      // Tentar recuperar
      const retrieved = localStorage.getItem(testKey);

      // Limpar
      localStorage.removeItem(testKey);

      const success = retrieved === testValue;
      console.log('Teste localStorage:', success ? 'PASSOU' : 'FALHOU');

      return success;
    } catch (error) {
      console.error('Erro no teste localStorage:', error);
      return false;
    }
  }

  /**
   * Atualiza os dados do usuário
   */
  static async updateProfile(userData: {
    name: string;
    email: string;
    phone: string;
    cpf: string;
    rg: string;
    birth_date: string;
    address: {
      address: string;
      number: string;
      complement?: string;
      city: string;
      state: string;
      zip_code: string;
    };
  }): Promise<any> {
    try {
      const response = await ApiService.put<any>('/user/profile', userData);

      // Atualizar dados do usuário no localStorage
      if (response.user) {
        ApiService.setUser(response.user);
      }

      return response;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  }

  /**
   * Altera a senha do usuário
   */
  static async changePassword(passwords: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }): Promise<any> {
    try {
      const response = await ApiService.put<any>(
        '/user/change-password',
        passwords
      );
      return response;
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      throw error;
    }
  }
}
