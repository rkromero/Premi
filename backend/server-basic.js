const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware básico
app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());

// Ruta de prueba
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Ruta de test
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API de Premi funcionando',
    server: 'Backend Test'
  });
});

// Login de prueba
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('Login attempt:', { email, password });
  
  if (email && password) {
    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: {
          id: 1,
          email: email,
          nombre: 'Usuario Prueba',
          rol: 'padre'
        },
        token: 'test-token-123'
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Email y contraseña requeridos'
    });
  }
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: 'Error del servidor'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor básico ejecutándose en puerto ${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
  console.log(`🧪 Test: http://localhost:${PORT}/api/test`);
});

module.exports = app; 