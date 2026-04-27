import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { ArrowLeft, Save, X, Briefcase, MapPin, DollarSign, AlignLeft } from 'lucide-react';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- STATE ---
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: '',
    type: 'Full-time'
  });

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchJob = async () => {
      try {
        // Adjust this URL to match your backend exactly
        const { data } = await axiosInstance.get(`/user/job/${id}`);
        if (data) {
          setFormData(data);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching job:", err);
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  // --- HANDLERS ---
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

  if (loading) return <div style={s.loader}>Gathering job details...</div>;

  return (
    <div style={s.container}>
      {/* --- TOP NAVIGATION --- */}
      <button onClick={() => navigate(-1)} style={s.backBtn}>
        <ArrowLeft size={18} /> Back to Postings
      </button>

      <header style={s.header}>
        <h1 style={s.title}>Edit Job Wave</h1>
        <p style={s.subtitle}>Modify the details for <strong>{formData.title || 'this posting'}</strong></p>
      </header>

      {/* --- FORM CARD --- */}
      <form onSubmit={handleSubmit} style={s.formCard}>

        {/* Job Title */}
        <div style={s.inputGroup}>
          <label style={s.label}><Briefcase size={16} color="#003A9B" /> Job Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Senior Full Stack Engineer"
            style={s.input}
            required
          />
        </div>

        <div style={s.row}>
          {/* Location */}
          <div style={{ ...s.inputGroup, flex: 1 }}>
            <label style={s.label}><MapPin size={16} color="#003A9B" /> Location</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Remote / Lagos, NG"
              style={s.input}
              required
            />
          </div>

          {/* Salary */}
          <div style={{ ...s.inputGroup, flex: 1 }}>
            <label style={s.label}><DollarSign size={16} color="#003A9B" /> Salary Range</label>
            <input
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g. $80k - $120k"
              style={s.input}
            />
          </div>
        </div>

        {/* Job Type Dropdown */}
        <div style={s.inputGroup}>
          <label style={s.label}>Employment Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            style={s.input}
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Freelance">Freelance</option>
          </select>
        </div>

        {/* Description */}
        <div style={s.inputGroup}>
          <label style={s.label}><AlignLeft size={16} color="#003A9B" /> Job Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the roles and responsibilities..."
            style={s.textarea}
            required
          />
        </div>

        <div style={s.btnGroup}>
          <button type="button" onClick={() => navigate(-1)} style={s.cancelBtn}>
            <X size={18} /> Cancel
          </button>
          <button type="submit" disabled={saving} style={s.saveBtn}>
            {saving ? 'Updating...' : <><Save size={18} /> Save Changes</>}
          </button>
        </div>
      </form>
    </div>
  );
};

// --- STYLING ---
const s = {
  container: {
    padding: '120px 24px 60px 24px',
    maxWidth: '900px',
    margin: '0 auto',
    fontFamily: "'Inter', sans-serif"
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'none',
    border: 'none',
    color: '#6B7280',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '24px',
    fontSize: '0.9rem'
  },
  header: { marginBottom: '32px' },
  title: { fontSize: '2.2rem', fontWeight: '900', color: '#111827', letterSpacing: '-1px', marginBottom: '8px' },
  subtitle: { color: '#6B7280', fontSize: '1.05rem' },

  formCard: {
    backgroundColor: '#FFFFFF',
    padding: '40px',
    borderRadius: '20px',
    border: '1px solid #EAEAEA',
    boxShadow: '0 10px 25px rgba(0,0,0,0.03)',
  },
  row: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
  inputGroup: { marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '10px' },
  label: { fontSize: '0.88rem', fontWeight: '700', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' },
  input: {
    padding: '14px 18px',
    borderRadius: '12px',
    border: '1px solid #D1D5DB',
    fontSize: '1rem',
    color: '#111827',
    outline: 'none',
    transition: 'border-color 0.2s',
    backgroundColor: '#F9FAFB'
  },
  textarea: {
    padding: '14px 18px',
    borderRadius: '12px',
    border: '1px solid #D1D5DB',
    fontSize: '1rem',
    minHeight: '180px',
    fontFamily: 'inherit',
    outline: 'none',
    backgroundColor: '#F9FAFB',
    resize: 'vertical'
  },
  btnGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '16px',
    marginTop: '40px',
    paddingTop: '30px',
    borderTop: '1px solid #F3F4F6'
  },
  cancelBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    borderRadius: '12px',
    border: '1px solid #D1D5DB',
    backgroundColor: '#FFF',
    color: '#4B5563',
    fontWeight: '700',
    cursor: 'pointer'
  },
  saveBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 32px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#003A9B',
    color: '#FFF',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0, 58, 155, 0.2)'
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#003A9B'
  }
};

export default EditJob;