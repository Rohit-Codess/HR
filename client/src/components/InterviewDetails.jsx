import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function InterviewDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/interviews/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setInterview(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchInterview();
  }, [id]);

  const handleDeleteInterview = async (interview) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete interview with "${interview.candidateName}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/interviews/${interview._id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The interview has been deleted successfully.',
          showConfirmButton: false,
          timer: 1500,
        });
        navigate('/interviews');
      } catch (err) {
        setError(err.message);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error deleting interview.',
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
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
            Interview with {interview.candidateName}
          </h2>
          <button
            onClick={() => navigate('/interviews')}
            className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Back to Interviews
          </button>
        </div>

        {/* Interview Details */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <span className="text-base sm:text-lg font-semibold text-gray-700">Candidate Name:</span>
            <span className="text-base sm:text-lg text-gray-600">{interview.candidateName}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <span className="text-base sm:text-lg font-semibold text-gray-700">Position:</span>
            <span className="text-base sm:text-lg text-gray-600">{interview.position}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <span className="text-base sm:text-lg font-semibold text-gray-700">Interviewer:</span>
            <span className="text-base sm:text-lg text-gray-600">{interview.interviewer}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <span className="text-base sm:text-lg font-semibold text-gray-700">Date & Time:</span>
            <span className="text-base sm:text-lg text-gray-600">
              {interview.dateTime ? new Date(interview.dateTime).toLocaleString() : 'N/A'}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <span className="text-base sm:text-lg font-semibold text-gray-700">Mode:</span>
            <span className="text-base sm:text-lg text-gray-600">{interview.mode}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <span className="text-base sm:text-lg font-semibold text-gray-700">Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
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
          <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4">
            <span className="text-base sm:text-lg font-semibold text-gray-700">Notes:</span>
            <p className="text-base sm:text-lg text-gray-600">{interview.notes}</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <span className="text-base sm:text-lg font-semibold text-gray-700">Meeting Link:</span>
            {interview.meetingLink ? (
              <a
                href={interview.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base sm:text-lg text-blue-600 hover:underline"
              >
                Join Meeting
              </a>
            ) : (
              <span className="text-base sm:text-lg text-gray-600">N/A</span>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <span className="text-base sm:text-lg font-semibold text-gray-700">Created At:</span>
            <span className="text-base sm:text-lg text-gray-600">
              {interview.createdAt ? new Date(interview.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <span className="text-base sm:text-lg font-semibold text-gray-700">Updated At:</span>
            <span className="text-base sm:text-lg text-gray-600">
              {interview.updatedAt ? new Date(interview.updatedAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={() => handleDeleteInterview(interview)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}