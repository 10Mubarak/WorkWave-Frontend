import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Trash2, User, Mail, Shield, Calendar, MoreVertical, AlertTriangle, X } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- RESPONSIVE TRACKER ---
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // --- DELETE MODAL STATE ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userNameToDelete, setUserNameToDelete] = useState('');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    fetchUsers();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/admin/users');
      setUsers(data.data || []);
    } catch (err) {
      setError("Failed to load users. Are you sure you're an admin?");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (userId, userName) => {
    setUserToDelete(userId);
    setUserNameToDelete(userName);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await axiosInstance.delete(`/admin/user/${userToDelete}`);
      setUsers(users.filter(user => user._id !== userToDelete));
      setShowDeleteModal(false);
      setUserToDelete(null);
      setUserNameToDelete('');
    } catch (err) {
      alert("Error deleting user.");
    }
  };

  const cancelDeleteUser = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
    setUserNameToDelete('');
  };

  if (loading) return <div style={statusMsg}>🌊 Scanning the network...</div>;
  if (error) return <div style={{ ...statusMsg, color: '#dc2626' }}>{error}</div>;

  return (
    <div style={container}>
      <div style={header}>
        <h1 style={title}>User Management</h1>
        <p style={subtitle}>Monitor and manage all active accounts on WorkWave.</p>
      </div>

      <div style={tableCard}>
        {isMobile ? (
          // --- MOBILE VIEW: CARD LIST ---
          <div style={mobileList}>
            {users.map((u) => (
              <div key={u._id} style={mobileUserCard}>
                <div style={mobileCardTop}>
                  <div style={userInfo}>
                    <div style={avatar}><User size={18} /></div>
                    <div>
                      <div style={userName}>{u.firstname} {u.lastname}</div>
                      <div style={userEmail}><Mail size={12} /> {u.email}</div>
                    </div>
                  </div>
                  {u.role !== 'admin' && (
                    <button style={deleteBtn} onClick={() => handleDeleteUser(u._id, u.firstname)}>
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <div style={mobileCardBottom}>
                  <span style={u.role === 'admin' ? adminBadge : userBadge}>
                    {u.role === 'admin' ? <Shield size={12} /> : null} {u.role}
                  </span>
                  <div style={dateText}>
                    <Calendar size={14} /> {new Date(u.createdAt || Date.now()).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // --- DESKTOP/IPAD VIEW: FULL TABLE ---
          <table style={table}>
            <thead>
              <tr style={tableHeader}>
                <th style={th}>User Details</th>
                <th style={th}>Role</th>
                <th style={th}>Joined Date</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={tr}>
                  <td style={td}>
                    <div style={userInfo}>
                      <div style={avatar}><User size={18} /></div>
                      <div>
                        <div style={userName}>{u.firstname} {u.lastname}</div>
                        <div style={userEmail}><Mail size={12} /> {u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={td}>
                    <span style={u.role === 'admin' ? adminBadge : userBadge}>
                      {u.role === 'admin' ? <Shield size={12} /> : null} {u.role}
                    </span>
                  </td>
                  <td style={td}>
                    <div style={dateText}>
                      <Calendar size={14} /> {new Date(u.createdAt || Date.now()).toLocaleDateString()}
                    </div>
                  </td>
                  <td style={td}>
                    {u.role !== 'admin' && (
                      <button style={deleteBtn} onClick={() => handleDeleteUser(u._id, u.firstname)}>
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {showDeleteModal && (
        <div style={modalBackdrop}>
          <div style={modalContainer}>
            <div style={modalHeader}>
              <AlertTriangle size={24} color="#DC2626" />
              <h3 style={modalTitle}>Confirm User Deletion</h3>
              <button style={modalCloseBtn} onClick={cancelDeleteUser}>
                <X size={20} />
              </button>
            </div>
            <div style={modalBody}>
              <p style={modalMessage}>
                Are you sure you want to permanently delete <strong>{userNameToDelete}</strong>?
                This action cannot be undone and will remove all associated data.
              </p>
            </div>
            <div style={modalFooter}>
              <button style={cancelBtn} onClick={cancelDeleteUser}>
                Cancel
              </button>
              <button style={confirmBtn} onClick={confirmDeleteUser}>
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- STYLES ---
const container = { padding: '0 20px', maxWidth: '1200px', margin: '0 auto' };
const header = { marginBottom: '32px', paddingTop: '45px' };
const title = { fontSize: '1.8rem', fontWeight: '800', color: '#111827', letterSpacing: '-0.5px' };
const subtitle = { color: '#6B7280', fontSize: '0.95rem' };

const tableCard = { backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' };
const table = { width: '100%', borderCollapse: 'collapse' };
const tableHeader = { backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', textAlign: 'left' };
const th = { padding: '16px 24px', fontSize: '0.75rem', fontWeight: '600', color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em' };
const tr = { borderBottom: '1px solid #F3F4F6' };
const td = { padding: '16px 24px', verticalAlign: 'middle' };

// Mobile Specific
const mobileList = { display: 'flex', flexDirection: 'column' };
const mobileUserCard = { padding: '0px', borderBottom: '1px solid #F3F4F6', paddingBottom: '30px' };
const mobileCardTop = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' };
const mobileCardBottom = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };

const userInfo = { display: 'flex', alignItems: 'center', gap: '12px' };
const avatar = { width: '40px', height: '40px', backgroundColor: '#F3F4F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' };
const userName = { fontWeight: '700', color: '#111827', fontSize: '0.95rem' };
const userEmail = { fontSize: '0.85rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' };

const userBadge = { backgroundColor: '#F3F4F6', color: '#374151', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', textTransform: 'capitalize' };
const adminBadge = { backgroundColor: '#EEF2FF', color: '#4338CA', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'capitalize', display: 'inline-flex', alignItems: 'center', gap: '4px' };

const dateText = { fontSize: '0.85rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '6px' };
const deleteBtn = { background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '8px', borderRadius: '6px' };
const statusMsg = { padding: '100px', textAlign: 'center', fontSize: '1rem', fontWeight: '600', color: '#6B7280' };

// ── MODAL STYLES ──────────────────────────────────────────────────────────────
const modalBackdrop = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '20px'
};

const modalContainer = {
  backgroundColor: '#FFF',
  borderRadius: '16px',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  maxWidth: '400px',
  width: '100%',
  overflow: 'hidden',
  border: '1px solid #E5E7EB'
};

const modalHeader = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '24px 24px 16px',
  borderBottom: '1px solid #F3F4F6'
};

const modalTitle = {
  fontSize: '1.25rem',
  fontWeight: '700',
  color: '#111827',
  margin: 0,
  flex: 1
};

const modalCloseBtn = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: '#6B7280',
  padding: '4px',
  borderRadius: '6px',
  transition: 'background 0.15s'
};

const modalBody = {
  padding: '24px'
};

const modalMessage = {
  fontSize: '0.95rem',
  color: '#374151',
  margin: 0,
  lineHeight: '1.5'
};

const modalFooter = {
  display: 'flex',
  gap: '12px',
  padding: '16px 24px 24px',
  borderTop: '1px solid #F3F4F6',
  justifyContent: 'flex-end'
};

const cancelBtn = {
  backgroundColor: '#F9FAFB',
  border: '1px solid #D1D5DB',
  color: '#374151',
  padding: '10px 20px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '0.875rem',
  transition: 'all 0.15s'
};

const confirmBtn = {
  backgroundColor: '#DC2626',
  border: 'none',
  color: '#FFF',
  padding: '10px 20px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '0.875rem',
  transition: 'all 0.15s'
};

export default AdminUsers;