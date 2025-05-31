// Exportar todos los stores desde un solo archivo
export { default as useAuthStore } from './authStore';
export { default as useTaskStore } from './taskStore';

// Crear un hook combinado para obtener información del usuario autenticado
import useAuthStore from './authStore';

export const useCurrentUser = () => {
  const { user, isAuthenticated } = useAuthStore();
  return { user, isAuthenticated };
};

// Hook para verificar si el usuario es padre
export const useIsParent = () => {
  const { user } = useAuthStore();
  return user?.rol === 'padre';
};

// Hook para verificar si el usuario es hijo
export const useIsChild = () => {
  const { user } = useAuthStore();
  return user?.rol === 'hijo';
}; 