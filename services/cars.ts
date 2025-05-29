import { ApiService } from "./api";
import { Car, CarFilters, CarListResponse } from "./types";

export class CarService {
  /**
   * Lista todos os carros com filtros opcionais
   */
  static async getCars(
    filters?: CarFilters,
    page: number = 1
  ): Promise<CarListResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            queryParams.append(key, value.toString());
          }
        });
      }

      queryParams.append("page", page.toString());

      const endpoint = `/cars?${queryParams.toString()}`;
      const response = await ApiService.get<CarListResponse>(endpoint);
      return response;
    } catch (error) {
      console.error("Erro ao buscar carros:", error);
      throw error;
    }
  }

  /**
   * Obtém um carro específico pelo ID
   */
  static async getCarById(id: number): Promise<Car> {
    try {
      const response = await ApiService.get<Car>(`/cars/${id}`);
      return response;
    } catch (error) {
      console.error("Erro ao buscar carro:", error);
      throw error;
    }
  }

  /**
   * Cria um novo anúncio de carro
   */
  static async createCar(
    carData: Omit<Car, "id" | "user_id" | "created_at" | "updated_at">
  ): Promise<Car> {
    try {
      const response = await ApiService.post<Car>("/cars", carData);
      return response;
    } catch (error) {
      console.error("Erro ao criar anúncio:", error);
      throw error;
    }
  }

  /**
   * Atualiza um anúncio de carro
   */
  static async updateCar(id: number, carData: Partial<Car>): Promise<Car> {
    try {
      const response = await ApiService.put<Car>(`/cars/${id}`, carData);
      return response;
    } catch (error) {
      console.error("Erro ao atualizar anúncio:", error);
      throw error;
    }
  }

  /**
   * Remove um anúncio de carro
   */
  static async deleteCar(id: number): Promise<void> {
    try {
      await ApiService.delete(`/cars/${id}`);
    } catch (error) {
      console.error("Erro ao remover anúncio:", error);
      throw error;
    }
  }

  /**
   * Busca carros por termo de pesquisa
   */
  static async searchCars(
    query: string,
    page: number = 1
  ): Promise<CarListResponse> {
    try {
      const queryParams = new URLSearchParams({
        search: query,
        page: page.toString(),
      });

      const endpoint = `/cars/search?${queryParams.toString()}`;
      const response = await ApiService.get<CarListResponse>(endpoint);
      return response;
    } catch (error) {
      console.error("Erro ao pesquisar carros:", error);
      throw error;
    }
  }

  /**
   * Obtém carros em destaque
   */
  static async getFeaturedCars(limit: number = 6): Promise<Car[]> {
    try {
      const queryParams = new URLSearchParams({
        featured: "true",
        limit: limit.toString(),
      });

      const endpoint = `/cars/featured?${queryParams.toString()}`;
      const response = await ApiService.get<Car[]>(endpoint);
      return response;
    } catch (error) {
      console.error("Erro ao buscar carros em destaque:", error);
      throw error;
    }
  }

  /**
   * Obtém carros do usuário logado
   */
  static async getUserCars(page: number = 1): Promise<CarListResponse> {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
      });

      const endpoint = `/user/cars?${queryParams.toString()}`;
      const response = await ApiService.get<CarListResponse>(endpoint);
      return response;
    } catch (error) {
      console.error("Erro ao buscar carros do usuário:", error);
      throw error;
    }
  }

  /**
   * Obtém marcas disponíveis
   */
  static async getBrands(): Promise<string[]> {
    try {
      const response = await ApiService.get<string[]>("/cars/brands");
      return response;
    } catch (error) {
      console.error("Erro ao buscar marcas:", error);
      throw error;
    }
  }

  /**
   * Obtém modelos de uma marca específica
   */
  static async getModelsByBrand(brand: string): Promise<string[]> {
    try {
      const queryParams = new URLSearchParams({ brand });
      const endpoint = `/cars/models?${queryParams.toString()}`;
      const response = await ApiService.get<string[]>(endpoint);
      return response;
    } catch (error) {
      console.error("Erro ao buscar modelos:", error);
      throw error;
    }
  }

  /**
   * Upload de imagens para um carro
   */
  static async uploadCarImages(
    carId: number,
    images: File[]
  ): Promise<string[]> {
    try {
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });

      const response = await fetch(
        `${ApiService.getBaseURL()}/cars/${carId}/images`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${ApiService.getAuthToken()}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao fazer upload das imagens");
      }

      const data = await response.json();
      return data.images;
    } catch (error) {
      console.error("Erro ao fazer upload das imagens:", error);
      throw error;
    }
  }

  /**
   * Remove uma imagem de um carro
   */
  static async removeCarImage(carId: number, imagePath: string): Promise<void> {
    try {
      const response = await fetch(
        `${ApiService.getBaseURL()}/cars/${carId}/images`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${ApiService.getAuthToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imagePath }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao remover a imagem");
      }
    } catch (error) {
      console.error("Erro ao remover a imagem do carro:", error);
      throw error;
    }
  }
}
