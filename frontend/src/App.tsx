import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Home           from './pages/Home';
import About          from './pages/About';
import Fleets         from './pages/Fleets';
import Tariffs        from './pages/Tariffs';
import Feedback       from './pages/Feedback';
import CarDetails     from './pages/CarDetails';
import Booking        from './pages/Booking';
import Dashboard      from './pages/Dashboard';
import Login          from './pages/Login';
import Register       from './pages/Register';
import Profile        from './pages/Profile';
import Contact        from './pages/Contact';

import AdminLayout    from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCars      from './pages/admin/AdminCars';
import AdminBookings  from './pages/admin/AdminBookings';
import AdminUsers     from './pages/admin/AdminUsers';
import AdminLocations from './pages/admin/AdminLocations';
import AdminFeedback  from './pages/admin/AdminFeedback';
import AdminOffers    from './pages/admin/AdminOffers';
import FloatingActions from './components/FloatingActions';
import ScrollToTop     from './components/ScrollToTop';

const ProtectedRoute: React.FC<{ children: React.ReactNode; requireAdmin?: boolean }> = ({ children, requireAdmin }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;
  if (!user) return <Navigate to="/login" />;
  if (requireAdmin && user.role !== 'ADMIN') return <Navigate to="/" />;
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public */}
          <Route path="/"          element={<Home />} />
          <Route path="/about"     element={<About />} />
          <Route path="/fleets"    element={<Fleets />} />
          <Route path="/tariffs"   element={<Tariffs />} />
          <Route path="/feedback"  element={<Feedback />} />
          <Route path="/cars"      element={<Navigate to="/" />} />
          <Route path="/cars/:id"  element={<CarDetails />} />
          <Route path="/contact"   element={<Contact />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/register"  element={<Register />} />

          {/* Authenticated */}
          <Route path="/book/:id"   element={<ProtectedRoute><Booking /></ProtectedRoute>} />
          <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile"    element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
            <Route index                element={<AdminDashboard />} />
            <Route path="cars"          element={<AdminCars />} />
            <Route path="bookings"      element={<AdminBookings />} />
            <Route path="users"         element={<AdminUsers />} />
            <Route path="locations"     element={<AdminLocations />} />
            <Route path="feedback"      element={<AdminFeedback />} />
            <Route path="offers"        element={<AdminOffers />} />
          </Route>
        </Routes>
        <FloatingActions />
      </Router>
    </AuthProvider>
  );
}

export default App;
