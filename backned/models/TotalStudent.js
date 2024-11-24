const mongoose = require('mongoose');

const totalStudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true,  
  },
});

 
const TotalStudent = mongoose.model('TotalStudent', totalStudentSchema);

module.exports = TotalStudent;
