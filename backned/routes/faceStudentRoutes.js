const express = require("express");
const router = express.Router();
const faceStudentController = require("../controllers/faceStudentController");

router.post("/register", faceStudentController.registerStudent);
router.get("/students", faceStudentController.getStudents);

module.exports = router;
