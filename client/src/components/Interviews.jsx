import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import InterviewEditForm from './InterviewEditForm';

export default function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editInterview, setEditInterview] = useState(null);
  const [newInterview, setNewInterview] = useState({
    candidateId: '',
    position: '',
    interviewer: '',
    dateTime: '',
    mode: 'Online',
    status: 'Scheduled',
    notes: '',
    meetingLink: '',
  });
  const [candidates, setCandidates] = useState([]);
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  // Set a default dateTime value when the component mounts
  useEffect(() => {
    // Set default to current date and time in the correct format
    const now = new Date();
    const defaultDateTime = now.toISOString().slice(0, 16); // Format: YYYY-MM-DDThh:mm
    setNewInterview((prev) => ({ ...prev, dateTime: defaultDateTime }));
  }, []);

  // Fetch interviews from the backend on component mount
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${baseURL}/api/interviews`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setInterviews(response.data);
        setFilteredInterviews(response.data);
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error fetching interviews. Please ensure the backend server is running.',
        });
      }
    };
    fetchInterviews();
  }, [baseURL]);

  // Fetch candidates for the dropdown
  useEffect(() => {
    const fetchCandidates = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${baseURL}/api/candidates`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setCandidates(response.data);
    };
    fetchCandidates();
  }, [baseURL]);

  const handleFilter = () => {
    let filtered = interviews;
    if (searchTerm) {
      filtered = filtered.filter((interview) =>
        interview.candidateName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (positionFilter) {
      filtered = filtered.filter((interview) =>
        interview.position?.toLowerCase().includes(positionFilter.toLowerCase())
      );
    }
    if (statusFilter) {
      filtered = filtered.filter((interview) =>
        interview.status?.toLowerCase().includes(statusFilter.toLowerCase())
      );
    }
    setFilteredInterviews(filtered);
  };

  const handleCreateInterview = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${baseURL}/api/interviews`, {
        ...newInterview,
        dateTime: new Date(newInterview.dateTime).toISOString(),
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const createdInterview = response.data;
      setInterviews([...interviews, createdInterview]);
      setFilteredInterviews([...filteredInterviews, createdInterview]);
      const now = new Date();
      const defaultDateTime = now.toISOString().slice(0, 16);
      setNewInterview({
        candidateId: '',
        position: '',
        interviewer: '',
        dateTime: defaultDateTime,
        mode: 'Online',
        status: 'Scheduled',
        notes: '',
        meetingLink: '',
      });
      setIsModalOpen(false);
      Swal.fire({
        icon: 'success',
        title: 'Interview Created!',
        text: 'The new interview has been scheduled successfully.',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error('Error creating interview:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response?.data?.message || 'Error creating interview.',
      });
    }
  };

  const handleEditInterview = (interview) => {
    setEditInterview(interview);
  };

  // Directly update interview on save (no password prompt)
  const handleSaveEdit = async (updatedData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${baseURL}/api/interviews/${editInterview._id}`,
        updatedData,
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );
      const updatedInterview = response.data;
      setInterviews(interviews.map((i) => (i._id === updatedInterview._id ? updatedInterview : i)));
      setFilteredInterviews(filteredInterviews.map((i) => (i._id === updatedInterview._id ? updatedInterview : i)));
      setEditInterview(null);
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Interview details updated successfully.',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Update failed',
        text: error.response?.data?.error || 'Could not update interview.',
      });
    }
  };

  const handleCancelEdit = () => {
    setEditInterview(null);
  };

  const handleDeleteInterview = async (interview) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete the interview with "${interview.candidateName}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${baseURL}/api/interviews/${interview._id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setInterviews(interviews.filter((i) => i._id !== interview._id));
        setFilteredInterviews(filteredInterviews.filter((i) => i._id !== interview._id));
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The interview has been deleted successfully.',
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error deleting interview.',
        });
      }
    }
  };

  return (
    <div className="flex-1 p-2 sm:p-4 md:p-6 lg:p-8 bg-gradient-to-r from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight mb-2 md:mb-0">
          Interviews
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 md:px-6 md:py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200 shadow-lg font-semibold"
        >
          + Schedule New Interview
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:flex-wrap gap-3 md:gap-4 mb-6 md:mb-8 p-3 md:p-6 bg-white rounded-2xl shadow-lg border border-indigo-100">
        <input
          type="text"
          placeholder="Search for candidate name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow duration-200"
        />
        <input
          type="text"
          placeholder="Filter by position..."
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
          className="w-full sm:w-auto p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow duration-200"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow duration-200"
        >
          <option value="">Status</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button
          onClick={handleFilter}
          className="w-full sm:w-auto px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md"
        >
          Filter
        </button>
      </div>

      {/* Interviews Table */}
      <div className="bg-white shadow-2xl rounded-2xl overflow-x-auto border border-indigo-100">
        <table className="w-full table-auto min-w-[700px]">
          <thead>
            <tr className="bg-indigo-50">
              <th className="p-4 text-left text-gray-700 font-semibold hidden sm:table-cell">Candidate Name</th>
              <th className="p-4 text-left text-gray-700 font-semibold hidden sm:table-cell">Position</th>
              <th className="p-4 text-left text-gray-700 font-semibold hidden sm:table-cell">Date & Time</th>
              <th className="p-4 text-left text-gray-700 font-semibold hidden sm:table-cell">Status</th>
              <th className="p-4 text-right text-gray-700 font-semibold hidden sm:table-cell">Actions</th>
              <th className="p-4 text-left text-gray-700 font-semibold sm:hidden">Interview Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredInterviews.map((interview) => (
              <tr
                key={interview._id}
                className="border-t hover:bg-indigo-50 transition-colors duration-150 flex flex-col sm:table-row"
              >
                {/* Mobile View */}
                <td className="p-4 sm:hidden">
                  <div className="flex flex-col space-y-2">
                    <div>
                      <span className="font-semibold text-gray-800">Candidate: </span>
                      {interview.candidateName}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800">Position: </span>
                      {interview.position}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800">Date & Time: </span>
                      {new Date(interview.dateTime).toLocaleString()}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800">Status: </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                          interview.status === 'Scheduled'
                            ? 'bg-blue-100 text-blue-800'
                            : interview.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {interview.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <button
                        onClick={() => navigate(`/interviews/${interview._id}`)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm font-semibold"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleEditInterview(interview)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 shadow-sm font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteInterview(interview)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-sm font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </td>
                {/* Desktop View */}
                <td className="p-4 text-gray-800 hidden sm:table-cell">{interview.candidateName}</td>
                <td className="p-4 text-gray-600 hidden sm:table-cell">{interview.position}</td>
                <td className="p-4 text-gray-600 hidden sm:table-cell">
                  {new Date(interview.dateTime).toLocaleString()}
                </td>
                <td className="p-4 hidden sm:table-cell">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                      interview.status === 'Scheduled'
                        ? 'bg-blue-100 text-blue-800'
                        : interview.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {interview.status}
                  </span>
                </td>
                <td className="p-4 text-right hidden sm:table-cell">
                  <div className="flex flex-wrap justify-end gap-2">
                    <button
                      onClick={() => navigate(`/interviews/${interview._id}`)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm font-semibold"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleEditInterview(interview)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 shadow-sm font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteInterview(interview)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-sm font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Scheduling New Interview */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-indigo-100">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
              Schedule New Interview
            </h3>
            <form onSubmit={handleCreateInterview} className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Candidate
                </label>
                <select
                  value={newInterview.candidateId}
                  onChange={e => setNewInterview({ ...newInterview, candidateId: e.target.value })}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Candidate</option>
                  {candidates.map(candidate => (
                    <option key={candidate._id} value={candidate._id}>
                      {candidate.name} ({candidate.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Position
                </label>
                <input
                  type="text"
                  value={newInterview.position}
                  onChange={(e) =>
                    setNewInterview({ ...newInterview, position: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter position..."
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Interviewer
                </label>
                <input
                  type="text"
                  value={newInterview.interviewer}
                  onChange={(e) =>
                    setNewInterview({ ...newInterview, interviewer: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter interviewer name..."
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={newInterview.dateTime}
                  onChange={(e) =>
                    setNewInterview({ ...newInterview, dateTime: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Mode
                </label>
                <select
                  value={newInterview.mode}
                  onChange={(e) =>
                    setNewInterview({ ...newInterview, mode: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Online">Online</option>
                  <option value="In-Person">In-Person</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Notes
                </label>
                <textarea
                  value={newInterview.notes}
                  onChange={(e) =>
                    setNewInterview({ ...newInterview, notes: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="3"
                  placeholder="Add any notes for the interview..."
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Meeting Link (if online)
                </label>
                <input
                  type="url"
                  value={newInterview.meetingLink}
                  onChange={(e) =>
                    setNewInterview({ ...newInterview, meetingLink: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., https://zoom.us/j/123456789"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Status
                </label>
                <select
                  value={newInterview.status}
                  onChange={(e) =>
                    setNewInterview({ ...newInterview, status: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  Schedule Interview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Editing Interview */}
      {editInterview && (
        <InterviewEditForm
          interview={editInterview}
          candidates={candidates}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
}