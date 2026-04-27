import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/student/Login';
import Register from '../pages/student/Register';
import Dashboard from '../pages/student/Dashboard';
import BookMeal from '../pages/student/BookMeal';
import BookingHistory from '../pages/student/BookingHistory';
import Profile from '../pages/student/Profile';
import AdminLogin from '../pages/admin/AdminLogin';
import AdminRegister from '../pages/admin/AdminRegister';
import AdminDashboard from '../pages/admin/AdminDashboard';
import PredictionDashboard from '../pages/admin/PredictionDashboard';
import AttendanceManagement from '../pages/admin/AttendanceManagement';
import StudentManagement from '../pages/admin/StudentManagement';
import AnalyticsDashboard from '../pages/admin/AnalyticsDashboard';
import MenuManagement from '../pages/admin/MenuManagement';
import ProtectedRoute from '../components/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/book-meal" element={<ProtectedRoute><BookMeal /></ProtectedRoute>} />
      <Route path="/booking-history" element={<ProtectedRoute><BookingHistory /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register" element={<AdminRegister />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/predictions" element={<ProtectedRoute adminOnly><PredictionDashboard /></ProtectedRoute>} />
      <Route path="/admin/attendance" element={<ProtectedRoute adminOnly><AttendanceManagement /></ProtectedRoute>} />
      <Route path="/admin/students" element={<ProtectedRoute adminOnly><StudentManagement /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute adminOnly><AnalyticsDashboard /></ProtectedRoute>} />
      <Route path="/admin/menu" element={<ProtectedRoute adminOnly><MenuManagement /></ProtectedRoute>} />
    </Routes>
  );
}

