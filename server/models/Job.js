const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: String,
  location: String,
  status: { type: String, default: 'Open' },
  aboutJob: String,
  aboutCompany: String,
  qualification: String,
  ctc: String,
  skills: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});
module.exports = mongoose.model('Job', jobSchema);