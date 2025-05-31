import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  ApiResponse, 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  User, 
  Task, 
  Reward, 
  Exchange, 
  Notification, 
  Family, 
  PaginatedResponse,
  TaskStatus,
  ExchangeStatus 
} from '../types';

// Configuración de la API
const API_BASE_URL = __DEV__ 
  ? 'http://192.168.0.233:3000/api'  // IP local del servidor backend
  : 'https://surprising-wisdom-production.up.railway.app/api'; // URL de producción en Railway

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para agregar token de autenticación
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para manejar respuestas de error
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expirado o inválido
          await AsyncStorage.multiRemove(['auth_token', 'user_data']);
          // Aquí podrías emitir un evento para redirigir al login
        }
        return Promise.reject(error);
      }
    );
  }

  // Métodos de utilidad
  private handleResponse<T>(response: AxiosResponse<ApiResponse<T>>): T {
    if (response.data.success) {
      return response.data.data as T;
    }
    throw new Error(response.data.message || 'Error en la respuesta del servidor');
  }

  private handleError(error: any): never {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    if (error.message) {
      throw new Error(error.message);
    }
    throw new Error('Error de conexión con el servidor');
  }

  // === AUTENTICACIÓN ===
  async login(credentials: LoginRequest): Promise<{ user: User; token: string }> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/login', credentials);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async register(userData: RegisterRequest): Promise<{ user: User; token: string }> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/register', userData);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async getProfile(): Promise<User> {
    try {
      const response = await this.api.get<ApiResponse<User>>('/auth/me');
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // === FAMILIAS ===
  async createFamily(name: string): Promise<Family> {
    try {
      const response = await this.api.post<ApiResponse<Family>>('/familias', { nombre: name });
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async joinFamily(code: string): Promise<Family> {
    try {
      const response = await this.api.post<ApiResponse<Family>>('/familias/join', { 
        codigoInvitacion: code 
      });
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async getMyFamily(): Promise<Family> {
    try {
      const response = await this.api.get<ApiResponse<Family>>('/familias/me');
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async leaveFamily(): Promise<void> {
    try {
      await this.api.delete('/familias/leave');
    } catch (error) {
      this.handleError(error);
    }
  }

  // === TAREAS ===
  async getTasks(params?: {
    asignadoA?: string;
    estado?: TaskStatus;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Task>> {
    try {
      const response = await this.api.get<ApiResponse<PaginatedResponse<Task>>>('/tareas', { 
        params 
      });
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async getTaskById(id: string): Promise<Task> {
    try {
      const response = await this.api.get<ApiResponse<Task>>(`/tareas/${id}`);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async createTask(taskData: {
    titulo: string;
    descripcion?: string;
    puntos: number;
    asignadoA?: string;
    fechaLimite?: string;
  }): Promise<Task> {
    try {
      const response = await this.api.post<ApiResponse<Task>>('/tareas', taskData);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateTask(id: string, taskData: Partial<Task>): Promise<Task> {
    try {
      const response = await this.api.put<ApiResponse<Task>>(`/tareas/${id}`, taskData);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    try {
      const response = await this.api.patch<ApiResponse<Task>>(`/tareas/${id}/status`, { 
        estado: status 
      });
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      await this.api.delete(`/tareas/${id}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  // === RECOMPENSAS ===
  async getRewards(params?: {
    estado?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Reward>> {
    try {
      const response = await this.api.get<ApiResponse<PaginatedResponse<Reward>>>('/recompensas', { 
        params 
      });
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async getRewardById(id: string): Promise<Reward> {
    try {
      const response = await this.api.get<ApiResponse<Reward>>(`/recompensas/${id}`);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async createReward(rewardData: {
    nombre: string;
    descripcion?: string;
    costoPuntos: number;
  }): Promise<Reward> {
    try {
      const response = await this.api.post<ApiResponse<Reward>>('/recompensas', rewardData);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateReward(id: string, rewardData: Partial<Reward>): Promise<Reward> {
    try {
      const response = await this.api.put<ApiResponse<Reward>>(`/recompensas/${id}`, rewardData);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteReward(id: string): Promise<void> {
    try {
      await this.api.delete(`/recompensas/${id}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  // === CANJES ===
  async getExchanges(params?: {
    usuarioId?: string;
    estado?: ExchangeStatus;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Exchange>> {
    try {
      const response = await this.api.get<ApiResponse<PaginatedResponse<Exchange>>>('/canjes', { 
        params 
      });
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async requestExchange(rewardId: string): Promise<Exchange> {
    try {
      const response = await this.api.post<ApiResponse<Exchange>>('/canjes', { 
        recompensaId: rewardId 
      });
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateExchangeStatus(id: string, status: ExchangeStatus): Promise<Exchange> {
    try {
      const response = await this.api.patch<ApiResponse<Exchange>>(`/canjes/${id}/status`, { 
        estado: status 
      });
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // === NOTIFICACIONES ===
  async getNotifications(params?: {
    leido?: boolean;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Notification> & { noLeidas: number }> {
    try {
      const response = await this.api.get<ApiResponse<PaginatedResponse<Notification> & { noLeidas: number }>>('/notificaciones', { 
        params 
      });
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async getNotificationSummary(): Promise<{
    total: number;
    noLeidas: number;
    porTipo: Record<string, number>;
  }> {
    try {
      const response = await this.api.get<ApiResponse<{
        total: number;
        noLeidas: number;
        porTipo: Record<string, number>;
      }>>('/notificaciones/summary');
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async markNotificationAsRead(id: string): Promise<Notification> {
    try {
      const response = await this.api.patch<ApiResponse<Notification>>(`/notificaciones/${id}/read`);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async markAllNotificationsAsRead(): Promise<{ count: number }> {
    try {
      const response = await this.api.patch<ApiResponse<{ count: number }>>('/notificaciones/read-all');
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteNotification(id: string): Promise<void> {
    try {
      await this.api.delete(`/notificaciones/${id}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteReadNotifications(): Promise<{ count: number }> {
    try {
      const response = await this.api.delete<ApiResponse<{ count: number }>>('/notificaciones/read');
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }
}

// Exportar una instancia singleton
export const apiService = new ApiService();
export default apiService; 