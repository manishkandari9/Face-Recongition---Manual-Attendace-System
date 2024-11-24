

import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentDashboard = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch attendance records from the backend
    const fetchAttendanceRecords = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/attendance/records");
        setAttendanceRecords(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching attendance records", error);
      }
    };

    fetchAttendanceRecords();
  }, []);

  return (
    <div>
      <h2>Attendance Records</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {attendanceRecords.map((record, index) => (
            <li key={index}>
              {record.name} ({record.studentId}) - {new Date(record.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentDashboard;