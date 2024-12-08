const { FaceStudent } = require('../models/faceStudentModel'); 
const { FaceAttendance } = require('../models/faceAttendanceModel'); 
const faceapi = require('face-api.js');


exports.markAttendance = async (req, res) => {
  try {
    const { faceDescriptor } = req.body;

    // faceDescriptor की जांच करें
    if (!faceDescriptor || !Array.isArray(faceDescriptor)) {
      return res.status(400).json({ message: "Valid face descriptor is required." });
    }

    // सभी छात्रों को डेटाबेस से प्राप्त करें
    const students = await FaceStudent.find();
    if (!students || students.length === 0) {
      return res.status(404).json({ message: "No students found in the database." });
    }

    let matchedStudent = null;

    // चेहरे की समानता का परीक्षण करें
    for (const student of students) {
      // यह जांचें कि दोनों faceDescriptors की लंबाई समान है
      if (faceDescriptor.length !== student.faceDescriptor.length) {
        console.error("Face descriptor length mismatch:", faceDescriptor.length, student.faceDescriptor.length);
        continue;  
      }

      
      const distance = faceapi.euclideanDistance(faceDescriptor, student.faceDescriptor);
      
      // Check if the distance is within the threshold for a match
      if (distance < 0.6) {  // Threshold for matching (आप इसे अपनी आवश्यकता अनुसार बदल सकते हैं)
        matchedStudent = student;
        break;  // Break once a match is found
      }
    }

    // अगर कोई मेल नहीं खाता तो 404 (Not Found) Error भेजें
    if (!matchedStudent) {
      return res.status(404).json({ message: "No matching student found." });
    }

    // Attendance mark करें
    const attendance = new FaceAttendance({
      studentId: matchedStudent.studentId,
      date: new Date(),  // आप यहाँ पर तारीख भी जोड़ सकते हैं
    });

    // Save attendance record
    await attendance.save();

    // Success response भेजें
    res.status(200).json({
      success: true,
      message: "Attendance marked successfully!",
      student: matchedStudent,
    });

  } catch (error) {
    console.error("Error during attendance marking:", error);
    res.status(500).json({ error: "An error occurred while marking attendance." });
  }
};

// GET रूट के लिए function
exports.getAttendanceRecords = async (req, res) => {
  try {
    const records = await FaceAttendance.find();  // उपस्थिति रिकॉर्ड प्राप्त करें
    if (!records || records.length === 0) {
      return res.status(404).json({ message: "No attendance records found." });
    }
    res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    res.status(500).json({ error: error.message });
  }
};
