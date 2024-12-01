const express = require("express");
const router = express.Router();
const assignmentController = require("../controller/assignmentController");
 
router.get("/", assignmentController.getAssignments);

 
router.post("/", assignmentController.createAssignment);

 
router.delete("/:id", assignmentController.deleteAssignment);

module.exports = router;

