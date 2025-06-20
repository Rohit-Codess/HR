const ActivityLog = require('../models/ActivityLog');

const activityLogger = async (req, res, next) => {
  if (req.user) { // req.user is set by auth middleware
    try {
      const log = new ActivityLog({
        userId: req.user.id,
        action: req.method, // e.g., GET, POST
        endpoint: req.originalUrl,
        ipAddress: req.ip,
      });
      await log.save();
    } catch (err) {
      console.error('Error logging activity:', err.message);
    }
  }
  next();
};

module.exports = activityLogger;