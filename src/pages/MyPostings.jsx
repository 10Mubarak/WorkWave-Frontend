import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useJobs } from '../hooks/useJobs';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Edit3, ExternalLink, ShieldCheck, Clock, AlertTriangle, X } from 'lucide-react';

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return 'Unknown Date';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return 'Unknown Date';
  }
};

const isOwnerCheck = (job, user) =>
  user && (job.postedBy === user._id || job.postedBy?._id === user._id);

const canManageCheck = (job, user) =>
  isOwnerCheck(job, user) || (user && user.role === 'admin');

// Inject CSS media-query styles once (handles all breakpoints without JS)
const STYLE_ID = 'my-postings-styles';
if (!document.getElementById(STYLE_ID)) {
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .mp-card-list  { display: flex; flex-direction: column; }
    .mp-table-wrapper { display: none; }

    @media (min-width: 640px) {
      .mp-job-card {
        flex-direction: row !important;
        align-items: center !important;
        gap: 0 !important;
      }
      .mp-card-meta-col { display: flex !important; }
      .mp-btn-view-full { width: auto !important; justify-content: flex-start !important; }
    }

    @media (min-width: 900px) {
      .mp-card-list     { display: none; }
      .mp-table-wrapper { display: block; overflow-x: auto; }
      .mp-tbody-row:hover { background: #FAFAFA; }
      .mp-btn-view-table:hover { background: #F3F4F6; border-color: #D1D5DB; }
    }
  `;
  document.head.appendChild(style);
}

// ── Component ─────────────────────────────────────────────────────────────────
const MyPostings = () => {
  const { jobs, loading, deleteJob } = useJobs();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const filteredJobs = jobs.filter((job) => isOwnerCheck(job, user));

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  const handleDelete = (id) => {
    setJobToDelete(id);
    setShowDeleteModal(true);
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/edit-job/${id}`);
  };

  const confirmDelete = () => {
    if (jobToDelete) {
      deleteJob(jobToDelete);
      setShowDeleteModal(false);
      setJobToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setJobToDelete(null);
  };

  return (
    <div style={container}>
      <div style={headerRow}>
        <h1 style={pageTitle}>Global Career Waves</h1>
        <p style={pageSubtitle}>Browse all opportunities. You have full control over the ones you posted.</p>
      </div>

      <div style={tableCard}>
        {loading ? (
          <div style={stateBox}>🌊 Catching the waves…</div>
        ) : filteredJobs.length === 0 ? (
          <div style={stateBox}>You have not posted any jobs yet.</div>
        ) : (
          <>
            {/* ── MOBILE / TABLET: card list ── */}
            <div className="mp-card-list">
              {filteredJobs.map((job) => {
                const isOwner = isOwnerCheck(job, user);
                const canManage = canManageCheck(job, user);

                return (
                  <div key={job._id} className="mp-job-card" style={mobileCard}>
                    {/* Title + company */}
                    <div style={cardMain}>
                      <div style={cardTop}>
                        <div>
                          <div style={roleWrapper}>
                            {job.title}
                            {isOwner && <span style={ownerBadge}>Your Post</span>}
                          </div>
                          <div style={companyText}>{job.company}</div>
                        </div>
                        {job.creatorRole === 'admin' && <ShieldCheck size={18} color="#059669" style={{ flexShrink: 0 }} />}
                      </div>
                    </div>

                    {/* Date — hidden on mobile, shown as flex on tablet+ */}
                    <div className="mp-card-meta-col" style={cardMetaCol}>
                      <div style={dateLine}>
                        <Clock size={13} />
                        {formatDate(job.createdAt)}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={cardActions}>
                      {canManage ? (
                        <div style={actionGroup}>
                          <button style={editBtn} onClick={() => handleEdit(job._id)}><Edit3 size={16} /> Edit</button>
                          <button style={deleteBtn} onClick={() => handleDelete(job._id)}><Trash2 size={16} /> Delete</button>
                        </div>
                      ) : (
                        <Link to={`/job/view/${job._id}`} className="mp-btn-view-full" style={viewBtnFull}>
                          View Details <ExternalLink size={15} />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── DESKTOP: table ── */}
            <div className="mp-table-wrapper">
              <table style={tableStyle}>
                <thead>
                  <tr style={tableHeaderRow}>
                    <th style={thStyle}>Role</th>
                    <th style={thStyle}>Authority</th>
                    <th style={thStyle}>Date Created</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => {
                    const isOwner = isOwnerCheck(job, user);
                    const canManage = canManageCheck(job, user);

                    return (
                      <tr key={job._id} className="mp-tbody-row" style={tableBodyRow}>
                        <td style={tdTitle}>
                          <div style={roleWrapper}>
                            {job.title}
                            {isOwner && <span style={ownerBadge}>Your Post</span>}
                          </div>
                          <div style={companyText}>{job.company}</div>
                        </td>
                        <td style={tdData}>
                          {job.creatorRole === 'admin' ? (
                            <span style={adminRef}><ShieldCheck size={14} /> Official</span>
                          ) : (
                            <span style={userRef}>Community</span>
                          )}
                        </td>
                        <td style={tdData}>{formatDate(job.createdAt)}</td>
                        <td style={actionCell}>
                          {canManage ? (
                            <div style={actionGroup}>
                              <button style={editBtn} title="Edit" onClick={() => handleEdit(job._id)}><Edit3 size={16} /></button>
                              <button style={deleteBtn} title="Delete" onClick={() => handleDelete(job._id)}><Trash2 size={16} /></button>
                            </div>
                          ) : (
                            <Link to={`/job/view/${job._id}`} className="mp-btn-view-table" style={viewBtnTable}>
                              <ExternalLink size={14} /> View
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {showDeleteModal && (
        <div style={modalBackdrop}>
          <div style={modalContainer}>
            <div style={modalHeader}>
              <AlertTriangle size={24} color="#DC2626" />
              <h3 style={modalTitle}>Confirm Deletion</h3>
              <button style={modalCloseBtn} onClick={cancelDelete}>
                <X size={20} />
              </button>
            </div>
            <div style={modalBody}>
              <p style={modalMessage}>
                Are you sure you want to delete this job posting? This action cannot be undone.
              </p>
            </div>
            <div style={modalFooter}>
              <button style={cancelBtn} onClick={cancelDelete}>
                Cancel
              </button>
              <button style={confirmBtn} onClick={confirmDelete}>
                Delete Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const container = { padding: '0 0px', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box' };
const headerRow = { marginBottom: '28px', paddingTop: '40px' };
const pageTitle = { fontSize: '1.9rem', fontWeight: '800', color: '#111827', margin: '0 0 6px' };
const pageSubtitle = { color: '#6B7280', fontSize: '1rem', margin: 0 };

const tableCard = { backgroundColor: '#FFF', borderRadius: '16px', border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' };
const stateBox = { padding: '60px 24px', textAlign: 'center', color: '#9CA3AF', fontSize: '0.95rem' };

// Mobile card
const mobileCard = { padding: '18px 16px', borderBottom: '1px solid #F3F4F6', display: 'flex', flexDirection: 'column', gap: '12px' };
const cardMain = { flex: 1, minWidth: 0 };
const cardTop = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' };
const cardMetaCol = { display: 'none', alignItems: 'center', gap: '20px', flexShrink: 0, marginLeft: '16px' };
const cardActions = { display: 'flex' };
const dateLine = { display: 'flex', alignItems: 'center', gap: '5px', color: '#9CA3AF', fontSize: '0.8rem' };

// Desktop table
const tableStyle = { width: '100%', borderCollapse: 'collapse', minWidth: '680px' };
const tableHeaderRow = { backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' };
const thStyle = { padding: '16px 24px', fontSize: '0.72rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left', whiteSpace: 'nowrap' };
const tableBodyRow = { borderBottom: '1px solid #F3F4F6', transition: 'background 0.15s' };
const tdTitle = { padding: '20px 24px' };
const tdData = { padding: '20px 24px', fontSize: '0.875rem', color: '#374151', whiteSpace: 'nowrap' };
const actionCell = { padding: '20px 24px' };

// Shared
const roleWrapper = { fontWeight: '700', color: '#111827', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' };
const companyText = { fontSize: '0.82rem', color: '#6B7280', marginTop: '3px' };
const ownerBadge = { backgroundColor: '#EFF6FF', color: '#1E40AF', padding: '2px 8px', borderRadius: '99px', fontSize: '0.68rem', fontWeight: '600', whiteSpace: 'nowrap' };
const actionGroup = { display: 'flex', gap: '12px' };
const editBtn = { background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', fontSize: '0.875rem', padding: '8px 0', minHeight: '44px' };
const deleteBtn = { background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', fontSize: '0.875rem', padding: '8px 0', minHeight: '44px' };
const viewBtnFull = { border: '1px solid #E5E7EB', color: '#374151', padding: '10px 16px', borderRadius: '8px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: '600', minHeight: '44px', width: '100%', justifyContent: 'center', boxSizing: 'border-box' };
const viewBtnTable = { border: '1px solid #E5E7EB', color: '#374151', padding: '7px 14px', borderRadius: '7px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '600', transition: 'background 0.15s, border-color 0.15s' };
const adminRef = { display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#059669', fontWeight: '600', fontSize: '0.875rem' };
const userRef = { color: '#9CA3AF', fontSize: '0.875rem' };

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
  fontSize: '1.5rem',
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

export default MyPostings;