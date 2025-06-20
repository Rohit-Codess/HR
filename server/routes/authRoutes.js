const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Register
router.post('/register', [
  check('email').isEmail().withMessage('Invalid email'),
  check('password').isLength({ min: 8 }).withMessage('Password too short'),
  check('name').notEmpty().withMessage('Name is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  // Convert email to lowercase
  const { email, password, name, phone, department, designation, address, gender, dob, linkedin, emergencyContact } = req.body;
  const lowerEmail = email.toLowerCase();
  try {
    const existingUser = await User.findOne({ email: lowerEmail });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: lowerEmail,
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
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '2d' });
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user._id, email: user.email, name: user.name, role: user.role },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login
router.post('/login', async (req, res) => {
  // Convert email to lowercase
  const { email, password } = req.body;
  const lowerEmail = email.toLowerCase();
  try {
    const user = await User.findOne({ email: lowerEmail });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '2d' });
    res.json({
      token,
      user: { id: user._id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Forgot Password - send reset link
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Generate reset token (expires in 10 min)
    const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '10m' });
    const resetLink = `http://localhost:5173/change-password/${resetToken}`;

    // Send email (configure your SMTP credentials in .env)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // your email password or app password
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Link',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 10 minutes.</p>`,
    });

    res.json({ message: 'Reset link sent to your email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send reset link' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid or expired token' });
  }
});

// Verify Password
router.post('/verify-password', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Incorrect password' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;