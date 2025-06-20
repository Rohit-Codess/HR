import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function CandidateDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/candidates/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch candidate details');
        const data = await response.json();
        setCandidate(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchCandidate();
  }, [id]);

  const handleDeleteCandidate = async (candidate) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete candidate "${candidate.name}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/candidates/${candidate._id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The candidate has been deleted successfully.',
          showConfirmButton: false,
          timer: 1500,
        });
        navigate('/candidates');
      } catch (err) {
        setError(err.message);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error deleting candidate.',
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-8 bg-gradient-to-r from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-6 sm:p-8 transform transition-all duration-300 hover:shadow-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">{candidate.name}</h2>
          <button
            onClick={() => navigate('/candidates')}
            className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Back to Candidates
          </button>
        </div>

        {/* Candidate Details */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <span className="text-base sm:text-lg font-semibold text-gray-700">Position:</span>
            <span className="text-base sm:text-lg text-gray-600">{candidate.position}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <span className="text-base sm:text-lg font-semibold text-gray-700">Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
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
          <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4">
            <span className="text-base sm:text-lg font-semibold text-gray-700">About the Candidate:</span>
            <p className="text-base sm:text-lg text-gray-600">{candidate.aboutCandidate}</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4">
            <span className="text-base sm:text-lg font-semibold text-gray-700">Skills:</span>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.split(',').map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <span className="text-base sm:text-lg font-semibold text-gray-700">Resume:</span>
            <a
              href={candidate.resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base sm:text-lg text-blue-600 hover:underline"
            >
              View Resume
            </a>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <span className="text-base sm:text-lg font-semibold text-gray-700">Experience:</span>
            <span className="text-base sm:text-lg text-gray-600">{candidate.experience}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <span className="text-base sm:text-lg font-semibold text-gray-700">Created At:</span>
            <span className="text-base sm:text-lg text-gray-600">
              {candidate.createdAt ? new Date(candidate.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <span className="text-base sm:text-lg font-semibold text-gray-700">Updated At:</span>
            <span className="text-base sm:text-lg text-gray-600">
              {candidate.updatedAt ? new Date(candidate.updatedAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={() => handleDeleteCandidate(candidate)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}