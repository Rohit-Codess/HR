const express = require('express');
const Job = require('../models/Job');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all jobs for user
router.get('/', auth, async (req, res) => {
  const jobs = await Job.find({ userId: req.user._id });
  res.json(jobs);
});

// Get job by id
router.get('/:id', auth, async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, userId: req.user._id });
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
});

// Create job
router.post('/', auth, async (req, res) => {
  const job = new Job({ ...req.body, userId: req.user._id });
  await job.save();
  res.status(201).json(job);
});

// Update job
router.put('/:id', auth, async (req, res) => {
  const job = await Job.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true }
  );
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
});

// Delete job
router.delete('/:id', auth, async (req, res) => {
  const job = await Job.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.status(204).send();
});

module.exports = router;