const mongoose = require('mongoose');

const ChatTopicSchema = new mongoose.Schema({
  topicId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  description: String,
  // Assigned sub-admins (only sub-admins can be assigned, main admin can access all)
  assignedSubAdmins: [{
    adminId: String, // Sub-admin email or ID
    adminName: String,
    assignedAt: Date,
    assignedBy: String // Admin email who assigned
  }],
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  displayOrder: {
    type: Number,
    default: 0,
    index: true
  },
  createdBy: {
    type: String, // Admin email
    required: true
  },
  updatedBy: {
    type: String, // Admin email
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

ChatTopicSchema.statics.generateTopicId = function() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `TOPIC${timestamp}${random}`;
};

ChatTopicSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('ChatTopic', ChatTopicSchema);

