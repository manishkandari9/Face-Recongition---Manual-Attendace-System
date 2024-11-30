const express = require('express');
const { signup, signin } = require('../controller/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);

// Protected Route Example
router.get('/protected', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'Welcome to the protected route!', user: req.user });
});

module.exports = router;
