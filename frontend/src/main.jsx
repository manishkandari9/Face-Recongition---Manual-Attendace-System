import React from 'react';
import ReactDOM from 'react-dom/client';  // 'react-dom/client' se import karein
import './index.css';  // Tailwind CSS
import App from './App';

// React 18 me createRoot API use karni hai
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app using createRoot
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
