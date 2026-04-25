import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, Calendar, ArrowLeft, Share2, Globe } from 'lucide-react';
import { useJobs } from '../hooks/useJobs';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, loading } = useJobs();

  // --- RESPONSIVE STATE ---
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const job = jobs?.find(j => j._id === id);

  if (loading) return <div style={loadingState}>Loading Briefing...</div>;
  if (!job) return <div style={loadingState}>Job not found.</div>;

  return (
    <div style={pageContainer}>
      {/* --- TOP NAVIGATION --- */}
      <nav style={{
        ...topNav,
        padding: isMobile ? '20px' : '40px 20px'
      }}>
        <button onClick={() => navigate(-1)} style={backBtn}>
          <ArrowLeft size={18} /> {isMobile ? "" : "Back to Waves"}
        </button>
        <button style={shareBtn}><Share2 size={18} /></button>
      </nav>

      <div style={{
        ...contentGrid,
        gridTemplateColumns: isMobile ? '1fr' : '1fr 380px',
        gap: isMobile ? '40px' : '80px',
        padding: isMobile ? '0 20px' : '0 20px'
      }}>
        {/* --- MAIN COLUMN --- */}
        <main style={mainCol}>
          <header style={headerSection}>
            <div style={{
              ...logoLarge,
              width: isMobile ? '60px' : '80px',
              height: isMobile ? '60px' : '80px',
              fontSize: isMobile ? '1.5rem' : '2rem'
            }}>
              {job.company?.[0]}
            </div>
            <h1 style={{
              ...mainTitle,
              fontSize: isMobile ? '2.2rem' : '3.5rem',
              letterSpacing: isMobile ? '-1px' : '-2px'
            }}>
              {job.title}
            </h1>
            <div style={headerMeta}>
              <span style={companyLink}>{job.company}</span>
              <span style={dot}>•</span>
              <span style={locationText}><MapPin size={14} /> {job.location}</span>
            </div>
          </header>

          <section style={detailsSection}>
            <h2 style={sectionHeading}>The Role</h2>
            <p style={descriptionText}>{job.description}</p>

            <h2 style={sectionHeading}>Requirements</h2>
            <ul style={listStyle}>
              <li>5+ years of experience in high-growth environments.</li>
              <li>Mastery of the MERN stack and modern UI patterns.</li>
              <li>A portfolio showcasing premium aesthetic sensibilities.</li>
            </ul>
          </section>
        </main>

        {/* --- SIDEBAR ACTION CARD --- */}
        <aside style={sidebarCol}>
          <div style={{
            ...actionCard,
            position: isMobile ? 'static' : 'sticky',
            padding: isMobile ? '24px' : '32px'
          }}>
            <div style={priceHighlight}>
              <span style={label}>Budget</span>
              <span style={{
                ...amount,
                fontSize: isMobile ? '1.5rem' : '1.8rem'
              }}>
                {job.salary || 'Negotiable'}
              </span>
            </div>

            <div style={divider} />

            <div style={quickStats}>
              <div style={statRow}>
                <Briefcase size={16} color="#666" />
                <span>{job.type}</span>
              </div>
              <div style={statRow}>
                <Calendar size={16} color="#666" />
                <span>Posted 2 days ago</span>
              </div>
            </div>

            <button style={primaryApplyBtn}>Apply for this Wave</button>
            <p style={secureNote}>Secure application via WorkWave</p>
          </div>

          <div style={{
            ...companyCard,
            padding: isMobile ? '24px' : '32px'
          }}>
            <h3 style={compTitle}>About {job.company}</h3>
            <p style={compDesc}>A leading innovator in the tech space, focusing on premium digital experiences.</p>
            <button style={websiteBtn}><Globe size={16} /> Visit Website</button>
          </div>
        </aside>
      </div>
    </div>
  );
};

// --- PREMIUM STYLES ---
const pageContainer = {
  backgroundColor: '#FFF',
  minHeight: '100vh',
  paddingTop: '80px',
  paddingBottom: '100px',
  fontFamily: "'Inter', sans-serif"
};

const topNav = {
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const backBtn = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  border: '1px solid #E5E7EB',
  background: '#FFFFFF',
  cursor: 'pointer',
  fontWeight: '700',
  color: '#003A9B',
  fontSize: '0.95rem',
  padding: '10px 16px',
  borderRadius: '10px',
  transition: 'all 0.2s ease',
  backgroundColor: '#F3F4F6'
};

const shareBtn = {
  padding: '10px',
  borderRadius: '50%',
  border: '1px solid #EEE',
  backgroundColor: '#FFF',
  cursor: 'pointer'
};

const contentGrid = {
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'grid'
};

const mainCol = { display: 'flex', flexDirection: 'column' };

const headerSection = {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '40px'
};

const logoLarge = {
  backgroundColor: '#000',
  color: '#FFF',
  borderRadius: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '900',
  marginBottom: '32px'
};

const mainTitle = {
  fontWeight: '900',
  color: '#000',
  margin: '0 0 16px 0',
  lineHeight: '1.1'
};

const headerMeta = {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '12px',
  fontSize: '1.1rem',
  fontWeight: '600'
};

const companyLink = { color: '#003A9B' };
const dot = { color: '#CCC' };
const locationText = { display: 'flex', alignItems: 'center', gap: '6px', color: '#666' };

const detailsSection = { marginTop: '60px' };
const sectionHeading = { fontSize: '1.5rem', fontWeight: '800', marginBottom: '24px', letterSpacing: '-0.5px' };
const descriptionText = { fontSize: '1.15rem', lineHeight: '1.8', color: '#333', whiteSpace: 'pre-wrap' };

const listStyle = { paddingLeft: '20px', fontSize: '1.15rem', lineHeight: '2', color: '#333' };

const sidebarCol = { display: 'flex', flexDirection: 'column', gap: '24px' };

const actionCard = {
  borderRadius: '32px',
  border: '1px solid #000',
  backgroundColor: '#FFF',
  top: '40px'
};

const priceHighlight = { display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '24px' };
const label = { fontSize: '0.85rem', fontWeight: '700', color: '#999', textTransform: 'uppercase' };
const amount = { fontWeight: '900', color: '#000' };

const divider = { height: '1px', backgroundColor: '#EEE', margin: '24px 0' };

const quickStats = { display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' };
const statRow = { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', fontWeight: '600', color: '#444' };

const primaryApplyBtn = {
  width: '100%',
  padding: '20px',
  borderRadius: '16px',
  border: 'none',
  backgroundColor: '#000',
  color: '#FFF',
  fontWeight: '800',
  fontSize: '1rem',
  cursor: 'pointer',
  marginBottom: '16px',
  transition: 'transform 0.2s'
};

const secureNote = { fontSize: '0.8rem', color: '#999', textAlign: 'center', fontWeight: '500' };

const companyCard = { borderRadius: '32px', backgroundColor: '#F9FAFB', border: '1px solid #F0F0F0' };
const compTitle = { fontSize: '1.1rem', fontWeight: '800', marginBottom: '12px' };
const compDesc = { fontSize: '0.95rem', color: '#666', lineHeight: '1.6', marginBottom: '20px' };
const websiteBtn = {
  width: '100%',
  padding: '12px',
  borderRadius: '12px',
  border: '1px solid #DDD',
  backgroundColor: '#FFF',
  fontWeight: '700',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  cursor: 'pointer'
};

const loadingState = {
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.2rem',
  fontWeight: '700'
};

export default JobDetails;