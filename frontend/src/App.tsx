import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/Admin/Login';
import AdminPortfolio from './pages/Admin/AdminPortfolio';
import AdminReviews from './pages/Admin/Reviews';
import AdminColumns from './pages/Admin/Columns';
import AdminDashboard from './pages/Admin/Dashboard';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Reviews from './pages/Reviews';
import Columns from './pages/Columns';
import KakaoChannelButton from './components/common/KakaoChannelButton';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AdminAuthProvider>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="portfolio" element={<AdminPortfolio />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="columns" element={<AdminColumns />} />
            </Route>

            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/columns" element={<Columns />} />
          </Routes>
          <KakaoChannelButton />
        </AdminAuthProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
