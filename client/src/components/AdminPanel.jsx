import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${baseURL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch users');
      }
    };
    fetchUsers();
  }, [baseURL]);

  const handleDeleteUser = async (user) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete the user "${user.name}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${baseURL}/api/admin/users/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(users.filter((u) => u._id !== user._id));
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The user has been deleted successfully.',
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.response?.data?.error || 'Failed to delete user',
        });
      }
    }
  };

  // Calculate counts
  const adminCount = users.filter((user) => user.role === 'admin').length;
  const hrUserCount = users.filter((user) => user.role === 'user').length;

  return (
    <div className="flex-1 p-4 sm:p-8 bg-gradient-to-r from-gray-50 to-gray-100 min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight mb-6 sm:mb-8">
        Admin Panel - User Management
      </h2>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}
      {/* Summary Statistics */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">User Summary</h3>
        <p className="text-gray-600">Total Admins: {adminCount}</p>
        <p className="text-gray-600">Total HR Users: {hrUserCount}</p>
        <p className="text-gray-600">Total Users: {users.length}</p>
      </div>
      {/* Users Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-indigo-50">
              <th className="p-4 text-left text-gray-700 font-semibold">ID</th>
              <th className="p-4 text-left text-gray-700 font-semibold">Email</th>
              <th className="p-4 text-left text-gray-700 font-semibold">Name</th>
              <th className="p-4 text-left text-gray-700 font-semibold">Role</th>
              <th className="p-4 text-right text-gray-700 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-t hover:bg-indigo-50 transition-colors duration-150"
              >
                <td className="p-4 text-gray-800">{user._id}</td>
                <td className="p-4 text-gray-800">{user.email}</td>
                <td className="p-4 text-gray-800">{user.name}</td>
                <td className="p-4 text-gray-800">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.role === 'admin'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {user.role !== 'admin' && (
                    <button
                      onClick={() => handleDeleteUser(user)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-sm"
                      disabled={user.role === 'admin'}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}