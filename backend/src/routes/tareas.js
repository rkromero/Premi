const express = require('express');
const { 
  createTask, 
  getTasks, 
  getTaskById, 
  updateTaskStatus, 
  updateTask, 
  deleteTask 
} = require('../controllers/tareaController');
const { authenticate, authorize, sameFamily } = require('../middleware/auth');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Crear tarea (solo padres)
router.post('/', authorize('padre'), createTask);

// Obtener tareas
router.get('/', sameFamily, getTasks);

// Obtener tarea por ID
router.get('/:id', sameFamily, getTaskById);

// Actualizar estado de tarea
router.patch('/:id/status', sameFamily, updateTaskStatus);

// Actualizar tarea (solo creador)
router.put('/:id', sameFamily, updateTask);

// Eliminar tarea (solo creador)
router.delete('/:id', sameFamily, deleteTask);

module.exports = router; 