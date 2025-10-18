// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'name', 'email', 'role', 'phone', 'profile_image', 'avatar_url', 'created_at', 'updated_at']
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // ✅ CRITICAL FIX: Convert to plain object
    req.user = user.get({ plain: true });
    
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin only.'
    });
  }
};

exports.authenticateToken = exports.protect;
exports.isAdmin = exports.admin;

module.exports = exports.protect;
module.exports.protect = exports.protect;
module.exports.admin = exports.admin;
module.exports.authenticateToken = exports.protect;
module.exports.isAdmin = exports.admin;