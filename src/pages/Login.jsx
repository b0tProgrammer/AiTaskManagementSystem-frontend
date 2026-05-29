import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

// Simple password strength estimator
const getPasswordStrength = (password) => {
  if (!password) return 'Empty';
  let score = 0;
  if (password.length >= 6) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return 'Weak';
  if (score === 2) return 'Medium';
  return 'Strong';
};

const PasswordStrengthBar = ({ password }) => {
  const strength = getPasswordStrength(password);
  const colors = { Empty: 'bg-gray-200', Weak: 'bg-red-400', Medium: 'bg-yellow-400', Strong: 'bg-emerald-400' };
  const width = { Empty: 'w-0', Weak: 'w-1/3', Medium: 'w-2/3', Strong: 'w-full' };
  return (
    <div>
      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
        <div className={`${colors[strength]} ${width[strength]} h-2 transition-all`} />
      </div>
      <p className="mt-2 text-xs text-gray-500">Strength: {strength === 'Empty' ? '—' : strength}</p>
    </div>
  );
};

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // For registration confirm password
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    // Client-side validation for registration
    if (!isLogin) {
      if (!formData.username || formData.username.length < 3) {
        setError('Username must be at least 3 characters long.');
        setIsLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters.');
        setIsLoading(false);
        return;
      }
      if (formData.password !== confirmPassword) {
        setError('Passwords do not match.');
        setIsLoading(false);
        return;
      }
      // Optional strength enforcement: require medium or strong
      const strength = getPasswordStrength(formData.password);
      if (strength === 'Weak') {
        setError('Please choose a stronger password.');
        setIsLoading(false);
        return;
      }
    }
    const authBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    const endpoint = isLogin ? '/auth/login' : '/auth/register';

    try {
      const response = await fetch(`${authBase}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(isLogin ? 'Invalid credentials' : 'Registration failed');
      }

      // Helper to extract token from various response shapes
      const parseTokenFromResponse = async (res) => {
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          const json = await res.clone().json().catch(() => null);
          if (!json) return null;
          if (json.data && (json.data.token || typeof json.data === 'string')) return json.data.token || json.data;
          if (json.token) return json.token;
          // fallback if API returned the token directly as JSON string
          if (typeof json === 'string') return json;
          return null;
        }
        // default: text body (common for simple token endpoints)
        const text = await res.clone().text().catch(() => '');
        return text || null;
      };

      if (isLogin) {
        const token = await parseTokenFromResponse(response);
        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('username', formData.username || '');
          navigate('/dashboard');
        } else {
          setError('Login succeeded but no token was returned.');
        }
      } else {
        // Registration succeeded; try to auto-login
        const loginResp = await fetch(`${authBase}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!loginResp.ok) {
          // Registration worked but login failed; show registration success
          setError('Registered successfully. Please login.');
          setIsLoading(false);
          setIsLogin(true);
          return;
        }

        const token = await parseTokenFromResponse(loginResp);
        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('username', formData.username || '');
          navigate('/dashboard');
        } else {
          setError('Registration succeeded but auto-login failed. Please login.');
          setIsLogin(true);
        }
      }

    } catch (err) {
      setError(err.message || 'Authentication error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      
      {/* Top Navbar matching the design */}
      <nav className="flex justify-between items-center p-6 bg-white/50 backdrop-blur-sm border-b border-white/20">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔥</span>
          <div>
            <h1 className="font-bold text-gray-800 leading-tight">Welcome to Ai-Taskfyer</h1>
            <p className="text-sm text-gray-500 leading-tight">Please login or register to view your tasks</p>
          </div>
        </div>
        
        {/* header right-side removed for clean login/register page */}
      </nav>

      {/* Main Centered Login Card */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-10 relative z-10 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {isLogin ? 'Login to Your Account' : 'Create an Account'}
            </h2>
            <p className="text-gray-500 text-sm">
              {isLogin ? 'Login Now. Don\'t have an account? ' : 'Join us. Already have an account? '}
              <button 
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-emerald-500 font-semibold hover:underline transition-all"
              >
                {isLogin ? 'Register here' : 'Login here'}
              </button>
            </p>
          </div>

          {error && (
            <div className="mb-6 text-sm text-red-600 text-center bg-red-50 p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Username</label>
              <input
                type="text"
                placeholder="e.g., Mohith2k"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2 p-1 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {!isLogin && (
                <div className="mt-3">
                  <PasswordStrengthBar password={formData.password} />
                </div>
              )}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors shadow-md mt-4 disabled:bg-emerald-300 flex justify-center items-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                isLogin ? 'Login Now' : 'Register Now'
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Login;