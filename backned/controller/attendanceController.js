 
const Attendance = require('../models/Attendance');

const addAttendance = async (req, res) => {
  const { date, year, students } = req.body;

  const attendance = new Attendance({
    date,
    year,
    students,
  });

  try {
    const savedAttendance = await attendance.save();
    res.status(201).json(savedAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { addAttendance };
