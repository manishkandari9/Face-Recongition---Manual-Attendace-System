import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignInSignUp from './SignInSignUp';
import Dashboard from './Dashboard';
import TeacherDashboard from './TeacherDashboard';
import AssignmentManager from './AssignmentManager';
import StudentDashboard from './StudentDashboard';
import Scan from './components/scan';
import './App.css'; 
import './index.css';

// Use BrowserRouter and pass the future flag for React Router v7
function App() {
  return (
    <Router 
      future={{
        v7_relativeSplatPath: true,  // Opt-in to relative splat path resolution in v7
      }}
    >
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
