import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import JobEditForm from './JobEditForm';

export default function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [newJob, setNewJob] = useState({
    title: '',
    department: '',
    location: '',
    status: 'Open',
    aboutJob: '',
    aboutCompany: '',
    qualification: '',
    ctc: '',
    skills: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/jobs', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setJobs(response.data);
        setFilteredJobs(response.data);
      } catch {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error fetching jobs. Please ensure the backend server is running.',
        });
      }
    };
    fetchJobs();
  }, []);

  const handleFilter = () => {
    let filtered = jobs;
    if (searchTerm) {
      filtered = filtered.filter((job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (departmentFilter) {
      filtered = filtered.filter((job) =>
        job.department.toLowerCase().includes(departmentFilter.toLowerCase())
      );
    }
    if (locationFilter) {
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    setFilteredJobs(filtered);
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/jobs', newJob, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const createdJob = response.data;
      setJobs([...jobs, createdJob]);
      setFilteredJobs([...filteredJobs, createdJob]);
      setNewJob({
        title: '',
        department: '',
        location: '',
        status: 'Open',
        aboutJob: '',
        aboutCompany: '',
        qualification: '',
        ctc: '',
        skills: '',
      });
      setIsModalOpen(false);
      Swal.fire({
        icon: 'success',
        title: 'Job Created!',
        text: 'The new job has been created successfully.',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error creating job.',
      });
    }
  };

  const handleEditJob = (job) => {
    setEditJob(job);
  };

  // Directly update job on save (no status toggle by click)
  const handleSaveEdit = async (updatedData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `/api/jobs/${editJob._id}`,
        updatedData,
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );
      const updatedJob = response.data;
      setJobs(jobs.map((j) => (j._id === updatedJob._id ? updatedJob : j)));
      setFilteredJobs(filteredJobs.map((j) => (j._id === updatedJob._id ? updatedJob : j)));
      setEditJob(null);
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Job details updated successfully.',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Update failed',
        text: error.response?.data?.errors?.[0]?.msg || 'Error updating job.',
      });
    }
  };

  const handleCancelEdit = () => {
    setEditJob(null);
  };

  const handleDeleteJob = async (job) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete the job "${job.title}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/jobs/${job._id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setJobs(jobs.filter((j) => j._id !== job._id));
        setFilteredJobs(filteredJobs.filter((j) => j._id !== job._id));
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The job has been deleted successfully.',
          showConfirmButton: false,
          timer: 1500,
        });
      } catch {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error deleting job.',
        });
      }
    }
  };

  return (
    <div className="flex-1 p-2 sm:p-4 md:p-6 lg:p-8 bg-gradient-to-r from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight mb-2 md:mb-0">
          Job Listings
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 md:px-6 md:py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200 shadow-lg font-semibold"
        >
          + Create New Job
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:flex-wrap gap-3 md:gap-4 mb-6 md:mb-8 p-3 md:p-6 bg-white rounded-2xl shadow-lg border border-indigo-100">
        <input
          type="text"
          placeholder="Search for job title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow duration-200"
        />
        <input
          type="text"
          placeholder="Filter by department..."
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="w-full md:w-56 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow duration-200"
        />
        <input
          type="text"
          placeholder="Filter by location..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="w-full md:w-56 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow duration-200"
        />
        <button
          onClick={handleFilter}
          className="w-full md:w-auto px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md font-semibold"
        >
          Filter
        </button>
      </div>

      {/* Job Table */}
      <div className="bg-white shadow-2xl rounded-2xl overflow-x-auto border border-indigo-100">
        <table className="w-full table-auto min-w-[700px]">
          <thead>
            <tr className="bg-indigo-50">
              <th className="p-4 text-left text-gray-700 font-semibold hidden md:table-cell">Job</th>
              <th className="p-4 text-left text-gray-700 font-semibold hidden md:table-cell">Department</th>
              <th className="p-4 text-left text-gray-700 font-semibold hidden md:table-cell">Location</th>
              <th className="p-4 text-left text-gray-700 font-semibold hidden md:table-cell">Status</th>
              <th className="p-4 text-right text-gray-700 font-semibold hidden md:table-cell">Actions</th>
              <th className="p-4 text-left text-gray-700 font-semibold md:hidden">Job Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job) => (
              <tr
                key={job._id}
                className="border-t hover:bg-indigo-50 transition-colors duration-150 flex flex-col md:table-row"
              >
                {/* Mobile View */}
                <td className="p-4 md:hidden">
                  <div className="flex flex-col space-y-2">
                    <div>
                      <span className="font-semibold text-gray-800">Job: </span>
                      {job.title}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800">Department: </span>
                      {job.department}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800">Location: </span>
                      {job.location}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800">Status: </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                          job.status === 'Open'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <button
                        onClick={() => navigate(`/jobs/${job._id}`)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm font-semibold"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleEditJob(job)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 shadow-sm font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-sm font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </td>
                {/* Desktop & Mid View */}
                <td className="p-4 text-gray-800 hidden md:table-cell align-middle">{job.title}</td>
                <td className="p-4 text-gray-600 hidden md:table-cell align-middle">{job.department}</td>
                <td className="p-4 text-gray-600 hidden md:table-cell align-middle">{job.location}</td>
                <td className="p-4 hidden md:table-cell align-middle">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                      job.status === 'Open'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {job.status}
                  </span>
                </td>
                <td className="p-4 text-right hidden md:table-cell align-middle">
                  <div className="flex flex-wrap justify-end gap-2">
                    <button
                      onClick={() => navigate(`/jobs/${job._id}`)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm font-semibold"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleEditJob(job)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 shadow-sm font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job)}
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

      {/* Modal for Creating New Job */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-indigo-100">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
              Create New Job
            </h3>
            <form onSubmit={handleCreateJob} className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={newJob.title}
                  onChange={(e) =>
                    setNewJob({ ...newJob, title: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={newJob.department}
                  onChange={(e) =>
                    setNewJob({ ...newJob, department: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter department..."
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={newJob.location}
                  onChange={(e) =>
                    setNewJob({ ...newJob, location: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter location..."
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  About the Job
                </label>
                <textarea
                  value={newJob.aboutJob}
                  onChange={(e) =>
                    setNewJob({ ...newJob, aboutJob: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="3"
                  placeholder="Describe the job role..."
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  About the Company
                </label>
                <textarea
                  value={newJob.aboutCompany}
                  onChange={(e) =>
                    setNewJob({ ...newJob, aboutCompany: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="3"
                  placeholder="Describe the company..."
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Qualifications
                </label>
                <textarea
                  value={newJob.qualification}
                  onChange={(e) =>
                    setNewJob({ ...newJob, qualification: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="3"
                  placeholder="List required qualifications..."
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  CTC (Cost to Company)
                </label>
                <input
                  type="text"
                  value={newJob.ctc}
                  onChange={(e) =>
                    setNewJob({ ...newJob, ctc: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., 15 LPA"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={newJob.skills}
                  onChange={(e) =>
                    setNewJob({ ...newJob, skills: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., JavaScript, React, Node.js"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Status
                </label>
                <select
                  value={newJob.status}
                  onChange={(e) =>
                    setNewJob({ ...newJob, status: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
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
                  Create Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Editing Job */}
      {editJob && (
        <JobEditForm
          job={editJob}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
}