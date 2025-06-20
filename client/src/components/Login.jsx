import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import Landing from './Landing';
import { Player } from "@lottiefiles/react-lottie-player";

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { token } = useParams();
  const location = useLocation();

  useEffect(() => {
    if (token) {
      setIsResetPassword(true);
    }
  }, [token]);

  // Show landing page only if path is "/" and user is not logged in
  const isRoot = location.pathname === '/';
  const isLoggedIn = !!localStorage.getItem('token');
  if (isRoot && !isLoggedIn) {
    return <Landing />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loader
    try {
      const response = await axios.post('/api/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      navigate('/');
      setLoading(false); // Stop loader on success
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login');
      setLoading(false); // Stop loader on error
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/forgot-password', { email });
      setMsg('Reset link sent! Please check your email.');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset link');
      setMsg('');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validatePassword(newPassword)) {
      setError('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await axios.post('/api/reset-password', {
        token,
        password: newPassword,
      });
      setError('');
      alert('Password reset successfully. Please log in with your new password.');
      setIsResetPassword(false);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
    }
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="bg-white/90 rounded-3xl shadow-2xl w-full max-w-5xl flex flex-col md:flex-row overflow-hidden border border-white/30 backdrop-blur-lg">
        {/* Left: Form */}
        <div className="flex-1 flex flex-col justify-center p-8 md:p-14">
          {isResetPassword ? (
            <>
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Reset Password</h2>
              {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm text-center shadow">
                  {error}
                </div>
              )}
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:bg-white transition"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-xs font-semibold text-gray-600 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:bg-white transition pr-10"
                      placeholder="Enter new password"
                      required
                    />
                    <span
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                      onClick={() => setShowNewPassword((v) => !v)}
                      tabIndex={0}
                      role="button"
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                    >
                      {showNewPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.236.938-4.675M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.062-4.675A9.956 9.956 0 0122 9c0 5.523-4.477 10-10 10a9.956 9.956 0 01-4.675-.938" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.828-2.828A9.956 9.956 0 0122 12c0 5.523-4.477 10-10 10S2 17.523 2 12c0-2.21.896-4.21 2.343-5.657" />
                        </svg>
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <label htmlFor="confirmNewPassword" className="block text-xs font-semibold text-gray-600 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <input
                      id="confirmNewPassword"
                      type={showConfirmNewPassword ? "text" : "password"}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:bg-white transition pr-10"
                      placeholder="Confirm new password"
                      required
                    />
                    <span
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                      onClick={() => setShowConfirmNewPassword((v) => !v)}
                      tabIndex={0}
                      role="button"
                      aria-label={showConfirmNewPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmNewPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.236.938-4.675M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.062-4.675A9.956 9.956 0 0122 9c0 5.523-4.477 10-10 10a9.956 9.956 0 01-4.675-.938" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.828-2.828A9.956 9.956 0 0122 12c0 5.523-4.477 10-10 10S2 17.523 2 12c0-2.21.896-4.21 2.343-5.657" />
                        </svg>
                      )}
                    </span>
                  </div>
                  {newPassword && confirmNewPassword && newPassword !== confirmNewPassword && (
                    <p className="text-red-600 text-xs mt-1">
                      Passwords do not match
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!validatePassword(newPassword) || !confirmNewPassword || newPassword !== confirmNewPassword}
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-xl shadow-lg hover:from-indigo-600 hover:to-pink-600 focus:ring-4 focus:ring-indigo-300 transition-all duration-200 font-bold text-lg"
                >
                  Reset Password
                </button>
              </form>
              <p className="mt-6 text-center text-sm text-gray-600">
                Back to{' '}
                <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
                  Login
                </Link>
              </p>
            </>
          ) : isForgotPassword ? (
            <>
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Forgot Password</h2>
              {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm text-center shadow">
                  {error}
                </div>
              )}
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:bg-white transition"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-xl shadow-lg hover:from-indigo-600 hover:to-pink-600 focus:ring-4 focus:ring-indigo-300 transition-all duration-200 font-bold text-lg"
                >
                  Send Reset Link
                </button>
                {msg && <div className="text-green-600 text-center">{msg}</div>}
              </form>
              <p className="mt-6 text-center text-sm text-gray-600">
                Back to{' '}
                <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium" onClick={() => setIsForgotPassword(false)}>
                  Login
                </Link>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-4xl font-extrabold text-gray-800 mb-2 text-center tracking-tight drop-shadow-lg">
                Welcome Back
              </h2>
              <p className="text-center text-gray-500 mb-8 text-lg">
                Sign in to your HR Portal account
              </p>
              {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm text-center shadow">
                  {error}
                </div>
              )}
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:bg-white transition"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:bg-white transition pr-10"
                      placeholder="Enter your password"
                      required
                    />
                    <span
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={0}
                      role="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.236.938-4.675M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.062-4.675A9.956 9.956 0 0122 9c0 5.523-4.477 10-10 10a9.956 9.956 0 01-4.675-.938" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.828-2.828A9.956 9.956 0 0122 12c0 5.523-4.477 10-10 10S2 17.523 2 12c0-2.21.896-4.21 2.343-5.657" />
                        </svg>
                      )}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-xl shadow-lg hover:from-indigo-600 hover:to-pink-600 focus:ring-4 focus:ring-indigo-300 transition-all duration-200 font-bold text-lg"
                >
                  Login
                </button>
              </form>
              <p className="mt-8 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-indigo-600 hover:text-indigo-800 font-semibold">
                  Sign Up
                </Link>
              </p>
            </>
          )}
          {loading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-10 backdrop-blur-sm">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-500 border-b-4 mb-4"></div>
                <span className="text-indigo-700 font-bold text-lg">Processing...</span>
              </div>
            </div>
          )}
        </div>
        {/* Right: Animation */}
        <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex-1">
          <Player
            src="/assets/loginImage.json"
            background="transparent"
            speed={1}
            style={{ width: "350px", height: "350px" }}
            loop
            autoplay
          />
          <p className="mt-6 text-lg text-indigo-400 font-semibold text-center px-6">
            Welcome to the HR Portal
          </p>
        </div>
      </div>
    </div>
  );
}