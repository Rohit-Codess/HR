const express = require('express');
const OfferLetter = require('../models/OfferLetter');
const Candidate = require('../models/Candidate');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all offer letters for user
router.get('/', auth, async (req, res) => {
  const offerLetters = await OfferLetter.find({ userId: req.user._id });
  res.json(offerLetters);
});

// Get offer letter by id
router.get('/:id', auth, async (req, res) => {
  const offerLetter = await OfferLetter.findOne({ _id: req.params.id, userId: req.user._id });
  if (!offerLetter) return res.status(404).json({ error: 'Offer letter not found' });
  res.json(offerLetter);
});

// Create offer letter
router.post('/', auth, async (req, res) => {
  // Optionally, fetch candidate name from candidateId
  let candidateName = req.body.candidateName;
  if (req.body.candidateId) {
    const candidate = await Candidate.findById(req.body.candidateId);
    if (candidate) candidateName = candidate.name;
  }
  const offerLetter = new OfferLetter({
    ...req.body,
    candidateName,
    userId: req.user._id,
  });
  await offerLetter.save();
  res.status(201).json(offerLetter);
});

// Update offer letter
router.put('/:id', auth, async (req, res) => {
  const offerLetter = await OfferLetter.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true }
  );
  if (!offerLetter) return res.status(404).json({ error: 'Offer letter not found' });
  res.json(offerLetter);
});

// Delete offer letter
router.delete('/:id', auth, async (req, res) => {
  const offerLetter = await OfferLetter.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!offerLetter) return res.status(404).json({ error: 'Offer letter not found' });
  res.status(204).send();
});

module.exports = router;