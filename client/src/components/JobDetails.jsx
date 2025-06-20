import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${baseURL}/api/jobs/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setJob(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, baseURL]);

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
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">{job.title}</h2>
          <button
            onClick={() => navigate('/jobs')}
            className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Back to Listings
          </button>
        </div>

        {/* Job Details */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <span className="text-base sm:text-lg font-semibold text-gray-700">Department:</span>
            <span className="text-base sm:text-lg text-gray-600">{job.department}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <span className="text-base sm:text-lg font-semibold text-gray-700">Location:</span>
            <span className="text-base sm:text-lg text-gray-600">{job.location}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <span className="text-base sm:text-lg font-semibold text-gray-700">Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                job.status === 'Open'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {job.status}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4">
            <span className="text-base sm:text-lg font-semibold text-gray-700">About the Job:</span>
            <p className="text-base sm:text-lg text-gray-600">{job.aboutJob}</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4">
            <span className="text-base sm:text-lg font-semibold text-gray-700">About the Company:</span>
            <p className="text-base sm:text-lg text-gray-600">{job.aboutCompany}</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4">
            <span className="text-base sm:text-lg font-semibold text-gray-700">Qualifications:</span>
            <p className="text-base sm:text-lg text-gray-600">{job.qualification}</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <span className="text-base sm:text-lg font-semibold text-gray-700">CTC:</span>
            <span className="text-base sm:text-lg text-gray-600">{job.ctc}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4">
            <span className="text-base sm:text-lg font-semibold text-gray-700">Skills:</span>
            <div className="flex flex-wrap gap-2">
              {job.skills.split(',').map((skill, index) => (
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
            <span className="text-base sm:text-lg font-semibold text-gray-700">Created At:</span>
            <span className="text-base sm:text-lg text-gray-600">
              {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <span className="text-base sm:text-lg font-semibold text-gray-700">Updated At:</span>
            <span className="text-base sm:text-lg text-gray-600">
              {job.updatedAt ? new Date(job.updatedAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}