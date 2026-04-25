import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { user, isInitialLoad } = useContext(AuthContext);

  // 1. Only show loading state during INITIAL app load (checking token on startup)
  // Do NOT hide during login attempts - the form needs to stay visible
  if (isInitialLoad) {
    return null;
  }

  // 2. The "Active Guard" with Role-Awareness:
  // If the user is logged in, redirect them based on their role.
  if (user) {
    if (user.role === 'admin') {
      return <Navigate to="/dashboard/all-users" replace />;
    }
    // Default redirect for regular users
    return <Navigate to="/explore" replace />;
  }

  // 3. Only show children (Login/Register) if user is definitely null.
  return children;
};

export default PublicRoute;