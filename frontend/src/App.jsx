// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignInSignUp from './SignInSignUp';  // Import other components
import Dashboard from './Dashboard';
import TeacherDashboard from './TeacherDashboard';
import AssignmentManager from './AssignmentManager';
import StudentDashboard from './StudentDashboard';
import Scan from './components/scan';  // Import Scan component
import './App.css';  // App-level CSS (optional)
import './index.css';  // Global CSS (optional)

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<SignInSignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/TeacherDashboard" element={<TeacherDashboard />} />
          <Route path="/AssignmentManager" element={<AssignmentManager />} />
          <Route path="/StudentDashboard" element={<StudentDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
