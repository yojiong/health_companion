import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Mail, Lock, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const performLogin = async (loginEmail, loginPassword) => {
    setError('');
    setLoading(true);

    const result = await login(loginEmail, loginPassword);

    if (result.success) {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo.role === 'institution') {
        navigate('/institution');
      } else if (userInfo.role === 'caregiver') {
        navigate('/caregiver');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await performLogin(email, password);
  };

  const handleQuickLogin = async (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password');
    await performLogin(demoEmail, 'password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-medical-cyan/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-medical-green/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <Activity className="w-10 h-10 text-medical-cyan" />
            <span className="text-2xl font-bold text-white">Health Companion</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to continue to your dashboard</p>
        </div>

        <div className="glass rounded-2xl p-8">
          {error && (
            <div className="flex items-center space-x-2 bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 text-sm mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-medical-cyan transition"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-medical-cyan transition"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-bg text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-medical-cyan hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-gray-500 text-xs text-center mb-4">Demo Accounts (click to log in)</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('patient@demo.com')}
                disabled={loading}
                className="bg-white/5 hover:bg-medical-cyan/20 border border-transparent hover:border-medical-cyan/40 rounded-lg p-2 text-center transition disabled:opacity-50"
              >
                <div className="text-gray-400 mb-1">Patient</div>
                <div className="text-gray-300 break-all">patient@demo.com</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('care@demo.com')}
                disabled={loading}
                className="bg-white/5 hover:bg-medical-cyan/20 border border-transparent hover:border-medical-cyan/40 rounded-lg p-2 text-center transition disabled:opacity-50"
              >
                <div className="text-gray-400 mb-1">Caregiver</div>
                <div className="text-gray-300 break-all">care@demo.com</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('inst@demo.com')}
                disabled={loading}
                className="bg-white/5 hover:bg-medical-cyan/20 border border-transparent hover:border-medical-cyan/40 rounded-lg p-2 text-center transition disabled:opacity-50"
              >
                <div className="text-gray-400 mb-1">Institution</div>
                <div className="text-gray-300 break-all">inst@demo.com</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
