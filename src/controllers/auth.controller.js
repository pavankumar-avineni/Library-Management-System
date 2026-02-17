const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return errorResponse(res, 'Email already exists', 400);
    }

    const roleData = await prisma.role.findUnique({
      where: { name: role },
    });

    if (!roleData) {
      return errorResponse(res, 'Invalid role', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId: roleData.id,
      },
      include: {
        role: true,
      },
    });

    return successResponse(res, 'User registered successfully', user, 201);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role.name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    return successResponse(res, 'Login successful', { token });
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
