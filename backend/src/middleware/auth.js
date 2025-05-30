const { verifyToken, extractTokenFromHeader } = require('../utils/jwt');
const { errorResponse } = require('../utils/helpers');
const prisma = require('../config/database');

// Middleware de autenticación
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return res.status(401).json(
        errorResponse('Token de autenticación requerido', 401)
      );
    }
    
    const decoded = verifyToken(token);
    
    // Verificar que el usuario existe y está activo
    const user = await prisma.usuario.findUnique({
      where: { id: decoded.userId },
      include: {
        familia: true,
      },
    });
    
    if (!user) {
      return res.status(401).json(
        errorResponse('Usuario no encontrado', 401)
      );
    }
    
    // Agregar información del usuario al request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json(
      errorResponse('Token inválido', 401)
    );
  }
};

// Middleware de autorización por rol
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(
        errorResponse('Acceso no autorizado', 401)
      );
    }
    
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json(
        errorResponse('Permisos insuficientes', 403)
      );
    }
    
    next();
  };
};

// Middleware para verificar que pertenece a la misma familia
const sameFamily = async (req, res, next) => {
  try {
    if (!req.user || !req.user.familiaId) {
      return res.status(403).json(
        errorResponse('Usuario debe pertenecer a una familia', 403)
      );
    }
    
    // Si se está accediendo a recursos de otro usuario, verificar que sea de la misma familia
    const targetUserId = req.params.userId || req.body.usuarioId || req.query.usuarioId;
    
    if (targetUserId && targetUserId !== req.user.id) {
      const targetUser = await prisma.usuario.findUnique({
        where: { id: targetUserId },
        select: { familiaId: true }
      });
      
      if (!targetUser || targetUser.familiaId !== req.user.familiaId) {
        return res.status(403).json(
          errorResponse('Acceso denegado: usuarios de diferentes familias', 403)
        );
      }
    }
    
    next();
  } catch (error) {
    return res.status(500).json(
      errorResponse('Error interno del servidor', 500)
    );
  }
};

module.exports = {
  authenticate,
  authorize,
  sameFamily,
}; 