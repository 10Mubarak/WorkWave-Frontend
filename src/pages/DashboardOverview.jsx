import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck 
} from 'lucide-react';

const DashboardOverview = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    myJobs: 0,
    applicants: 0, 
    views: 128    
  });

  useEffect(() => {
    const fetchOverviewData = async () => {
  try {
    const response = await axiosInstance.get('/user/my-jobs');
    
    // response.data contains: { success, count, totalApplicants, data }
    const { count, totalApplicants } = response.data;

    setStats({
      myJobs: count || 0,
      applicants: totalApplicants || 0,
      views: 128 // Still mock data
    });
    
  } catch (err) {
    console.error("Dashboard Fetch Error:", err);
  }
};
    if (user) {
      fetchOverviewData();
    }
  }, [user]);

  return (
    <div style={container}>
      {/* --- WELCOME SECTION --- */}
      <header style={headerStyle}>
        <div>
          <h1 style={greeting}>
            Welcome back, {user?.firstname}! 
            {user?.role === 'admin' && (
              <ShieldCheck size={24} style={adminIconInline} />
            )}
          </h1>
          <p style={subText}>
            {user?.role === 'admin' 
              ? "System Overview: Managing the WorkWave ecosystem." 
              : "Here is a summary of your current activity and reach."}
          </p>
        </div>
      </header>

      {/* --- STATS GRID --- */}
      <div style={statsGrid}>
        <div style={statCard}>
          <div style={{ ...iconBox, backgroundColor: '#EEF2FF' }}>
            <Briefcase color="#4338CA" size={24} />
          </div>
          <div>
            <span style={statLabel}>Your Active Jobs</span>
            <h2 style={statNumber}>{stats.myJobs}</h2>
          </div>
        </div>

        <div style={statCard}>
          <div style={{ ...iconBox, backgroundColor: '#ECFDF5' }}>
            <Users color="#059669" size={24} />
          </div>
          <div>
            <span style={statLabel}>Total Applicants</span>
            <h2 style={statNumber}>{stats.applicants}</h2>
          </div>
        </div>

        <div style={statCard}>
          <div style={{ ...iconBox, backgroundColor: '#FFF7ED' }}>
            <TrendingUp color="#EA580C" size={24} />
          </div>
          <div>
            <span style={statLabel}>Global Reach</span>
            <h2 style={statNumber}>{stats.views}</h2>
          </div>
        </div>
      </div>

      {/* --- SUGGESTED ACTIONS --- */}
      <section style={infoSection}>
        <h3 style={sectionTitle}>Suggested Actions</h3>
        <div style={actionCard}>
          <div style={actionContent}>
            <h4 style={actionHeading}>Optimize your hiring flow</h4>
            <p style={actionText}>
              {user?.role === 'admin' 
                ? "Review flagged waves in the Management tab to maintain platform integrity." 
                : "Premium listings stay at the top of search results for 30 days."}
            </p>
          </div>
          <button style={outlineBtn}>
            {user?.role === 'admin' ? "View Analytics" : "Learn More"} <ArrowRight size={16} />
          </button>
        </div>
      </section>
      
    </div>
  );
};

// --- STYLES ---
const container = { animation: 'fadeIn 0.5s ease-in' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', paddingTop: '45px' };
const greeting = { fontSize: '2rem', fontWeight: '800', color: '#111827', margin: 0, display: 'flex', alignItems: 'center' };
const adminIconInline = { marginLeft: '12px', color: '#003A9B' };
const subText = { color: '#6B7280', fontSize: '1rem', marginTop: '4px' };

const statsGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' };
const statCard = { 
  backgroundColor: '#FFF', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB',
  display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
};
const iconBox = { width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const statLabel = { fontSize: '0.875rem', fontWeight: '500', color: '#6B7280' };
const statNumber = { fontSize: '1.75rem', fontWeight: '800', color: '#111827', margin: '4px 0 0 0' };

const infoSection = { marginTop: '48px' };
const sectionTitle = { fontSize: '1.25rem', fontWeight: '700', color: '#111827', marginBottom: '20px' };
const actionCard = { 
  backgroundColor: '#F9FAFB', border: '1px dashed #D1D5DB', borderRadius: '16px', 
  padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
};
const actionHeading = { margin: 0, fontSize: '1.1rem', color: '#111827', fontWeight: '700' };
const actionText = { margin: '4px 0 0 0', color: '#6B7280', fontSize: '0.95rem' };
const actionContent = { flex: 1 };
const outlineBtn = { 
  border: '1px solid #D1D5DB', backgroundColor: '#FFF', padding: '10px 16px', 
  borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' 
};

export default DashboardOverview;