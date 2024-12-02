import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignInSignUp from './SignInSignUp';
import Dashboard from './Dashboard';
import TeacherDashboard from './TeacherDashboard';
import AssignmentManager from './AssignmentManager';
import StudentDashboard from './StudentDashboard';
// import Scan from './components/scan';
import './App.css';
import './index.css';

// Define the routes and enable future flags
const router = createBrowserRouter(
  [
    { path: '/', element: <SignInSignUp /> },
    { path: '/dashboard', element: <Dashboard /> },
    // { path: '/scan', element: <Scan /> },
    { path: '/TeacherDashboard', element: <TeacherDashboard /> },
    { path: '/AssignmentManager', element: <AssignmentManager /> },
    { path: '/StudentDashboard', element: <StudentDashboard /> },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
