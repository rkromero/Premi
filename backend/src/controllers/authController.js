const { hashPassword, comparePassword, validatePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');
const { errorResponse, successResponse, isValidEmail, sanitizeUser } = require('../utils/helpers');
const prisma = require('../config/database');

// Registro de usuario
const register = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Validaciones
    if (!nombre || !email || !password || !rol) {
      return res.status(400).json(
        errorResponse('Todos los campos son requeridos')
      );
    }

    if (!isValidEmail(email)) {
      return res.status(400).json(
        errorResponse('Email inválido')
      );
    }

    validatePassword(password);

    if (!['padre', 'hijo'].includes(rol)) {
      return res.status(400).json(
        errorResponse('Rol inválido. Debe ser "padre" o "hijo"')
      );
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json(
        errorResponse('El email ya está registrado')
      );
    }

    // Hash de la contraseña
    const passwordHash = await hashPassword(password);

    // Crear usuario
    const user = await prisma.usuario.create({
      data: {
        nombre,
        email,
        passwordHash,
        rol,
      },
    });

    // Generar token
    const token = generateToken({ userId: user.id });

    res.status(201).json(
      successResponse(
        {
          user: sanitizeUser(user),
          token,
        },
        'Usuario registrado exitosamente'
      )
    );
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json(
      errorResponse('Error interno del servidor')
    );
  }
};

// Login de usuario
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json(
        errorResponse('Email y contraseña son requeridos')
      );
    }

    // Buscar usuario
    const user = await prisma.usuario.findUnique({
      where: { email },
      include: {
        familia: true,
      },
    });

    if (!user) {
      return res.status(401).json(
        errorResponse('Credenciales inválidas')
      );
    }

    // Verificar contraseña
    const isValidPassword = await comparePassword(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json(
        errorResponse('Credenciales inválidas')
      );
    }

    // Generar token
    const token = generateToken({ userId: user.id });

    res.json(
      successResponse(
        {
          user: sanitizeUser(user),
          token,
        },
        'Login exitoso'
      )
    );
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json(
      errorResponse('Error interno del servidor')
    );
  }
};

// Obtener perfil del usuario autenticado
const getProfile = async (req, res) => {
  try {
    const user = await prisma.usuario.findUnique({
      where: { id: req.user.id },
      include: {
        familia: true,
      },
    });

    res.json(
      successResponse(
        sanitizeUser(user),
        'Perfil obtenido exitosamente'
      )
    );
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json(
      errorResponse('Error interno del servidor')
    );
  }
};

module.exports = {
  register,
  login,
  getProfile,
}; 