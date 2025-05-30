const { errorResponse, successResponse } = require('../utils/helpers');
const prisma = require('../config/database');

// Crear nueva recompensa (solo padres)
const createReward = async (req, res) => {
  try {
    const { nombre, descripcion, costoPuntos } = req.body;

    if (!nombre || !costoPuntos) {
      return res.status(400).json(
        errorResponse('Nombre y costo en puntos son requeridos')
      );
    }

    if (costoPuntos < 1) {
      return res.status(400).json(
        errorResponse('El costo debe ser mayor a 0')
      );
    }

    const recompensa = await prisma.recompensa.create({
      data: {
        nombre,
        descripcion,
        costoPuntos,
        creadaPor: req.user.id,
      },
      include: {
        usuarioCreador: {
          select: {
            id: true,
            nombre: true,
            rol: true,
          },
        },
      },
    });

    res.status(201).json(
      successResponse(
        recompensa,
        'Recompensa creada exitosamente'
      )
    );
  } catch (error) {
    console.error('Error al crear recompensa:', error);
    res.status(500).json(
      errorResponse('Error interno del servidor')
    );
  }
};

// Obtener recompensas
const getRewards = async (req, res) => {
  try {
    const { estado, page = 1, limit = 10 } = req.query;
    
    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    const where = {
      usuarioCreador: {
        familiaId: req.user.familiaId
      }
    };

    if (estado) {
      where.estado = estado;
    }

    const [recompensas, total] = await Promise.all([
      prisma.recompensa.findMany({
        where,
        include: {
          usuarioCreador: {
            select: {
              id: true,
              nombre: true,
              rol: true,
            },
          },
          canjes: {
            include: {
              usuario: {
                select: {
                  id: true,
                  nombre: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take,
      }),
      prisma.recompensa.count({ where })
    ]);

    res.json(
      successResponse(
        {
          recompensas,
          pagination: {
            page: parseInt(page),
            limit: take,
            total,
            pages: Math.ceil(total / take),
          },
        },
        'Recompensas obtenidas exitosamente'
      )
    );
  } catch (error) {
    console.error('Error al obtener recompensas:', error);
    res.status(500).json(
      errorResponse('Error interno del servidor')
    );
  }
};

// Obtener recompensa por ID
const getRewardById = async (req, res) => {
  try {
    const { id } = req.params;

    const recompensa = await prisma.recompensa.findUnique({
      where: { id },
      include: {
        usuarioCreador: {
          select: {
            id: true,
            nombre: true,
            rol: true,
          },
        },
        canjes: {
          include: {
            usuario: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },
        },
      },
    });

    if (!recompensa) {
      return res.status(404).json(
        errorResponse('Recompensa no encontrada')
      );
    }

    // Verificar que pertenece a la misma familia
    if (recompensa.usuarioCreador.familiaId !== req.user.familiaId) {
      return res.status(403).json(
        errorResponse('No tienes permisos para ver esta recompensa')
      );
    }

    res.json(
      successResponse(
        recompensa,
        'Recompensa obtenida exitosamente'
      )
    );
  } catch (error) {
    console.error('Error al obtener recompensa:', error);
    res.status(500).json(
      errorResponse('Error interno del servidor')
    );
  }
};

// Solicitar canje de recompensa
const requestExchange = async (req, res) => {
  try {
    const { recompensaId } = req.body;

    if (!recompensaId) {
      return res.status(400).json(
        errorResponse('ID de recompensa es requerido')
      );
    }

    const recompensa = await prisma.recompensa.findUnique({
      where: { id: recompensaId },
      include: {
        usuarioCreador: true,
      },
    });

    if (!recompensa) {
      return res.status(404).json(
        errorResponse('Recompensa no encontrada')
      );
    }

    // Verificar que la recompensa esté disponible
    if (recompensa.estado !== 'disponible') {
      return res.status(400).json(
        errorResponse('Recompensa no disponible')
      );
    }

    // Verificar que el usuario tenga suficientes puntos
    if (req.user.puntos < recompensa.costoPuntos) {
      return res.status(400).json(
        errorResponse('Puntos insuficientes para esta recompensa')
      );
    }

    // Verificar que pertenece a la misma familia
    if (recompensa.usuarioCreador.familiaId !== req.user.familiaId) {
      return res.status(403).json(
        errorResponse('No puedes canjear recompensas de otra familia')
      );
    }

    // Verificar que no tenga un canje pendiente para esta recompensa
    const canjeExistente = await prisma.canje.findFirst({
      where: {
        recompensaId,
        usuarioId: req.user.id,
        estado: 'pendiente',
      },
    });

    if (canjeExistente) {
      return res.status(400).json(
        errorResponse('Ya tienes un canje pendiente para esta recompensa')
      );
    }

    const canje = await prisma.canje.create({
      data: {
        recompensaId,
        usuarioId: req.user.id,
      },
      include: {
        recompensa: true,
        usuario: {
          select: {
            id: true,
            nombre: true,
            rol: true,
          },
        },
      },
    });

    // Crear notificación para los padres de la familia
    const padres = await prisma.usuario.findMany({
      where: {
        familiaId: req.user.familiaId,
        rol: 'padre',
      },
    });

    for (const padre of padres) {
      await prisma.notificacion.create({
        data: {
          usuarioId: padre.id,
          tipo: 'canje_solicitado',
          mensaje: `${req.user.nombre} solicitó canjear: ${recompensa.nombre}`,
        },
      });
    }

    res.status(201).json(
      successResponse(
        canje,
        'Canje solicitado exitosamente'
      )
    );
  } catch (error) {
    console.error('Error al solicitar canje:', error);
    res.status(500).json(
      errorResponse('Error interno del servidor')
    );
  }
};

// Obtener canjes
const getExchanges = async (req, res) => {
  try {
    const { usuarioId, estado, page = 1, limit = 10 } = req.query;
    
    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    const where = {};

    // Si es hijo, solo puede ver sus propios canjes
    if (req.user.rol === 'hijo') {
      where.usuarioId = req.user.id;
    } else {
      // Si es padre, puede ver todos los canjes de la familia
      where.usuario = {
        familiaId: req.user.familiaId
      };
      
      if (usuarioId) {
        where.usuarioId = usuarioId;
      }
    }

    if (estado) {
      where.estado = estado;
    }

    const [canjes, total] = await Promise.all([
      prisma.canje.findMany({
        where,
        include: {
          recompensa: true,
          usuario: {
            select: {
              id: true,
              nombre: true,
              rol: true,
            },
          },
          usuarioAprobador: {
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
      prisma.canje.count({ where })
    ]);

    res.json(
      successResponse(
        {
          canjes,
          pagination: {
            page: parseInt(page),
            limit: take,
            total,
            pages: Math.ceil(total / take),
          },
        },
        'Canjes obtenidos exitosamente'
      )
    );
  } catch (error) {
    console.error('Error al obtener canjes:', error);
    res.status(500).json(
      errorResponse('Error interno del servidor')
    );
  }
};

// Aprobar o rechazar canje (solo padres)
const updateExchangeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado || !['aprobado', 'rechazado'].includes(estado)) {
      return res.status(400).json(
        errorResponse('Estado inválido. Debe ser "aprobado" o "rechazado"')
      );
    }

    const canje = await prisma.canje.findUnique({
      where: { id },
      include: {
        recompensa: true,
        usuario: true,
      },
    });

    if (!canje) {
      return res.status(404).json(
        errorResponse('Canje no encontrado')
      );
    }

    // Verificar que el canje esté pendiente
    if (canje.estado !== 'pendiente') {
      return res.status(400).json(
        errorResponse('El canje ya fue procesado')
      );
    }

    // Verificar que el usuario pertenece a la misma familia
    if (canje.usuario.familiaId !== req.user.familiaId) {
      return res.status(403).json(
        errorResponse('No puedes procesar canjes de otra familia')
      );
    }

    // Usar transacción para asegurar consistencia
    const result = await prisma.$transaction(async (tx) => {
      // Actualizar el canje
      const canjeActualizado = await tx.canje.update({
        where: { id },
        data: {
          estado,
          aprobadoPor: req.user.id,
        },
        include: {
          recompensa: true,
          usuario: {
            select: {
              id: true,
              nombre: true,
              rol: true,
            },
          },
          usuarioAprobador: {
            select: {
              id: true,
              nombre: true,
              rol: true,
            },
          },
        },
      });

      if (estado === 'aprobado') {
        // Descontar puntos del usuario
        await tx.usuario.update({
          where: { id: canje.usuarioId },
          data: {
            puntos: {
              decrement: canje.recompensa.costoPuntos,
            },
          },
        });

        // Marcar recompensa como reclamada si es necesario
        await tx.recompensa.update({
          where: { id: canje.recompensaId },
          data: {
            estado: 'reclamada',
          },
        });
      }

      return canjeActualizado;
    });

    // Crear notificación para el usuario
    const tipoNotificacion = estado === 'aprobado' ? 'canje_aprobado' : 'canje_rechazado';
    const mensaje = estado === 'aprobado' 
      ? `Tu canje de "${canje.recompensa.nombre}" fue aprobado`
      : `Tu canje de "${canje.recompensa.nombre}" fue rechazado`;

    await prisma.notificacion.create({
      data: {
        usuarioId: canje.usuarioId,
        tipo: tipoNotificacion,
        mensaje,
      },
    });

    res.json(
      successResponse(
        result,
        `Canje ${estado} exitosamente`
      )
    );
  } catch (error) {
    console.error('Error al actualizar estado de canje:', error);
    res.status(500).json(
      errorResponse('Error interno del servidor')
    );
  }
};

// Actualizar recompensa (solo creador)
const updateReward = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, costoPuntos } = req.body;

    const recompensa = await prisma.recompensa.findUnique({
      where: { id },
    });

    if (!recompensa) {
      return res.status(404).json(
        errorResponse('Recompensa no encontrada')
      );
    }

    // Solo el creador puede actualizar
    if (recompensa.creadaPor !== req.user.id) {
      return res.status(403).json(
        errorResponse('Solo el creador puede actualizar la recompensa')
      );
    }

    // No se puede actualizar si ya fue reclamada
    if (recompensa.estado === 'reclamada') {
      return res.status(400).json(
        errorResponse('No se puede actualizar una recompensa ya reclamada')
      );
    }

    const updateData = {};
    if (nombre) updateData.nombre = nombre;
    if (descripcion !== undefined) updateData.descripcion = descripcion;
    if (costoPuntos) updateData.costoPuntos = costoPuntos;

    const recompensaActualizada = await prisma.recompensa.update({
      where: { id },
      data: updateData,
      include: {
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
        recompensaActualizada,
        'Recompensa actualizada exitosamente'
      )
    );
  } catch (error) {
    console.error('Error al actualizar recompensa:', error);
    res.status(500).json(
      errorResponse('Error interno del servidor')
    );
  }
};

// Eliminar recompensa (solo creador)
const deleteReward = async (req, res) => {
  try {
    const { id } = req.params;

    const recompensa = await prisma.recompensa.findUnique({
      where: { id },
      include: {
        canjes: true,
      },
    });

    if (!recompensa) {
      return res.status(404).json(
        errorResponse('Recompensa no encontrada')
      );
    }

    // Solo el creador puede eliminar
    if (recompensa.creadaPor !== req.user.id) {
      return res.status(403).json(
        errorResponse('Solo el creador puede eliminar la recompensa')
      );
    }

    // No se puede eliminar si tiene canjes
    if (recompensa.canjes.length > 0) {
      return res.status(400).json(
        errorResponse('No se puede eliminar una recompensa con canjes asociados')
      );
    }

    await prisma.recompensa.delete({
      where: { id },
    });

    res.json(
      successResponse(
        null,
        'Recompensa eliminada exitosamente'
      )
    );
  } catch (error) {
    console.error('Error al eliminar recompensa:', error);
    res.status(500).json(
      errorResponse('Error interno del servidor')
    );
  }
};

module.exports = {
  createReward,
  getRewards,
  getRewardById,
  requestExchange,
  getExchanges,
  updateExchangeStatus,
  updateReward,
  deleteReward,
}; 