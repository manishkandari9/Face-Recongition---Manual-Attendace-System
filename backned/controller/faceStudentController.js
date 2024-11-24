const FaceStudent = require("../models/faceStudentModel");

// Student Registration
exports.registerStudent = async (req, res) => {
  try {
    const { studentId, name, faceDescriptor } = req.body;

    // Validate faceDescriptor
    if (!Array.isArray(faceDescriptor) || faceDescriptor.some((num) => typeof num !== "number")) {
      return res.status(400).json({ message: "faceDescriptor must be an array of numbers." });
    }

    const newStudent = new FaceStudent({ studentId, name, faceDescriptor });
    await newStudent.save();
    res.status(201).json({ message: "Student registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch all students
exports.getStudents = async (req, res) => {
  try {
    const students = await FaceStudent.find(); // Fetch all students from the database
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "An error occurred while fetching students." });
  }
};
