const express = require('express');
const Candidate = require('../models/Candidate');
const auth = require('../middleware/auth');
const { validateCandidate } = require('../validation');
const router = express.Router();

// Get all candidates for user
router.get('/', auth, async (req, res) => {
  const candidates = await Candidate.find({ userId: req.user._id });
  res.json(candidates);
});

// Get candidate by id
router.get('/:id', auth, async (req, res) => {
  const candidate = await Candidate.findOne({ _id: req.params.id, userId: req.user._id });
  if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
  res.json(candidate);
});

// Create candidate
router.post('/', auth, validateCandidate, async (req, res) => {
  const candidate = new Candidate({ ...req.body, userId: req.user._id });
  await candidate.save();
  res.status(201).json(candidate);
});

// Update candidate
router.put('/:id', auth, validateCandidate, async (req, res) => {
  const candidate = await Candidate.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true }
  );
  if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
  res.json(candidate);
});

// Delete candidate
router.delete('/:id', auth, async (req, res) => {
  const candidate = await Candidate.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
  res.status(204).send();
});

module.exports = router;