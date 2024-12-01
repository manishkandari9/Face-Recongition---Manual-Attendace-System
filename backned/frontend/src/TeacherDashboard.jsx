import React, { useState,  useEffect } from 'react';
import axios from 'axios';
import api from './services/api';
import { CheckCircleIcon, AcademicCapIcon } from '@heroicons/react/outline';

// Student component
const Student = ({ id, name, rollNumber, status, onStatusChange }) => {
  const getStatusStyle = (status) => {
    if (status === 'present') {
      return { backgroundColor: '#4CAF50', color: 'white' }; // Green for Present
    }
    if (status === 'absent') {
      return { backgroundColor: '#F44336', color: 'white' }; // Red for Absent
    }
    return { backgroundColor: '#E0E0E0', color: 'black' }; // Gray for unselected
  };

  return (
    <div className="flex items-center justify-between bg-gray-800 p-2 rounded-md shadow-md">
      <div className="flex items-center">
    <span className="text-sm font-medium text-white mr-20">{rollNumber}</span>
    <span className="text-base font-medium text-white capitalize">{name}</span>
  </div>
      <div className="flex items-center space-x-6">
        {/* Present Box */}
        <div
          onClick={() => onStatusChange(rollNumber, 'present')}
          className="attendance-box"
          style={getStatusStyle(status === 'present' ? 'present' : 'unselected')}
        >
          Present
        </div>

        {/* Absent Box */}
        <div
          onClick={() => onStatusChange(rollNumber, 'absent')}
          className="attendance-box"
          style={getStatusStyle(status === 'absent' ? 'absent' : 'unselected')}
        >
          Absent
        </div>
      </div>

      <style jsx>{`
        .attendance-box {
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          text-align: center;
          transition: all 0.3s ease;
          width: 100px;
          font-weight: bold;
        }

        .attendance-box:hover {
          opacity: 0.9;
          transform: translateY(-5px);
        }

        .attendance-box:active {
          transform: translateY(5px);
        }
      `}</style>
    </div>
  );
};

// Card component
const Card = ({ title, value, icon: Icon, color }) => (
  <div className={`border-2 border-${color}-500 bg-gray-900 text-white rounded-lg shadow-lg p-4 transition duration-300 transform hover:scale-105 hover:bg-${color}-600`}>
    <div className="flex items-center justify-between pb-2">
      <h3 className="text-sm font-semibold">{title}</h3>
      {title.includes("Absent") ? (
        <Icon className="h-6 w-6" style={{ color: '#FF0000' }} /> // Red for Absent
      ) : title.includes("Total Present") ? (
        <Icon className="h-6 w-6" style={{ color: '#00FF00' }} /> // Neon green for Present
      ) : (
        <Icon className="h-6 w-6 text-neon-yellow" /> // Neon yellow for AcademicCapIcon
      )}
    </div>
    <div className="text-3xl font-bold">{value}</div>
  </div>
);


const TeacherDashboard = () => {
  const [date, setDate] = useState(new Date());
  const [teacherName, setTeacherName] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [thirdYearStudents, setThirdYearStudents] = useState([]);
  const [newStudentName, setNewStudentName] = useState('');
  const [newRollNumber, setNewRollNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [totalPresent, setTotalPresent] = useState(0);  // To store the total present students
  const [totalAbsent, setTotalAbsent] = useState(0); 
  const [fetchDate, setFetchDate] = useState('');
  const [isAttendanceVisible, setIsAttendanceVisible] = useState(false);    // To store the total absent students
  // const [isTakingAttendance, setIsTakingAttendance] = useState(false);



   const fetchStudents = async () => {
  try {
    // Make the GET request to the API
    const response = await axios.get('http://localhost:3000/api/students');
    
    // Check if the response data is an array (to avoid errors when calling .filter or other array methods)
    if (Array.isArray(response.data)) {
      setThirdYearStudents(response.data); // Set the students data
    } else {
      console.error("Unexpected data format:", response.data);
      setErrorMessage("Unexpected response format. Please try again.");
    }
  } catch (error) {
    // Handle errors (network errors, etc.)
    console.error("Error fetching students:", error);
    setErrorMessage("Failed to fetch students. Please try again.");
  }
};


    const addNewStudent = async () => {
      // Check karo ki student ka name aur roll number diya gaya hai ya nahi
      if (!newStudentName || !newRollNumber) return;
    
      // Roll number ke duplicate check karo
      const isDuplicateRollNumber = thirdYearStudents.some(
        student => student.rollNumber === parseInt(newRollNumber, 10)
      );
    
      if (isDuplicateRollNumber) {
        setErrorMessage(`Roll number ${newRollNumber} already exists.`);
        return;
      }
      try {
        const newStudent = {
          name: newStudentName,
          rollNumber: parseInt(newRollNumber, 10),
        };
        console.log("Sending data:", newStudent);
    
        const response = await axios.post('http://localhost:3000/api/students', newStudent);
    
        if (response.data) {
          console.log('Response from API:', response.data);
          setThirdYearStudents([...thirdYearStudents, response.data]);
          setNewStudentName('');
          setNewRollNumber('');
          setSuccessMessage('Student added successfully!');
          setTimeout(() => setSuccessMessage(''), 3000); 
        }
      } catch (error) {
        console.error("Error adding student:", error);
        setErrorMessage('Failed to add student. Please try again.');
      }
    };
  // Handle status changes for students
  const handleStudentStatus = (rollNumber, status) => {
    setThirdYearStudents((students) =>
      students.map((student) =>
        student.rollNumber === rollNumber ? { ...student, status } : student
      )
    );
  };
  // State for attendance reports
  const [attendanceReports, setAttendanceReports] = useState([]);
  const [reportType, setReportType] = useState('daily'); // New state for report type

  const handleManualAttendance = async (e) => {
    e.preventDefault();
    const attendanceData = {
      date: date.toISOString().split('T')[0],
      teacherName,
      subjectName,
      students: thirdYearStudents,
    };
    await sendAttendanceData(attendanceData);
  };

  const removeStudent = (studentId) => {
    const updatedStudents = thirdYearStudents.filter(student => student.id !== studentId);
    setThirdYearStudents(updatedStudents);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  console.log(Array.isArray(thirdYearStudents));
  const totalAbsentStudents = thirdYearStudents.filter(student => student.status === 'absent').length;
  
  const totalStudents = thirdYearStudents.length;
  const totalPresentStudents = thirdYearStudents.filter(student => student.status === 'present').length;
  const absentPercentage = totalStudents > 0 ? (totalAbsentStudents / totalStudents * 100).toFixed(2) : 0;
  const presentPercentage = totalStudents > 0 ? (totalPresentStudents / totalStudents * 100).toFixed(2) : 0;


  const sendAttendanceData = async (attendanceData) => {
    try {
      const response = await api.post('http://localhost:3000/api/attendance', attendanceData);
      console.log("Attendance data sent successfully:", response.data);

      setSuccessMessage('Attendance submitted successfully!');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error("Error sending attendance data:", error);
      setErrorMessage('Failed to submit attendance. Please try again.');
    }
  };
   // Fetch attendance data

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await api.get(`http://localhost:3000/api/attendance`, {
          params: { date: date.toISOString().split('T')[0] },
        });
        const data = response.data;
        if (data && data.students) {
          setThirdYearStudents(data.students);
          localStorage.setItem('students', JSON.stringify(data.students));
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };
    fetchAttendanceData();
  }, [date]);

  // New function to fetch attendance reports
  const fetchAttendanceReports = async () => {``
    try {
      const response = await axios.get(`/api/attendance/fetch`, {
        params: { date: fetchDate, reportType },
      });
      setAttendanceReports(response.data);
      calculateAttendance(response.data);  
      setFetchDate(''); // Clear the fetch date after fetching
    } catch (error) {
      console.error("Error fetching attendance reports:", error);
      setErrorMessage('Failed to fetch attendance reports. Please try again.');
    }
  };
  
  const calculateAttendance = (data) => {
    if (data.length > 0) {
      const students = data[0].students; // Access the students array from the first report

      let presentCount = 0;
      let absentCount = 0;

      // Iterate through students to count present and absent
      students.forEach(student => {
        if (student.status === 'present') {
          presentCount++; // Increment present count
        } else {
          absentCount++; // Increment absent count
        }
      });

      // Update the total present and absent counts in state
      setTotalPresent(presentCount);
      setTotalAbsent(absentCount);
    } else {
      console.log("No attendance data available.");
    }
  };

  
// Fetch attendance reports on mount and when the date changes

  return (
    <div className="container mx-auto p-6 bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-neon-blue">Teacher Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card title="Total Students" value={totalStudents} icon={AcademicCapIcon} color="neon-blue" />
        <Card 
        title="Total Present" 
        value={totalPresent} 
        icon={CheckCircleIcon} 
        color="#00ff00"  // Green color for present students
      />

      <Card 
        title="Total Absent" 
        value={totalAbsent} 
        icon={CheckCircleIcon} 
        color="neon-red"  // Custom color for absent students
      />
        <Card title="Absent Percentage" value={`${absentPercentage} %`} icon={CheckCircleIcon} color="'#9900ff" />
        <Card title="Present Percentage" value={`${presentPercentage} %`} icon={CheckCircleIcon} color="neon-purple" />
      </div>

      {/* Flexbox Container for Add New Student and Attendance Form */}
      <div className="flex flex-col md:flex-row justify-between space-x-8 mb-8">
        {/* Add New Student Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex-1 mb-4 md:mb-0">
          <h2 className="text-xl font-semibold mb-6 text-white">Add New Student</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-400">Name</label>
              <input
                type="text"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-400">Roll Number</label>
              <input
                type="text"
                value={newRollNumber}
                onChange={(e) => setNewRollNumber(e.target.value)}
                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
              />
            </div>
            <button
              onClick={addNewStudent}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Add Student
            </button>
            {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
            {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
          </div>
        </div>

        {/* Attendance Form Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex-1">
          <h2 className="text-xl font-semibold mb-6 text-white">Take Attendance</h2>
          <button
  type="button"
  onClick={() => setIsAttendanceVisible(!isAttendanceVisible)}
  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 mb-4"
>
  {isAttendanceVisible ? 'Hide Students' : 'Show Students'}
</button>
          <form onSubmit={handleManualAttendance}>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-400">Select Date</label>
                <input
                  type="date"
                  value={date.toISOString().split('T')[0]}
                  onChange={(e) => setDate(new Date(e.target.value))}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-400">Teacher Name</label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-400">Subject Name</label>
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                />
              </div>
              {isAttendanceVisible && thirdYearStudents.map(student => (
                <Student
                  key={student.id}
                  id={student.id}
                  name={student.name}
                  rollNumber={student.rollNumber}
                  status={student.status}
                  onStatusChange={handleStudentStatus}
                  onRemove={removeStudent}
                />
              ))}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Submit Attendance
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Fetch Attendance Reports Section */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex-1">
        <h2 className="text-xl font-semibold mb-6 text-white">Fetch Attendance Reports</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-400">Fetch Attendance Report Date</label>
            <input
              type="date"
              value={fetchDate}
              onChange={(e) => setFetchDate(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
            />
          </div>
          {/* Report Type Selection */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-400">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <button
            type="button"
            onClick={fetchAttendanceReports}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Fetch Reports
          </button>
          {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
          
          {/* Display Attendance Reports */}
          <AttendanceReportTable reports={attendanceReports} fetchDate={fetchDate} teacherName={teacherName} subjectName={subjectName} />
        </div>
      </div>
    </div>
  );
};

// Attendance Report Table Component
const AttendanceReportTable = ({ reports, fetchDate, teacherName, subjectName }) => {
  if (reports.length === 0) {
    return <p className="text-white">No reports available.</p>;
  }

  return (
    <div className="bg-gray-700 p-4 rounded-lg mt-4">
      {/* Displaying the header information above the table */}
      <div className="flex space-x-4 mb-4 text-white">
        <div>
          <strong>Date:</strong> <span className="font-semibold">{new Date(fetchDate).toLocaleDateString()}</span>
        </div>
        <div>
          <strong>Teacher:</strong> <span className="font-semibold">{teacherName}</span>
        </div>
        <div>
          <strong>Subject:</strong> <span className="font-semibold">{subjectName}</span>
        </div>
      </div>
      <table className="min-w-full bg-gray-800 text-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Roll Numbers</th>
            <th className="py-2 px-4 border-b">Names</th>
            <th className="py-2 px-4 border-b">Status</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report, index) => (
            <tr key={index} className="hover:bg-gray-700">
              <td className="py-2 px-4 border-b">
                <ul className="list-none">
                  {report.students.map((student, idx) => (
                    <li key={idx} className="text-center">{student.rollNumber}</li>
                  ))}
                </ul>
              </td>
              <td className="py-2 px-4 border-b">
                <ul className="list-none">
                  {report.students.map((student) => (
                    <li key={student.id} className="text-center">{student.name}</li>
                  ))}
                </ul>
              </td>
              <td className="py-2 px-4 border-b">
                <ul className="list-none">
                  {report.students.map((student) => (
                    <li key={student.id} className="text-center">
                      <span className={`font-bold ${student.status === 'absent' ? 'text-red-500' : 'text-green-500'}`}>
                        {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                      </span>
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default TeacherDashboard;
