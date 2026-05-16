import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="glass fixed w-full z-50 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Activity className="w-8 h-8 text-medical-cyan" />
            <span className="text-xl font-bold text-white">Health Companion</span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {user.role === 'patient' && (
                  <Link to="/dashboard" className="text-white hover:text-medical-cyan px-3 py-2 rounded-lg transition">
                    Dashboard
                  </Link>
                )}
                {(user.role === 'patient' || user.role === 'caregiver') && (
                  <Link to="/medications" className="text-white hover:text-medical-cyan px-3 py-2 rounded-lg transition">
                    Medications
                  </Link>
                )}
                {user.role === 'caregiver' && (
                  <Link to="/caregiver" className="text-white hover:text-medical-cyan px-3 py-2 rounded-lg transition">
                    Caregiver Panel
                  </Link>
                )}
                {user.role === 'institution' && (
                  <Link to="/institution" className="text-white hover:text-medical-cyan px-3 py-2 rounded-lg transition">
                    Institution Panel
                  </Link>
                )}
                <div className="flex items-center space-x-2 ml-4">
                  <div className="w-8 h-8 rounded-full bg-medical-green flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white text-sm">{user.name}</span>
                  <button onClick={handleLogout} className="text-white hover:text-red-400 ml-2">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-medical-cyan px-3 py-2 rounded-lg transition">
                  Login
                </Link>
                <Link to="/register" className="gradient-bg text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden glass border-t border-white/20">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user ? (
              <>
                {user.role === 'patient' && (
                  <Link to="/dashboard" className="block text-white hover:text-medical-cyan px-3 py-2 rounded-lg">
                    Dashboard
                  </Link>
                )}
                {(user.role === 'patient' || user.role === 'caregiver') && (
                  <Link to="/medications" className="block text-white hover:text-medical-cyan px-3 py-2 rounded-lg">
                    Medications
                  </Link>
                )}
                {user.role === 'caregiver' && (
                  <Link to="/caregiver" className="block text-white hover:text-medical-cyan px-3 py-2 rounded-lg">
                    Caregiver Panel
                  </Link>
                )}
                {user.role === 'institution' && (
                  <Link to="/institution" className="block text-white hover:text-medical-cyan px-3 py-2 rounded-lg">
                    Institution Panel
                  </Link>
                )}
                <button onClick={handleLogout} className="block w-full text-left text-white hover:text-red-400 px-3 py-2 rounded-lg">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-white hover:text-medical-cyan px-3 py-2 rounded-lg">
                  Login
                </Link>
                <Link to="/register" className="block gradient-bg text-white px-3 py-2 rounded-lg text-center">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;