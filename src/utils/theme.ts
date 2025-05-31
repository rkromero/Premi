import { Theme } from '../types';

// Colores principales
export const colors = {
  // Colores primarios (familia-friendly)
  primary: '#6366F1',      // Indigo vibrante
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  
  // Colores secundarios
  secondary: '#F59E0B',    // Amarillo/dorado para puntos y recompensas
  secondaryLight: '#FDE047',
  secondaryDark: '#D97706',
  
  // Colores de estado
  success: '#10B981',      // Verde para tareas completadas
  successLight: '#6EE7B7',
  warning: '#F59E0B',      // Amarillo para pendientes
  warningLight: '#FDE047',
  error: '#EF4444',        // Rojo para errores/rechazadas
  errorLight: '#FCA5A5',
  
  // Colores de fondo
  background: '#F8FAFC',   // Fondo principal claro
  surface: '#FFFFFF',      // Fondo de cards
  surfaceVariant: '#F1F5F9',
  
  // Colores de texto
  text: '#1E293B',         // Texto principal
  textSecondary: '#64748B', // Texto secundario
  textLight: '#94A3B8',    // Texto claro
  textOnPrimary: '#FFFFFF',
  
  // Colores de borde
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  
  // Colores específicos para roles
  parent: '#8B5CF6',       // Púrpura para padres
  child: '#06B6D4',        // Cyan para hijos
  
  // Estados de tareas
  taskActive: '#3B82F6',   // Azul para activas
  taskPending: '#F59E0B',  // Amarillo para pendientes
  taskApproved: '#10B981', // Verde para aprobadas
  taskRejected: '#EF4444', // Rojo para rechazadas
  
  // Otros
  disabled: '#94A3B8',
  shadow: '#00000020',
  overlay: '#00000050',
};

// Espaciado
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Bordes redondeados
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
};

// Tamaños de fuente
export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
};

// Pesos de fuente
export const fontWeight = {
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

// Sombras
export const shadows = {
  sm: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  md: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lg: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

// Tema principal
export const theme: Theme = {
  colors: {
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    surface: colors.surface,
    error: colors.error,
    success: colors.success,
    warning: colors.warning,
    text: colors.text,
    textSecondary: colors.textSecondary,
    border: colors.border,
    disabled: colors.disabled,
  },
  spacing,
  borderRadius,
};

// Estilos comunes
export const commonStyles = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.sm,
    marginHorizontal: spacing.md,
    ...shadows.sm,
  },
  
  button: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  
  buttonSecondary: {
    backgroundColor: colors.secondary,
  },
  
  buttonText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.textOnPrimary,
  },
  
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    fontSize: fontSize.base,
    backgroundColor: colors.surface,
  },
  
  title: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  
  subtitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  
  body: {
    fontSize: fontSize.base,
    color: colors.text,
    lineHeight: 24,
  },
  
  caption: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  
  centerContent: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  
  spaceBetween: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
};

// Utilitarios para colores de estado de tareas
export const getTaskStatusColor = (status: string) => {
  switch (status) {
    case 'activa':
      return colors.taskActive;
    case 'pendiente_aprobacion':
      return colors.taskPending;
    case 'aprobada':
      return colors.taskApproved;
    case 'rechazada':
      return colors.taskRejected;
    default:
      return colors.textSecondary;
  }
};

// Utilitarios para colores de rol
export const getRoleColor = (role: 'padre' | 'hijo') => {
  return role === 'padre' ? colors.parent : colors.child;
};

// Constantes para animaciones
export const animations = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeInOut: 'ease-in-out',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
  },
};

export default theme; 