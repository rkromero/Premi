# 🏠 Premi - Aplicación Familiar de Tareas Gamificada

Una aplicación completa para la gestión gamificada de tareas familiares que permite a padres e hijos colaborar de manera divertida y organizada.

## 📱 Componentes del Proyecto

### Backend API
- **Tecnología:** Node.js + Express + PostgreSQL + Prisma
- **Ubicación:** `/backend`
- **Características:**
  - API REST completa
  - Autenticación JWT
  - Base de datos PostgreSQL con Prisma ORM
  - Sistema de roles (padres/hijos)
  - Gestión de tareas, recompensas y puntos
  - Notificaciones en tiempo real

### Aplicación Móvil
- **Tecnología:** React Native + Expo + TypeScript
- **Ubicación:** `/mobile-app`
- **Características:**
  - Interfaz moderna y amigable
  - Gestión de estado con Zustand
  - Navegación con React Navigation
  - Diseño responsivo con React Native Paper
  - Integración completa con la API

## 🚀 Despliegue

### Backend en Railway
1. El backend está configurado para desplegarse automáticamente en Railway
2. Variables de entorno necesarias:
   - `DATABASE_URL`: URL de PostgreSQL
   - `JWT_SECRET`: Clave secreta para JWT
   - `PORT`: Puerto del servidor (Railway lo asigna automáticamente)

### Aplicación Móvil
- Desarrollo: Expo Go para testing
- Producción: Build para App Store/Google Play

## 📖 Documentación

Consulta la documentación completa en cada directorio:
- [Backend API Documentation](./backend/README.md)
- [Mobile App Documentation](./mobile-app/README.md)

## 🛠️ Instalación Rápida

### Clonar el repositorio
```bash
git clone <tu-repo-url>
cd Premi
```

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configurar variables de entorno
npm run prisma:migrate
npm start
```

### Mobile App
```bash
cd mobile-app
npm install
npm start
```

## 🌟 Características Principales

- **Gamificación:** Sistema de puntos y recompensas
- **Roles diferenciados:** Padres pueden crear tareas, hijos pueden completarlas
- **Interfaz intuitiva:** Diseño moderno y fácil de usar
- **Tiempo real:** Notificaciones instantáneas
- **Seguridad:** Autenticación JWT y validación de datos

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles. 