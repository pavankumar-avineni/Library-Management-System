const { errorResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Prisma Unique Constraint Error
  if (err.code === 'P2002') {
    return errorResponse(res, 'Duplicate field value', 400);
  }

  // Prisma Record Not Found
  if (err.code === 'P2025') {
    return errorResponse(res, 'Record not found', 404);
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid Token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token Expired', 401);
  }

  return errorResponse(res, err.message || 'Internal Server Error', 500);
};

module.exports = errorHandler;
