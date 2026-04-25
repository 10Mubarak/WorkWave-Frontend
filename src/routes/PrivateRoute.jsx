import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // 1. While the app is verifying the session, show nothing (or a spinner)
  // This prevents flickering between "Login" and "Dashboard"
  if (loading) {
    return null; 
  }

  // 2. If not logged in:
  // We pass 'state' so the Login page knows where the user came from
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. The Role Guard:
  // If a route is marked 'adminOnly' but the user is just a 'user',
  // we bounce them to /explore so they don't see a broken page.
  if (adminOnly && user.role !== 'admin') {
    console.warn("🛡️ Access Denied: Admin privileges required.");
    return <Navigate to="/explore" replace />;
  }

  // 4. Authorized: Render the requested page
  return children;
};

export default PrivateRoute;