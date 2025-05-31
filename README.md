# 📱 App Móvil - Gestión Familiar de Tareas

Aplicación móvil desarrollada en React Native con Expo para la gestión gamificada de tareas familiares.

## 🚀 Características

- **Autenticación** con JWT
- **Interfaz moderna** con React Native Paper
- **Gestión de estado** con Zustand
- **Navegación** con React Navigation
- **Tipado fuerte** con TypeScript
- **Componentes reutilizables**
- **Tema personalizado** familiar-friendly

## 🛠️ Stack Tecnológico

- **React Native** + **Expo**
- **TypeScript** para tipado
- **React Navigation** para navegación
- **Zustand** para manejo de estado
- **React Native Paper** para UI
- **Axios** para peticiones HTTP
- **AsyncStorage** para persistencia local

## �� Instalación

1. **Instalar dependencias**
```bash
npm install
```

2. **Iniciar el servidor de desarrollo**
```bash
npm start
```

3. **Ejecutar en dispositivo**
```bash
# Android
npm run android

# iOS (requiere macOS)
npm run ios

# Web
npm run web
```

## 📱 Configuración del Backend

La aplicación se conecta automáticamente al backend según el entorno:

- **Desarrollo**: `http://10.0.2.2:3000/api` (Android Emulator)
- **Producción**: `https://surprising-wisdom-production.up.railway.app/api`

Para desarrollo local, asegúrate de que el backend esté ejecutándose en el puerto 3000.

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Button.tsx      # Botón personalizado
│   ├── Input.tsx       # Input personalizado
│   └── ...
├── screens/            # Pantallas de la aplicación
│   ├── auth/          # Pantallas de autenticación
│   │   └── LoginScreen.tsx
│   └── ...
├── navigation/         # Configuración de navegación
│   └── AppNavigator.tsx
├── services/          # Servicios (API, etc.)
│   └── api.ts         # Cliente API con Axios
├── store/             # Stores de Zustand
│   ├── authStore.ts   # Store de autenticación
│   ├── taskStore.ts   # Store de tareas
│   └── index.ts       # Exports centralizados
├── types/             # Tipos TypeScript
│   └── index.ts       # Todas las interfaces
├── utils/             # Utilidades
│   └── theme.ts       # Tema y constantes de diseño
└── hooks/             # Custom hooks (por implementar)
```

## 🎨 Tema y Diseño

### Colores Principales
- **Primario**: `#6366F1` (Indigo) - Para acciones principales
- **Secundario**: `#F59E0B` (Dorado) - Para puntos y recompensas
- **Éxito**: `#10B981` (Verde) - Para tareas completadas
- **Error**: `#EF4444` (Rojo) - Para errores

### Colores por Rol
- **Padre**: `#8B5CF6` (Púrpura)
- **Hijo**: `#06B6D4` (Cyan)

### Estados de Tareas
- **Activa**: `#3B82F6` (Azul)
- **Pendiente**: `#F59E0B` (Amarillo)
- **Aprobada**: `#10B981` (Verde)
- **Rechazada**: `#EF4444` (Rojo)

## 🔧 Componentes Disponibles

### Button
```tsx
<Button
  title="Iniciar Sesión"
  onPress={handleLogin}
  variant="primary"
  size="medium"
  loading={isLoading}
/>
```

### Input
```tsx
<Input
  label="Email"
  placeholder="tu@email.com"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  leftIcon="mail"
  error={emailError}
/>
```

## 📊 Stores (Zustand)

### AuthStore
```tsx
const { user, isAuthenticated, login, logout } = useAuthStore();
```

### TaskStore
```tsx
const { tasks, loading, fetchTasks, createTask } = useTaskStore();
```

### Custom Hooks
```tsx
const { user, isAuthenticated } = useCurrentUser();
const isParent = useIsParent();
const isChild = useIsChild();
```

## 🔗 API Integration

El servicio API (`src/services/api.ts`) maneja:

- **Autenticación automática** con tokens JWT
- **Interceptores** para agregar headers
- **Manejo de errores** centralizado
- **Tipado completo** con TypeScript

Ejemplo de uso:
```tsx
import apiService from '../services/api';

// Login
const response = await apiService.login({ email, password });

// Obtener tareas
const tasks = await apiService.getTasks();
```

## 🚀 Despliegue

### Expo Go (Desarrollo)
1. Descargar **Expo Go** en tu dispositivo
2. Escanear el QR code generado por `npm start`

### Build de Producción
```bash
# Android APK
expo build:android

# iOS (requiere cuenta de desarrollador)
expo build:ios
```

### Expo Application Services (EAS)
```bash
# Instalar EAS CLI
npm install -g @expo/eas-cli

# Configurar
eas build:configure

# Build
eas build --platform android
```

## 🧪 Testing

```bash
# Ejecutar tests (por implementar)
npm test

# Type checking
npx tsc --noEmit
```

## 📝 Próximas Funcionalidades

- [ ] **Pantalla de Registro**
- [ ] **Dashboard principal**
- [ ] **Lista de tareas**
- [ ] **Gestión de recompensas**
- [ ] **Perfil de usuario**
- [ ] **Notificaciones push**
- [ ] **Modo offline**
- [ ] **Animaciones**

## 🤝 Desarrollo

### Scripts Disponibles
```json
{
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios", 
  "web": "expo start --web"
}
```

### Configuración VS Code
Extensiones recomendadas:
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Expo Tools
- React Native Tools

## 📄 Licencia

MIT License - ver archivo LICENSE para detalles. 