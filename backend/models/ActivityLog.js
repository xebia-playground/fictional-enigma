const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    action: {
      type: String,
      required: true,
    },
    keyword: String,
    metadata: mongoose.Schema.Types.Mixed,
    ip: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);