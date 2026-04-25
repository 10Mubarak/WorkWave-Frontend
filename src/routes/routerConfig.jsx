import React from 'react';
import { Navigate } from 'react-router-dom';

// Pages
import Home from '../pages/Home';
import JobDetails from '../pages/JobDetails';
import Login from '../pages/Login';
import Register from '../pages/Register';
import DashboardOverview from '../pages/DashboardOverview';
import MyPostings from '../pages/MyPostings';
import PostJob from '../pages/PostJob';
import AdminUsers from '../pages/AdminUsers';
import AdminJobs from '../pages/AdminJobs';
import Explore from '../pages/explore';
import EditJob from '../pages/EditJob';
import Profile from '../pages/Profile'; // 👈 Added Profile Import

// Components & Layouts
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import DashboardLayout from '../layouts/DashboardLayout';
import MainLayout from '../layouts/MainLayout';

/**
 * WorkWave Router Configuration
 */
export const routerConfig = [
  // --- PUBLIC ROUTES (GUEST ONLY) ---
  {
    path: "/",
    element: (
      <PublicRoute>
        <MainLayout>
          <Home />
        </MainLayout>
      </PublicRoute>
    )
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    )
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    )
  },

  // --- PROTECTED "APP" ROUTES ---
  {
    path: "/explore",
    element: (
      <PrivateRoute>
        <MainLayout>
          <Explore />
        </MainLayout>
      </PrivateRoute>
    )
  },
  {
    path: "/job/:id",
    element: (
      <PrivateRoute>
        <MainLayout>
          <JobDetails />
        </MainLayout>
      </PrivateRoute>
    )
  },
  {
    path: "/profile", // 👈 Registered Profile Route
    element: (
      <PrivateRoute>
        <MainLayout>
          <Profile />
        </MainLayout>
      </PrivateRoute>
    )
  },

  // --- PROTECTED DASHBOARD ROUTES ---
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardOverview />
      },
      {
        path: "analytics",
        element: <DashboardOverview />
      },
      {
        path: "my-jobs",
        element: <MyPostings />
      },
      {
        path: "edit-job/:id",
        element: <EditJob />
      },

      // --- ADMIN ONLY SUB-ROUTES ---
      {
        path: "all-users",
        element: (
          <PrivateRoute adminOnly={true}>
            <AdminUsers />
          </PrivateRoute>
        )
      },
      {
        path: "all-jobs",
        element: (
          <PrivateRoute adminOnly={true}>
            <AdminJobs />
          </PrivateRoute>
        )
      },

      // Local Dashboard Catch-all
      {
        path: "*",
        element: <Navigate to="/dashboard" replace />
      }
    ]
  },

  // --- GLOBAL CATCH-ALL ---
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
];