import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UserPanel() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    address: '',
    gender: '',
    dob: '',
    linkedin: '',
    emergencyContact: '',
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setUser(res.data);
        setForm({
          name: res.data.name || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          department: res.data.department || '',
          designation: res.data.designation || '',
          address: res.data.address || '',
          gender: res.data.gender || '',
          dob: res.data.dob ? res.data.dob.slice(0, 10) : '',
          linkedin: res.data.linkedin || '',
          emergencyContact: res.data.emergencyContact || '',
        });
      })
      .catch(() => setMsg('Failed to load user details'));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async e => {
    e.preventDefault();
    setMsg('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('/api/users/me', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      setEditMode(false);
      setMsg('Profile updated successfully!');
      localStorage.setItem('user', JSON.stringify(res.data));
      // Redirect to /profile and show message
      navigate('/profile');
    } catch (err) {
      setMsg(err.response?.data?.error || 'Failed to update profile');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/users/change-password',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPasswordMsg('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setShowPasswordModal(false), 1500);
    } catch (err) {
      setPasswordMsg(err.response?.data?.error || 'Failed to change password');
    }
    setPasswordLoading(false);
  };

  if (!user && !msg) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">Loading user details...</div>
      </div>
    );
  }
  if (msg && !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-600">{msg}</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">My Profile</h2>
      {msg && (
        <div className="mb-4 text-center text-green-700 bg-green-100 rounded-lg p-2">{msg}</div>
      )}
      {!editMode ? (
        <div>
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-700 mb-2">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="text-xl font-semibold">{user.name}</div>
            <div className="text-gray-500">{user.email}</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <span className="font-medium text-gray-700">Phone:</span> {user.phone || '-'}
            </div>
            <div>
              <span className="font-medium text-gray-700">Department:</span> {user.department || '-'}
            </div>
            <div>
              <span className="font-medium text-gray-700">Designation:</span> {user.designation || '-'}
            </div>
            <div>
              <span className="font-medium text-gray-700">Gender:</span> {user.gender || '-'}
            </div>
            <div>
              <span className="font-medium text-gray-700">Date of Birth:</span> {user.dob ? user.dob.slice(0, 10) : '-'}
            </div>
            <div>
              <span className="font-medium text-gray-700">Address:</span> {user.address || '-'}
            </div>
            <div>
              <span className="font-medium text-gray-700">LinkedIn:</span> {user.linkedin ? <a href={user.linkedin} className="text-indigo-600" target="_blank" rel="noopener noreferrer">{user.linkedin}</a> : '-'}
            </div>
            <div>
              <span className="font-medium text-gray-700">Emergency Contact:</span> {user.emergencyContact || '-'}
            </div>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={() => setEditMode(true)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Edit Profile
            </button>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Change Password
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
                disabled
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Department</label>
              <input
                type="text"
                name="department"
                value={form.department}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Designation</label>
              <input
                type="text"
                name="designation"
                value={form.designation}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">LinkedIn</label>
              <input
                type="url"
                name="linkedin"
                value={form.linkedin}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Emergency Contact</label>
              <input
                type="text"
                name="emergencyContact"
                value={form.emergencyContact}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setShowPasswordModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-center text-purple-700">Change Password</h2>
            {passwordMsg && (
              <div className={`mb-4 text-center ${passwordMsg.includes('success') ? 'text-green-700' : 'text-red-600'}`}>
                {passwordMsg}
              </div>
            )}
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="mt-1 w-full p-3 border border-gray-300 rounded-lg pr-10"
                    required
                  />
                  <span
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                    onClick={() => setShowCurrentPassword((v) => !v)}
                    tabIndex={0}
                    role="button"
                    aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                  >
                    {showCurrentPassword ? (
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
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="mt-1 w-full p-3 border border-gray-300 rounded-lg pr-10"
                    required
                  />
                  <span
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
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
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="mt-1 w-full p-3 border border-gray-300 rounded-lg pr-10"
                    required
                  />
                  <span
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
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
                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-red-600 text-xs mt-1">
                    Passwords do not match
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={
                  passwordLoading ||
                  !currentPassword ||
                  !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(newPassword) ||
                  newPassword !== confirmPassword
                }
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:bg-gray-400"
              >
                {passwordLoading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}