import { useState } from 'react';
import { axiosInstance } from '../api/axiosInstance';

export const useAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  // Fetch all users for the admin panel
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/admin/users');
      setUsers(data.data); // data.data because your controller returns { data: users }
    } catch (err) {
      console.error("Admin Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete a user
  const adminDeleteUser = async (userId) => {
    if (!window.confirm("Delete this user account permanently?")) return;
    try {
      await axiosInstance.delete(`/admin/user/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  // Admin Delete Job (Can delete ANY job)
  const adminDeleteJob = async (jobId, callback) => {
    if (!window.confirm("Admin: Delete this job posting?")) return;
    try {
      await axiosInstance.delete(`/admin/job/${jobId}`);
      if (callback) callback(); // Refresh the list
    } catch (err) {
      alert("Failed to delete job");
    }
  };

  return { users, loading, fetchUsers, adminDeleteUser, adminDeleteJob };
};