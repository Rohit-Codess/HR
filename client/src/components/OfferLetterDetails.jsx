import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function OfferLetterDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offerLetter, setOfferLetter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchOfferLetter = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${baseURL}/api/offerLetter/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setOfferLetter(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchOfferLetter();
  }, [id, baseURL]);

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
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The offer letter has been deleted successfully.',
          showConfirmButton: false,
          timer: 1500,
        });
        navigate('/offerLetter');
      } catch (err) {
        setError(err.message);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error deleting offer letter.',
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
            Offer Letter for {offerLetter.candidateName}
          </h2>
          <button
            onClick={() => navigate('/offerLetter')}
            className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Back to Offer Letters
          </button>
        </div>

        {/* Offer Letter Details */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <span className="text-base sm:text-lg font-semibold text-gray-700">Candidate Name:</span>
            <span className="text-base sm:text-lg text-gray-600">{offerLetter.candidateName}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <span className="text-base sm:text-lg font-semibold text-gray-700">Position:</span>
            <span className="text-base sm:text-lg text-gray-600">{offerLetter.position}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <span className="text-base sm:text-lg font-semibold text-gray-700">Date Issued:</span>
            <span className="text-base sm:text-lg text-gray-600">
              {offerLetter.dateIssued
                ? new Date(offerLetter.dateIssued).toISOString().split('T')[0]
                : 'N/A'}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <span className="text-base sm:text-lg font-semibold text-gray-700">Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <span className="text-base sm:text-lg font-semibold text-gray-700">Salary:</span>
            <span className="text-base sm:text-lg text-gray-600">{offerLetter.salary}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <span className="text-base sm:text-lg font-semibold text-gray-700">Start Date:</span>
            <span className="text-base sm:text-lg text-gray-600">{offerLetter.startDate}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4">
            <span className="text-base sm:text-lg font-semibold text-gray-700">Notes:</span>
            <p className="text-base sm:text-lg text-gray-600">{offerLetter.notes || 'N/A'}</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <span className="text-base sm:text-lg font-semibold text-gray-700">Created At:</span>
            <span className="text-base sm:text-lg text-gray-600">
              {offerLetter.createdAt
                ? new Date(offerLetter.createdAt).toISOString().split('T')[0]
                : 'N/A'}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <span className="text-base sm:text-lg font-semibold text-gray-700">Updated At:</span>
            <span className="text-base sm:text-lg text-gray-600">
              {offerLetter.updatedAt
                ? new Date(offerLetter.updatedAt).toISOString().split('T')[0]
                : 'N/A'}
            </span>
          </div>
        </div>
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={() => handleDeleteOfferLetter(offerLetter)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete Offer Letter
          </button>
        </div>
      </div>
    </div>
  );
}