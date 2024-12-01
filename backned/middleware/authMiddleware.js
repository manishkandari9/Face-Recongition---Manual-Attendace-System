const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user || user.token !== token) {
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }

    req.user = user; // Attach the user to the request object
    next();
  } catch (error) {
    console.error('Error in auth middleware:', error);
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;
