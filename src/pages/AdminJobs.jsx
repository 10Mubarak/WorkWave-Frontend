import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Trash2, User, Building2, Calendar, AlertCircle, Clock, AlertTriangle, X } from 'lucide-react';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- RESPONSIVE TRACKER ---
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // --- DELETE MODAL STATE ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [jobTitleToDelete, setJobTitleToDelete] = useState('');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    fetchAllJobs();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchAllJobs = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/admin/jobs');
      setJobs(data.data || []);
    } catch (err) {
      setError("Unauthorized: You must be an admin to view this page.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminDelete = (jobId, title) => {
    setJobToDelete(jobId);
    setJobTitleToDelete(title);
    setShowDeleteModal(true);
  };

  const confirmDeleteJob = async () => {
    if (!jobToDelete) return;
    try {
      await axiosInstance.delete(`/admin/job/${jobToDelete}`);
      setJobs(jobs.filter(j => j._id !== jobToDelete));
      setShowDeleteModal(false);
      setJobToDelete(null);
      setJobTitleToDelete('');
    } catch (err) {
      alert("Failed to delete job.");
    }
  };

  const cancelDeleteJob = () => {
    setShowDeleteModal(false);
    setJobToDelete(null);
    setJobTitleToDelete('');
  };

  if (loading) return <div style={loader}>🌊 Scanning global job database...</div>;
  if (error) return <div style={errorContainer}><AlertCircle /> {error}</div>;

  return (
    <div style={container}>
      <div style={header}>
        <h1 style={title}>Global Job Control</h1>
        <p style={subtitle}>Monitor and moderate all active postings across the entire network.</p>
      </div>

      <div style={tableCard}>
        {jobs.length === 0 ? (
          <div style={emptyMsg}>No jobs found in the system.</div>
        ) : isMobile ? (
          // --- MOBILE VIEW: ADAPTIVE CARDS ---
          <div style={mobileList}>
            {jobs.map((job) => (
              <div key={job._id} style={mobileJobCard}>
                <div style={mobileCardHeader}>
                  <div>
                    <div style={jobTitle}>{job.title}</div>
                    <div style={companyInfo}><Building2 size={12} /> {job.company}</div>
                  </div>
                  <button style={deleteBtn} onClick={() => handleAdminDelete(job._id, job.title)}>
                    <Trash2 size={18} />
                  </button>
                </div>

                <div style={mobileCardPoster}>
                  <div style={posterInfo}>
                    <User size={14} />
                    {job.postedBy ? `${job.postedBy.firstname} ${job.postedBy.lastname}` : 'Unknown'}
                  </div>
                  <div style={posterEmail}>{job.postedBy?.email}</div>
                </div>

                <div style={mobileCardFooter}>
                  <span style={activeBadge}>Live</span>
                  <div style={dateText}>
                    <Clock size={14} /> {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // --- DESKTOP / IPAD VIEW: FULL TABLE ---
          <table style={tableStyle}>
            <thead>
              <tr style={tableHeader}>
                <th style={th}>Job & Company</th>
                <th style={th}>Posted By</th>
                <th style={th}>Date Posted</th>
                <th style={th}>Status</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id} style={tableRow}>
                  <td style={td}>
                    <div style={jobTitle}>{job.title}</div>
                    <div style={companyInfo}><Building2 size={12} /> {job.company}</div>
                  </td>
                  <td style={td}>
                    <div style={posterInfo}>
                      <User size={14} />
                      {job.postedBy ? `${job.postedBy.firstname} ${job.postedBy.lastname}` : 'Unknown'}
                    </div>
                    <div style={posterEmail}>{job.postedBy?.email}</div>
                  </td>
                  <td style={td}>
                    <div style={dateText}>
                      <Calendar size={14} /> {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td style={td}>
                    <span style={activeBadge}>Live</span>
                  </td>
                  <td style={td}>
                    <button style={deleteBtn} onClick={() => handleAdminDelete(job._id, job.title)} title="Delete Job">
                      <Trash2 size={18} />
                    </button>
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
              <h3 style={modalTitle}>Confirm Job Deletion</h3>
              <button style={modalCloseBtn} onClick={cancelDeleteJob}>
                <X size={20} />
              </button>
            </div>
            <div style={modalBody}>
              <p style={modalMessage}>
                Are you sure you want to permanently delete <strong>"{jobTitleToDelete}"</strong> from the platform?
                This action cannot be undone and will remove the posting for all users.
              </p>
            </div>
            <div style={modalFooter}>
              <button style={cancelBtn} onClick={cancelDeleteJob}>
                Cancel
              </button>
              <button style={confirmBtn} onClick={confirmDeleteJob}>
                Delete Job
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
const tableStyle = { width: '100%', borderCollapse: 'collapse', textAlign: 'left' };
const tableHeader = { backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' };
const th = { padding: '16px 24px', fontSize: '0.75rem', fontWeight: '600', color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em' };
const tableRow = { borderBottom: '1px solid #F3F4F6' };
const td = { padding: '16px 24px', verticalAlign: 'middle' };

// Mobile Styles
const mobileList = { display: 'flex', flexDirection: 'column' };
const mobileJobCard = { padding: '24px', borderBottom: '1px solid #F3F4F6' };
const mobileCardHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' };
const mobileCardPoster = { marginBottom: '16px', padding: '10px', backgroundColor: '#F9FAFB', borderRadius: '8px' };
const mobileCardFooter = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };

const jobTitle = { fontWeight: '700', color: '#111827', fontSize: '1rem' };
const companyInfo = { fontSize: '0.875rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' };
const posterInfo = { fontSize: '0.9rem', color: '#111827', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' };
const posterEmail = { fontSize: '0.8rem', color: '#9CA3AF', marginLeft: '20px' };

const dateText = { fontSize: '0.85rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '6px' };
const activeBadge = { backgroundColor: '#ECFDF5', color: '#059669', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase' };
const deleteBtn = { background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '8px' };

const loader = { padding: '100px', textAlign: 'center', fontWeight: '600', color: '#6B7280' };
const errorContainer = { padding: '40px', color: '#DC2626', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', fontWeight: '600' };
const emptyMsg = { padding: '40px', textAlign: 'center', color: '#9CA3AF' };

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

export default AdminJobs;