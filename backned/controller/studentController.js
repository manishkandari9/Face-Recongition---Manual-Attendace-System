const TotalStudent = require('../models/TotalStudent');

// Controller to create a new student
exports.createStudent = async (req, res) => {
  const { name, rollNumber } = req.body;

  if (!name || !rollNumber) {
    return res.status(400).json({ message: 'Name and roll number are required.' });
  }

  try {
    const existingStudent = await TotalStudent.findOne({ rollNumber });
    if (existingStudent) {
      return res.status(400).json({ message: 'Roll number already exists.' });
    }

    const newStudent = new TotalStudent({ name, rollNumber });
    const savedStudent = await newStudent.save();

    res.status(201).json(savedStudent);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ message: 'Failed to create student', error: error.message });
  }
};

// Controller to get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await TotalStudent.find();
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
};

// Controller to delete a student by roll number
exports.deleteStudent = async (req, res) => {
  const { rollNumber } = req.params;

  try {
    const deletedStudent = await TotalStudent.findOneAndDelete({ rollNumber });

    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Failed to delete student', error: error.message });
  }
};
