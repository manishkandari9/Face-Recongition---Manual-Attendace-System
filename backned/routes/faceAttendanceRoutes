const express = require("express");
const router = express.Router();
const faceAttendanceController = require("../controllers/faceAttendanceController");

router.post("/mark", faceAttendanceController.markAttendance);
router.get("/records", faceAttendanceController.getAttendanceRecords);

module.exports = router;
