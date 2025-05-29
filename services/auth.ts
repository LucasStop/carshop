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
   */
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await ApiService.post<LoginResponse>('/auth/login', credentials);

      // Armazenar token e dados do usuário
      if (response.token) {
        ApiService.setAuthToken(response.token);
      }
      if (response.user) {
        ApiService.setUser(response.user);
      }
      
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
      const response = await ApiService.post<RegisterResponse>('/auth/register', userData);
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
   * Atualiza os dados do usuário
   */
//   static async updateProfile(userData: Partial<RegisterRequest>): Promise<any> {
//     try {
//       const response = await ApiService.put('/user/profile', userData);
      
//       // Atualizar dados do usuário no localStorage
//       if (response.user) {
//         ApiService.setUser(response.user);
//       }
      
//       return response;
//     } catch (error) {
//       console.error('Erro ao atualizar perfil:', error);
//       throw error;
//     }
//   }

  /**
   * Altera a senha do usuário
   */
//   static async changePassword(passwords: {
//     current_password: string;
//     password: string;
//     password_confirmation: string;
//   }): Promise<any> {
//     try {
//       const response = await ApiService.put('/user/change-password', passwords);
//       return response;
//     } catch (error) {
//       console.error('Erro ao alterar senha:', error);
//       throw error;
//     }
//   }
}
