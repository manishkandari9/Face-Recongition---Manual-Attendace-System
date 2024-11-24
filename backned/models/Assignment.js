const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");  

const assignmentSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 }, 
  subject: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  pdfFile: { type: String },  
});

 
module.exports = mongoose.model("Assignment", assignmentSchema);
