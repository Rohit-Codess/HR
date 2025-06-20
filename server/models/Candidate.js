const mongoose = require('mongoose');
const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  position: String,
  status: { type: String, default: 'Applied' },
  aboutCandidate: String,
  skills: String,
  resumeLink: String,
  experience: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true }); // <-- Add this line

module.exports = mongoose.model('Candidate', candidateSchema);