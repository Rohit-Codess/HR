import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import CandidateEditForm from './CandidateEditForm';

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCandidate, setEditCandidate] = useState(null);
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    email: '',
    position: '',
    status: 'Applied',
    aboutCandidate: '',
    skills: '',
    resumeLink: '',
    experience: '',
  });
  const navigate = useNavigate();

  // Fetch candidates from the backend on component mount
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/candidates', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setCandidates(response.data);
        setFilteredCandidates(response.data);
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error fetching candidates. Please ensure the backend server is running.',
        });
      }
    };
    fetchCandidates();
  }, []);

  const handleFilter = () => {
    let filtered = candidates;
    if (searchTerm) {
      filtered = filtered.filter((candidate) =>
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (positionFilter) {
      filtered = filtered.filter((candidate) =>
        candidate.position.toLowerCase().includes(positionFilter.toLowerCase())
      );
    }
    if (statusFilter) {
      filtered = filtered.filter((candidate) =>
        candidate.status.toLowerCase().includes(statusFilter.toLowerCase())
      );
    }
    setFilteredCandidates(filtered);
  };

  const handleCreateCandidate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/candidates', newCandidate, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const createdCandidate = response.data;
      setCandidates([...candidates, createdCandidate]);
      setFilteredCandidates([...filteredCandidates, createdCandidate]);
      setNewCandidate({
        name: '',
        email: '',
        position: '',
        status: 'Applied',
        aboutCandidate: '',
        skills: '',
        resumeLink: '',
        experience: '',
      });
      setIsModalOpen(false);
      Swal.fire({
        icon: 'success',
        title: 'Candidate Created!',
        text: 'The new candidate has been added successfully.',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response?.data?.errors?.[0]?.msg || 'Error creating candidate.',
      });
    }
  };

  const handleEditCandidate = (candidate) => {
    setEditCandidate(candidate);
  };

  // Directly update candidate on save (no password prompt)
  const handleSaveEdit = async (updatedData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `/api/candidates/${editCandidate._id}`,
        updatedData,
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );
      const updatedCandidate = response.data;
      setCandidates(candidates.map((c) => (c._id === updatedCandidate._id ? updatedCandidate : c)));
      setFilteredCandidates(filteredCandidates.map((c) => (c._id === updatedCandidate._id ? updatedCandidate : c)));
      setEditCandidate(null);
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Candidate details updated successfully.',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Update failed',
        text: error.response?.data?.error || 'Could not update candidate.',
      });
    }
  };

  const handleCancelEdit = () => {
    setEditCandidate(null);
  };

  const handleDeleteCandidate = async (candidate) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete the candidate "${candidate.name}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/candidates/${candidate._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setCandidates(candidates.filter((c) => c._id !== candidate._id));
        setFilteredCandidates(filteredCandidates.filter((c) => c._id !== candidate._id));
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The candidate has been deleted successfully.',
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error deleting candidate.',
        });
      }
    }
  };

  return (
    <div className="flex-1 p-2 sm:p-4 md:p-6 lg:p-8 bg-gradient-to-r from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight mb-2 md:mb-0">
          Candidates
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 md:px-6 md:py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200 shadow-lg font-semibold"
        >
          + Add New Candidate
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:flex-wrap gap-3 md:gap-4 mb-6 md:mb-8 p-3 md:p-6 bg-white rounded-2xl shadow-lg border border-indigo-100">
        <input
          type="text"
          placeholder="Search for candidate name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow duration-200"
        />
        <input
          type="text"
          placeholder="Filter by position..."
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
          className="w-full md:w-56 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow duration-200"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-56 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow duration-200"
        >
          <option value="">Status</option>
          <option value="Applied">Applied</option>
          <option value="Interviewed">Interviewed</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button
          onClick={handleFilter}
          className="w-full md:w-auto px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md font-semibold"
        >
          Filter
        </button>
      </div>

      {/* Candidates Table */}
      <div className="bg-white shadow-2xl rounded-2xl overflow-x-auto border border-indigo-100">
        <table className="w-full table-auto min-w-[700px]">
          <thead>
            <tr className="bg-indigo-50">
              <th className="p-4 text-left text-gray-700 font-semibold hidden md:table-cell">Name</th>
              <th className="p-4 text-left text-gray-700 font-semibold hidden md:table-cell">Position</th>
              <th className="p-4 text-left text-gray-700 font-semibold hidden md:table-cell">Status</th>
              <th className="p-4 text-right text-gray-700 font-semibold hidden md:table-cell">Actions</th>
              <th className="p-4 text-left text-gray-700 font-semibold md:hidden">Candidate Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.map((candidate) => (
              <tr
                key={candidate._id}
                className="border-t hover:bg-indigo-50 transition-colors duration-150 flex flex-col md:table-row"
              >
                {/* Mobile View */}
                <td className="p-4 md:hidden">
                  <div className="flex flex-col space-y-2">
                    <div>
                      <span className="font-semibold text-gray-800">Name: </span>
                      {candidate.name}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800">Position: </span>
                      {candidate.position}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800">Status: </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                          candidate.status === 'Applied'
                            ? 'bg-blue-100 text-blue-800'
                            : candidate.status === 'Interviewed'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {candidate.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <button
                        onClick={() => navigate(`/candidates/${candidate._id}`)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm font-semibold"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleEditCandidate(candidate)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 shadow-sm font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCandidate(candidate)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-sm font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </td>
                {/* Desktop View */}
                <td className="p-4 text-gray-800 hidden md:table-cell">{candidate.name}</td>
                <td className="p-4 text-gray-600 hidden md:table-cell">{candidate.position}</td>
                <td className="p-4 hidden md:table-cell">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                      candidate.status === 'Applied'
                        ? 'bg-blue-100 text-blue-800'
                        : candidate.status === 'Interviewed'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {candidate.status}
                  </span>
                </td>
                <td className="p-4 text-right hidden md:table-cell">
                  <div className="flex flex-wrap justify-end gap-2">
                    <button
                      onClick={() => navigate(`/candidates/${candidate._id}`)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm font-semibold"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleEditCandidate(candidate)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 shadow-sm font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCandidate(candidate)}
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

      {/* Modal for Adding New Candidate */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-indigo-100">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
              Add New Candidate
            </h3>
            <form onSubmit={handleCreateCandidate} className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newCandidate.name}
                  onChange={(e) =>
                    setNewCandidate({ ...newCandidate, name: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newCandidate.email}
                  onChange={(e) =>
                    setNewCandidate({ ...newCandidate, email: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter candidate email"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Position
                </label>
                <input
                  type="text"
                  value={newCandidate.position}
                  onChange={(e) =>
                    setNewCandidate({ ...newCandidate, position: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter position..."
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  About the Candidate
                </label>
                <textarea
                  value={newCandidate.aboutCandidate}
                  onChange={(e) =>
                    setNewCandidate({ ...newCandidate, aboutCandidate: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="3"
                  placeholder="Describe the candidate..."
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={newCandidate.skills}
                  onChange={(e) =>
                    setNewCandidate({ ...newCandidate, skills: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., JavaScript, React, Node.js"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Resume Link
                </label>
                <input
                  type="url"
                  value={newCandidate.resumeLink}
                  onChange={(e) =>
                    setNewCandidate({ ...newCandidate, resumeLink: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., https://example.com/resume.pdf"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Experience
                </label>
                <input
                  type="text"
                  value={newCandidate.experience}
                  onChange={(e) =>
                    setNewCandidate({ ...newCandidate, experience: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., 3 years"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Status
                </label>
                <select
                  value={newCandidate.status}
                  onChange={(e) =>
                    setNewCandidate({ ...newCandidate, status: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Applied">Applied</option>
                  <option value="Interviewed">Interviewed</option>
                  <option value="Rejected">Rejected</option>
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
                  Add Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Editing Candidate */}
      {editCandidate && (
        <CandidateEditForm
          candidate={editCandidate}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
}