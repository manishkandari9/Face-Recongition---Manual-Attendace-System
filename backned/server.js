const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const assignmentRoutes = require("./routes/assignmentRoutes");
const studentRoutes = require('./routes/studentRoutes');
const path = require('path');
const cors = require('cors'); // Import the CORS middleware
require('dotenv').config();

const app = express();

// Connect to the database
connectDB();



// Frontend URLs (development + production)
const allowedOrigins = [
    'http://localhost:3000', // Local development URL
    'https://your-vercel-project-name.vercel.app' // Vercel production URL
];

app.use(cors({
    origin: function (origin, callback) {
        // Agar origin allowed URLs me se hai to allow karo
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('CORS not allowed'), false);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // Agar cookies ya sessions use ho rahe hain
}));


app.use(express.json({ limit: "50mb" })); 

// Add routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use("/api", studentRoutes);

app.get('/api/data', (req, res) => {
    res.json({ message: "API is working" });
});

// Serve frontend build files
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Handle React Router's routes (Fallback to index.html)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
