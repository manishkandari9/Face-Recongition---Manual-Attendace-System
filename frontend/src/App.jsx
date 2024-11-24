import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignInSignUp from './SignInSignUp';
import Dashboard from './Dashboard';
import TeacherDashboard from './TeacherDashboard';
import AssignmentManager from './AssignmentManager';
import StudentDashboard from './StudentDashboard';
import Scan from './components/scan';
import './App.css'; 
import './index.css';

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
