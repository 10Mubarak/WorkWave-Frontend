import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Hexagon, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const { login, refreshUser, loading, error: hookError } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setLocalError(null); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    const result = await login(credentials);

    if (result.success) {
      // Role-based redirect using the user data from login result
      const userRole = result.user?.role;
      console.log("Login Success - User Role:", userRole, "Full User:", result.user);

      if (userRole === 'admin' || userRole === 'recruiter') {
        console.log("Redirecting to dashboard");
        navigate('/dashboard');
      } else {
        console.log("Redirecting to explore");
        navigate('/explore');
      }
    } else {
      setLocalError(result.message || "Login failed");
      console.log("Login failed with message:", result.message);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formCardStyle}>
        {/* BRAND ANCHOR */}
        <div style={logoWrapper}>
          <Hexagon size={40} color="#003A9B" strokeWidth={2.5} />
          <Link to="/" style={logoStyle}>WORKWAVE</Link>
        </div>

        <h1 style={titleStyle}>Welcome Back</h1>
        <p style={subtitleStyle}>Log in to manage your postings and find talent.</p>

        {localError && <div style={errorStyle}>{localError}</div>}

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroup}>
            <label style={labelStyle}>Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="name@company.com"
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={inputGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={labelStyle}>Password</label>
              <span style={forgotPassStyle}>Forgot?</span>
            </div>

            {/* --- PASSWORD INPUT WITH ICON --- */}
            <div style={{ position: 'relative' }}>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={eyeIconStyle}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={submitButtonStyle}>
            {loading ? 'Verifying...' : 'Sign In'} <ArrowRight size={18} />
          </button>

          <p style={footerTextStyle}>
            Don't have an account? <Link to="/register" style={linkStyle}>Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

// --- STYLES ---

const eyeIconStyle = {
  position: 'absolute',
  right: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  color: '#9CA3AF', // Muted gray to match placeholders
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  padding: '4px',
  transition: 'color 0.2s'
};

const containerStyle = {
  backgroundColor: '#F9FAFB',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px'
};

const formCardStyle = {
  maxWidth: '420px',
  width: '100%',
  backgroundColor: '#FFFFFF',
  padding: '48px 40px',
  borderRadius: '16px',
  border: '1px solid #EAEAEA',
  boxShadow: '0 10px 40px rgba(0,0,0,0.03)'
};

const logoWrapper = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '32px'
};

const logoStyle = {
  fontSize: '1.2rem',
  fontWeight: '800',
  color: '#2D2D2D',
  textDecoration: 'none',
  letterSpacing: '-0.5px',
  textTransform: 'uppercase'
};

const titleStyle = {
  fontSize: '1.75rem',
  fontWeight: '700',
  color: '#2D2D2D',
  marginBottom: '8px',
  textAlign: 'center',
  letterSpacing: '-0.5px'
};

const subtitleStyle = {
  color: '#666',
  textAlign: 'center',
  marginBottom: '32px',
  fontSize: '0.95rem',
  lineHeight: '1.5'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const inputGroup = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const labelStyle = {
  fontSize: '0.85rem',
  fontWeight: '600',
  color: '#2D2D2D'
};

const inputStyle = {
  width: '100%',
  padding: '12px 45px 12px 16px', // Extra right padding to avoid text overlapping the eye
  borderRadius: '8px',
  border: '1px solid #D1D1D1',
  fontSize: '1rem',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box'
};

const forgotPassStyle = {
  fontSize: '0.8rem',
  color: '#003A9B',
  fontWeight: '600',
  cursor: 'pointer'
};

const submitButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  backgroundColor: '#003A9B',
  color: '#FFFFFF',
  padding: '14px',
  borderRadius: '8px',
  border: 'none',
  fontSize: '1rem',
  fontWeight: '700',
  cursor: 'pointer',
  marginTop: '8px'
};

const errorStyle = {
  color: '#dc2626',
  backgroundColor: '#fef2f2',
  padding: '12px',
  borderRadius: '8px',
  fontSize: '0.9rem',
  textAlign: 'center',
  marginBottom: '20px',
  border: '1px solid #fee2e2'
};

const footerTextStyle = {
  textAlign: 'center',
  marginTop: '24px',
  fontSize: '0.9rem',
  color: '#666'
};

const linkStyle = {
  color: '#003A9B',
  fontWeight: '700',
  textDecoration: 'none'
};

export default Login;