import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import Swal from 'sweetalert2';
import JobListings from './components/JobListings';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Candidates from './components/Candidates';
import Interviews from './components/Interviews';
import OfferLetter from './components/OfferLetter';
import JobDetails from './components/JobDetails';
import CandidateDetails from './components/CandidateDetails';
import InterviewDetails from './components/InterviewDetails';
import OfferLetterDetails from './components/OfferLetterDetails';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminPanel from './components/AdminPanel';
import ChangePassword from './components/ChangePassword';
import UserPanel from './components/UserPanel';

function Header({ onMenuClick, user, onLogout }) {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 p-4 shadow-lg relative z-10">
      <button
        className="lg:hidden text-2xl text-white focus:outline-none hover:bg-indigo-700 rounded-full p-2 transition"
        onClick={onMenuClick}
        aria-label="Open sidebar"
      >
        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="flex items-center space-x-3">
        <img
          src="/assets/logo.jpg"
          alt="HR Portal Logo"
          className="w-10 h-10 rounded-full shadow-md border-2 border-white object-cover"
        />
        <h2 className="text-2xl font-extrabold text-white tracking-wide drop-shadow-lg">HR Portal</h2>
      </div>
      <div className="flex items-center space-x-4">
        {user && (
          <>
            <span className="hidden sm:block text-white font-medium bg-indigo-700 px-3 py-1 rounded-full shadow">
              {user.name}
            </span>
            <div
              className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-700 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg border-2 border-white cursor-pointer"
              onClick={() => navigate('/profile')}
              title="View Profile"
              style={{ transition: 'box-shadow 0.2s' }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={onLogout}
              className="ml-2 px-4 py-2 bg-white text-indigo-700 font-semibold rounded-lg shadow hover:bg-indigo-50 transition-colors duration-200 border border-indigo-200"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}

function ProtectedRoute({ children, isAdminOnly = false }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else if (isAdminOnly && user?.role !== 'admin') {
      navigate('/');
    }
  }, [token, user, isAdminOnly, navigate]);

  return token ? children : null;
}

function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isTokenExpired(token)) {
      axios.get(`${baseURL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        });
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  }, [baseURL]);

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of your session.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout',
      background: '#fff',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        Swal.fire({
          title: 'Logged out!',
          text: 'You have been logged out successfully.',
          icon: 'success',
          confirmButtonColor: '#6366f1',
          timer: 1500,
          showConfirmButton: false,
          background: '#fff',
        });
      }
    });
  };

  return (
    <Router>
      {user ? (
        <div className="flex h-screen bg-white">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            user={user}
          />
          <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
            <Header
              onMenuClick={() => setSidebarOpen(!sidebarOpen)}
              user={user}
              onLogout={handleLogout}
            />
            <main className="flex-1 overflow-y-auto bg-gray-50 pl-0 lg:pl-4 pr-4 pt-4 pb-4">
              <Routes>
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/jobs" element={<ProtectedRoute><JobListings /></ProtectedRoute>} />
                <Route path="/jobs/:id" element={<ProtectedRoute><JobDetails /></ProtectedRoute>} />
                <Route path="/candidates" element={<ProtectedRoute><Candidates /></ProtectedRoute>} />
                <Route path="/candidates/:id" element={<ProtectedRoute><CandidateDetails /></ProtectedRoute>} />
                <Route path="/interviews" element={<ProtectedRoute><Interviews /></ProtectedRoute>} />
                <Route path="/interviews/:id" element={<ProtectedRoute><InterviewDetails /></ProtectedRoute>} />
                <Route path="/offerLetter" element={<ProtectedRoute><OfferLetter /></ProtectedRoute>} />
                <Route path="/offerLetter/:id" element={<ProtectedRoute><OfferLetterDetails /></ProtectedRoute>} />
                <Route
                  path="/admin"
                  element={<ProtectedRoute isAdminOnly={true}><AdminPanel /></ProtectedRoute>}
                />
                <Route path="/profile" element={<ProtectedRoute><UserPanel /></ProtectedRoute>} />
                <Route path="/login" element={<Login setUser={setUser} />} />
                <Route path="/signup" element={<Signup setUser={setUser} />} />
                <Route path="/reset-password/:token" element={<Login setUser={setUser} />} />
                <Route path="/change-password/:token" element={<ChangePassword />} />
              </Routes>
            </main>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/reset-password/:token" element={<Login setUser={setUser} />} />
          <Route path="/change-password/:token" element={<ChangePassword />} />
          <Route path="*" element={<Login setUser={setUser} />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;