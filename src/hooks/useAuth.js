import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Pull the centralized logic from AuthContext
  const { setUser, login: contextLogin, refreshUser } = useContext(AuthContext);

  const register = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.post('/user/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    setError(null);

    // Use the login function from AuthContext so everything stays in sync
    const result = await contextLogin(credentials);

    if (result.success) {
      // Return the user data directly for immediate redirect decision
      setLoading(false);
      return { success: true, user: result.user };
    } else {
      // Make sure to return and set the exact error message from backend
      setError(result.message);
      setLoading(false);
      return { success: false, message: result.message };
    }
  };

  // Return refreshUser so the Login page can call it if needed
  return { register, login, refreshUser, loading, error };
};