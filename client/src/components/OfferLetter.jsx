import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import OfferLetterEditForm from './OfferLetterEditForm';

export default function OfferLetter() {
  const [offerLetters, setOfferLetters] = useState([]);
  const [filteredOfferLetters, setFilteredOfferLetters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editOfferLetter, setEditOfferLetter] = useState(null);
  const [newOfferLetter, setNewOfferLetter] = useState({
    candidateId: '',
    position: '',
    dateIssued: new Date().toISOString().split('T')[0],
    status: 'Pending',
    content: `Dear ${candidates.name},\n\nWe are pleased to offer you the position of ${candidates.position} at our company. Based on your interview and qualifications, we believe you are a great fit for the role. The offered salary for this position is ${offerLetters.salary}, and your expected start date will be ${offerLetters.dateIssued}.\n\nPlease review the attached offer letter for detailed terms and respond by ${offerLetters.startDate}.\n\nWe look forward to your response.\n\nBest regards,\nHR Team`,
    salary: '',
    startDate: '',
    notes: '',
  });
  const [candidates, setCandidates] = useState([]);
  const [deliveredIds, setDeliveredIds] = useState([]);
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  // Fetch offer letters from the backend on component mount
  useEffect(() => {
    const fetchOfferLetters = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${baseURL}/api/offerLetter`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setOfferLetters(response.data);
        setFilteredOfferLetters(response.data);
      } catch {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error fetching offer letters. Please ensure the backend server is running.',
        });
      }
    };
    fetchOfferLetters();
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
    let filtered = offerLetters;
    if (searchTerm) {
      filtered = filtered.filter((offerLetter) =>
        offerLetter.candidateName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (positionFilter) {
      filtered = filtered.filter((offerLetter) =>
        offerLetter.position?.toLowerCase().includes(positionFilter.toLowerCase())
      );
    }
    if (statusFilter) {
      filtered = filtered.filter((offerLetter) =>
        offerLetter.status?.toLowerCase().includes(statusFilter.toLowerCase())
      );
    }
    setFilteredOfferLetters(filtered);
  };

  const handleCreateOfferLetter = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const candidate = candidates.find(c => c._id === newOfferLetter.candidateId);
      const response = await axios.post(`${baseURL}/api/offerLetter`, {
        ...newOfferLetter,
        candidateName: candidate ? candidate.name : '',
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const createdOfferLetter = response.data;
      setOfferLetters([...offerLetters, createdOfferLetter]);
      setFilteredOfferLetters([...filteredOfferLetters, createdOfferLetter]);
      setNewOfferLetter({
        candidateId: '',
        position: '',
        dateIssued: new Date().toISOString().split('T')[0],
        status: 'Pending',
        content: `Dear [Candidate Name],\n\nWe are pleased to offer you the position of [Position] at our company. [Add details about the role, company, and terms of employment here.]\n\nWe look forward to your response.\n\nBest regards,\nHR Team`,
        salary: '',
        startDate: '',
        notes: '',
      });
      setIsModalOpen(false);
      Swal.fire({
        icon: 'success',
        title: 'Offer Letter Created!',
        text: 'The new offer letter has been created successfully.',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response?.data?.errors?.[0]?.msg || 'Error creating offer letter.',
      });
    }
  };

  const handleEditOfferLetter = (offerLetter) => {
    setEditOfferLetter(offerLetter);
  };

  // Directly update offer letter on save (no status toggle by click)
  const handleSaveEdit = async (updatedData) => {
    try {
      const token = localStorage.getItem('token');
      const candidate = candidates.find(c => c._id === updatedData.candidateId);
      const response = await axios.put(
        `${baseURL}/api/offerLetter/${editOfferLetter._id}`,
        {
          ...updatedData,
          candidateName: candidate ? candidate.name : editOfferLetter.candidateName,
        },
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );
      const updatedOfferLetter = response.data;
      setOfferLetters(offerLetters.map((o) => (o._id === updatedOfferLetter._id ? updatedOfferLetter : o)));
      setFilteredOfferLetters(filteredOfferLetters.map((o) => (o._id === updatedOfferLetter._id ? updatedOfferLetter : o)));
      setEditOfferLetter(null);
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Offer letter details updated successfully.',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response?.data?.errors?.[0]?.msg || 'Error updating offer letter.',
      });
    }
  };

  const handleCancelEdit = () => {
    setEditOfferLetter(null);
  };

  const handleDeleteOfferLetter = async (offerLetter) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete the offer letter for "${offerLetter.candidateName}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${baseURL}/api/offerLetter/${offerLetter._id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setOfferLetters(offerLetters.filter((o) => o._id !== offerLetter._id));
        setFilteredOfferLetters(filteredOfferLetters.filter((o) => o._id !== offerLetter._id));
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The offer letter has been deleted successfully.',
          showConfirmButton: false,
          timer: 1500,
        });
      } catch {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error deleting offer letter.',
        });
      }
    }
  };

  const handleSendEmail = async (offerLetter) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${baseURL}/api/offerLetter/${offerLetter._id}/send-email`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDeliveredIds([...deliveredIds, offerLetter._id]);
      Swal.fire({
        icon: 'success',
        title: 'Delivered!',
        text: 'Offer letter email sent to candidate.',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed!',
        text: err.response?.data?.error || 'Failed to send email.',
      });
    }
  };

  return (
    <div className="flex-1 p-2 sm:p-4 md:p-6 lg:p-8 bg-gradient-to-r from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight mb-2 md:mb-0">
          Offer Letters
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 md:px-6 md:py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200 shadow-lg font-semibold"
        >
          + Create New Offer Letter
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
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button
          onClick={handleFilter}
          className="w-full sm:w-auto px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md"
        >
          Filter
        </button>
      </div>

      {/* Offer Letters Table */}
      <div className="bg-white shadow-2xl rounded-2xl overflow-x-auto border border-indigo-100">
        <table className="w-full table-auto min-w-[700px]">
          <thead>
            <tr className="bg-indigo-50">
              <th className="p-4 text-left text-gray-700 font-semibold hidden sm:table-cell">Candidate Name</th>
              <th className="p-4 text-left text-gray-700 font-semibold hidden sm:table-cell">Position</th>
              <th className="p-4 text-left text-gray-700 font-semibold hidden sm:table-cell">Date Issued</th>
              <th className="p-4 text-left text-gray-700 font-semibold hidden sm:table-cell">Status</th>
              <th className="p-4 text-right text-gray-700 font-semibold hidden sm:table-cell">Actions</th>
              <th className="p-4 text-left text-gray-700 font-semibold sm:hidden">Offer Letter Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredOfferLetters.map((offerLetter) => (
              <tr
                key={offerLetter._id}
                className="border-t hover:bg-indigo-50 transition-colors duration-150 flex flex-col sm:table-row"
              >
                {/* Mobile View */}
                <td className="p-4 sm:hidden">
                  <div className="flex flex-col space-y-2">
                    <div>
                      <span className="font-semibold text-gray-800">Candidate: </span>
                      {offerLetter.candidateName}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800">Position: </span>
                      {offerLetter.position}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800">Date Issued: </span>
                      {offerLetter.dateIssued}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800">Status: </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                          offerLetter.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : offerLetter.status === 'Accepted'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {offerLetter.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <button
                        onClick={() => navigate(`/offerLetter/${offerLetter._id}`)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm font-semibold"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleEditOfferLetter(offerLetter)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 shadow-sm font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteOfferLetter(offerLetter)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-sm font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </td>
                {/* Desktop View */}
                <td className="p-4 text-gray-800 hidden sm:table-cell">{offerLetter.candidateName}</td>
                <td className="p-4 text-gray-600 hidden sm:table-cell">{offerLetter.position}</td>
                <td className="p-4 text-gray-600 hidden sm:table-cell">{offerLetter.dateIssued}</td>
                <td className="p-4 hidden sm:table-cell">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                      offerLetter.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : offerLetter.status === 'Accepted'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {offerLetter.status}
                  </span>
                </td>
                <td className="p-4 text-right hidden sm:table-cell">
                  <div className="flex flex-wrap justify-end gap-2">
                    <button
                      onClick={() => navigate(`/offerLetter/${offerLetter._id}`)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm font-semibold"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleEditOfferLetter(offerLetter)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 shadow-sm font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteOfferLetter(offerLetter)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-sm font-semibold"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleSendEmail(offerLetter)}
                      disabled={deliveredIds.includes(offerLetter._id)}
                      className={`px-4 py-2 rounded-lg font-semibold shadow-sm transition-colors duration-200 ${
                        deliveredIds.includes(offerLetter._id)
                          ? 'bg-green-400 text-white cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {deliveredIds.includes(offerLetter._id) ? 'Delivered' : 'Send Email'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Creating New Offer Letter */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-indigo-100">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
              Create New Offer Letter
            </h3>
            <form onSubmit={handleCreateOfferLetter} className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Candidate
                </label>
                <select
                  value={newOfferLetter.candidateId}
                  onChange={e => setNewOfferLetter({ ...newOfferLetter, candidateId: e.target.value })}
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
                  value={newOfferLetter.position}
                  onChange={(e) =>
                    setNewOfferLetter({ ...newOfferLetter, position: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter position..."
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Date Issued
                </label>
                <input
                  type="date"
                  value={newOfferLetter.dateIssued}
                  onChange={(e) =>
                    setNewOfferLetter({ ...newOfferLetter, dateIssued: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Salary
                </label>
                <input
                  type="text"
                  value={newOfferLetter.salary}
                  onChange={(e) =>
                    setNewOfferLetter({ ...newOfferLetter, salary: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., 15 LPA"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={newOfferLetter.startDate}
                  onChange={(e) =>
                    setNewOfferLetter({ ...newOfferLetter, startDate: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Content
                </label>
                <textarea
                  value={newOfferLetter.content}
                  onChange={(e) =>
                    setNewOfferLetter({ ...newOfferLetter, content: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="5"
                  placeholder="Enter the offer letter content..."
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Notes
                </label>
                <textarea
                  value={newOfferLetter.notes}
                  onChange={(e) =>
                    setNewOfferLetter({ ...newOfferLetter, notes: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="3"
                  placeholder="Add any notes for the offer letter..."
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Status
                </label>
                <select
                  value={newOfferLetter.status}
                  onChange={(e) =>
                    setNewOfferLetter({ ...newOfferLetter, status: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
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
                  Create Offer Letter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Editing Offer Letter */}
      {editOfferLetter && (
        <OfferLetterEditForm
          offerLetter={editOfferLetter}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
          candidates={candidates}
        />
      )}
    </div>
  );
}