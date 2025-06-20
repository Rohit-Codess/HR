const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user',
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  phone: String,
  department: String,
  designation: String,
  address: String,
  gender: String,
  dob: String,
  linkedin: String,
  emergencyContact: String,
});

module.exports = mongoose.model('User', userSchema);