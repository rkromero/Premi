require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Importar rutas
const authRoutes = require('./src/routes/auth');
const familiaRoutes = require('./src/routes/familias');
const tareaRoutes = require('./src/routes/tareas');
const recompensaRoutes = require('./src/routes/recompensas');
const canjeRoutes = require('./src/routes/canjes');
const notificacionRoutes = require('./src/routes/notificaciones');

// Importar middleware de error
const { errorResponse } = require('./src/utils/helpers');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana de tiempo
  message: {
    success: false,
    message: 'Demasiadas solicitudes, intenta de nuevo más tarde',
  },
});

// Middleware de seguridad
app.use(helmet());
app.use(limiter);

// Configuración de CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Middleware de logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Middleware para parsing de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/familias', familiaRoutes);
app.use('/api/tareas', tareaRoutes);
app.use('/api/recompensas', recompensaRoutes);
app.use('/api/canjes', canjeRoutes);
app.use('/api/notificaciones', notificacionRoutes);

// Ruta para manejar endpoints no encontrados
app.use('*', (req, res) => {
  res.status(404).json(
    errorResponse('Endpoint no encontrado', 404)
  );
});

// Middleware global de manejo de errores
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  
  // Error de validación de Prisma
  if (error.code === 'P2002') {
    return res.status(400).json(
      errorResponse('Violación de restricción única', 400)
    );
  }
  
  // Error de registro no encontrado en Prisma
  if (error.code === 'P2025') {
    return res.status(404).json(
      errorResponse('Registro no encontrado', 404)
    );
  }
  
  // Error de JSON malformado
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json(
      errorResponse('JSON malformado', 400)
    );
  }
  
  // Error genérico del servidor
  res.status(500).json(
    errorResponse('Error interno del servidor', 500)
  );
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`📖 API Base URL: http://localhost:${PORT}/api`);
  }
});

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('Excepción no capturada:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesa rechazada no manejada:', reason);
  process.exit(1);
});

module.exports = app; 