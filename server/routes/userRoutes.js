const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const ActivityLog = require('../models/ActivityLog');

// @route   POST /api/users/register
// @desc    Register a user
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password, role, phone, department, designation, address, gender, dob, linkedin, emergencyContact } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      email,
      password: hashedPassword,
      name,
      phone,
      department,
      designation,
      address,
      gender,
      dob,
      linkedin,
      emergencyContact
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2d' }
    );

    // Log registration activity
    await new ActivityLog({
      userId: user._id,
      action: 'register',
      endpoint: '/api/users/register',
    }).save();

    const userObj = user.toObject();
    delete userObj.password;
    res.json({ token, user: userObj });
  } catch (err) {
    console.error('Error registering user:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/login
// @desc    Login a user
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2d' }
    );

    // Log login activity
    await new ActivityLog({
      userId: user._id,
      action: 'login',
      endpoint: '/api/users/login',
    }).save();

    const userObj = user.toObject();
    delete userObj.password;
    res.json({ token, user: userObj });
  } catch (err) {
    console.error('Error logging in user:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/me
// @desc    Update current user profile (for UserPanel)
// @access  Private
router.put('/me', auth, async (req, res) => {
  try {
    const updateFields = {
      name: req.body.name,
      phone: req.body.phone,
      department: req.body.department,
      designation: req.body.designation,
      address: req.body.address,
      gender: req.body.gender,
      dob: req.body.dob,
      linkedin: req.body.linkedin,
      emergencyContact: req.body.emergencyContact,
    };
    // Only allow updating email if you want, otherwise remove this line
    // updateFields.email = req.body.email;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await new ActivityLog({
      userId: req.user.id,
      action: 'update_profile',
      endpoint: '/api/users/me',
    }).save();

    res.json(user);
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Change password for logged-in user
router.post('/change-password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword)
    return res.status(400).json({ error: 'All fields are required' });

  try {
    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ error: 'Current password is incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;