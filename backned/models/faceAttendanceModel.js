const mongoose = require("mongoose");

const faceAttendanceSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const FaceAttendance = mongoose.model("FaceAttendance", faceAttendanceSchema);

module.exports = FaceAttendance;

