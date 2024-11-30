const express = require('express');
const router = express.Router();
const studentController = require('../controller/studentController');


 
router.post('/students', studentController.createStudent);

 
router.get('/students', studentController.getAllStudents);

 
router.delete('/students/:rollNumber', studentController.deleteStudent);

module.exports = router;
