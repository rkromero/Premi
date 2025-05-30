const { errorResponse, successResponse } = require('../utils/helpers');
const prisma = require('../config/database');

// Crear nueva tarea (solo padres)
const createTask = async (req, res) => {
  try {
    const { titulo, descripcion, puntos, asignadoA, fechaLimite } = req.body;

    if (!titulo || !puntos) {
      return res.status(400).json(
        errorResponse('Título y puntos son requeridos')
      );
    }

    if (puntos < 1) {
      return res.status(400).json(
        errorResponse('Los puntos deben ser mayor a 0')
      );
    }

    // Si se asigna a alguien, verificar que sea de la misma familia
    if (asignadoA) {
      const targetUser = await prisma.usuario.findUnique({
        where: { id: asignadoA },
        select: { familiaId: true, rol: true }
      });

      if (!targetUser || targetUser.familiaId !== req.user.familiaId) {
        return res.status(400).json(
          errorResponse('Usuario asignado no pertenece a la familia')
        );
      }
    }

    const tarea = await prisma.tarea.create({
      data: {
        titulo,
        descripcion,
        puntos,
        asignadoA,
        creadaPor: req.user.id,
        fechaLimite: fechaLimite ? new Date(fechaLimite) : null,
      },
      include: {
        usuarioAsignado: {
          select: {
            id: true,
            nombre: true,
            rol: true,
          },
        },
        usuarioCreador: {
          select: {
            id: true,
            nombre: true,
            rol: true,
          },
        },
      },
    });

    // Crear notificación si se asignó a alguien
    if (asignadoA) {
      await prisma.notificacion.create({
        data: {
          usuarioId: asignadoA,
          tipo: 'nueva_tarea',
          mensaje: `Nueva tarea asignada: ${titulo}`,
        },
      });
    }

    res.status(201).json(
      successResponse(
        tarea,
        'Tarea creada exitosamente'
      )
    );
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json(
      errorResponse('Error interno del servidor')
    );
  }
};

// Obtener tareas
const getTasks = async (req, res) => {
  try {
    const { asignadoA, estado, page = 1, limit = 10 } = req.query;
    
    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    const where = {
      OR: [
        { creadaPor: req.user.id },
        { asignadoA: req.user.id },
        // Si es padre, puede ver todas las tareas de la familia
        ...(req.user.rol === 'padre' ? [{
          usuarioCreador: {
            familiaId: req.user.familiaId
          }
        }] : [])
      ]
    };

    if (asignadoA) {
      where.asignadoA = asignadoA;
    }

    if (estado) {
      where.estado = estado;
    }

    const [tareas, total] = await Promise.all([
      prisma.tarea.findMany({
        where,
        include: {
          usuarioAsignado: {
            select: {
              id: true,
              nombre: true,
              rol: true,
            },
          },
          usuarioCreador: {
            select: {
              id: true,
              nombre: true,
              rol: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take,
      }),
      prisma.tarea.count({ where })
    ]);

    res.json(
      successResponse(
        {
          tareas,
          pagination: {
            page: parseInt(page),
            limit: take,
            total,
            pages: Math.ceil(total / take),
          },
        },
        'Tareas obtenidas exitosamente'
      )
    );
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json(
      errorResponse('Error interno del servidor')
    );
  }
};

// Obtener tarea por ID
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const tarea = await prisma.tarea.findUnique({
      where: { id },
      include: {
        usuarioAsignado: {
          select: {
            id: true,
            nombre: true,
            rol: true,
          },
        },
        usuarioCreador: {
          select: {
            id: true,
            nombre: true,
            rol: true,
          },
        },
      },
    });

    if (!tarea) {
      return res.status(404).json(
        errorResponse('Tarea no encontrada')
      );
    }

    // Verificar permisos
    const canAccess = 
      tarea.creadaPor === req.user.id ||
      tarea.asignadoA === req.user.id ||
      (req.user.rol === 'padre' && tarea.usuarioCreador.familiaId === req.user.familiaId);

    if (!canAccess) {
      return res.status(403).json(
        errorResponse('No tienes permisos para ver esta tarea')
      );
    }

    res.json(
      successResponse(
        tarea,
        'Tarea obtenida exitosamente'
      )
    );
  } catch (error) {
    console.error('Error al obtener tarea:', error);
    res.status(500).json(
      errorResponse('Error interno del servidor')
    );
  }
};

// Cambiar estado de tarea
const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado || !['activa', 'pendiente_aprobacion', 'aprobada', 'rechazada'].includes(estado)) {
      return res.status(400).json(
        errorResponse('Estado inválido')
      );
    }

    const tarea = await prisma.tarea.findUnique({
      where: { id },
      include: {
        usuarioAsignado: true,
        usuarioCreador: true,
      },
    });

    if (!tarea) {
      return res.status(404).json(
        errorResponse('Tarea no encontrada')
      );
    }

    // Lógica de permisos según el estado
    if (estado === 'pendiente_aprobacion') {
      // Solo el usuario asignado puede marcar como pendiente
      if (tarea.asignadoA !== req.user.id) {
        return res.status(403).json(
          errorResponse('Solo el usuario asignado puede completar la tarea')
        );
      }
    } else if (estado === 'aprobada' || estado === 'rechazada') {
      // Solo padres o el creador pueden aprobar/rechazar
      if (req.user.rol !== 'padre' && tarea.creadaPor !== req.user.id) {
        return res.status(403).json(
          errorResponse('Solo los padres pueden aprobar o rechazar tareas')
        );
      }
    }

    // Actualizar tarea
    const tareaActualizada = await prisma.tarea.update({
      where: { id },
      data: { estado },
      include: {
        usuarioAsignado: {
          select: {
            id: true,
            nombre: true,
            rol: true,
          },
        },
        usuarioCreador: {
          select: {
            id: true,
            nombre: true,
            rol: true,
          },
        },
      },
    });

    // Lógica adicional según el nuevo estado
    if (estado === 'pendiente_aprobacion') {
      // Notificar al creador
      await prisma.notificacion.create({
        data: {
          usuarioId: tarea.creadaPor,
          tipo: 'tarea_completada',
          mensaje: `${tarea.usuarioAsignado?.nombre} completó la tarea: ${tarea.titulo}`,
        },
      });
    } else if (estado === 'aprobada') {
      // Otorgar puntos al usuario asignado
      if (tarea.asignadoA) {
        await prisma.usuario.update({
          where: { id: tarea.asignadoA },
          data: {
            puntos: {
              increment: tarea.puntos,
            },
          },
        });

        // Notificar al usuario asignado
        await prisma.notificacion.create({
          data: {
            usuarioId: tarea.asignadoA,
            tipo: 'tarea_aprobada',
            mensaje: `Tu tarea "${tarea.titulo}" fue aprobada. +${tarea.puntos} puntos`,
          },
        });
      }
    } else if (estado === 'rechazada') {
      // Notificar al usuario asignado
      if (tarea.asignadoA) {
        await prisma.notificacion.create({
          data: {
            usuarioId: tarea.asignadoA,
            tipo: 'tarea_rechazada',
            mensaje: `Tu tarea "${tarea.titulo}" fue rechazada`,
          },
        });
      }
    }

    res.json(
      successResponse(
        tareaActualizada,
        'Estado de tarea actualizado exitosamente'
      )
    );
  } catch (error) {
    console.error('Error al actualizar estado de tarea:', error);
    res.status(500).json(
      errorResponse('Error interno del servidor')
    );
  }
};

// Actualizar tarea (solo creador)
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, puntos, asignadoA, fechaLimite } = req.body;

    const tarea = await prisma.tarea.findUnique({
      where: { id },
    });

    if (!tarea) {
      return res.status(404).json(
        errorResponse('Tarea no encontrada')
      );
    }

    // Solo el creador puede actualizar
    if (tarea.creadaPor !== req.user.id) {
      return res.status(403).json(
        errorResponse('Solo el creador puede actualizar la tarea')
      );
    }

    // No se puede actualizar si ya está en proceso
    if (tarea.estado !== 'activa') {
      return res.status(400).json(
        errorResponse('No se puede actualizar una tarea que no está activa')
      );
    }

    const updateData = {};
    if (titulo) updateData.titulo = titulo;
    if (descripcion !== undefined) updateData.descripcion = descripcion;
    if (puntos) updateData.puntos = puntos;
    if (asignadoA !== undefined) updateData.asignadoA = asignadoA;
    if (fechaLimite !== undefined) updateData.fechaLimite = fechaLimite ? new Date(fechaLimite) : null;

    const tareaActualizada = await prisma.tarea.update({
      where: { id },
      data: updateData,
      include: {
        usuarioAsignado: {
          select: {
            id: true,
            nombre: true,
            rol: true,
          },
        },
        usuarioCreador: {
          select: {
            id: true,
            nombre: true,
            rol: true,
          },
        },
      },
    });

    res.json(
      successResponse(
        tareaActualizada,
        'Tarea actualizada exitosamente'
      )
    );
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    res.status(500).json(
      errorResponse('Error interno del servidor')
    );
  }
};

// Eliminar tarea (solo creador)
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const tarea = await prisma.tarea.findUnique({
      where: { id },
    });

    if (!tarea) {
      return res.status(404).json(
        errorResponse('Tarea no encontrada')
      );
    }

    // Solo el creador puede eliminar
    if (tarea.creadaPor !== req.user.id) {
      return res.status(403).json(
        errorResponse('Solo el creador puede eliminar la tarea')
      );
    }

    await prisma.tarea.delete({
      where: { id },
    });

    res.json(
      successResponse(
        null,
        'Tarea eliminada exitosamente'
      )
    );
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json(
      errorResponse('Error interno del servidor')
    );
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTaskStatus,
  updateTask,
  deleteTask,
}; 