const crypto = require('crypto');

// Generar código de invitación único para familias
const generateInvitationCode = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

// Formatear respuesta de error
const errorResponse = (message, statusCode = 400, details = null) => {
  const error = {
    success: false,
    message,
    statusCode,
  };
  
  if (details) {
    error.details = details;
  }
  
  return error;
};

// Formatear respuesta exitosa
const successResponse = (data, message = 'Operación exitosa') => {
  return {
    success: true,
    message,
    data,
  };
};

// Validar email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Limpiar datos de usuario (remover información sensible)
const sanitizeUser = (user) => {
  const { passwordHash, ...sanitizedUser } = user;
  return sanitizedUser;
};

// Paginar resultados
const paginate = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return {
    skip,
    take: limit,
  };
};

module.exports = {
  generateInvitationCode,
  errorResponse,
  successResponse,
  isValidEmail,
  sanitizeUser,
  paginate,
}; 