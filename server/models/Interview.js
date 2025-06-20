const mongoose = require('mongoose');
const interviewSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
  candidateName: String,
  position: String,
  interviewer: String,
  dateTime: Date,
  mode: String,
  status: { type: String, default: 'Scheduled' },
  notes: String,
  meetingLink: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});
module.exports = mongoose.model('Interview', interviewSchema);