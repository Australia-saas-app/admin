const mongoose = require('mongoose');

const OrderChatSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    index: true
  },
  // Messages in the chat
  messages: [{
    messageId: {
      type: String,
      required: true
    },
    senderId: {
      type: String,
      required: true
    },
    senderType: {
      type: String,
      enum: ['user', 'agency', 'admin', 'sub-admin'],
      required: true
    },
    senderName: String,
    messageType: {
      type: String,
      enum: ['text', 'file', 'voice', 'call'],
      default: 'text'
    },
    content: String, // Text message content
    fileUrl: String, // For file messages
    fileName: String,
    fileType: String, // pdf, photo, audio, video
    voiceUrl: String, // For voice messages
    voiceDuration: Number, // Duration in seconds
    callDuration: Number, // For call messages (in seconds)
    timestamp: {
      type: Date,
      default: Date.now
    },
    readBy: [{
      userId: String,
      readAt: Date
    }],
    isDeleted: {
      type: Boolean,
      default: false
    }
  }],
  // Assigned admin/sub-admin (null means unassigned, available to all)
  assignedAdmin: {
    adminId: String, // Admin email or ID
    adminName: String,
    assignedAt: Date,
    lastActiveAt: Date
  },
  // Chat settings
  settings: {
    messageEnabled: {
      type: Boolean,
      default: true
    },
    callEnabled: {
      type: Boolean,
      default: true
    },
    blocked: {
      type: Boolean,
      default: false
    },
    blockedBy: String, // Admin email who blocked
    blockedAt: Date,
    blockReason: String,
    messageExpirationDays: {
      type: Number,
      default: 7 // Default 7 days
    }
  },
  // User/Agency info
  participant: {
    userId: String,
    accountType: String, // user, agency, business
    fullName: String,
    email: String,
    phone: String
  },
  // Track if admin has replied (for file/voice/call restrictions)
  adminHasReplied: {
    type: Boolean,
    default: false
  },
  firstAdminReplyAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  // TTL index for auto-deletion (will be set in seconds based on messageExpirationDays)
  expiresAt: Date
});

// Generate message ID
OrderChatSchema.statics.generateMessageId = function() {
  return `MSG${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
};

// Auto-update expiresAt before save
OrderChatSchema.pre('save', function(next) {
  if (this.isModified('settings.messageExpirationDays') || this.isNew) {
    const expirationDays = this.settings.messageExpirationDays || 7;
    this.expiresAt = new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000);
  }
  this.updatedAt = new Date();
  next();
});

// Index for TTL (MongoDB will auto-delete expired documents)
OrderChatSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for efficient queries
OrderChatSchema.index({ orderId: 1, 'messages.timestamp': -1 });
OrderChatSchema.index({ 'assignedAdmin.adminId': 1 });
OrderChatSchema.index({ 'participant.userId': 1 });

module.exports = mongoose.model('OrderChat', OrderChatSchema);

