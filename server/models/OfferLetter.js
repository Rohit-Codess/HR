const mongoose = require('mongoose');
const offerLetterSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
  candidateName: String,
  position: String,
  dateIssued: Date,
  status: { type: String, default: 'Pending' },
  content: String,
  salary: String,
  startDate: String,
  notes: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});
module.exports = mongoose.model('OfferLetter', offerLetterSchema);