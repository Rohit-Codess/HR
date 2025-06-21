const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const auth = require("../middleware/auth");
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const baseURL = process.env.VITE_API_BASE_URL;

// Register
router.post(
  "/register",
  [
    check("email").isEmail().withMessage("Invalid email"),
    check("password").isLength({ min: 8 }).withMessage("Password too short"),
    check("name").notEmpty().withMessage("Name is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    // Convert email to lowercase
    const {
      email,
      password,
      name,
      phone,
      department,
      designation,
      address,
      gender,
      dob,
      linkedin,
      emergencyContact,
    } = req.body;
    const lowerEmail = email.toLowerCase();
    try {
      const existingUser = await User.findOne({ email: lowerEmail });
      if (existingUser)
        return res.status(400).json({ error: "Email already exists" });
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
        emergencyContact,
      });
      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
        expiresIn: "2d",
      });
      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to register user" });
    }
  }
);

// Login
router.post("/login", async (req, res) => {
  // Convert email to lowercase
  const { email, password } = req.body;
  const lowerEmail = email.toLowerCase();
  try {
    const user = await User.findOne({ email: lowerEmail });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "2d",
    });
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to login" });
  }
});

// Forgot Password - send reset link
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Generate reset token (expires in 10 min)
    const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "10m",
    });
    const resetLink = `${baseURL}/change-password/${resetToken}`;

    // Send email (configure your SMTP credentials in .env)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // your email password or app password
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Link",
      html: `<body style="margin:0;padding:0;font-family: Arial, sans-serif; background-color:#f6f9fc;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f9fc; padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,0.05);padding:40px;">
            <tr>
              <td align="center" style="padding-bottom:20px;">
                <img src="/assets/logo.jpg" alt="HR Recruiter Logo" width="80" height="80" style="border-radius: 50%;"/>
                <h2 style="margin-top:10px;color:#333333;">Reset Your Password</h2>
              </td>
            </tr>
            <tr>
              <td style="color:#555555;font-size:16px;line-height:1.6;">
                <p>Hi <strong>${user.name}</strong>,</p>
                <p>We received a request to reset your password. Click the button below to create a new password:</p>

                <p style="text-align: center; margin: 30px 0;">
                  <a href="${resetLink}" style="background-color: #6366f1; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                    Reset Password
                  </a>
                </p>

                <p>If you didn’t request this, please ignore this email. This link will expire in 10 minutes.</p>
                <p>Thank you,<br/><strong>HR Recruiter Team</strong></p>
              </td>
            </tr>
            <tr>
              <td align="center" style="font-size:12px;color:#999999;padding-top:30px;">
                <p>&copy; 2025 HR Recruiter. All rights reserved.</p>
                <p>Ranchi</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>`,
    });

    res.json({ message: "Reset link sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send reset link" });
  }
});

// Reset Password
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
});

// Verify Password
router.post("/verify-password", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Incorrect password" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
