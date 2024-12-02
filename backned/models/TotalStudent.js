const mongoose = require('mongoose');

// Schema definition for TotalStudent
const totalStudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,  // Ensure unique names
    trim: true,    // Remove any leading/trailing spaces
    lowercase: true,  // Optionally store names in lowercase for case-insensitivity
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true,  // Ensure unique roll numbers
    trim: true,    // Remove any leading/trailing spaces
  },
}, {
  timestamps: true,  // Add createdAt and updatedAt fields
});

// Create an index on rollNumber to optimize search and queries by roll number
totalStudentSchema.index({ rollNumber: 1 });

const TotalStudent = mongoose.model('TotalStudent', totalStudentSchema);

module.exports = TotalStudent;
