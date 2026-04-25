import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Hexagon, ArrowRight, Eye, EyeOff } from 'lucide-react'; // Added icons

const Register = () => {
    const { register, loading, error } = useAuth();
    const [showPassword, setShowPassword] = useState(false); // Toggle state
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        // Force email to lowercase for consistency
        const value = e.target.name === 'email' ? e.target.value.toLowerCase() : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        register(formData);
    };

    return (
        <div style={containerStyle}>
            <div style={formCardStyle}>
                {/* --- BRAND ANCHOR WITH HEXAGON --- */}
                <div style={logoWrapper}>
                    <Hexagon size={40} color="#003A9B" strokeWidth={2.5} />
                    <Link to="/" style={logoStyle}>
                        WORKWAVE
                    </Link>
                </div>

                <h1 style={titleStyle}>Create Account</h1>
                <p style={subtitleStyle}>Join the network for top-tier tech talent.</p>

                {error && <div style={errorStyle}>{error}</div>}

                <form onSubmit={handleSubmit} style={formStyle}>
                    {/* --- SPLIT ROW LAYOUT --- */}
                    <div style={rowStyle}>
                        <div style={inputGroup}>
                            <label style={labelStyle}>First Name</label>
                            <input
                                name="firstname"
                                type="text"
                                placeholder="John"
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            />
                        </div>
                        <div style={inputGroup}>
                            <label style={labelStyle}>Last Name</label>
                            <input
                                name="lastname"
                                type="text"
                                placeholder="Doe"
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {/* Email */}
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

                    {/* --- PASSWORD WITH EYE ICON --- */}
                    <div style={inputGroup}>
                        <label style={labelStyle}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                onChange={handleChange}
                                required
                                // Applying 'eyeInputStyle' specifically for the padding-right
                                style={{ ...inputStyle, ...eyeInputStyle }}
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
                        {loading ? 'Creating Account...' : 'Get Started'} <ArrowRight size={18} />
                    </button>

                    <p style={footerTextStyle}>
                        Already have an account? <Link to="/login" style={linkStyle}>Sign In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

// --- STYLES (Synchronized with new Login DNA) ---

const containerStyle = {
    backgroundColor: '#F9FAFB',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px' // Extra vertical padding for longer form
};

const formCardStyle = {
    maxWidth: '480px', // Slightly wider than Login to accommodate the split row
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
    gap: '20px' // Unified gap from Login
};

const rowStyle = {
    display: 'flex',
    gap: '16px'
};

const inputGroup = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1
};

const labelStyle = {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#2D2D2D'
};

const inputStyle = {
    width: '100%',
    boxSizing: 'border-box', // Crucial for padding/width consistency
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #D1D1D1',
    fontSize: '1rem',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s'
};

/* Specific style for password input so text doesn't hide under the eye */
const eyeInputStyle = {
    paddingRight: '45px'
};

const eyeIconStyle = {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#9CA3AF', // Muted gray
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '4px'
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
    marginTop: '10px',
    transition: 'all 0.2s'
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

export default Register;