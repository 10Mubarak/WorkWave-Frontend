import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Path to your context
import { User, Mail, Shield, Edit3, Calendar } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <div style={s.loader}>Loading profile...</div>;

  // Get the first letter of the first name
  const initial = user.firstname ? user.firstname.charAt(0).toUpperCase() : '?';

  return (
    <div style={s.container}>
      {/* Header Section */}
      <div style={s.profileHeader}>
        <div style={s.avatarCircle}>
          {initial}
        </div>
        <h1 style={s.userName}>{user.firstname} {user.lastname}</h1>
        <span style={s.roleBadge}>{user.role}</span>
      </div>

      {/* Info Card */}
      <div style={s.card}>
        <h2 style={s.cardTitle}>Account Information</h2>
        
        <div style={s.infoRow}>
          <div style={s.iconBox}><User size={18} /></div>
          <div style={s.infoContent}>
            <label style={s.label}>Full Name</label>
            <p style={s.value}>{user.firstname} {user.lastname}</p>
          </div>
        </div>

        <div style={s.infoRow}>
          <div style={s.iconBox}><Mail size={18} /></div>
          <div style={s.infoContent}>
            <label style={s.label}>Email Address</label>
            <p style={s.value}>{user.email}</p>
          </div>
        </div>

        <div style={s.infoRow}>
          <div style={s.iconBox}><Shield size={18} /></div>
          <div style={s.infoContent}>
            <label style={s.label}>Account Permission</label>
            <p style={s.value}>{user.role === 'admin' ? 'Administrator' : 'Standard User'}</p>
          </div>
        </div>
      </div>

      <button style={s.editBtn}>
        <Edit3 size={16} /> Edit Profile Details
      </button>
    </div>
  );
};

// --- PREMIUM STYLING ---
const s = {
  container: {
    padding: '100px 20px 40px', // Space for fixed header
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: "'Inter', sans-serif",
  },
  profileHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '40px',
  },
  avatarCircle: {
    width: '100px',
    height: '100px',
    backgroundColor: '#003A9B', // WorkWave Blue
    color: '#FFFFFF',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '2.5rem',
    fontWeight: '800',
    marginBottom: '16px',
    boxShadow: '0 8px 20px rgba(0, 58, 155, 0.15)',
  },
  userName: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#111827',
    marginBottom: '8px',
    textAlign: 'center'
  },
  roleBadge: {
    backgroundColor: '#E0E7FF',
    color: '#4338CA',
    padding: '4px 12px',
    borderRadius: '100px',
    fontSize: '0.75rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    border: '1px solid #F3F4F6',
    padding: '30px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#374151',
    marginBottom: '24px',
    borderBottom: '1px solid #F3F4F6',
    paddingBottom: '12px'
  },
  infoRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '20px',
    alignItems: 'flex-start'
  },
  iconBox: {
    padding: '10px',
    backgroundColor: '#F9FAFB',
    borderRadius: '10px',
    color: '#6B7280'
  },
  infoContent: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    marginBottom: '2px'
  },
  value: {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#111827'
  },
  editBtn: {
    width: '100%',
    marginTop: '24px',
    padding: '14px',
    borderRadius: '12px',
    border: '1px solid #D1D5DB',
    backgroundColor: 'white',
    color: '#374151',
    fontWeight: '700',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  loader: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#003A9B',
    fontWeight: '600'
  }
};

export default Profile;