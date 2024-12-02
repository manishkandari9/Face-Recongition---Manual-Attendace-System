const express = require('express');
const router = express.Router();
const studentController = require('../controller/studentController');

// Route for creating a new student
router.post('/students', studentController.createStudent);

// Route for fetching all students
router.get('/students', studentController.getAllStudents);

// Route for deleting a student by roll number
router.delete('/students/:rollNumber', studentController.deleteStudent);

module.exports = router;
