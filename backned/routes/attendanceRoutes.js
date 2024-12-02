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

 
const moment = require('moment'); // Make sure to install moment for date handling

router.get('/fetch', async (req, res) => {
  const { date } = req.query;  

  if (!date) {
    return res.status(400).json({ message: 'Date parameter is required' });
  }

  try {
    // Use moment to handle date correctly and match the whole day range
    const startDate = moment(date).startOf('day').toDate();
    const endDate = moment(date).endOf('day').toDate();

    // Query to fetch attendance data for the given date range
    const attendanceData = await Attendance.find({
      date: {
        $gte: startDate, // greater than or equal to the start of the day
        $lte: endDate,   // less than or equal to the end of the day
      },
    });

    // Return the data in JSON format
    res.status(200).json(attendanceData);
  } catch (error) {
    // Return error response with details
    res.status(500).json({ message: 'Error fetching attendance data', error: error.message });
  }
});

module.exports = router;
