const express = require('express');
const Job = require('../models/Job');
const Candidate = require('../models/Candidate');
const Interview = require('../models/Interview');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const openPositions = await Job.countDocuments({ status: 'Open', userId: req.user._id });
  const totalCandidates = await Candidate.countDocuments({ userId: req.user._id });
  const scheduledInterviews = await Interview.countDocuments({ status: { $in: ['Scheduled', 'Rescheduled'] }, userId: req.user._id });
  res.json({ openPositions, totalCandidates, scheduledInterviews });
});

module.exports = router;