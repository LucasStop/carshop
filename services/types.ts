// Interfaces para autenticação
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  authorization: {
    token: string;
    type: string;
    expires_in: number;
  };
  user: User;
  message: string;
}

export interface RegisterRequest {
  role_id: number;
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  cpf: string;
  rg: string;
  birth_date: string;
  address: Address;
}

export interface RegisterResponse {
  user: User;
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

// Interfaces para entidades
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  rg: string;
  birth_date: string;
  role_id: number;
  address: Address;
  created_at: string;
  updated_at: string;
}

export interface Address {
  address: string;
  number: string;
  complement?: string;
  city: string;
  state: string;
  zip_code: string;
}

// Interfaces para carros
export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  color: string;
  description: string;
  images: string[];
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface CarFilters {
  brand?: string;
  model?: string;
  year_min?: number;
  year_max?: number;
  price_min?: number;
  price_max?: number;
  mileage_max?: number;
  fuel_type?: string;
  transmission?: string;
  color?: string;
}

export interface CarListResponse {
  data: Car[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Interface para resposta de erro da API
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}
