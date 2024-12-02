const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const assignmentRoutes = require("./routes/assignmentRoutes");
const studentRoutes = require('./routes/studentRoutes');
const path = require('path');
const cors = require('cors'); // Import the CORS middleware
require('dotenv').config();
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());

// Connect to the database
connectDB();
app.use(cors());


//.................... code for deployment.................

if(process.env.NODE_ENV === "production"){
    const dirPath = path.resolve();
    
    app.use(express.static("./frontend/dist"));
    app.get("*",(req,res) =>{
      res.sendFile(path.resolve(dirPath, "./frontend/dist", "index.html"));
    })
  }

app.use(express.json({ limit: "50mb" })); 

// Add routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use("/api", studentRoutes);





// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
