 
const mongoose = require('mongoose');

 
const attendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  teacherName: { type: String, required: true },
  subjectName: { type: String, required: true },
  students: [
    {
      id: String,
      name: String,
      rollNumber: String,
      status: { type: String, enum: ['present', 'absent'], required: true },
    },
  ],
});

 
const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
