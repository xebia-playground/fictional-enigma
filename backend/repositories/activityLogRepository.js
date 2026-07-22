const ActivityLog = require('../models/ActivityLog');

const createActivityLog = (logData) => ActivityLog.create(logData);

const findRecentActivityLogs = (limit = 50) =>
  ActivityLog.find().sort({ createdAt: -1 }).limit(limit).populate('user', 'username email');

module.exports = {
  createActivityLog,
  findRecentActivityLogs,
};