import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

export const usePostJob = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const postJob = async (jobData) => {
    setLoading(true);
    setError(null);

    try {
      /**
       * ALIGNMENT FIX:
       * Your backend route is: router.post('/create', ...)
       * Mounted in server.js as: app.use('/api/v1/job', jobRoutes)
       * Resulting endpoint: /job/create
       */
      const { data } = await axiosInstance.post('/job/create', jobData);

      if (data.success) {
        // Using a more "premium" alert style logic
        console.log("Wave published successfully! 🌊");
        navigate('/dashboard/my-jobs');
      }
    } catch (err) {
      // Extract the most specific error message possible
      const errorMessage = 
        err.response?.data?.error || // Mongoose validation error
        err.response?.data?.message || // General error message
        "Failed to create job posting.";
      
      setError(errorMessage);
      console.error("Post Job Error Details:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return { postJob, loading, error };
};