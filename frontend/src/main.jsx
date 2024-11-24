// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Global styles (optional)
import App from './App';  // Import the App component

const root = document.getElementById('root'); // Select the root div in index.html
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
