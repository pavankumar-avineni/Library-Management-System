const { errorResponse } = require('../utils/response');

exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(res, 'Forbidden: Access Denied', 403);
    }
    next();
  };
};
