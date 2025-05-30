const express = require('express');
const { 
  getNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification, 
  deleteReadNotifications, 
  getNotificationSummary 
} = require('../controllers/notificacionController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Obtener notificaciones
router.get('/', getNotifications);

// Obtener resumen de notificaciones
router.get('/summary', getNotificationSummary);

// Marcar notificación como leída
router.patch('/:id/read', markAsRead);

// Marcar todas como leídas
router.patch('/read-all', markAllAsRead);

// Eliminar notificación
router.delete('/:id', deleteNotification);

// Eliminar todas las leídas
router.delete('/read', deleteReadNotifications);

module.exports = router; 