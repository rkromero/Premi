require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de seguridad básico
app.use(helmet());

// Configuración de CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Middleware de logging
app.use(morgan('dev'));

// Middleware para parsing de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando correctamente - Versión de prueba',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Rutas básicas de prueba
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando correctamente',
    data: {
      server: 'Backend Premi',
      version: '1.0.0-test'
    }
  });
});

// Ruta de login de prueba (sin base de datos)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simulación de login exitoso
  if (email && password) {
    res.json({
      success: true,
      message: 'Login exitoso (modo prueba)',
      data: {
        user: {
          id: 1,
          email: email,
          nombre: 'Usuario de Prueba',
          rol: 'padre'
        },
        token: 'test-jwt-token-123'
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Email y contraseña son requeridos'
    });
  }
});

// Ruta de registro de prueba
app.post('/api/auth/register', (req, res) => {
  const { email, password, nombre } = req.body;
  
  if (email && password && nombre) {
    res.json({
      success: true,
      message: 'Registro exitoso (modo prueba)',
      data: {
        user: {
          id: 1,
          email: email,
          nombre: nombre,
          rol: 'padre'
        }
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Todos los campos son requeridos'
    });
  }
});

// Ruta para manejar endpoints no encontrados
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado',
    error: 'NOT_FOUND'
  });
});

// Middleware global de manejo de errores
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: 'INTERNAL_SERVER_ERROR'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor PRUEBA ejecutándose en puerto ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test API: http://localhost:${PORT}/api/test`);
  console.log(`📖 API Base URL: http://localhost:${PORT}/api`);
});

module.exports = app; 