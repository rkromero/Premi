const { errorResponse, successResponse, generateInvitationCode } = require('../utils/helpers');
const prisma = require('../config/database');

// Crear nueva familia
const createFamily = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json(
        errorResponse('El nombre de la familia es requerido')
      );
    }

    // Verificar que el usuario no pertenezca ya a una familia
    if (req.user.familiaId) {
      return res.status(400).json(
        errorResponse('Ya perteneces a una familia')
      );
    }

    // Generar código de invitación único
    let codigoInvitacion;
    let isUnique = false;
    
    while (!isUnique) {
      codigoInvitacion = generateInvitationCode();
      const existingFamily = await prisma.familia.findUnique({
        where: { codigoInvitacion }
      });
      if (!existingFamily) {
        isUnique = true;
      }
    }

    // Crear familia
    const familia = await prisma.familia.create({
      data: {
        nombre,
        codigoInvitacion,
      },
    });

    // Asociar usuario a la familia
    await prisma.usuario.update({
      where: { id: req.user.id },
      data: { familiaId: familia.id },
    });

    res.status(201).json(
      successResponse(
        familia,
        'Familia creada exitosamente'
      )
    );
  } catch (error) {
    console.error('Error al crear familia:', error);
    res.status(500).json(
      errorResponse('Error interno del servidor')
    );
  }
};

// Unirse a una familia por código de invitación
const joinFamily = async (req, res) => {
  try {
    const { codigoInvitacion } = req.body;

    if (!codigoInvitacion) {
      return res.status(400).json(
        errorResponse('El código de invitación es requerido')
      );
    }

    // Verificar que el usuario no pertenezca ya a una familia
    if (req.user.familiaId) {
      return res.status(400).json(
        errorResponse('Ya perteneces a una familia')
      );
    }

    // Buscar familia por código
    const familia = await prisma.familia.findUnique({
      where: { codigoInvitacion: codigoInvitacion.toUpperCase() },
      include: {
        usuarios: {
          select: {
            id: true,
            nombre: true,
            rol: true,
          },
        },
      },
    });

    if (!familia) {
      return res.status(404).json(
        errorResponse('Código de invitación inválido')
      );
    }

    // Asociar usuario a la familia
    await prisma.usuario.update({
      where: { id: req.user.id },
      data: { familiaId: familia.id },
    });

    res.json(
      successResponse(
        familia,
        'Te has unido a la familia exitosamente'
      )
    );
  } catch (error) {
    console.error('Error al unirse a familia:', error);
    res.status(500).json(
      errorResponse('Error interno del servidor')
    );
  }
};

// Obtener información de la familia del usuario
const getMyFamily = async (req, res) => {
  try {
    if (!req.user.familiaId) {
      return res.status(404).json(
        errorResponse('No perteneces a ninguna familia')
      );
    }

    const familia = await prisma.familia.findUnique({
      where: { id: req.user.familiaId },
      include: {
        usuarios: {
          select: {
            id: true,
            nombre: true,
            rol: true,
            puntos: true,
            avatarUrl: true,
            createdAt: true,
          },
        },
      },
    });

    res.json(
      successResponse(
        familia,
        'Información de familia obtenida exitosamente'
      )
    );
  } catch (error) {
    console.error('Error al obtener familia:', error);
    res.status(500).json(
      errorResponse('Error interno del servidor')
    );
  }
};

// Salir de la familia
const leaveFamily = async (req, res) => {
  try {
    if (!req.user.familiaId) {
      return res.status(400).json(
        errorResponse('No perteneces a ninguna familia')
      );
    }

    // Desasociar usuario de la familia
    await prisma.usuario.update({
      where: { id: req.user.id },
      data: { familiaId: null },
    });

    res.json(
      successResponse(
        null,
        'Has salido de la familia exitosamente'
      )
    );
  } catch (error) {
    console.error('Error al salir de familia:', error);
    res.status(500).json(
      errorResponse('Error interno del servidor')
    );
  }
};

module.exports = {
  createFamily,
  joinFamily,
  getMyFamily,
  leaveFamily,
}; 