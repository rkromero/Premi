// Tipos de Usuario
export type UserRole = 'padre' | 'hijo';

export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: UserRole;
  familiaId?: string;
  avatarUrl?: string;
  puntos: number;
  createdAt: string;
}

// Tipos de Familia
export interface Family {
  id: string;
  nombre: string;
  codigoInvitacion: string;
  createdAt: string;
  usuarios: User[];
}

// Tipos de Tarea
export type TaskStatus = 'activa' | 'pendiente_aprobacion' | 'aprobada' | 'rechazada';

export interface Task {
  id: string;
  titulo: string;
  descripcion?: string;
  puntos: number;
  asignadoA?: string;
  creadaPor: string;
  estado: TaskStatus;
  fechaLimite?: string;
  createdAt: string;
  usuarioAsignado?: Pick<User, 'id' | 'nombre' | 'rol'>;
  usuarioCreador?: Pick<User, 'id' | 'nombre' | 'rol'>;
}

// Tipos de Recompensa
export type RewardStatus = 'disponible' | 'reclamada';

export interface Reward {
  id: string;
  nombre: string;
  descripcion?: string;
  costoPuntos: number;
  estado: RewardStatus;
  creadaPor: string;
  createdAt: string;
  usuarioCreador?: Pick<User, 'id' | 'nombre' | 'rol'>;
  canjes?: Exchange[];
}

// Tipos de Canje
export type ExchangeStatus = 'pendiente' | 'aprobado' | 'rechazado';

export interface Exchange {
  id: string;
  recompensaId: string;
  usuarioId: string;
  estado: ExchangeStatus;
  aprobadoPor?: string;
  createdAt: string;
  recompensa: Reward;
  usuario: Pick<User, 'id' | 'nombre' | 'rol'>;
  usuarioAprobador?: Pick<User, 'id' | 'nombre' | 'rol'>;
}

// Tipos de Notificación
export type NotificationType = 
  | 'tarea_completada'
  | 'tarea_aprobada'
  | 'tarea_rechazada'
  | 'canje_solicitado'
  | 'canje_aprobado'
  | 'canje_rechazado'
  | 'nueva_tarea'
  | 'nueva_recompensa';

export interface Notification {
  id: string;
  usuarioId: string;
  tipo: NotificationType;
  mensaje: string;
  leido: boolean;
  createdAt: string;
}

// Tipos de Autenticación
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
  rol: UserRole;
}

// Tipos de API Response
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  statusCode?: number;
  details?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Tipos de Navegación
export type RootStackParamList = {
  Auth: undefined;
  MainTabs: undefined;
  TaskDetail: { taskId: string };
  RewardDetail: { rewardId: string };
  CreateTask: undefined;
  CreateReward: undefined;
  EditTask: { taskId: string };
  EditReward: { rewardId: string };
  Profile: undefined;
  Family: undefined;
  JoinFamily: undefined;
  CreateFamily: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Tasks: undefined;
  Rewards: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  Welcome: undefined;
};

// Tipos de Store (Zustand)
export interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  loadStoredAuth: () => Promise<void>;
}

export interface TaskStore {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: (params?: any) => Promise<void>;
  createTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  clearTasks: () => void;
}

export interface RewardStore {
  rewards: Reward[];
  exchanges: Exchange[];
  loading: boolean;
  error: string | null;
  fetchRewards: () => Promise<void>;
  fetchExchanges: () => Promise<void>;
  createReward: (reward: Partial<Reward>) => Promise<void>;
  requestExchange: (rewardId: string) => Promise<void>;
  updateExchangeStatus: (id: string, status: ExchangeStatus) => Promise<void>;
  clearRewards: () => void;
}

export interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearNotifications: () => void;
}

export interface FamilyStore {
  family: Family | null;
  loading: boolean;
  error: string | null;
  fetchFamily: () => Promise<void>;
  createFamily: (name: string) => Promise<void>;
  joinFamily: (code: string) => Promise<void>;
  leaveFamily: () => Promise<void>;
  clearFamily: () => void;
}

// Tipos de componentes
export interface BaseComponentProps {
  children?: React.ReactNode;
  style?: any;
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  onPress?: () => void;
  disabled?: boolean;
}

export interface TaskCardProps extends CardProps {
  task: Task;
  onStatusChange?: (status: TaskStatus) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export interface RewardCardProps extends CardProps {
  reward: Reward;
  onRequest?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  userPoints?: number;
}

// Tipos de utilidades
export interface FormField {
  value: string;
  error?: string;
  touched: boolean;
}

export interface FormState {
  [key: string]: FormField;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Constantes de colores (para el tema)
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    error: string;
    success: string;
    warning: string;
    text: string;
    textSecondary: string;
    border: string;
    disabled: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
} 