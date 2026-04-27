import React, { useState } from 'react';
import { usePostJob } from '../hooks/usePostJob';
import { Briefcase, MapPin, DollarSign, AlignLeft, Building2, Globe, Sparkles, ArrowRight } from 'lucide-react';

// Inject responsive + animation styles
const STYLE_ID = 'post-job-styles';
if (!document.getElementById(STYLE_ID)) {
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

    .pj-wrap * { box-sizing: border-box; }

    /* Fade-up entrance */
    @keyframes pj-fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes pj-pulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.6; }
    }
    @keyframes pj-shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }

    .pj-wrap {
      animation: pj-fadeUp 0.55s ease both;
    }
    .pj-card {
      animation: pj-fadeUp 0.65s 0.1s ease both;
    }
    .pj-section-row {
      animation: pj-fadeUp 0.5s ease both;
    }

    /* Input focus glow */
    .pj-input:focus,
    .pj-select:focus,
    .pj-textarea:focus {
      outline: none;
      border-color: #003A9B !important;
      box-shadow: 0 0 0 4px rgba(0,58,155,0.10);
      background: #fff !important;
    }

    /* Submit button shimmer on hover */
    .pj-submit:not(:disabled):hover {
      background-position: right center;
      transform: translateY(-1px);
      box-shadow: 0 12px 32px rgba(0,58,155,0.38);
    }
    .pj-submit:not(:disabled):active {
      transform: translateY(0);
    }
    .pj-submit:disabled {
      animation: pj-pulse 1.4s ease infinite;
      cursor: not-allowed;
    }

    /* Responsive grid: 1 col mobile, 2 col tablet+ */
    .pj-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
    }
    @media (min-width: 640px) {
      .pj-grid { grid-template-columns: 1fr 1fr; }
    }

    /* Outer container padding */
    @media (max-width: 540px) {
      .pj-outer { padding: 0 0px !important; }
      .pj-card  { padding: 28px 18px !important; }
      .pj-title { font-size: 2rem !important; }
    }
    @media (min-width: 481px) and (max-width: 768px) {
      .pj-outer { padding: 0 24px !important; }
      .pj-card  { padding: 36px 28px !important; }
    }
    @media (min-width: 769px) {
      .pj-outer { padding: 0 32px !important; }
    }

    /* Label icon alignment */
    .pj-label {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Divider line */
    .pj-divider {
      height: 1px;
      background: linear-gradient(90deg, #E8EDF8 0%, #C7D4F0 50%, #E8EDF8 100%);
      margin: 36px 0;
    }
  `;
  document.head.appendChild(style);
}

const PostJob = () => {
  const { postJob, loading, error } = usePostJob();
  const [form, setForm] = useState({
    title: '', company: '', location: '', salary: '', type: 'Full-time', description: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); postJob(form); };

  return (
    <div className="pj-outer pj-wrap" style={outerContainer}>

      {/* ── Header ── */}
      <div style={headerSection}>
        <div style={badgeStyle}>
          <Sparkles size={13} style={{ marginRight: 5 }} />
          For Employers
        </div>
        <h1 className="pj-title" style={titleStyle}>
          Post a New Wave<span style={dotAccent}>.</span>
        </h1>
        <p style={subtitleStyle}>Reach the most talented developers and designers in the ecosystem.</p>
      </div>

      {/* ── Form Card ── */}
      <form onSubmit={handleSubmit} className="pj-card" style={formCard}>

        {error && <div style={errorBox}>{error}</div>}

        {/* Section 1 */}
        <div className="pj-section-row" style={sectionHeader}>
          <div style={sectionNumber}>1</div>
          <h3 style={sectionTitle}>Role Details</h3>
        </div>

        <div className="pj-grid">
          <div style={inputGroup}>
            <label className="pj-label" style={labelStyle}><Briefcase size={14} /> Job Title</label>
            <input className="pj-input" name="title" placeholder="e.g. Senior Product Designer" onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={inputGroup}>
            <label className="pj-label" style={labelStyle}><Building2 size={14} /> Company Name</label>
            <input className="pj-input" name="company" placeholder="e.g. WorkWave Inc." onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={inputGroup}>
            <label className="pj-label" style={labelStyle}><Globe size={14} /> Job Type</label>
            <select className="pj-select" name="type" onChange={handleChange} style={selectStyle}>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div style={inputGroup}>
            <label className="pj-label" style={labelStyle}><MapPin size={14} /> Location</label>
            <input className="pj-input" name="location" placeholder="e.g. Remote or Lagos, Nigeria" onChange={handleChange} required style={inputStyle} />
          </div>
        </div>

        <div className="pj-divider" />

        {/* Section 2 */}
        <div className="pj-section-row" style={sectionHeader}>
          <div style={sectionNumber}>2</div>
          <h3 style={sectionTitle}>Salary & Description</h3>
        </div>

        <div style={inputGroup}>
          <label className="pj-label" style={labelStyle}><DollarSign size={14} /> Salary Range <span style={optionalTag}>(Optional)</span></label>
          <input className="pj-input" name="salary" placeholder="e.g. $50k–$80k or ₦500,000–₦800,000" onChange={handleChange} style={inputStyle} />
        </div>

        <div style={{ ...inputGroup, marginTop: '20px' }}>
          <label className="pj-label" style={labelStyle}><AlignLeft size={14} /> Description</label>
          <textarea
            className="pj-textarea"
            name="description"
            placeholder="What will they do? What skills and experience are required?"
            onChange={handleChange}
            required
            style={textareaStyle}
          />
        </div>

        {/* Footer */}
        <div style={footerSection}>
          <div style={footerInner}>
            <button type="submit" disabled={loading} className="pj-submit" style={submitBtnStyle}>
              {loading ? 'Publishing Wave…' : (
                <><span>Publish Job Posting</span><ArrowRight size={17} style={{ marginLeft: 8 }} /></>
              )}
            </button>
            <p style={finePrint}>By publishing, you agree to WorkWave's community guidelines.</p>
          </div>
        </div>

      </form>
    </div>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const outerContainer  = { maxWidth: '850px', margin: '0 auto', paddingBottom: '80px', };

const headerSection   = { paddingTop: '52px', marginBottom: '36px' };

const badgeStyle      = { display: 'inline-flex', alignItems: 'center', backgroundColor: '#EEF2FF', color: '#003A9B', fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '6px 14px', borderRadius: '99px', marginBottom: '20px', border: '1px solid #C7D4F0' };

const titleStyle      = { fontSize: '2.6rem', fontWeight: '800', color: '#1A1A1A', margin: '0 0 12px', lineHeight: 1.1, letterSpacing: '-0.02em' };

const dotAccent       = { color: '#003A9B' };

const subtitleStyle   = { color: '#666', fontSize: '1rem', margin: 0, lineHeight: 1.6, maxWidth: '480px' };

const formCard        = { backgroundColor: '#fff', borderRadius: '20px', padding: '44px 40px', border: '1px solid #E4E9F5', boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 20px 60px rgba(0,58,155,0.06)' };

const errorBox        = { backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '14px 18px', borderRadius: '10px', fontSize: '0.875rem', marginBottom: '28px', fontWeight: '500' };

const sectionHeader   = { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' };

const sectionNumber   = { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#003A9B', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '800', flexShrink: 0, };

const sectionTitle    = { fontWeight: '700', fontSize: '1.1rem', color: '#1A1A1A', margin: 0, letterSpacing: '-0.01em' };

const inputGroup      = { display: 'flex', flexDirection: 'column', gap: '8px' };

const labelStyle      = { fontSize: '0.82rem', fontWeight: '600', color: '#1A1A1A', letterSpacing: '0.01em' };

const optionalTag     = { color: '#999', fontWeight: '400', marginLeft: '4px' };

const sharedField     = { width: '100%', padding: '13px 16px', border: '1.5px solid #E4E9F5', borderRadius: '10px', fontSize: '0.9rem', color: '#1A1A1A', backgroundColor: '#F8FAFF', transition: 'all 0.2s ease', fontFamily: "'DM Sans', sans-serif" };

const inputStyle      = { ...sharedField };

const selectStyle     = { ...sharedField, cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' };

const textareaStyle   = { ...sharedField, minHeight: '160px', resize: 'vertical', lineHeight: '1.65' };

const footerSection   = { marginTop: '36px', paddingTop: '28px', borderTop: '1px solid #F0F3FA' };

const footerInner     = { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px' };

const submitBtnStyle  = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '15px 32px', background: 'linear-gradient(135deg, #003A9B 0%, #0052CC 50%, #0070E0 100%)', backgroundSize: '200% auto', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 6px 20px rgba(0,58,155,0.28)', letterSpacing: '0.01em', fontFamily: "'DM Sans', sans-serif", width: '100%', maxWidth: '300px' };

const finePrint       = { color: '#999', fontSize: '0.78rem', margin: 0, lineHeight: 1.5 };

export default PostJob;