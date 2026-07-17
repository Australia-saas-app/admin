const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  notificationId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  type: {
    type: String,
    enum: ['new-order', 'new-agency', 'order-message', 'agency-message', 'new-payment', 'new-return', 'live-chat', 'system'],
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  // Related entity references
  relatedEntity: {
    entityType: {
      type: String,
      enum: ['order', 'user', 'agency', 'transaction', 'chat']
    },
    entityId: String
  },
  // Target audience
  target: {
    type: String,
    enum: ['all-admins', 'specific-admin', 'all-sub-admins', 'specific-sub-admin'],
    default: 'all-admins'
  },
  targetAdminId: String, // If target is specific
  // Read status
  readBy: [{
    adminId: String,
    readAt: Date
  }],
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  // Priority
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

NotificationSchema.statics.generateNotificationId = function() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `NOTIF${timestamp}${random}`;
};

NotificationSchema.index({ createdAt: -1 });
NotificationSchema.index({ type: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);

