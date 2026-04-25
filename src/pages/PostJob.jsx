import React, { useState } from 'react';
import { usePostJob } from '../hooks/usePostJob';
import { Briefcase, MapPin, DollarSign, AlignLeft, Building2, Globe } from 'lucide-react';

const PostJob = () => {
  const { postJob, loading, error } = usePostJob();
  const [form, setForm] = useState({
    title: '', company: '', location: '', salary: '', type: 'Full-time', description: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    postJob(form);
  };

  return (
    <div style={container}>
      <div style={headerSection}>
        <div style={badgeStyle}>For Employers</div>
        <h1 style={titleStyle}>Post a New Wave<span>.</span></h1>
        <p style={subtitleStyle}>Reach the most talented developers and designers in the ecosystem.</p>
      </div>

      <form onSubmit={handleSubmit} style={formCard}>
        {error && <div style={errorBox}>{error}</div>}

        {/* SECTION 1: ROLE DETAILS */}
        <div style={sectionHeader}>
          <div style={sectionNumber}>1</div>
          <h3 style={sectionTitle}>Role Details</h3>
        </div>

        <div style={inputGrid}>
          <div style={inputGroup}>
            <label style={labelStyle}><Briefcase size={14} /> Job Title</label>
            <input name="title" placeholder="e.g. Senior Product Designer" onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}><Building2 size={14} /> Company Name</label>
            <input name="company" placeholder="e.g. WorkWave Inc." onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}><Globe size={14} /> Job Type</label>
            <select name="type" onChange={handleChange} style={selectStyle}>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}><MapPin size={14} /> Location</label>
            <input name="location" placeholder="e.g. Remote or Lagos, Nigeria" onChange={handleChange} required style={inputStyle} />
          </div>
        </div>

        {/* SECTION 2: COMPENSATION & DESCRIPTION */}
        <div style={{ ...sectionHeader, marginTop: '40px' }}>
          <div style={sectionNumber}>2</div>
          <h3 style={sectionTitle}>Salary & Description</h3>
        </div>

        <div style={inputGroup}>
          <label style={labelStyle}><DollarSign size={14} /> Salary Range (Optional)</label>
          <input name="salary" placeholder="e.g. $50k - $80k or ₦500,000 - ₦800,000" onChange={handleChange} style={inputStyle} />
        </div>

        <div style={{ ...inputGroup, marginTop: '24px' }}>
          <label style={labelStyle}><AlignLeft size={14} /> Description</label>
          <textarea 
            name="description" 
            placeholder="What will they do? What are the requirements?" 
            onChange={handleChange} 
            required 
            style={textareaStyle} 
          />
        </div>

        <div style={footerSection}>
           <button type="submit" disabled={loading} style={submitBtnStyle}>
            {loading ? 'Publishing Wave...' : 'Publish Job Posting'}
          </button>
          <p style={finePrint}>By publishing, you agree to WorkWave's community guidelines.</p>
        </div>
      </form>
    </div>
  );
};

// --- PREMIUM STYLES ---

const container = { 
  maxWidth: '720px', 
  margin: '40px auto', 
  padding: '0 20px',
  fontFamily: "'Inter', sans-serif" 
};

const headerSection = { marginBottom: '40px' };

const badgeStyle = {
  backgroundColor: '#EBF4FF',
  color: '#003A9B',
  padding: '6px 12px',
  borderRadius: '20px',
  fontSize: '0.75rem',
  fontWeight: '700',
  textTransform: 'uppercase',
  display: 'inline-block',
  marginBottom: '16px'
};

const titleStyle = { 
  fontSize: '2.5rem', 
  fontWeight: '800', 
  color: '#1A1A1A', 
  letterSpacing: '-1.5px',
  margin: 0
};

const subtitleStyle = { 
  color: '#666', 
  marginTop: '8px', 
  fontSize: '1.1rem',
  lineHeight: '1.5' 
};

const formCard = { 
  backgroundColor: '#FFF', 
  padding: '48px', 
  borderRadius: '24px', 
  border: '1px solid #F0F0F0', 
  boxShadow: '0 20px 50px rgba(0,0,0,0.04)' 
};

const sectionHeader = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '24px'
};

const sectionNumber = {
  width: '28px',
  height: '28px',
  backgroundColor: '#003A9B',
  color: '#FFF',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.8rem',
  fontWeight: '700'
};

const sectionTitle = {
  fontSize: '1.1rem',
  fontWeight: '700',
  color: '#1A1A1A',
  margin: 0
};

const inputGrid = { 
  display: 'grid', 
  gridTemplateColumns: '1fr 1fr', 
  gap: '24px' 
};

const inputGroup = { display: 'flex', flexDirection: 'column', gap: '10px' };

const labelStyle = { 
  fontSize: '0.85rem', 
  fontWeight: '600', 
  color: '#4A5568', 
  display: 'flex', 
  alignItems: 'center', 
  gap: '6px' 
};

const inputStyle = { 
  padding: '14px', 
  borderRadius: '12px', 
  border: '1px solid #E2E8F0', 
  fontSize: '1rem', 
  outline: 'none', 
  backgroundColor: '#F9FAFB',
  transition: 'all 0.2s ease',
  width: '100%',
  boxSizing: 'border-box'
};

// FIXED: Removed the SVG string that caused the Vite Parse Error
const selectStyle = { 
  ...inputStyle, 
  cursor: 'pointer',
  paddingRight: '40px',
  backgroundImage: 'linear-gradient(45deg, transparent 50%, #4A5568 50%), linear-gradient(135deg, #4A5568 50%, transparent 50%)',
  backgroundPosition: 'calc(100% - 20px) calc(1em + 2px), calc(100% - 15px) calc(1em + 2px)',
  backgroundSize: '5px 5px, 5px 5px',
  backgroundRepeat: 'no-repeat',
  appearance: 'none',
  WebkitAppearance: 'none'
};

const textareaStyle = { 
  ...inputStyle, 
  minHeight: '180px', 
  lineHeight: '1.6',
  resize: 'vertical' 
};

const footerSection = {
  marginTop: '40px',
  textAlign: 'center'
};

const submitBtnStyle = { 
  width: '100%', 
  backgroundColor: '#003A9B', 
  color: '#FFF', 
  padding: '18px', 
  borderRadius: '14px', 
  border: 'none', 
  fontWeight: '700', 
  fontSize: '1.1rem', 
  cursor: 'pointer',
  boxShadow: '0 10px 20px rgba(0, 58, 155, 0.2)',
  transition: 'transform 0.2s ease'
};

const finePrint = {
  fontSize: '0.8rem',
  color: '#A0AEC0',
  marginTop: '16px'
};

const errorBox = { 
  backgroundColor: '#FFF5F5', 
  color: '#C53030', 
  padding: '16px', 
  borderRadius: '12px', 
  marginBottom: '32px', 
  fontSize: '0.9rem', 
  border: '1px solid #FED7D7',
  textAlign: 'center' 
};
export default PostJob;