const jwt = require('jsonwebtoken');
const ApiError = require('../api-error');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, "Không tìm thấy token xác thực"));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = decoded;
    return next();
  } catch (error) {
    console.error("Token verification error:", error);
    return next(new ApiError(401, "Token không hợp lệ hoặc đã hết hạn"));
  }
};
