const Assignment = require("../models/Assignment");
const { body, validationResult } = require('express-validator');

 
exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching assignments", error });
  }
};

 
exports.createAssignment = [
  // Validate and sanitize input fields
  body('subject').notEmpty().withMessage('Subject is required'),
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),

  async (req, res) => {
   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { subject, title, description, dueDate, pdfFile } = req.body;
    const newAssignment = new Assignment({ subject, title, description, dueDate, pdfFile });

    try {
      const savedAssignment = await newAssignment.save();
      res.status(201).json(savedAssignment);  
    } catch (error) {
      res.status(500).json({ message: "Error creating assignment", error });
    }
  }
];
 
exports.deleteAssignment = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAssignment = await Assignment.findOneAndDelete({ id });  
    if (!deletedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.status(200).json({ message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting assignment", error });
  }
};
