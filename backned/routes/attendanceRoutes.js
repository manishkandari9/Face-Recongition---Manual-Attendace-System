const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

 
router.post('/', async (req, res) => {
  const { date, teacherName, subjectName, students } = req.body;

  try {
    const attendance = new Attendance({ date, teacherName, subjectName, students });
    await attendance.save();
    res.status(201).json({ message: 'Attendance data saved successfully!', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Error saving attendance data', error });
  }
});

 
router.get('/fetch', async (req, res) => {
  const { date } = req.query;  

  try {
    const attendanceData = await Attendance.find({ date: new Date(date) });
    res.status(200).json(attendanceData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance data', error });
  }
});

module.exports = router;
