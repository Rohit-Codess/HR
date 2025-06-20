const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const router = express.Router();

// Get all users (admin only)
router.get('/users', auth, isAdmin, async (req, res) => {
  const users = await User.find({}, 'email name role');
  res.json(users);
});

// Delete user (admin only)
router.delete('/users/:id', auth, isAdmin, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.role === 'admin') return res.status(403).json({ error: 'Cannot delete admin users' });
  await user.deleteOne();
  res.status(204).send();
});

module.exports = router;