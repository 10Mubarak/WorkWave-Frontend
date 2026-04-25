import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal, ChevronRight, Briefcase, X } from 'lucide-react';
import { useJobs } from '../hooks/useJobs';

const Explore = () => {
  const navigate = useNavigate();
  const { jobs, loading, error } = useJobs();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [locationFilter, setLocationFilter] = useState('');

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 992;
  const isTablet = windowWidth < 1200;

  const filteredJobs = useMemo(() => {
    return (jobs || []).filter(job => {
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        query === '' ||
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        (job.location || '').toLowerCase().includes(query) ||
        (job.type || '').toLowerCase().includes(query) ||
        (job.description || '').toLowerCase().includes(query);
      const matchesLocation = (job.location || '').toLowerCase().includes(locationFilter.toLowerCase());
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(job.type);
      return matchesSearch && matchesLocation && matchesType;
    });
  }, [jobs, searchTerm, locationFilter, selectedTypes]);

  const handleTypeChange = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const noJobs = filteredJobs.length === 0 && !loading;

  return (
    <div style={pageContainer}>
      <div style={{
        ...contentLayout,
        flexDirection: isMobile ? 'column' : 'row'
      }}>
        {/* --- FILTERS SIDEBAR (Responsive) --- */}
        {(!isMobile || showMobileFilters) && (
          <aside style={{
            ...sidebar,
            ...(isMobile ? mobileSidebarOverlay : {})
          }}>
            <div style={sidebarHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <SlidersHorizontal size={18} />
                <span style={sidebarTitle}>Filters</span>
              </div>
              {isMobile && <X onClick={() => setShowMobileFilters(false)} cursor="pointer" />}
            </div>

            <div style={filterGroup}>
              <label style={filterLabel}>Search Jobs</label>
              <div style={locationSearch}>
                <Search size={14} color="#999" />
                <input
                  type="text"
                  placeholder="Search by title, company or location"
                  style={sidebarInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div style={filterGroup}>
              <label style={filterLabel}>Employment Type</label>
              <div style={checkboxGroup}>
                {['Full-time', 'Contract', 'Remote', 'Part-time'].map(type => (
                  <label key={type} style={checkLabel}>
                    <input
                      type="checkbox"
                      style={checkbox}
                      checked={selectedTypes.includes(type)}
                      onChange={() => handleTypeChange(type)}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <div style={filterGroup}>
              <label style={filterLabel}>Location</label>
              <div style={locationSearch}>
                <MapPin size={14} color="#999" />
                <input
                  type="text"
                  placeholder="e.g. Lagos"
                  style={sidebarInput}
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </div>
            </div>

            {isMobile && (
              <button
                style={applyFiltersBtn}
                onClick={() => setShowMobileFilters(false)}
              >
                Apply Filters
              </button>
            )}
          </aside>
        )}

        {/* --- MAIN CONTENT --- */}
        <main style={mainContent}>
          <header style={{
            ...stickyHeader,
            padding: isMobile ? '20px' : '30px 40px',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '16px' : '0'
          }}>
            <div style={{
              ...searchWrapper,
              maxWidth: isMobile ? '100%' : '560px'
            }}>
              <Search size={20} color="#000" />
              <input
                aria-label="Job search"
                type="text"
                placeholder="Search jobs, companies or locations e.g. Frontend Developer"
                style={mainSearchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  style={searchClearBtn}
                  aria-label="Clear search"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: isMobile ? '100%' : 'auto',
              gap: '20px'
            }}>
              {isMobile && (
                <button
                  style={mobileFilterToggle}
                  onClick={() => setShowMobileFilters(true)}
                >
                  <SlidersHorizontal size={16} /> Filters
                </button>
              )}
              <div style={resultsCount}>
                <strong>{filteredJobs.length}</strong> Waves
              </div>
            </div>
          </header>

          <div style={{
            ...jobScrollArea,
            padding: isMobile ? '20px' : '40px'
          }}>
            {loading ? (
              <div style={loadingState}>Loading waves...</div>
            ) : error ? (
              <div style={errorState}>Failed to load jobs.</div>
            ) : noJobs ? (
              <div style={emptyState}>
                <h3 style={emptyTitle}>No matching jobs</h3>
                <p>Try adjusting your filters</p>
              </div>
            ) : (
              <div style={{
                ...exploreGrid,
                gridTemplateColumns: isTablet
                  ? 'repeat(auto-fill, minmax(280px, 1fr))'
                  : 'repeat(auto-fill, minmax(340px, 1fr))'
              }}>
                {filteredJobs.map((job) => (
                  <div
                    key={job._id}
                    style={exploreCard}
                    onClick={() => navigate(`/job/${job._id}`)}
                  >
                    <div style={cardTop}>
                      <div style={logoBox}>{job.company?.charAt(0).toUpperCase() || 'W'}</div>
                      <div>
                        <h3 style={{
                          ...exploreJobTitle,
                          fontSize: isMobile ? '1.1rem' : '1.2rem'
                        }}>{job.title}</h3>
                        <p style={exploreCompany}>{job.company}</p>
                      </div>
                    </div>

                    <div style={{ ...exploreMeta, flexWrap: 'wrap' }}>
                      <div style={metaBadge}><MapPin size={12} /> {job.location || 'Remote'}</div>
                      <div style={metaBadge}><Briefcase size={12} /> {job.type || 'Full-time'}</div>
                    </div>

                    <div style={cardFooter}>
                      <span style={priceTag}>{job.salary || 'Competitive'}</span>
                      <button style={applyBtn}>
                        Details <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

// --- STYLES ---
const pageContainer = { backgroundColor: '#FFFFFF', minHeight: '100vh', fontFamily: "'Inter', sans-serif" };
const contentLayout = { display: 'flex', maxWidth: '1440px', margin: '0 auto' };

const sidebar = {
  width: '300px', padding: '40px 24px', borderRight: '1px solid #F0F0F0',
  height: '100vh', position: 'sticky', top: 0, backgroundColor: '#FAFAFA', zIndex: 100
};

const mobileSidebarOverlay = {
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh',
  backgroundColor: '#FFF', padding: '30px', overflowY: 'auto'
};

const sidebarHeader = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' };
const sidebarTitle = { fontWeight: '800', fontSize: '1.1rem' };
const filterGroup = { display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' };
const filterLabel = { fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#999', letterSpacing: '1px' };
const checkboxGroup = { display: 'flex', flexDirection: 'column', gap: '14px' };
const checkLabel = { fontSize: '0.9rem', fontWeight: '500', color: '#333', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' };
const checkbox = { width: '18px', height: '18px', accentColor: '#000' };

const locationSearch = {
  display: 'flex', alignItems: 'center', gap: '8px', padding: '12px',
  backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #E5E7EB'
};

const sidebarInput = { border: 'none', outline: 'none', flex: 1, fontSize: '0.9rem' };
const mainContent = { flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' };

const stickyHeader = {
  borderBottom: '1px solid #F0F0F0', display: 'flex', justifyContent: 'space-between',
  alignItems: 'center', backgroundColor: '#FFF', position: 'sticky', top: 0, zIndex: 10
};

const searchWrapper = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flex: 1,
  backgroundColor: '#F8FAFC',
  border: '1px solid #E5E7EB',
  borderRadius: '16px',
  padding: '12px 16px',
  minHeight: '52px',
  width: '100%'
};
const mainSearchInput = {
  border: 'none',
  outline: 'none',
  fontSize: '1rem',
  width: '100%',
  fontWeight: '500',
  backgroundColor: 'transparent',
  color: '#111827'
};
const searchClearBtn = {
  background: 'none',
  border: 'none',
  color: '#6B7280',
  cursor: 'pointer',
  padding: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};
const resultsCount = { fontSize: '0.85rem', color: '#666', fontWeight: '600', whiteSpace: 'nowrap' };

const jobScrollArea = { flex: 1 };
const exploreGrid = { display: 'grid', gap: '20px' };

const exploreCard = {
  border: '1px solid #EAEAEA', padding: '24px', borderRadius: '20px',
  transition: 'all 0.3s ease', cursor: 'pointer', display: 'flex',
  flexDirection: 'column', justifyContent: 'space-between', minHeight: '220px', backgroundColor: '#FFF'
};

const cardTop = { display: 'flex', gap: '16px', marginBottom: '16px' };
const logoBox = {
  width: '48px', height: '48px', backgroundColor: '#000', color: '#FFF',
  borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontWeight: '900', fontSize: '1.1rem'
};

const exploreJobTitle = { fontWeight: '800', margin: 0, letterSpacing: '-0.3px' };
const exploreCompany = { fontSize: '0.9rem', color: '#003A9B', fontWeight: '600', marginTop: '2px' };
const exploreMeta = { display: 'flex', gap: '8px', marginBottom: '20px' };
const metaBadge = {
  display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem',
  color: '#666', backgroundColor: '#F9FAFB', padding: '4px 10px',
  borderRadius: '100px', fontWeight: '600', border: '1px solid #F0F0F0'
};

const cardFooter = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  borderTop: '1px solid #F9FAFB', paddingTop: '16px'
};
const priceTag = { fontWeight: '800', fontSize: '0.95rem', color: '#000' };
const applyBtn = { border: 'none', background: 'none', color: '#000', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' };

const mobileFilterToggle = {
  display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px',
  backgroundColor: '#000', color: '#FFF', borderRadius: '10px', border: 'none', fontWeight: '700', fontSize: '0.85rem'
};

const applyFiltersBtn = {
  width: '100%', padding: '16px', backgroundColor: '#000', color: '#FFF',
  borderRadius: '12px', border: 'none', fontWeight: '800', marginTop: '20px'
};

const loadingState = { textAlign: 'center', padding: '100px 0', color: '#666' };
const errorState = { textAlign: 'center', padding: '100px 0', color: '#dc2626' };
const emptyState = { textAlign: 'center', padding: '100px 0' };
const emptyTitle = { fontWeight: '800', fontSize: '1.2rem' };

export default Explore;