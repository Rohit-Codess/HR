import React, { useState } from 'react';

export default function JobEditForm({ job, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: job.title || '',
    department: job.department || '',
    location: job.location || '',
    status: job.status || 'Open',
    aboutJob: job.aboutJob || '',
    aboutCompany: job.aboutCompany || '',
    qualification: job.qualification || '',
    ctc: job.ctc || '',
    skills: job.skills || '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
          Edit Job
        </h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Job Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">About the Job</label>
            <textarea
              name="aboutJob"
              value={formData.aboutJob}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              rows="3"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">About the Company</label>
            <textarea
              name="aboutCompany"
              value={formData.aboutCompany}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              rows="3"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Qualifications</label>
            <textarea
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              rows="3"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">CTC</label>
            <input
              type="text"
              name="ctc"
              value={formData.ctc}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Skills (comma-separated)</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}