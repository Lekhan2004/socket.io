// src/api/auth.js
import axios from 'axios';
import { API_URL, USERS_API } from '../utils/constants';

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}${USERS_API}/login`, credentials);
    const { message, token } = response.data;
    
    if (message === 'login success') {
      return token;
    }
    
    return null;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Login failed');
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}${USERS_API}/register`, userData);
    const { message } = response.data;

    if (message === 'Registration successful') {
      return response.data;
    }

    throw new Error(message || 'Registration failed');
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};
