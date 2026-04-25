import React from 'react';
import Navigation from '../components/Navigation';

const MainLayout = ({ children }) => {
  return (
    <>
      {/* This ensures the Navigation header is on every public page */}
      <Navigation /> 
      
      <main style={{ minHeight: '80vh' }}>
        {children}
      </main>

      {/* You can add a Footer here later if you want */}
    </>
  );
};

export default MainLayout;