import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, ArrowRight, Star } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useJobs } from '../hooks/useJobs';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { jobs, loading, error } = useJobs();
  const navigate = useNavigate();

  // Helper to handle protected actions
  const handleProtectedAction = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <>
      <Navigation />
      <div style={pageContainer}>
        {/* --- HERO SECTION --- */}
        <section style={heroSection}>
          <div style={heroContent}>
            <div style={badgeStyle}>
              <Star size={14} fill="#003A9B" /> <span>Trusted by 500+ Tech Companies</span>
            </div>
            <h1 style={heroTitle}>
              The premier network <br /> for top-tier tech talent.
            </h1>
            <p style={heroSubtitle}>
              Curated opportunities for developers, designers, and innovators <br />
              across Nigeria and the global remote market.
            </p>

            <button style={getStartedButton} onClick={handleProtectedAction}>
              Get started
            </button>
            

            {/* Search Bar - Redirects to Login */}
            <div style={searchBarContainer}>
              <div style={searchField}>
                <Search size={20} color="#666" />
                <input type="text" placeholder="Role, company, or technology" style={searchInput} />
              </div>
              <div style={divider} />
              <div style={searchField}>
                <MapPin size={20} color="#666" />
                <input type="text" placeholder="Location" style={searchInput} />
              </div>
              <button style={searchButton} onClick={handleProtectedAction}>
                Search
              </button>
            </div>

            {/* Get Started Button */}
            {/* <button style={getStartedButton} onClick={handleProtectedAction}>
              Get started
            </button> */}
          </div>
        </section>

        {/* --- JOB FEED --- */}
        <main style={feedSection}>
          <div style={feedHeader}>
            <h2 style={sectionTitle}>Featured Opportunities</h2>
            {/* <button style={filterButton} onClick={handleProtectedAction}>Latest Posts</button> */}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <p>Catching the latest waves... </p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#dc2626' }}>
              <p>{error}</p>
            </div>
          ) : (
            <div style={jobGrid}>
              {jobs.slice(0, 9).map((job) => (
                <div key={job._id} style={jobCard}>
                  <div style={cardHeader}>
                    <div style={companyLogoPlaceholder}>
                      {job.company ? job.company.substring(0, 2).toUpperCase() : 'WW'}
                    </div>
                    <div>
                      <h3 style={jobTitle}>{job.title}</h3>
                      <p style={companyName}>{job.company}</p>
                    </div>
                  </div>

                  <div style={metaRow}>
                    <div style={metaItem}><MapPin size={16} /> {job.location}</div>
                    <div style={metaItem}><Briefcase size={16} /> {job.type || 'Full-time'}</div>
                    {job.salary && <div style={salaryBadge}>{job.salary}</div>}
                  </div>

                  <p style={jobExcerpt}>
                    {job.description ? job.description.substring(0, 100) + '...' : 'Sign in to see full details about this role.'}
                  </p>

                  {/* Apply/View Button - Redirects to Login */}
                  <button style={viewBtn} onClick={handleProtectedAction}>
                    Login to Apply <ArrowRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

// --- STYLES ---
const pageContainer = {
  background: 'linear-gradient(180deg, #F9FAFB 0%, #F3F4F6 100%)',
  minHeight: '100vh'
};

const heroSection = {
  backgroundColor: '#FFFFFF',
  padding: '80px 20px',
  textAlign: 'center',
  borderBottom: '1px solid #EAEAEA',
  marginTop: '80px',
};

const heroContent = {
  maxWidth: '900px',
  margin: '0 auto'
};

const badgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  background: 'linear-gradient(135deg, rgba(0,58,155,0.08), rgba(0,58,155,0.02))',
  color: '#003A9B',
  padding: '8px 18px',
  borderRadius: '999px',
  fontSize: '0.8rem',
  fontWeight: '700',
  marginBottom: '24px'
};

const heroTitle = {
  fontSize: '4rem',
  fontWeight: '900',
  color: '#1A1A1A',
  lineHeight: '1.15',
  letterSpacing: '-2px'
};

const heroSubtitle = {
  fontSize: '1.1rem',
  color: '#6B7280',
  margin: '20px auto 40px auto',
  maxWidth: '650px',
  lineHeight: '1.6'
};

const searchBarContainer = {
  display: 'flex',
  backgroundColor: '#FFF',
  padding: '8px',
  borderRadius: '50px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
  maxWidth: '850px',
  margin: '0 auto',
  border: '1px solid #EAEAEA'
};

const searchField = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  padding: '0 14px',
  gap: '10px'
};

const searchInput = {
  border: 'none',
  outline: 'none',
  width: '100%',
  fontSize: '1rem',
  background: 'transparent'
};

const divider = {
  width: '1px',
  backgroundColor: '#EAEAEA',
  margin: '10px 0'
};

const searchButton = {
  background: 'linear-gradient(135deg, #003A9B, #0052CC)',
  color: '#FFF',
  padding: '14px 32px',
  borderRadius: '40px',
  border: 'none',
  fontWeight: '700',
  cursor: 'pointer',
  fontSize: '1rem',
  // boxShadow: '0 8px 20px rgba(0,58,155,0.25)'
};

const getStartedButton = {
  display: 'block',
  width: '100%',
  maxWidth: '150px',
  margin: '0px auto 40px',
  background: 'linear-gradient(135deg, #003A9B, #0052CC)',
  color: '#FFF',
  padding: '14px 20px',
  borderRadius: '40px',
  border: 'none',
  fontWeight: '700',
  cursor: 'pointer',
  fontSize: '1.1rem',
  // boxShadow: '0 10px 25px rgba(0,58,155,0.3)',
  transition: 'all 0.3s ease',
  textAlign: 'center'
};

const feedSection = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '60px 20px'
};

const feedHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '32px'
};

const sectionTitle = {
  fontSize: '1.7rem',
  fontWeight: '900',
  color: '#111827'
};

const filterButton = {
  padding: '10px 18px',
  borderRadius: '12px',
  border: '1px solid #E5E7EB',
  backgroundColor: '#FFF',
  cursor: 'pointer',
  fontWeight: '600',
  color: '#374151',
  transition: 'all 0.2s'
};

const jobGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '22px'
};

/* 🔥 PREMIUM JOB CARD */
const jobCard = {
  background: 'rgba(255,255,255,0.85)',
  backdropFilter: 'blur(10px)',
  padding: '28px',
  borderRadius: '24px',
  border: '1px solid rgba(0,0,0,0.05)',
  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
  transition: 'all 0.3s ease',
  cursor: 'pointer'
};

// const jobCardHover = {
//   transform: 'translateY(-8px)',
//   boxShadow: '0 20px 50px rgba(0,0,0,0.08)'
// };

const cardHeader = {
  display: 'flex',
  gap: '16px',
  marginBottom: '20px',
  alignItems: 'center'
};

const companyLogoPlaceholder = {
  width: '56px',
  height: '56px',
  background: 'linear-gradient(135deg, #003A9B, #0052CC)',
  borderRadius: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '800',
  color: '#FFF',
  fontSize: '1rem',
  boxShadow: '0 6px 16px rgba(0,58,155,0.3)'
};

const jobTitle = {
  fontSize: '1.2rem',
  fontWeight: '800',
  color: '#111827',
  margin: '0 0 4px 0'
};

const companyName = {
  fontSize: '0.9rem',
  color: '#6B7280',
  fontWeight: '500'
};

const metaRow = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  marginBottom: '20px'
};

const metaItem = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '0.8rem',
  color: '#374151',
  backgroundColor: '#F3F4F6',
  padding: '6px 12px',
  borderRadius: '999px',
  fontWeight: '500'
};

const salaryBadge = {
  background: 'linear-gradient(135deg, #EBF4FF, #DBEAFE)',
  color: '#003A9B',
  padding: '6px 12px',
  borderRadius: '999px',
  fontSize: '0.8rem',
  fontWeight: '700'
};

const jobExcerpt = {
  fontSize: '0.95rem',
  color: '#4B5563',
  lineHeight: '1.6',
  marginBottom: '24px'
};

/* 🔥 PREMIUM BUTTON */
const viewBtn = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: 'linear-gradient(135deg, #003A9B, #0052CC)',
  color: '#FFF',
  fontWeight: '700',
  border: 'none',
  borderRadius: '14px',
  padding: '12px 18px',
  cursor: 'pointer',
  fontSize: '0.9rem',
  boxShadow: '0 10px 20px rgba(0,58,155,0.2)',
  transition: 'all 0.2s'
};

export default Home;
