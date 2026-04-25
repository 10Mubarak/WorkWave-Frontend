import React, { createContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // --- LOGOUT ---
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setLoading(false);
  }, []);

  // --- REFRESH / CHECK USER ---
  // This pulls fresh data from the backend (useful after profile updates)
  const checkUser = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setUser(null);
      setLoading(false);
      setIsInitialLoad(false);
      return;
    }

    try {
      const { data } = await axiosInstance.get('/user/me');

      // DEBUG: Verify that data.user contains firstname and lastname
      console.log("Auth Check (User Data):", data);

      let userData;
      if (data.success && data.user) {
        userData = data.user;
      } else if (data.user) {
        userData = data.user;
      } else {
        userData = data;
      }

      // Ensure role and names are present
      setUser(userData);
    } catch (err) {
      console.error("Auth Check Failed:", err.response?.data?.message || err.message);
      // Only logout if the token is actually invalid (401)
      if (err.response?.status === 401) logout();
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  // --- LOGIN ---
  const login = async (credentials) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/user/login', credentials);

      if (data.token) {
        localStorage.setItem('token', data.token);

        // Normalize user data from login response
        let userData = data.user || data;
        
        // Ensure role is mapped if it's at the top level
        if (!userData.role && data.role) {
          userData.role = data.role;
        }

        console.log("Login Successful. User:", userData.firstname);
        setUser(userData);
        return { success: true, user: userData };
      }
      return { success: false, message: "No token received" };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Login failed";
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // --- UPDATE USER (LOCAL STATE) ---
  // Use this to update the UI instantly after a successful Profile Edit
  const updateUserState = (newData) => {
    setUser(prev => ({ ...prev, ...newData }));
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      setUser,           // Direct access to set user
      updateUserState,   // Helper for partial updates (profile edits)
      loading,
      isInitialLoad,
      logout,
      login,
      refreshUser: checkUser // Your plan calls for this to sync with DB
    }}>
      {children}
    </AuthContext.Provider>
  );
};