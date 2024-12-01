const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Import the User model

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];  // Extract token from Authorization header

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(403).json({ message: 'User not found.' });
    }

    req.user = user;  // Attach the user to the request object for further use

    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Error in auth middleware:', error);

    // Handle expired or invalid token
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please log in again.' });
    }

    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;
