import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const user = JSON.parse(localStorage.getItem('user')); // Get user data

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold">HR Portal</h2>
        <button className="lg:hidden text-2xl" onClick={onClose}>
          ✕
        </button>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block py-2 px-4 rounded ${isActive ? 'bg-indigo-600' : 'hover:bg-gray-700'}`
              }
              onClick={onClose}
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/jobs"
              className={({ isActive }) =>
                `block py-2 px-4 rounded ${isActive ? 'bg-indigo-600' : 'hover:bg-gray-700'}`
              }
              onClick={onClose}
            >
              Job Listings
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/candidates"
              className={({ isActive }) =>
                `block py-2 px-4 rounded ${isActive ? 'bg-indigo-600' : 'hover:bg-gray-700'}`
              }
              onClick={onClose}
            >
              Candidates
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/interviews"
              className={({ isActive }) =>
                `block py-2 px-4 rounded ${isActive ? 'bg-indigo-600' : 'hover:bg-gray-700'}`
              }
              onClick={onClose}
            >
              Interviews
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/offerLetter"
              className={({ isActive }) =>
                `block py-2 px-4 rounded ${isActive ? 'bg-indigo-600' : 'hover:bg-gray-700'}`
              }
              onClick={onClose}
            >
              Offer Letters
            </NavLink>
          </li>
          {user?.role === 'admin' && (
            <li>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `block py-2 px-4 rounded ${isActive ? 'bg-indigo-600' : 'hover:bg-gray-700'}`
                }
                onClick={onClose}
              >
                Admin Panel
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;