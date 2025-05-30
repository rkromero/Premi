const { errorResponse, successResponse } = require('../utils/helpers');
const prisma = require('../config/database');

// Obtener notificaciones del usuario
const getNotifications = async (req, res) => {
  try {
    const { leido, page = 1, limit = 20 } = req.query;
    
    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    const where = {
      usuarioId: req.user.id,
    };

    if (leido !== undefined) {
      where.leido = leido === 'true';
    }

    const [notificaciones, total, noLeidas] = await Promise.all([
      prisma.notificacion.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take,
      }),
      prisma.notificacion.count({ where }),
      prisma.notificacion.count({
        where: {
          usuarioId: req.user.id,
          leido: false,
        },
      }),
    ]);

    res.json(
      successResponse(
        {
          notificaciones,
          pagination: {
            page: parseInt(page),
            limit: take,
            total,
            pages: Math.ceil(total / take),
          },
          noLeidas,
        },
        'Notificaciones obtenidas exitosamente'
      )
    );
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    res.status(500).json(
      errorResponse('Error interno del servidor')
    );
  }
};

// Marcar notificación como leída
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notificacion = await prisma.notificacion.findUnique({
      where: { id },
    });

    if (!notificacion) {
      return res.status(404).json(
        errorResponse('Notificación no encontrada')
      );
    }

    // Verificar que la notificación pertenece al usuario
    if (notificacion.usuarioId !== req.user.id) {
      return res.status(403).json(
        errorResponse('No tienes permisos para modificar esta notificación')
      );
    }

    const notificacionActualizada = await prisma.notificacion.update({
      where: { id },
      data: { leido: true },
    });

    res.json(
      successResponse(
        notificacionActualizada,
        'Notificación marcada como leída'
      )
    );
  } catch (error) {
    console.error('Error al marcar notificación como leída:', error);
    res.status(500).json(
      errorResponse('Error interno del servidor')
    );
  }
};

// Marcar todas las notificaciones como leídas
const markAllAsRead = async (req, res) => {
  try {
    const result = await prisma.notificacion.updateMany({
      where: {
        usuarioId: req.user.id,
        leido: false,
      },
      data: { leido: true },
    });

    res.json(
      successResponse(
        { count: result.count },
        `${result.count} notificaciones marcadas como leídas`
      )
    );
  } catch (error) {
    console.error('Error al marcar todas las notificaciones como leídas:', error);
    res.status(500).json(
      errorResponse('Error interno del servidor')
    );
  }
};

// Eliminar notificación
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notificacion = await prisma.notificacion.findUnique({
      where: { id },
    });

    if (!notificacion) {
      return res.status(404).json(
        errorResponse('Notificación no encontrada')
      );
    }

    // Verificar que la notificación pertenece al usuario
    if (notificacion.usuarioId !== req.user.id) {
      return res.status(403).json(
        errorResponse('No tienes permisos para eliminar esta notificación')
      );
    }

    await prisma.notificacion.delete({
      where: { id },
    });

    res.json(
      successResponse(
        null,
        'Notificación eliminada exitosamente'
      )
    );
  } catch (error) {
    console.error('Error al eliminar notificación:', error);
    res.status(500).json(
      errorResponse('Error interno del servidor')
    );
  }
};

// Eliminar todas las notificaciones leídas
const deleteReadNotifications = async (req, res) => {
  try {
    const result = await prisma.notificacion.deleteMany({
      where: {
        usuarioId: req.user.id,
        leido: true,
      },
    });

    res.json(
      successResponse(
        { count: result.count },
        `${result.count} notificaciones eliminadas`
      )
    );
  } catch (error) {
    console.error('Error al eliminar notificaciones leídas:', error);
    res.status(500).json(
      errorResponse('Error interno del servidor')
    );
  }
};

// Obtener resumen de notificaciones
const getNotificationSummary = async (req, res) => {
  try {
    const [total, noLeidas, porTipo] = await Promise.all([
      prisma.notificacion.count({
        where: { usuarioId: req.user.id },
      }),
      prisma.notificacion.count({
        where: {
          usuarioId: req.user.id,
          leido: false,
        },
      }),
      prisma.notificacion.groupBy({
        by: ['tipo'],
        where: {
          usuarioId: req.user.id,
          leido: false,
        },
        _count: {
          tipo: true,
        },
      }),
    ]);

    const resumenPorTipo = porTipo.reduce((acc, item) => {
      acc[item.tipo] = item._count.tipo;
      return acc;
    }, {});

    res.json(
      successResponse(
        {
          total,
          noLeidas,
          porTipo: resumenPorTipo,
        },
        'Resumen de notificaciones obtenido exitosamente'
      )
    );
  } catch (error) {
    console.error('Error al obtener resumen de notificaciones:', error);
    res.status(500).json(
      errorResponse('Error interno del servidor')
    );
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteReadNotifications,
  getNotificationSummary,
}; 