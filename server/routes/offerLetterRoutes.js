const express = require('express');
const OfferLetter = require('../models/OfferLetter');
const Candidate = require('../models/Candidate');
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const PDFDocument = require('pdfkit');
const { Readable } = require('stream');
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

// Send offer letter via email
router.post('/:id/send-email', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const offerLetter = await OfferLetter.findById(req.params.id);
    if (!offerLetter) return res.status(404).json({ error: 'Offer letter not found' });

    const candidate = await require('../models/Candidate').findById(offerLetter.candidateId);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

    const user = await User.findById(req.user._id);

    let subject, content, attachments = [];
    if (status === 'Accepted') {
      subject = `Offer Letter for ${offerLetter.position}`;
      content = `Dear ${candidate.name},\n\nWe are pleased to offer you the position of ${offerLetter.position} at our company. Based on your interview and qualifications, we believe you are a great fit for the role. The offered salary for this position is ${offerLetter.salary}, and your expected start date will be ${offerLetter.startDate}.\n\nPlease review the attached offer letter for detailed terms and respond by [Response Deadline].\n\nWe look forward to your response.\n\nBest regards,\nHR Team`;

      // Generate PDF
      const doc = new PDFDocument();
      let buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', async () => {
        const pdfData = Buffer.concat(buffers);
        attachments.push({
          filename: 'OfferLetter.pdf',
          content: pdfData,
        });

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        // Send email with PDF
        await transporter.sendMail({
          from: user.email,
          to: candidate.email,
          subject,
          text: content,
          html: `<p>${content.replace(/\n/g, '<br/>')}</p>`,
          attachments,
        });

        offerLetter.status = status;
        await offerLetter.save();

        res.json({ message: 'Email sent and status updated successfully', status });
      });

      doc.fontSize(16).text('Offer Letter', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(content);
      doc.end();
      return; // Prevent further execution
    } else if (status === 'Rejected') {
      subject = `Application Update for ${offerLetter.position}`;
      content = `Dear ${candidate.name},\n\nThank you for your interest in the position of ${offerLetter.position} at our company. We appreciate the time and effort you invested in the application and interview process.\n\nAfter careful consideration, we regret to inform you that we will not be moving forward with your application at this time.\n\nWe wish you all the best in your future endeavors.\n\nBest regards,\nHR Team`;

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: user.email,
        to: candidate.email,
        subject,
        text: content,
        html: `<p>${content.replace(/\n/g, '<br/>')}</p>`,
      });

      offerLetter.status = status;
      await offerLetter.save();

      res.json({ message: 'Email sent and status updated successfully', status });
    } else {
      return res.status(400).json({ error: 'Invalid status' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

module.exports = router;