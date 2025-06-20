const { body, validationResult } = require('express-validator');

const validateJob = [
  body('title').notEmpty().trim().withMessage('Job title is required'),
  body('description').optional().trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateCandidate = [
  body('name').notEmpty().trim().withMessage('Candidate name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('skills').optional().trim(),
  body('resumeLink').optional().isURL().withMessage('Valid resume link is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateInterview = [
  body('candidateId').isInt().withMessage('Valid candidate ID is required'),
  body('jobId').isInt().withMessage('Valid job ID is required'),
  body('date').isISO8601().toDate().withMessage('Valid date is required'),
  body('meetingLink').optional().isURL().withMessage('Valid meeting link is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateOfferLetter = [
  body('candidateId').isInt().withMessage('Valid candidate ID is required'),
  body('jobId').isInt().withMessage('Valid job ID is required'),
  body('content').notEmpty().trim().withMessage('Offer letter content is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validatePasswordReset = [
  body('email').isEmail().withMessage('Invalid email'),
  body('token').notEmpty().trim().withMessage('Token is required'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .withMessage('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateJob,
  validateCandidate,
  validateInterview,
  validateOfferLetter,
  validatePasswordReset
};