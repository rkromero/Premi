import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthStore, User, RegisterRequest } from '../types';
import apiService from '../services/api';

const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  // Login del usuario
  login: async (email: string, password: string) => {
    try {
      const response = await apiService.login({ email, password });
      
      // Guardar datos en AsyncStorage
      await AsyncStorage.setItem('auth_token', response.token);
      await AsyncStorage.setItem('user_data', JSON.stringify(response.user));
      
      // Actualizar estado
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
      });
    } catch (error: any) {
      throw new Error(error.message || 'Error al iniciar sesión');
    }
  },

  // Registro del usuario
  register: async (data: RegisterRequest) => {
    try {
      const response = await apiService.register(data);
      
      // Guardar datos en AsyncStorage
      await AsyncStorage.setItem('auth_token', response.token);
      await AsyncStorage.setItem('user_data', JSON.stringify(response.user));
      
      // Actualizar estado
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
      });
    } catch (error: any) {
      throw new Error(error.message || 'Error al registrar usuario');
    }
  },

  // Logout del usuario
  logout: async () => {
    try {
      // Limpiar AsyncStorage
      await AsyncStorage.multiRemove(['auth_token', 'user_data']);
      
      // Limpiar estado
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  },

  // Actualizar datos del usuario
  updateUser: (userData: Partial<User>) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      set({ user: updatedUser });
      
      // Actualizar en AsyncStorage
      AsyncStorage.setItem('user_data', JSON.stringify(updatedUser));
    }
  },

  // Cargar datos guardados del usuario
  loadStoredAuth: async () => {
    try {
      const [token, userData] = await AsyncStorage.multiGet(['auth_token', 'user_data']);
      
      if (token[1] && userData[1]) {
        const user = JSON.parse(userData[1]);
        
        // Verificar que el token sigue siendo válido
        try {
          await apiService.getProfile();
          
          set({
            user,
            token: token[1],
            isAuthenticated: true,
          });
        } catch (error) {
          // Token inválido, limpiar datos
          await AsyncStorage.multiRemove(['auth_token', 'user_data']);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      }
    } catch (error) {
      console.error('Error al cargar datos de autenticación:', error);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    }
  },
}));

export default useAuthStore; 