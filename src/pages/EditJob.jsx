import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { ArrowLeft, Save, X, Briefcase, MapPin, DollarSign, AlignLeft, ChevronDown } from 'lucide-react';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: '',
    type: 'Full-time'
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await axiosInstance.get(`/user/job/${id}`);
        if (data) setFormData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching job:", err);
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosInstance.put(`/user/job/${id}`, formData);
      navigate('/dashboard/my-jobs');
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update job posting.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={s.loaderWrap}>
      <div style={s.loaderDot} />
      <div style={{ ...s.loaderDot, animationDelay: '0.15s' }} />
      <div style={{ ...s.loaderDot, animationDelay: '0.3s' }} />
      <style>{loaderAnim}</style>
    </div>
  );

  return (
    <div style={s.page}>
      <style>{css}</style>

      {/* Background accent */}
      <div style={s.bgAccent} />

      <div style={s.container}>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          style={s.backBtn}
          className="back-btn"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          <span>My Postings</span>
        </button>

        {/* Header */}
        <header style={s.header}>
          <div style={s.headerTag}>Job Posting</div>
          <h1 style={s.title}>
            Edit <span style={s.titleAccent}>Wave</span>
          </h1>
          <p style={s.subtitle}>
            Refine your listing for <strong style={s.jobNameHighlight}>{formData.title || 'this posting'}</strong>
          </p>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} style={s.form}>

          {/* Job Title */}
          <div style={s.fieldWrap} className="field-wrap">
            <label style={s.label}>
              <Briefcase size={14} strokeWidth={2.5} />
              Job Title
            </label>
            <div style={{
              ...s.inputWrap,
              ...(focusedField === 'title' ? s.inputWrapFocused : {})
            }}>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                onFocus={() => setFocusedField('title')}
                onBlur={() => setFocusedField(null)}
                placeholder="e.g. Senior Full Stack Engineer"
                style={s.input}
                required
              />
            </div>
          </div>

          {/* Row: Location + Salary */}
          <div style={s.row}>
            <div style={{ ...s.fieldWrap, flex: 1 }} className="field-wrap">
              <label style={s.label}>
                <MapPin size={14} strokeWidth={2.5} />
                Location
              </label>
              <div style={{
                ...s.inputWrap,
                ...(focusedField === 'location' ? s.inputWrapFocused : {})
              }}>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('location')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Remote / Lagos, NG"
                  style={s.input}
                  required
                />
              </div>
            </div>

            <div style={{ ...s.fieldWrap, flex: 1 }} className="field-wrap">
              <label style={s.label}>
                <DollarSign size={14} strokeWidth={2.5} />
                Salary Range
              </label>
              <div style={{
                ...s.inputWrap,
                ...(focusedField === 'salary' ? s.inputWrapFocused : {})
              }}>
                <input
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('salary')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="$80k – $120k"
                  style={s.input}
                />
              </div>
            </div>
          </div>

          {/* Employment Type */}
          <div style={s.fieldWrap} className="field-wrap">
            <label style={s.label}>Employment Type</label>
            <div style={{
              ...s.inputWrap,
              ...s.selectWrap,
              ...(focusedField === 'type' ? s.inputWrapFocused : {})
            }}>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                onFocus={() => setFocusedField('type')}
                onBlur={() => setFocusedField(null)}
                style={{ ...s.input, ...s.select }}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
              </select>
              <ChevronDown size={16} style={s.chevron} strokeWidth={2.5} />
            </div>
          </div>

          {/* Description */}
          <div style={s.fieldWrap} className="field-wrap">
            <label style={s.label}>
              <AlignLeft size={14} strokeWidth={2.5} />
              Job Description
            </label>
            <div style={{
              ...s.inputWrap,
              ...(focusedField === 'description' ? s.inputWrapFocused : {})
            }}>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                onFocus={() => setFocusedField('description')}
                onBlur={() => setFocusedField(null)}
                placeholder="Describe the roles, responsibilities, and requirements..."
                style={s.textarea}
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div style={s.actions}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={s.cancelBtn}
              className="cancel-btn"
            >
              <X size={16} strokeWidth={2.5} />
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={saving ? { ...s.saveBtn, opacity: 0.7 } : s.saveBtn}
              className="save-btn"
            >
              {saving ? (
                <span style={s.savingText}>Saving…</span>
              ) : (
                <>
                  <Save size={16} strokeWidth={2.5} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

/* ─── Styles ─────────────────────────────────────────────── */

const BLUE = '#0A3BC1';
const BLUE_LIGHT = '#EEF2FF';
const BLUE_MID = '#3B5FDB';

const s = {
  page: {
    minHeight: '100vh',
    background: '#F7F8FC',
    fontFamily: "'Sora', 'DM Sans', 'Segoe UI', sans-serif",
    position: 'relative',
    overflowX: 'hidden',
  },
  bgAccent: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '340px',
    background: `linear-gradient(135deg, ${BLUE} 0%, ${BLUE_MID} 60%, #6C8EFF 100%)`,
    zIndex: 0,
    pointerEvents: 'none',
  },
  container: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '780px',
    margin: '0 auto',
    padding: '48px 20px 80px',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.3)',
    backdropFilter: 'blur(8px)',
    color: '#fff',
    fontFamily: 'inherit',
    fontWeight: '600',
    fontSize: '0.82rem',
    letterSpacing: '0.02em',
    padding: '8px 16px',
    borderRadius: '100px',
    cursor: 'pointer',
    marginBottom: '36px',
    transition: 'background 0.2s, transform 0.15s',
  },
  header: {
    marginBottom: '36px',
  },
  headerTag: {
    display: 'inline-block',
    background: 'rgba(255,255,255,0.2)',
    border: '1px solid rgba(255,255,255,0.35)',
    color: '#fff',
    fontSize: '0.72rem',
    fontWeight: '700',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    padding: '4px 12px',
    borderRadius: '100px',
    marginBottom: '14px',
  },
  title: {
    fontSize: 'clamp(2rem, 5vw, 2.9rem)',
    fontWeight: '800',
    color: '#fff',
    letterSpacing: '-0.03em',
    lineHeight: 1.1,
    margin: '0 0 10px',
  },
  titleAccent: {
    color: '#A5BFFF',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: '0.97rem',
    fontWeight: '400',
    margin: 0,
  },
  jobNameHighlight: {
    color: '#fff',
    fontWeight: '700',
  },

  form: {
    background: '#fff',
    borderRadius: '20px',
    padding: 'clamp(24px, 5vw, 44px)',
    boxShadow: '0 20px 60px rgba(10,59,193,0.08), 0 2px 8px rgba(0,0,0,0.04)',
    border: '1px solid rgba(10,59,193,0.08)',
  },

  row: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },

  fieldWrap: {
    marginBottom: '22px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    minWidth: '200px',
  },

  label: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.78rem',
    fontWeight: '700',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#5465A0',
  },

  inputWrap: {
    borderRadius: '12px',
    border: '1.5px solid #E2E6F0',
    background: '#FAFBFF',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    overflow: 'hidden',
  },
  inputWrapFocused: {
    borderColor: BLUE,
    boxShadow: `0 0 0 3px rgba(10,59,193,0.1)`,
    background: '#fff',
  },
  selectWrap: {
    position: 'relative',
  },

  input: {
    width: '100%',
    padding: '13px 16px',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: '0.96rem',
    color: '#1A2340',
    fontFamily: 'inherit',
    fontWeight: '500',
    boxSizing: 'border-box',
  },
  select: {
    appearance: 'none',
    paddingRight: '40px',
    cursor: 'pointer',
  },
  chevron: {
    position: 'absolute',
    right: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#8896C4',
    pointerEvents: 'none',
  },
  textarea: {
    width: '100%',
    padding: '14px 16px',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: '0.96rem',
    color: '#1A2340',
    fontFamily: 'inherit',
    fontWeight: '500',
    minHeight: '160px',
    resize: 'vertical',
    boxSizing: 'border-box',
    lineHeight: 1.6,
  },

  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '12px',
    paddingTop: '28px',
    borderTop: '1px solid #EEF0F6',
    flexWrap: 'wrap',
  },
  cancelBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
    padding: '12px 22px',
    borderRadius: '12px',
    border: '1.5px solid #DDE1EE',
    background: '#fff',
    color: '#5465A0',
    fontFamily: 'inherit',
    fontWeight: '700',
    fontSize: '0.88rem',
    cursor: 'pointer',
    transition: 'background 0.15s, border-color 0.15s',
  },
  saveBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 28px',
    borderRadius: '12px',
    border: 'none',
    background: `linear-gradient(135deg, ${BLUE} 0%, ${BLUE_MID} 100%)`,
    color: '#fff',
    fontFamily: 'inherit',
    fontWeight: '700',
    fontSize: '0.88rem',
    cursor: 'pointer',
    boxShadow: `0 4px 16px rgba(10,59,193,0.3)`,
    transition: 'opacity 0.2s, transform 0.15s, box-shadow 0.15s',
  },
  savingText: {
    letterSpacing: '0.04em',
  },

  loaderWrap: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    gap: '8px',
    background: '#F7F8FC',
  },
  loaderDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: BLUE,
    animation: 'bounce 0.6s infinite alternate',
  },
};

const loaderAnim = `
  @keyframes bounce {
    from { transform: translateY(0); opacity: 0.4; }
    to   { transform: translateY(-12px); opacity: 1; }
  }
`;

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');

  * { box-sizing: border-box; }

  .back-btn:hover {
    background: rgba(255,255,255,0.25) !important;
    transform: translateX(-2px);
  }
  .cancel-btn:hover {
    background: #F4F6FF !important;
    border-color: #B0BADF !important;
  }
  .save-btn:hover:not(:disabled) {
    box-shadow: 0 6px 24px rgba(10,59,193,0.4) !important;
    transform: translateY(-1px);
  }
  .save-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  input::placeholder,
  textarea::placeholder {
    color: #AAB4D4;
    font-weight: 400;
  }

  /* Responsive: stack row on small screens */
  @media (max-width: 540px) {
    .field-wrap {
      min-width: 100% !important;
    }
  }
`;

export default EditJob;