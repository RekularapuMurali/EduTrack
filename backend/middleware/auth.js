const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT + attach req.user
exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized — no token provided' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: err.name === 'TokenExpiredError' ? 'Token expired — please log in again' : 'Invalid token',
      });
    }

    const user = await User.findById(decoded.id);
    if (!user)         return res.status(401).json({ success: false, message: 'User no longer exists' });
    if (!user.isActive)return res.status(403).json({ success: false, message: 'Account deactivated' });

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error in auth middleware' });
  }
};

// Check role — must come after protect
exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({
      success: false,
      message: `Role '${req.user?.role}' is not authorized. Required: ${roles.join(' or ')}`,
    });
  }
  next();
};