const express = require('express');
const Interview = require('../models/Interview');
const Candidate = require('../models/Candidate');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all interviews for user
router.get('/', auth, async (req, res) => {
  const interviews = await Interview.find({ userId: req.user._id });
  res.json(interviews);
});

// Get interview by id
router.get('/:id', auth, async (req, res) => {
  const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
  if (!interview) return res.status(404).json({ error: 'Interview not found' });
  res.json(interview);
});

// Create interview
router.post('/', auth, async (req, res) => {
  // Optionally, fetch candidate name from candidateId
  let candidateName = req.body.candidateName;
  if (req.body.candidateId) {
    const candidate = await Candidate.findById(req.body.candidateId);
    if (candidate) candidateName = candidate.name;
  }
  const interview = new Interview({
    ...req.body,
    candidateName,
    userId: req.user._id,
  });
  await interview.save();
  res.status(201).json(interview);
});

// Update interview
router.put('/:id', auth, async (req, res) => {
  const interview = await Interview.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true }
  );
  if (!interview) return res.status(404).json({ error: 'Interview not found' });
  res.json(interview);
});

// Delete interview
router.delete('/:id', auth, async (req, res) => {
  const interview = await Interview.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!interview) return res.status(404).json({ error: 'Interview not found' });
  res.status(204).send();
});

module.exports = router;