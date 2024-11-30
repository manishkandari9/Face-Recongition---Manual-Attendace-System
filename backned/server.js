const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const assignmentRoutes = require("./routes/assignmentRoutes");
const studentRoutes = require('./routes/studentRoutes');

// const faceStudentRoutes = require("./routes/faceStudentRoutes");
// const faceAttendanceRoutes = require("./routes/faceAttendanceRoutes");
const cors = require('cors'); // Import the CORS middleware
require('dotenv').config();

const app = express();

// Connect to the database
connectDB();


app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true 
}));

app.use(express.json({ limit: "50mb" })); 

// Add routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use("/api", studentRoutes);


// app.use("/api/students", faceStudentRoutes);
// app.use("/api/attendance", faceAttendanceRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
