import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

export const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Using useCallback so 'refresh' can be used as a dependency if needed
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Hits: GET /api/v1/job/all
      const { data } = await axiosInstance.get('/job/all');
      
      // Your controller returns { success: true, jobs: [...] }
      const finalData = data.jobs || data.data || data;
      
      setJobs(Array.isArray(finalData) ? finalData : []);
    } catch (err) {
      console.error("Fetch Jobs Error:", err);
      setError(err.response?.data?.message || "Failed to fetch waves 🌊");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * DELETE LOGIC
   * Authorized for the Job Owner or Admin
   */
  const deleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this posting? This action cannot be undone.")) {
      return { success: false };
    }

    try {
      // Hits: DELETE /api/v1/job/delete/:id
      const { data } = await axiosInstance.delete(`/job/delete/${jobId}`);
      
      if (data.success || data.message === "Job deleted successfully") {
        // Update UI instantly
        setJobs((prevJobs) => prevJobs.filter(job => job._id !== jobId));
        return { success: true };
      }
      
      return { success: false };
    } catch (err) {
      const errMsg = err.response?.data?.message || "Unauthorized or Server Error";
      alert(`Could not delete: ${errMsg}`);
      return { success: false, error: errMsg };
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return { 
    jobs, 
    loading, 
    error, 
    deleteJob, 
    refresh: fetchJobs 
  };
};