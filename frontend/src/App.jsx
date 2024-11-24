import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignInSignUp from './SignInSignUp'; // Import your SignInSignUp component
import Dashboard from './Dashboard';
import Scan from './components/scan';
import TeacherDashboard from './TeacherDashboard';
import AssignmentManager from './AssignmentManager';
import './App.css'; 
import './index.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignInSignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/AssignmentManager" element={<AssignmentManager />} />
        <Route path="/TeacherDashboard" element={<TeacherDashboard />} />
        
      </Routes>
    </Router>
  );
}

export default App;
