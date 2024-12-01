const express = require('express');
const { signin, signup, logout, allUsers, protectedRoute} = require('../controller/authController'); // Import `allUsers` handler

const router = express.Router();

// Route to handle user signup
router.post('/signup', signup);

// Route to handle user signin
router.post('/signin', signin);

// Route to handle user logout (clear the JWT cookie)
router.post('/logout', logout);

// Protected route to retrieve all users
router.get('/allUsers', allUsers);

// Protected Route
router.get('/protected', protectedRoute);

module.exports = router;
