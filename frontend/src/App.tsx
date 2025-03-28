import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/Admin/Login';
import AdminPortfolio from './pages/Admin/AdminPortfolio';
import AdminReview from './pages/Admin/AdminReview';
import ReviewEditor from './pages/Admin/ReviewEditor';
import AdminColumn from './pages/Admin/AdminColumn';
import ColumnEditor from './pages/Admin/ColumnEditor';
import AdminDashboard from './pages/Admin/Dashboard';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Reviews from './pages/Reviews';
import Columns from './pages/Columns';
import ColumnDetail from './pages/Columns/detail';
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
              <Route path="portfolios" element={<AdminPortfolio />} />
              <Route path="reviews" element={<AdminReview />} />
              <Route path="reviews/new" element={<ReviewEditor />} />
              <Route path="reviews/:id/edit" element={<ReviewEditor />} />
              <Route path="columns" element={<AdminColumn />} />
              <Route path="columns/new" element={<ColumnEditor />} />
              <Route path="columns/:id/edit" element={<ColumnEditor />} />
            </Route>

            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/columns" element={<Columns />} />
            <Route path="/columns/:id" element={<ColumnDetail />} />
          </Routes>
          <KakaoChannelButton />
        </AdminAuthProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
