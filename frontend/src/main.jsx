// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Importing global CSS file
import App from './App';  // Importing the App component

const rootElement = document.getElementById('root');  // Find the div with id="root" in index.html
const root = ReactDOM.createRoot(rootElement);  // Create a root for React

root.render(
  <React.StrictMode>
    <App /> 
  </React.StrictMode>
);
