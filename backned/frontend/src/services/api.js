// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Replace with your backend URL
  headers: {
    'Content-Type': 'application/json',
    // You can add other headers here, like authentication tokens
  },
});

export default api;
