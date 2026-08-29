import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotificationToast from './components/NotificationToast';

import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import FeaturesPage from './pages/FeaturesPage';
import HowItWorksPage from './pages/HowItWorksPage';
import CategoriesPage from './pages/CategoriesPage';
import BrowseToolsPage from './pages/BrowseToolsPage';
import BrowseHelpersPage from './pages/BrowseHelpersPage';
import ToolDetailsPage from './pages/ToolDetailsPage';
import SearchPage from './pages/SearchPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import NotFoundPage from './pages/NotFoundPage';

import UserDashboard from './pages/dashboard/UserDashboard';
import MyListings from './pages/dashboard/MyListings';
import MyBookings from './pages/dashboard/MyBookings';
import MyFavorites from './pages/dashboard/MyFavorites';
import ChatPage from './pages/dashboard/ChatPage';
import ProfileSettings from './pages/dashboard/ProfileSettings';
import AddToolPage from './pages/dashboard/AddToolPage';
import AdminDashboard from './pages/admin/AdminDashboard';

import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <NotificationToast />
      <Navbar />

      <div className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/tools" element={<BrowseToolsPage />} />
          <Route path="/tools/:id" element={<ToolDetailsPage />} />
          <Route path="/helpers" element={<BrowseHelpersPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Dashboard Nested Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<MyListings />} />
            <Route path="listings" element={<MyListings />} />
            <Route path="bookings" element={<MyBookings />} />
            <Route path="favorites" element={<MyFavorites />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="settings" element={<ProfileSettings />} />
            <Route path="add-tool" element={<AddToolPage />} />
          </Route>

          {/* Admin Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
