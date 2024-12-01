const express = require('express');
const { signin, signup } = require('../controller/authController');
const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.post('/logout', logout); 

module.exports = router;
