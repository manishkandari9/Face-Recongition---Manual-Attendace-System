import React, { useState, useEffect } from 'react';
import {  Box,  Typography,  List,  ListItem,  ListItemIcon,  ListItemText,  Grid,  Paper,  InputBase,  IconButton,} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import ScannerIcon from '@mui/icons-material/Scanner';
import axios from 'axios';
import Logo from './facee.jpg';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import RefreshIcon from '@mui/icons-material/Refresh';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Cookies from 'js-cookie';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const attendanceData = [
  { day: 'Mon', thirdYear: 40 },
  { day: 'Tue', thirdYear: 40 },
  { day: 'Wed', thirdYear: 40 },
  { day: 'Thu', thirdYear: 40 },
  { day: 'Fri', thirdYear: 40 },
  { day: 'Sat', thirdYear: 40 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleScanNowClick = () => {
    navigate('/scan');
  };

  const handleTeacherDashboardClick = () => {
    navigate("/TeacherDashboard");
  };

  const handleAssignmentManagerClick = () => {
    navigate("/AssignmentManager");
  };

  const handleStudentDashboardClick = () => {
    navigate("/StudentDashboard");
  };

  const handlerefreshiconClick = () => {
    navigate("/dashboard");
  };

  const handleLogoutClick = async () => {
    try {
      const userConfirmed = window.confirm('Are you sure you want to logout?');
  
      if (!userConfirmed) {
        return;
      }
  
      // Proceed with logout
      await axios.post('http://localhost:3000/api/auth/logout');
      Cookies.remove('token');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  

  // Data fetching and logic for attendance goes here
  const [topAttendees, setTopAttendees] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [totalPresent, setTotalPresent] = useState(0);  
  const [totalAbsent, setTotalAbsent] = useState(0);  
  const fetchDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchAttendanceReports = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/attendance/fetch', {
          params: { date: fetchDate, reportType: 'daily' },
        });

        console.log("API Response:", JSON.stringify(response.data, null, 2)); 
        calculateTopAttendees(response.data);  
      } catch (error) {
        console.error('Error fetching attendance reports:', error);
        if (error.response) {
          setErrorMessage(`Error: ${error.response.data.message || error.message}`);
        } else {
          setErrorMessage('Failed to fetch attendance reports. Please try again.');
        }
      }
    };

     const calculateTopAttendees = (data) => {
      if (data.length > 0) {
        const students = data[0].students;

        let presentCount = 0;
        let absentCount = 0;

        // Create a map to count presence for each student
        const presenceCountMap = {};
        students.forEach(student => {
          if (student.status === 'present') {
            presentCount++; // Increment present count
            presenceCountMap[student.name] = (presenceCountMap[student.name] || 0) + 1; // Increment count for the student
          } else {
            absentCount++; // Increment absent count
          }
        });

        // Update the total present and absent counts in state
        setTotalPresent(presentCount);
        setTotalAbsent(absentCount);

        // Convert the map to an array and sort by presence count
        const attendeesWithCounts = Object.entries(presenceCountMap).map(([name, count]) => ({
          name,
          presenceCount: count
        }));

        console.log("Attendees with Counts:", attendeesWithCounts); 

        // Sort the students based on presence count and take top 3
        const topStudents = attendeesWithCounts
          .sort((a, b) => b.presenceCount - a.presenceCount) 
          .slice(0, 3);

        console.log("Top Students:", topStudents);

        setTopAttendees(topStudents); // Update the top attendees state
      } else {
        console.log("No attendance data available.");
      }
    };

    fetchAttendanceReports();

    const intervalId = setInterval(fetchAttendanceReports, 20000); // Fetch every 20 seconds

    return () => clearInterval(intervalId); // Clear interval on unmount
  }, [fetchDate]);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#14151B', color: 'white' }}>
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Box sx={{ width: 700, backgroundColor: "#14151B", padding: 2, border: "1px solid #07f7ff", borderTop: '0', borderBottom: '0', borderLeft: '0' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <img src={Logo} alt="Logo" style={{ width: 40, height: 'auto', marginRight: "8px", borderRadius: "50%" }} />
              <Typography variant="h6" color="white" sx={{ display: 'inline', fontSize: "1rem" }}>Face Attendance</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid orange', borderRadius: 4, padding: 0.5 }}>
              <SearchIcon sx={{ color: 'white', mr: 1 }} />
              <InputBase
                placeholder="Search..."
                sx={{ color: '#00ff00', flex: 1, ml: 1 }}
              />
            </Box>
          </Box>
          <List>
            <ListItem button>
              <ListItemIcon>
                <DashboardIcon sx={{ color: '#07f7ff' }} />
              </ListItemIcon>
              <ListItemText primary="Home" />                        
            </ListItem>
            <Box sx={{ marginTop: 'auto' }}>
              <ListItem button onClick={handleLogoutClick}>
                <ListItemIcon>
                  <LogoutIcon sx={{ color: '#07f7ff', cursor: "pointer" }} />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </Box>
          </List>
        </Box>

        <Box sx={{ flexGrow: 1, padding: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, borderBottom: '1px solid #07f7ff', paddingBottom: 1 }}>
            <Typography variant="h2" sx={{ color: 'white', fontSize: "1.2rem" }}>
              {currentTime.toLocaleTimeString()} - {currentTime.toLocaleDateString()} - {currentTime.toLocaleDateString(undefined, { weekday: 'long' })}
            </Typography>
            <Box>
              <IconButton color="inherit">
                <DarkModeIcon />
              </IconButton>
              <IconButton color="inherit" onClick={handlerefreshiconClick}>
                <RefreshIcon />
              </IconButton>
              <IconButton color="inherit">
                <NotificationsIcon />
              </IconButton>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Paper
                sx={{
                  p: 4,
                  height: "5rem",
                  background: "linear-gradient(to right, #000000, #003440)",
                  border: "1px solid  #07f7ff",
                  borderRadius: 2,
                  cursor: 'pointer',
                  marginLeft: "1rem",
                  transition: 'all 0.3s ease',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.5)',
                  '&:hover': {
                    border: "2px solid #ff00ff",
                    borderColor: '#ff00ff',
                    boxShadow: '0px 10px 20px rgba(255, 0, 255, 0.5), 0px 4px 6px rgba(255, 0, 255, 0.3)'
                  }
                }}
                onClick={handleScanNowClick}
              >
                <Typography
                  variant="h6"
                  color="white"
                  align="center"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    '&:hover': {
                      color: '#00ff00',
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
                    },
                  }}
                >
                  <ScannerIcon sx={{ fontSize: 30, mr: 1 }} />
                  Scan Face
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={3}>
              <Paper
                sx={{
                  p: 4,
                  height: "5rem",
                  background: "linear-gradient(to right, #000000, #003440)",
                  border: "1px solid  #07f7ff",
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.5)',
                  '&:hover': {
                    borderColor: '#00ff00 ',
                    boxShadow: '0px 10px 20px rgba(0, 255, 0, 0.5), 0px 4px 6px rgba(0, 255, 0, 0.3)'
                  }
                }}
                onClick={handleTeacherDashboardClick}
              >
                <Typography
                  variant="h6"
                  color="white"
                  align="center"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    '&:hover': {
                      color: 'blue'
                    },
                    transition: 'color 0.3s ease'
                  }}
                >
                  Teacher Dashboard
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={3}>
              <Paper
                sx={{
                  p: 4,
                  height: "5rem",
                  background: "linear-gradient(to right, #000000, #003440)",
                  border: "1px solid  #07f7ff",
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.5)',
                  '&:hover': {
                    borderColor: '#00ff00 ',
                    boxShadow: '0px 10px 20px rgba(0, 255, 0, 0.5), 0px 4px 6px rgba(0, 255, 0, 0.3)'
                  }
                }}
                onClick={handleAssignmentManagerClick}
              >
                <Typography
                  variant="h6"
                  color="white"
                  align="center"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    '&:hover': {
                      color: 'blue'
                    },
                    transition: 'color 0.3s ease'
                  }}
                >
                  Assignment Manager
                </Typography>
              </Paper>
            </Grid>

            {/* Student Dashboard Button */}
            <Grid item xs={3}>
              <Paper
                sx={{
                  p: 4,
                  height: "5rem",
                  background: "linear-gradient(to right, #000000, #003440)",  
                  border: "1px solid  #07f7ff",
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.5)',
                  '&:hover': {
                    border: "2px solid #ff00ff",
                    borderColor: '#00ff00',
                    boxShadow: '0px 10px 20px rgba(0, 255, 0, 0.5), 0px 4px 6px rgba(0, 255, 0, 0.3)'
                  }
                }}
                onClick={handleStudentDashboardClick}
              >
                <Typography
                  variant="h6"
                  color="white"
                  align="center"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    '&:hover': {
                      color: 'blue'
                    },
                    transition: 'color 0.3s ease'
                  }}
                >
                  Student Dashboard
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={8.5} sx={{ ml: 1 }}>
              <Paper sx={{ padding: 2, backgroundColor: '#1e1e1e', color: "#07f7ff", border: "1px solid #07f7ff", borderRadius: "20px" }}>
                <Typography variant="h6" align="center">3rd Year Attendance</Typography>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" stroke="#07f7ff" />
                    <YAxis stroke="#07f7ff" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="thirdYear" stroke="#FF8042" name="3rd Year" />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={3.4}>
            <div className="space-y-2">
  <div className="bg-[#1e1e1e] p-3 rounded-lg border border-[#07f7ff] hover:border-red-500 transition-all duration-300 ease-in-out">
    <h4 className="text-lg font-semibold mb-2">Today's Attendance</h4>
    <p className="text-3xl font-bold text-[#00ff00]">{totalPresent + totalAbsent}</p>
  </div>
  <div className="bg-[#1e1e1e] p-3 rounded-lg border border-[#07f7ff] hover:border-red-500 transition-all duration-300 ease-in-out">
    <h4 className="text-lg font-semibold mb-2">Present Students</h4>
    <p className= "text-3xl font-bold text-[#00ff00]">{totalPresent}</p>
  </div>
  <div className="bg-[#1e1e1e] p-3 rounded-lg border border-[#07f7ff] hover:border-red-500 transition-all duration-300 ease-in-out">
    <h4 className="text-lg font-semibold mb-2">Absent Students</h4>
    <p className="text-3xl font-bold text-red-500">{totalAbsent}</p>
  </div>
  </div>
</Grid>
            <Grid item xs={12} sx={{ ml: 1 }}> 
  <div className="grid grid-cols-3 gap-4">
    {/* Top Attendees Card */}
    <Paper sx={{
      backgroundColor: '#1e1e1e',
      padding: 2,
      color: 'white',
      border: '1px solid #07f7ff',
      borderRadius: '8px',
      height: '14rem',
    }}>
      {errorMessage && (
        <Typography color="error">{errorMessage}</Typography>
      )}
      <Typography variant="h6" sx={{ mb: 2, color: '#07f7ff' }}>Top Attendees</Typography>
      {topAttendees.length > 0 ? (
        topAttendees.map((attendee, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box sx={{ 
              width: 40, 
              height: 40, 
              borderRadius: '50%', 
              backgroundColor: '#6901cb', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              mr: 2 
            }}>
              <Typography color="white" variant="body1">
                {attendee.name.split(' ').map(n => n[0]).join('')}
              </Typography>
            </Box>
            <Box>
              <Typography>{attendee.name}</Typography>
              <Typography variant="body2" color="gray">
                {`${attendee.presenceCount}% attendance`}
              </Typography>
            </Box>
          </Box>
        ))
      ) : (
        <Typography>No top attendees available.</Typography>
      )}
    </Paper>
    <Paper sx={{
      backgroundColor: '#1e1e1e',
      padding: 2,
      color: 'white',
      border: '1px solid #07f7ff',
      borderRadius: '8px',
      height: '14rem',
    }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#07f7ff' }}>Quick Actions</Typography>
      <div className="space-y-2">
        <button className="w-full bg-[#2e2e2e] hover:bg-[#3e3e3e] text-white font-bold py-2 px-4 rounded">
          Generate Report
        </button>
        <button className="w-full bg-[#2e2e2e] hover:bg-[#3e3e3e] text-white font-bold py-2 px-4 rounded">
          Send Notifications
        </button>
        <button className="w-full bg-[#2e2e2e] hover:bg-[#3e3e3e] text-white font-bold py-2 px-4 rounded">
          Update Records
        </button>
      </div>
    </Paper>

    {/* System Status Card */}
    <Paper sx={{
      backgroundColor: '#1e1e1e',
      padding: 2,
      color: 'white',
      border: '1px solid #07f7ff',
      borderRadius: '8px',
      height: '14rem',
    }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#07f7ff' }}>System Status</Typography>
      {[
        { label: 'Face Recognition', status: 'Operational' },
        { label: 'Database', status: 'Operational' },
        { label: 'Notification System', status: 'Maintenance' }
      ].map((item, index) => (
        <div key={index} className="flex justify-between items-center mb-1">
          <Typography>{item.label}</Typography>
          <Typography color={item.status === 'Operational' ? 'green' : 'yellow'}>
            {item.status}
          </Typography>
        </div>
      ))}
    </Paper>
  </div>
</Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
