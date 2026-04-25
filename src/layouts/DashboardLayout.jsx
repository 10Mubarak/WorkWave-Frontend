import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link, useLocation, Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, Users, Briefcase, Plus, LayoutDashboard, BadgeCheck } from 'lucide-react';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // AUTO-REDIRECT: If Admin lands on base /dashboard, send them to the User Management panel
  // useEffect(() => {
  //   if (user?.role === 'admin' && location.pathname === '/dashboard') {
  //     navigate('/dashboard/all-users', { replace: true });
  //   }
  // }, [user, location.pathname, navigate]);

  const isActive = (path) => location.pathname === path;

  return (
    <div style={pageWrapper}>
      <Navigation />

      {/* --- DASHBOARD SUB-HEADER --- */}
      {!isMobile && (
        <div style={subHeaderStyle}>
          <div style={subHeaderContent}>
            <div style={tabContainer}>

              {/* Common Tab for both Users and Admins */}
              <Link
                to="/dashboard"
                style={isActive('/dashboard') ? activeTab : tabItem}
              >
                <LayoutDashboard size={16} /> Overview
              </Link>

              <Link
                to="/dashboard/my-jobs"
                style={isActive('/dashboard/my-jobs') ? activeTab : tabItem}
              >
                <Briefcase size={16} /> My Postings
              </Link>

              {user?.role === 'admin' && (
                <>
                  <div style={adminTabsContainer}>
                    <Link
                      to="/dashboard/all-users"
                      style={isActive('/dashboard/all-users') ? adminActiveTab : adminTabItem}
                    >
                      <Users size={16} color={isActive('/dashboard/all-users') ? '#FFF' : '#003A9B'} /> User Directory
                    </Link>
                    <Link
                      to="/dashboard/all-jobs"
                      style={isActive('/dashboard/all-jobs') ? adminActiveTab : adminTabItem}
                    >
                      <ShieldCheck size={16} color={isActive('/dashboard/all-jobs') ? '#FFF' : '#003A9B'} /> Management
                    </Link>
                  </div>
                </>
              )}
            </div>

            <div style={actionGroup}>
              {/* ROLE BADGE: Visual feedback that the Admin system is active */}
              {user?.role === 'admin' && (
                <div style={adminBadge}>
                  <BadgeCheck size={14} color="#003A9B" />
                  <span>Administrator Access</span>
                </div>
              )}

              <Link to="/dashboard/post-job" style={actionBtn}>
                <Plus size={18} /> <span>Post Job</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* --- CONTENT AREA --- */}
      <main style={mainContent}>
        <div className="fade-in-content" style={contentFadeIn}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

// --- LUXURY STYLES ---

const pageWrapper = {
  backgroundColor: '#FFFFFF',
  minHeight: '100vh',
  fontFamily: "'Inter', sans-serif"
};

const subHeaderStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.95)', // Slight transparency for luxury feel
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid #F0F0F0',
  position: 'sticky',
  top: '80px', // Fixed for Navigation height (80px)
  zIndex: 900,
};

const subHeaderContent = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 40px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '72px'
};

const tabContainer = {
  display: 'flex',
  gap: '32px',
  height: '100%'
};

const tabItem = {
  textDecoration: 'none',
  color: '#888',
  fontSize: '0.85rem',
  fontWeight: '600',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  height: '100%',
  borderBottom: '2px solid transparent',
  transition: 'all 0.2s ease-out',
  padding: '12px 20px'
};

const adminTabsContainer = {
  display: 'flex',
  gap: '8px',
  backgroundColor: '#F0F7FF',
  padding: '8px 16px',
  borderRadius: '12px',
  border: '1px solid #E0E7FF'
};

const adminTabItem = {
  ...tabItem,
  color: '#003A9B',
  fontWeight: '700',
  backgroundColor: 'transparent',
  borderRadius: '8px',
  padding: '10px 16px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  fontSize: '0.88rem'
};

const adminActiveTab = {
  ...adminTabItem,
  color: '#FFF',
  backgroundColor: '#003A9B',
  boxShadow: '0 4px 12px rgba(0, 58, 155, 0.4)',
  transform: 'translateY(-1px)'
};

const activeTab = {
  ...tabItem,
  color: '#FFF',
  backgroundColor: '#003A9B',
  borderBottom: '2px solid #FFF',
  borderRadius: '8px 8px 0 0',
  boxShadow: '0 -2px 8px rgba(0, 58, 155, 0.3)',
  padding: '12px 20px'
};

const actionGroup = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px'
};

const adminBadge = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 16px',
  background: 'linear-gradient(135deg, #003A9B, #1E40AF)',
  borderRadius: '12px',
  fontSize: '0.85rem',
  fontWeight: '800',
  color: '#FFF',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  boxShadow: '0 4px 12px rgba(0, 58, 155, 0.3)',
  minHeight: '36px'
};

const actionBtn = {
  backgroundColor: '#000',
  color: '#FFF',
  padding: '10px 20px',
  borderRadius: '10px',
  textDecoration: 'none',
  fontWeight: '700',
  fontSize: '0.85rem',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s ease'
};

const mainContent = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '40px 40px'
};

const contentFadeIn = {
  // Use CSS for the actual animation in your index.css:
  // @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  animation: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
};

export default DashboardLayout;