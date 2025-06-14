import { ApiService } from './api';

// Interfaces para Admin
export interface AdminUser {
  id: number;
  role_id: number;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  rg: string;
  birth_date: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  role: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    permissions: string[] | null;
    created_at: string;
    updated_at: string;
  };
  address: {
    id: number;
    user_id: number;
    address: string;
    number: string;
    complement?: string;
    city: string;
    state: string;
    zip_code: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
}

export interface AdminAddress {
  id: number;
  user_id: number;
  address: string;
  number: string;
  complement?: string;
  city: string;
  state: string;
  zip_code: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
}

export interface AdminBrand {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
  models_count?: number;
  cars_count?: number;
}

export interface AdminModel {
  id: number;
  name: string;
  slug: string;
  brand_id: number;
  brand?: AdminBrand;
  created_at: string;
  updated_at: string;
  cars_count?: number;
}

export interface AdminCar {
  id: number;
  brand_id: number;
  model_id: number;
  year: number;
  price: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  body_type: string;
  color: string;
  doors: number;
  description: string;
  featured: boolean;
  status: 'active' | 'inactive' | 'sold';
  user_id: number;
  brand?: AdminBrand;
  model?: AdminModel;
  user?: AdminUser;
  images?: string[];
  created_at: string;
  updated_at: string;
}

export interface AdminSale {
  id: number;
  car_id: number;
  buyer_id: number;
  seller_id: number;
  price: number;
  status: 'pending' | 'completed' | 'cancelled';
  sale_date: string;
  notes?: string;
  car?: AdminCar;
  buyer?: AdminUser;
  seller?: AdminUser;
  created_at: string;
  updated_at: string;
}

export interface AdminRole {
  id: number;
  name: string;
  slug: string;
  permissions: string[];
  created_at: string;
  updated_at: string;
}

export interface AdminStats {
  total_users: number;
  total_cars: number;
  total_sales: number;
  total_brands: number;
  total_models: number;
  revenue_this_month: number;
  sales_this_month: number;
  new_users_this_month: number;
  active_listings: number;
}

export interface AdminListResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  cpf: string;
  rg: string;
  birth_date: string;
  role_id: number;
  address: {
    address: string;
    number: string;
    complement?: string;
    city: string;
    state: string;
    zip_code: string;
  };
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  rg?: string;
  birth_date?: string;
  role_id?: number;
  address?: {
    address?: string;
    number?: string;
    complement?: string;
    city?: string;
    state?: string;
    zip_code?: string;
  };
}

export interface CreateCarRequest {
  brand_id: number;
  model_id: number;
  year: number;
  price: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  body_type: string;
  color: string;
  doors: number;
  description: string;
  featured?: boolean;
  status: 'active' | 'inactive';
  user_id?: number;
  images?: File[];
}

export interface UpdateCarRequest {
  brand_id?: number;
  model_id?: number;
  year?: number;
  price?: number;
  mileage?: number;
  fuel_type?: string;
  transmission?: string;
  body_type?: string;
  color?: string;
  doors?: number;
  description?: string;
  featured?: boolean;
  status?: 'active' | 'inactive' | 'sold';
  user_id?: number;
}

export interface CreateBrandRequest {
  name: string;
}

export interface UpdateBrandRequest {
  name?: string;
}

export interface CreateModelRequest {
  name: string;
  brand_id: number;
}

export interface UpdateModelRequest {
  name?: string;
  brand_id?: number;
}

export interface CreateSaleRequest {
  car_id: number;
  buyer_id: number;
  seller_id: number;
  price: number;
  notes?: string;
}

export interface UpdateSaleRequest {
  price?: number;
  status?: 'pending' | 'completed' | 'cancelled';
  notes?: string;
}

export class AdminService {
  // Stats
  static async getStats(): Promise<AdminStats> {
    return ApiService.get<AdminStats>('/stats');
  }

  // Users
  static async getUsers(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    role?: string;
    status?: string;
  }): Promise<AdminListResponse<AdminUser>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page)
      queryParams.append('per_page', params.per_page.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.role) queryParams.append('role', params.role);
    if (params?.status) queryParams.append('status', params.status);
    const url = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return ApiService.get<AdminListResponse<AdminUser>>(url);
  }

  static async getUser(id: number): Promise<AdminUser> {
    return ApiService.get<AdminUser>(`/users/${id}`);
  }

  static async createUser(data: CreateUserRequest): Promise<AdminUser> {
    return ApiService.post<AdminUser>('/users', data);
  }

  static async updateUser(
    id: number,
    data: UpdateUserRequest
  ): Promise<AdminUser> {
    return ApiService.put<AdminUser>(`/users/${id}`, data);
  }

  static async deleteUser(id: number): Promise<void> {
    return ApiService.delete(`/users/${id}`);
  }

  // Cars
  static async getCars(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    brand?: string;
    model?: string;
    status?: string;
    user?: string;
  }): Promise<AdminListResponse<AdminCar>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page)
      queryParams.append('per_page', params.per_page.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.brand) queryParams.append('brand', params.brand);
    if (params?.model) queryParams.append('model', params.model);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.user) queryParams.append('user', params.user);
    const url = `/cars${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return ApiService.get<AdminListResponse<AdminCar>>(url);
  }

  static async getCar(id: number): Promise<AdminCar> {
    return ApiService.get<AdminCar>(`/cars/${id}`);
  }

  static async createCar(data: CreateCarRequest): Promise<AdminCar> {
    // Se há imagens, usar FormData
    if (data.images && data.images.length > 0) {
      const formData = new FormData();

      // Adicionar dados do carro
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'images' && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      // Adicionar imagens
      data.images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });

      return ApiService.postFormData<AdminCar>('/cars', formData);
    }

    return ApiService.post<AdminCar>('/cars', data);
  }

  static async updateCar(
    id: number,
    data: UpdateCarRequest
  ): Promise<AdminCar> {
    return ApiService.put<AdminCar>(`/cars/${id}`, data);
  }

  static async deleteCar(id: number): Promise<void> {
    return ApiService.delete(`/cars/${id}`);
  }

  // Brands
  static async getBrands(params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }): Promise<AdminListResponse<AdminBrand>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page)
      queryParams.append('per_page', params.per_page.toString());
    if (params?.search) queryParams.append('search', params.search);
    const url = `/brands${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return ApiService.get<AdminListResponse<AdminBrand>>(url);
  }

  static async getBrand(id: number): Promise<AdminBrand> {
    return ApiService.get<AdminBrand>(`/brands/${id}`);
  }

  static async createBrand(data: CreateBrandRequest): Promise<AdminBrand> {
    return ApiService.post<AdminBrand>('/brands', data);
  }

  static async updateBrand(
    id: number,
    data: UpdateBrandRequest
  ): Promise<AdminBrand> {
    return ApiService.put<AdminBrand>(`/brands/${id}`, data);
  }

  static async deleteBrand(id: number): Promise<void> {
    return ApiService.delete(`/brands/${id}`);
  }

  // Models
  static async getModels(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    brand?: string;
  }): Promise<AdminListResponse<AdminModel>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page)
      queryParams.append('per_page', params.per_page.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.brand) queryParams.append('brand', params.brand);
    const url = `/models${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return ApiService.get<AdminListResponse<AdminModel>>(url);
  }

  static async getModel(id: number): Promise<AdminModel> {
    return ApiService.get<AdminModel>(`/models/${id}`);
  }

  static async createModel(data: CreateModelRequest): Promise<AdminModel> {
    return ApiService.post<AdminModel>('/models', data);
  }

  static async updateModel(
    id: number,
    data: UpdateModelRequest
  ): Promise<AdminModel> {
    return ApiService.put<AdminModel>(`/models/${id}`, data);
  }

  static async deleteModel(id: number): Promise<void> {
    return ApiService.delete(`/models/${id}`);
  }

  // Sales
  static async getSales(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<AdminListResponse<AdminSale>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page)
      queryParams.append('per_page', params.per_page.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.date_from) queryParams.append('date_from', params.date_from);
    if (params?.date_to) queryParams.append('date_to', params.date_to);
    const url = `/sales${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return ApiService.get<AdminListResponse<AdminSale>>(url);
  }

  static async getSale(id: number): Promise<AdminSale> {
    return ApiService.get<AdminSale>(`/sales/${id}`);
  }

  static async createSale(data: CreateSaleRequest): Promise<AdminSale> {
    return ApiService.post<AdminSale>('/sales', data);
  }

  static async updateSale(
    id: number,
    data: UpdateSaleRequest
  ): Promise<AdminSale> {
    return ApiService.put<AdminSale>(`/sales/${id}`, data);
  }

  static async deleteSale(id: number): Promise<void> {
    return ApiService.delete(`/sales/${id}`);
  }

  // Addresses
  static async getAddresses(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    city?: string;
    state?: string;
  }): Promise<AdminListResponse<AdminAddress>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page)
      queryParams.append('per_page', params.per_page.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.city) queryParams.append('city', params.city);
    if (params?.state) queryParams.append('state', params.state);
    const url = `/addresses${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return ApiService.get<AdminListResponse<AdminAddress>>(url);
  }

  static async getAddress(id: number): Promise<AdminAddress> {
    return ApiService.get<AdminAddress>(`/addresses/${id}`);
  }

  // Roles & Permissions
  static async getRoles(): Promise<AdminRole[]> {
    return ApiService.get<AdminRole[]>('/roles');
  }

  static async getRole(id: number): Promise<AdminRole> {
    return ApiService.get<AdminRole>(`/roles/${id}`);
  }

  // Verificação de permissões
  static hasPermission(
    userRole: string,
    requiredPermissions: string[]
  ): boolean {
    // Admin tem todas as permissões
    if (userRole === 'admin') {
      return true; // Super admin tem todas as permissões
    }

    if (userRole === 'employee') {
      const employeePermissions = [
        'view_users',
        'view_cars',
        'view_sales',
        'view_brands',
        'view_models',
        'manage_sales',
        'manage_cars',
      ];
      return requiredPermissions.some(permission =>
        employeePermissions.includes(permission)
      );
    }

    // Cliente não tem permissões administrativas
    return false;
  }

  static canAccessAdmin(userRole: string): boolean {
    return ['admin', 'employee'].includes(userRole);
  }
}
