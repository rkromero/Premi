const express = require('express');
const { 
  createReward, 
  getRewards, 
  getRewardById, 
  updateReward, 
  deleteReward 
} = require('../controllers/recompensaController');
const { authenticate, authorize, sameFamily } = require('../middleware/auth');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Crear recompensa (solo padres)
router.post('/', authorize('padre'), createReward);

// Obtener recompensas
router.get('/', sameFamily, getRewards);

// Obtener recompensa por ID
router.get('/:id', sameFamily, getRewardById);

// Actualizar recompensa (solo creador)
router.put('/:id', sameFamily, updateReward);

// Eliminar recompensa (solo creador)
router.delete('/:id', sameFamily, deleteReward);

module.exports = router; 