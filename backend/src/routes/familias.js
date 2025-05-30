const express = require('express');
const { createFamily, joinFamily, getMyFamily, leaveFamily } = require('../controllers/familiaController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Crear familia (solo padres)
router.post('/', authorize('padre'), createFamily);

// Unirse a familia
router.post('/join', joinFamily);

// Obtener mi familia
router.get('/me', getMyFamily);

// Salir de familia
router.delete('/leave', leaveFamily);

module.exports = router; 