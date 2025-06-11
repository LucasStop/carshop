import { ApiError } from './types';

export class ApiService {
  private static baseURL = process.env.NEXT_PUBLIC_API_URL;

  static getBaseURL(): string {
    if (!this.baseURL) {
      throw new Error(
        'Base URL da API não definida. Verifique a variável de ambiente NEXT_PUBLIC_API_URL.'
      );
    }
    return this.baseURL;
  }

  static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Adicionar token de autenticação se estiver disponível
    const token = this.getAuthToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const apiError: ApiError = {
          message: errorData.message || 'Erro na requisição',
          errors: errorData.errors,
          status: response.status,
        };
        throw apiError;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error && 'status' in error) {
        throw error; // Re-throw API errors
      }

      // Network or other errors
      const networkError: ApiError = {
        message: 'Erro de conexão. Verifique sua internet.',
        status: 0,
      };
      throw networkError;
    }
  }

  static async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  static async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async postFormData<T>(
    endpoint: string,
    formData: FormData
  ): Promise<T> {
    const headers: Record<string, string> = {};

    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro na requisição');
    }

    return response.json();
  }

  static async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
  static async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Métodos para gerenciamento de token
  static setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      console.log('Token salvo no localStorage com chave "auth_token"');
    } else {
      console.warn('localStorage não disponível (SSR)');
    }
  }

  static getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      return token;
    }
    return null;
  }

  static removeAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      console.log('Token removido do localStorage');
    }
  }

  static setUser(user: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  static getUser(): any | null {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }
  static removeUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  }
  static logout(): void {
    this.removeAuthToken();
    this.removeUser();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
}
