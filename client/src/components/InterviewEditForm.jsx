import React, { useState, useEffect } from 'react';

export default function InterviewEditForm({ interview, candidates, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    candidateId: interview.candidateId || '',
    position: interview.position || '',
    interviewer: interview.interviewer || '',
    dateTime: interview.dateTime ? new Date(interview.dateTime).toISOString().slice(0, 16) : '',
    mode: interview.mode || 'Online',
    status: interview.status || 'Scheduled',
    notes: interview.notes || '',
    meetingLink: interview.meetingLink || '',
  });

  useEffect(() => {
    if (interview.dateTime) {
      setFormData((prev) => ({
        ...prev,
        dateTime: new Date(interview.dateTime).toISOString().slice(0, 16),
      }));
    }
  }, [interview.dateTime]);

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
          Edit Interview
        </h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Candidate</label>
            <select
              name="candidateId"
              value={formData.candidateId}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
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
            <label className="block text-gray-700 font-medium mb-1">Position</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Interviewer</label>
            <input
              type="text"
              name="interviewer"
              value={formData.interviewer}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Date & Time</label>
            <input
              type="datetime-local"
              name="dateTime"
              value={formData.dateTime}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Mode</label>
            <select
              name="mode"
              value={formData.mode}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="Online">Online</option>
              <option value="In-Person">In-Person</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Meeting Link</label>
            <input
              type="url"
              name="meetingLink"
              value={formData.meetingLink}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
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
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
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