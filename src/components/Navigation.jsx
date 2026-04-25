import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Hexagon, Menu, X, ChevronDown, ChevronUp } from 'lucide-react';

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dashboardMenuOpen, setDashboardMenuOpen] = useState(false);
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const avatarRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setDashboardMenuOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    setMenuOpen(false);
    setDashboardMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setAvatarDropdownOpen(false);
      }
    };

    if (avatarDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [avatarDropdownOpen]);

  const closeAllMenus = () => {
    setMenuOpen(false);
    setDashboardMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    closeAllMenus();
  };

  return (
    <nav style={navStyle}>
      <div style={navInnerContainer}>

        {/* --- LOGO --- */}
        <Link to={user?.role === 'admin' ? "/dashboard" : "/"} style={logoContainer}>
          <Hexagon size={32} color="#003A9B" strokeWidth={2.5} />
          <span style={logoStyle}>WORKWAVE</span>
        </Link>

        {/* --- LINKS --- */}
        <div
          style={{
            ...linksContainer,
            ...(isMobile
              ? menuOpen
                ? mobileMenuOpen
                : mobileMenuClosed
              : {}),
          }}
        >
          <Link to="/explore" style={isMobile ? mobileMenuItem : linkItem} onClick={() => setMenuOpen(false)}>
            Explore Jobs
          </Link>

          {user ? (
            <>
              {isMobile ? (
                <div style={dashboardMenuWrapper}>
                  <button
                    type="button"
                    onClick={() => setDashboardMenuOpen((prev) => !prev)}
                    style={dashboardMenuBtn}
                  >
                    <span>{user.role === 'admin' ? 'Admin Panel' : 'My Dashboard'}</span>
                    {dashboardMenuOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>

                  {dashboardMenuOpen && (
                    <div style={dashboardSubMenu}>
                      <Link to="/dashboard" style={nestedLinkItem} onClick={closeAllMenus}>
                        Overview
                      </Link>
                      <Link to="/dashboard/my-jobs" style={nestedLinkItem} onClick={closeAllMenus}>
                        My Postings
                      </Link>
                      {user.role === 'admin' && (
                        <>
                          <Link to="/dashboard/all-users" style={nestedLinkItem} onClick={closeAllMenus}>
                            User Directory
                          </Link>
                          <Link to="/dashboard/all-jobs" style={nestedLinkItem} onClick={closeAllMenus}>
                            Management
                          </Link>
                        </>
                      )}
                    </div>
                  )}

                  <Link to="/dashboard/post-job" style={mobilePostJobBtn} onClick={closeAllMenus}>
                    Post Job
                  </Link>
                </div>
              ) : (
                user.role === 'admin' ? (
                  <Link to="/dashboard/all-users" style={linkItem} onClick={closeAllMenus}>
                    <span style={adminBadge}>Admin Panel</span>
                  </Link>
                ) : (
                  <Link to="/dashboard/my-jobs" style={linkItem} onClick={closeAllMenus}>
                    My Dashboard
                  </Link>
                )
              )}

              {/* Avatar with Dropdown (DESKTOP ONLY) */}
              {!isMobile && (
                <div style={avatarContainer} ref={avatarRef}>
                  <button
                    onClick={() => setAvatarDropdownOpen(!avatarDropdownOpen)}
                    style={avatarStyle}
                    title={user.firstname}
                  >
                    {user.firstname?.[0]?.toUpperCase() || 'U'}
                  </button>

                  {avatarDropdownOpen && (
                    <div style={dropdownMenu}>
                      <Link to="/profile" style={dropdownItem} onClick={() => setAvatarDropdownOpen(false)}>
                        View Profile
                      </Link>
                      <button onClick={() => { handleLogout(); setAvatarDropdownOpen(false); }} style={dropdownLogoutBtn}>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <Link to="/login" style={isMobile ? mobileMenuItem : linkItem} onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" style={isMobile ? mobileRegisterBtn : registerBtn} onClick={() => setMenuOpen(false)}>
                Post a Job
              </Link>
            </>
          )}
        </div>

        {/* --- RIGHT SIDE CONTAINER (AVATAR + HAMBURGER) ON MOBILE --- */}
        {isMobile && user && (
          <div style={rightMobileContainer}>
            <div style={avatarContainer} ref={avatarRef}>
              <button
                onClick={() => setAvatarDropdownOpen(!avatarDropdownOpen)}
                style={avatarStyle}
                title={user.firstname}
              >
                {user.firstname?.[0]?.toUpperCase() || 'U'}
              </button>

              {avatarDropdownOpen && (
                <div style={{ ...dropdownMenu, right: '-20px' }}>
                  <Link to="/profile" style={dropdownItem} onClick={() => setAvatarDropdownOpen(false)}>
                    View Profile
                  </Link>
                  <button onClick={() => { handleLogout(); setAvatarDropdownOpen(false); }} style={dropdownLogoutBtn}>
                    Logout
                  </button>
                </div>
              )}
            </div>

            <button onClick={() => setMenuOpen(!menuOpen)} style={hamburgerBtn}>
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        )}

        {/* --- HAMBURGER (DESKTOP MOBILE CHECK) --- */}
        {isMobile && !user && (
          <button onClick={() => setMenuOpen(!menuOpen)} style={hamburgerBtn}>
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        )}
      </div>
    </nav>
  );
};

// --- STYLES ---

const navStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid #EAEAEA',
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  zIndex: 1000,
  height: '80px'
};

const navInnerContainer = {
  width: '100%',
  maxWidth: '1300px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 24px',
  position: 'relative'
};

const logoContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  textDecoration: 'none'
};

const logoStyle = {
  fontSize: '1.4rem',
  fontWeight: '900',
  color: '#2D2D2D',
  letterSpacing: '-1px',
  textTransform: 'uppercase'
};

const linksContainer = {
  display: 'flex',
  gap: '28px',
  alignItems: 'center'
};

// --- MOBILE MENU STATES ---
const mobileMenuOpen = {
  position: 'absolute',
  top: '50px',
  right: '0',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'flex-start',
  backgroundColor: '#FFF',
  padding: '20px',
  gap: '16px',
  borderBottom: '1px solid #E5E7EB',
  transition: 'all 0.2s ease-in-out'
};

const mobileMenuClosed = {
  display: 'none'
};

// --- HAMBURGER ---
const hamburgerBtn = {
  background: 'none',
  border: 'none',
  cursor: 'pointer'
};

// --- RIGHT MOBILE CONTAINER ---
const rightMobileContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

// --- LINKS ---
const linkItem = {
  textDecoration: 'none',
  color: '#555',
  fontWeight: '600',
  fontSize: '0.95rem'
};

const dashboardMenuWrapper = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%'
};

const dashboardMenuBtn = {
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'transparent',
  border: '1px solid #E5E7EB',
  borderRadius: '12px',
  padding: '12px 16px',
  color: '#333',
  fontWeight: '700',
  cursor: 'pointer',
  textAlign: 'left'
};

const dashboardSubMenu = {
  display: 'flex',
  flexDirection: 'column',
  padding: '12px 16px',
  marginTop: '10px',
  gap: '10px',
  borderRadius: '12px',
  backgroundColor: '#F8FAFC',
  border: '1px solid #E5E7EB'
};

const nestedLinkItem = {
  textDecoration: 'none',
  color: '#003A9B',
  fontWeight: '700',
  fontSize: '0.95rem',
  padding: '10px 0',
  display: 'block'
};

const mobileMenuItem = {
  textDecoration: 'none',
  color: '#003A9B',
  fontWeight: '700',
  fontSize: '0.95rem',
  width: '100%',
  padding: '14px 16px',
  borderRadius: '14px',
  backgroundColor: '#F8FAFC',
  border: '1px solid #E2E8F0',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const mobileRegisterBtn = {
  ...mobileMenuItem,
  backgroundColor: '#003A9B',
  color: '#FFF',
  border: 'none'
};

const mobilePostJobBtn = {
  ...mobileMenuItem,
  backgroundColor: '#003A9B',
  color: '#FFF',
  border: 'none'
};

const registerBtn = {
  backgroundColor: '#003A9B',
  color: '#FFF',
  padding: '12px 24px',
  borderRadius: '10px',
  textDecoration: 'none',
  fontWeight: '700'
};

const adminBadge = {
  color: '#003A9B',
  border: '1px solid #003A9B',
  padding: '4px 12px',
  borderRadius: '6px',
  fontSize: '0.85rem',
  textTransform: 'uppercase',
  fontWeight: '800'
};

// --- AVATAR & DROPDOWN ---
const avatarContainer = {
  position: 'relative'
};

const avatarStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: '#003A9B',
  color: '#FFFFFF',
  border: 'none',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '0.95rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0',
  lineHeight: '1',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  boxShadow: '0 2px 8px rgba(0, 58, 155, 0.2)'
};

const dropdownMenu = {
  position: 'absolute',
  top: '50px',
  right: '0',
  backgroundColor: '#FFFFFF',
  borderRadius: '12px',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
  border: '1px solid #E5E7EB',
  zIndex: 1001,
  minWidth: '160px',
  overflow: 'hidden'
};

const dropdownItem = {
  display: 'block',
  width: '100%',
  padding: '14px 20px',
  textDecoration: 'none',
  color: '#333',
  fontWeight: '600',
  fontSize: '0.95rem',
  backgroundColor: '#FFFFFF',
  border: 'none',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'background-color 0.2s ease',
  borderBottom: '1px solid #F0F0F0'
};

const dropdownLogoutBtn = {
  display: 'block',
  width: '100%',
  padding: '14px 20px',
  textDecoration: 'none',
  color: '#DC2626',
  fontWeight: '600',
  fontSize: '0.95rem',
  backgroundColor: '#FFFFFF',
  border: 'none',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'background-color 0.2s ease'
};

export default Navigation;