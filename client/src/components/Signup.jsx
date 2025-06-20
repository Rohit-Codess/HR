import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Player } from "@lottiefiles/react-lottie-player";

export default function Signup({ setUser }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    department: '',
    designation: '',
    address: '',
    gender: '',
    dob: '',
    linkedin: '',
    emergencyContact: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false); // <-- Add loading state
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validatePassword(form.password)) {
      setError('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character');
      return;
    }
    if (form.password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true); // Start loader
    try {
      const response = await axios.post(`${baseURL}/api/register`, form);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      navigate('/');
      setLoading(false); // Stop loader on success
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register');
      setLoading(false); // Stop loader on error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="bg-white/90 rounded-3xl shadow-2xl w-full max-w-5xl flex flex-col md:flex-row overflow-hidden border border-white/30 backdrop-blur-lg">
        {/* Left: Form */}
        <div className="flex-1 flex flex-col justify-center p-8 md:p-14">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-2 text-center tracking-tight drop-shadow-lg">
            Create Your Account
          </h2>
          <p className="text-center text-gray-500 mb-8 text-lg">
            Join our HR Portal and unlock the next level of recruitment!
          </p>
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm text-center shadow">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:bg-white transition"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:bg-white transition"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
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
                {!validatePassword(form.password) && form.password && (
                  <p className="text-red-600 text-xs mt-1">
                    Password must be at least 8 characters long and include uppercase, lowercase, number, and special character
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:bg-white transition pr-10"
                    placeholder="Confirm your password"
                    required
                  />
                  <span
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    tabIndex={0}
                    role="button"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
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
                {form.password && confirmPassword && form.password !== confirmPassword && (
                  <p className="text-red-600 text-xs mt-1">
                    Passwords do not match
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:bg-white transition"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Department</label>
                <input
                  type="text"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:bg-white transition"
                  placeholder="Department"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:bg-white transition"
                  placeholder="Designation"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:bg-white transition"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:bg-white transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:bg-white transition"
                  placeholder="Address"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">LinkedIn</label>
                <input
                  type="url"
                  name="linkedin"
                  value={form.linkedin}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:bg-white transition"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Emergency Contact</label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={form.emergencyContact}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:bg-white transition"
                  placeholder="Emergency Contact"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-xl shadow-lg hover:from-indigo-600 hover:to-pink-600 focus:ring-4 focus:ring-indigo-300 transition-all duration-200 font-bold text-lg mt-4"
              disabled={
                !validatePassword(form.password) ||
                !confirmPassword ||
                form.password !== confirmPassword
              }
            >
              Sign Up
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-semibold">
              Login
            </Link>
          </p>
          {/* Loader Overlay */}
          {loading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30 backdrop-blur-sm">
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
            src="/assets/signupImage.json"
            background="transparent"
            speed={1}
            style={{ width: "400px", height: "600px" }}
            loop
            autoplay
          />
          <p className="mt-6 text-lg text-indigo-400 font-semibold text-center px-6">
            Welcome to the future of HR management!
          </p>
        </div>
      </div>
    </div>
  );
}