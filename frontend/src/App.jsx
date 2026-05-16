import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import Medications from './pages/Medications';
import Caregiver from './pages/Caregiver';
import Institution from './pages/Institution';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-medical-cyan"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'institution') {
      return <Navigate to="/institution" />;
    } else if (user.role === 'caregiver') {
      return <Navigate to="/caregiver" />;
    } else {
      return <Navigate to="/dashboard" />;
    }
  }

  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  const getDefaultRoute = () => {
    if (!user) return null;
    if (user.role === 'institution') return '/institution';
    if (user.role === 'caregiver') return '/caregiver';
    return '/dashboard';
  };

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={getDefaultRoute()} /> : <LandingPage />} />
      <Route path="/login" element={user ? <Navigate to={getDefaultRoute()} /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to={getDefaultRoute()} /> : <RegisterPage />} />
      <Route path="/dashboard" element={
        <PrivateRoute allowedRoles={['patient', 'caregiver', 'institution']}>
          <Layout><Dashboard /></Layout>
        </PrivateRoute>
      } />
      <Route path="/medications" element={
        <PrivateRoute allowedRoles={['patient', 'caregiver']}>
          <Layout><Medications /></Layout>
        </PrivateRoute>
      } />
      <Route path="/caregiver" element={
        <PrivateRoute allowedRoles={['caregiver']}>
          <Layout><Caregiver /></Layout>
        </PrivateRoute>
      } />
      <Route path="/institution" element={
        <PrivateRoute allowedRoles={['institution']}>
          <Layout><Institution /></Layout>
        </PrivateRoute>
      } />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <AppRoutes />
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;