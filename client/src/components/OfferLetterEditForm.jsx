import React, { useState, useEffect } from 'react';

export default function OfferLetterEditForm({ offerLetter, candidates, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    candidateId: offerLetter.candidateId || '',
    position: offerLetter.position || '',
    dateIssued: offerLetter.dateIssued ? offerLetter.dateIssued.slice(0, 10) : '',
    status: offerLetter.status || 'Pending',
    // content: offerLetter.content || '',
    salary: offerLetter.salary || '',
    startDate: offerLetter.startDate || '',
    notes: offerLetter.notes || '',
  });

  useEffect(() => {
    if (offerLetter.dateIssued) {
      setFormData((prev) => ({
        ...prev,
        dateIssued: offerLetter.dateIssued.slice(0, 10),
      }));
    }
  }, [offerLetter.dateIssued]);

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
          Edit Offer Letter
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
            <label className="block text-gray-700 font-medium mb-1">Date Issued</label>
            <input
              type="date"
              name="dateIssued"
              value={formData.dateIssued}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Salary</label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          {/* <div>
            <label className="block text-gray-700 font-medium mb-1">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              rows="5"
              required
            />
          </div> */}
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
            <label className="block text-gray-700 font-medium mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
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