# 🏠 Backend - App Familiar de Tareas y Recompensas

Backend desarrollado en Node.js + Express + PostgreSQL + Prisma para la gestión gamificada de tareas familiares.

## 🚀 Características

- **Autenticación JWT** con roles (padre/hijo)
- **Gestión de familias** con códigos de invitación
- **Sistema de tareas** con estados y aprobaciones
- **Sistema de recompensas** y canjes
- **Notificaciones** internas
- **API REST** completa y documentada
- **Middleware de seguridad** (helmet, rate limiting, CORS)
- **Validaciones** robustas
- **Manejo de errores** centralizado

## 🛠️ Stack Tecnológico

- **Node.js** + **Express.js**
- **PostgreSQL** como base de datos
- **Prisma** como ORM
- **JWT** para autenticación
- **bcryptjs** para hash de contraseñas
- **Helmet** para seguridad
- **Morgan** para logging
- **CORS** para cross-origin requests

## 📦 Instalación

1. **Clonar el repositorio**
```bash
git clone <repo-url>
cd backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp env.example .env
# Editar .env con tus configuraciones
```

4. **Configurar base de datos**
```bash
# Crear base de datos PostgreSQL
createdb familia_tareas

# Ejecutar migraciones
npm run db:migrate

# Generar cliente Prisma
npm run db:generate
```

5. **Iniciar servidor**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 🌍 Variables de Entorno

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/familia_tareas?schema=public"

# JWT
JWT_SECRET="tu_jwt_secret_muy_seguro_aqui"

# Server
PORT=3000
NODE_ENV=development

# CORS (for Expo development)
CORS_ORIGIN="*"
```

## 📊 Scripts Disponibles

```bash
npm start          # Iniciar servidor en producción
npm run dev        # Iniciar servidor en desarrollo con nodemon
npm run db:migrate # Ejecutar migraciones de Prisma
npm run db:generate # Generar cliente Prisma
npm run db:push    # Push schema a la base de datos
npm run db:studio  # Abrir Prisma Studio
npm run db:reset   # Resetear base de datos
```

## 🔗 API Endpoints

### 🔐 Autenticación
```
POST   /api/auth/register     # Registro de usuario
POST   /api/auth/login        # Login
GET    /api/auth/me           # Obtener perfil
```

### 👨‍👩‍👧‍👦 Familias
```
POST   /api/familias          # Crear familia (padres)
POST   /api/familias/join     # Unirse a familia
GET    /api/familias/me       # Obtener mi familia
DELETE /api/familias/leave    # Salir de familia
```

### ✅ Tareas
```
POST   /api/tareas            # Crear tarea (padres)
GET    /api/tareas            # Obtener tareas
GET    /api/tareas/:id        # Obtener tarea por ID
PATCH  /api/tareas/:id/status # Cambiar estado de tarea
PUT    /api/tareas/:id        # Actualizar tarea
DELETE /api/tareas/:id        # Eliminar tarea
```

### 🎁 Recompensas
```
POST   /api/recompensas       # Crear recompensa (padres)
GET    /api/recompensas       # Obtener recompensas
GET    /api/recompensas/:id   # Obtener recompensa por ID
PUT    /api/recompensas/:id   # Actualizar recompensa
DELETE /api/recompensas/:id   # Eliminar recompensa
```

### 🔄 Canjes
```
POST   /api/canjes            # Solicitar canje
GET    /api/canjes            # Obtener canjes
PATCH  /api/canjes/:id/status # Aprobar/rechazar canje (padres)
```

### 🔔 Notificaciones
```
GET    /api/notificaciones           # Obtener notificaciones
GET    /api/notificaciones/summary   # Resumen de notificaciones
PATCH  /api/notificaciones/:id/read  # Marcar como leída
PATCH  /api/notificaciones/read-all  # Marcar todas como leídas
DELETE /api/notificaciones/:id       # Eliminar notificación
DELETE /api/notificaciones/read      # Eliminar todas las leídas
```

## 🗄️ Modelo de Datos

### Usuario
- `id`, `nombre`, `email`, `passwordHash`
- `rol` (padre/hijo)
- `familiaId`, `puntos`, `avatarUrl`

### Familia
- `id`, `nombre`, `codigoInvitacion`

### Tarea
- `id`, `titulo`, `descripcion`, `puntos`
- `asignadoA`, `creadaPor`
- `estado` (activa/pendiente_aprobacion/aprobada/rechazada)
- `fechaLimite`

### Recompensa
- `id`, `nombre`, `descripcion`, `costoPuntos`
- `estado` (disponible/reclamada)
- `creadaPor`

### Canje
- `id`, `recompensaId`, `usuarioId`
- `estado` (pendiente/aprobado/rechazado)
- `aprobadoPor`

### Notificación
- `id`, `usuarioId`, `tipo`, `mensaje`
- `leido`

## 🔒 Seguridad

- **Autenticación JWT** con expiración
- **Hash de contraseñas** con bcrypt (12 rounds)
- **Rate limiting** (100 requests/15min)
- **Helmet** para headers de seguridad
- **Validación** de entrada en todos los endpoints
- **Autorización** por roles y familia
- **CORS** configurado para Expo

## 🚀 Despliegue en Railway

1. **Conectar repositorio** a Railway
2. **Configurar variables de entorno**:
   - `DATABASE_URL` (PostgreSQL de Railway)
   - `JWT_SECRET`
   - `NODE_ENV=production`
3. **Railway ejecutará automáticamente**:
   - `npm install`
   - `npm run build` (genera Prisma Client)
   - `npm start`

### Variables de Railway
```env
DATABASE_URL=postgresql://...  # Auto-generada por Railway
JWT_SECRET=tu_secret_super_seguro
NODE_ENV=production
PORT=3000  # Auto-configurado por Railway
```

## 🧪 Testing

```bash
# Health check
curl http://localhost:3000/health

# Registro
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan","email":"juan@test.com","password":"123456","rol":"padre"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@test.com","password":"123456"}'
```

## 📝 Notas de Desarrollo

- **Prisma Studio**: `npm run db:studio` para interfaz visual de BD
- **Logs**: Morgan configurado para desarrollo y producción
- **Hot reload**: Nodemon en desarrollo
- **Error handling**: Middleware centralizado para errores
- **Validaciones**: Validación robusta en controladores
- **Transacciones**: Uso de transacciones Prisma para operaciones críticas

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

MIT License - ver archivo LICENSE para detalles. 