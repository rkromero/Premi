const express = require('express');
const { 
  requestExchange, 
  getExchanges, 
  updateExchangeStatus 
} = require('../controllers/recompensaController');
const { authenticate, authorize, sameFamily } = require('../middleware/auth');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Solicitar canje
router.post('/', sameFamily, requestExchange);

// Obtener canjes
router.get('/', sameFamily, getExchanges);

// Aprobar o rechazar canje (solo padres)
router.patch('/:id/status', authorize('padre'), sameFamily, updateExchangeStatus);

module.exports = router; 