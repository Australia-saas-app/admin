const mongoose = require('mongoose');

const AgencyChatSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  // Agency who initiated the chat
  agencyId: {
    type: String,
    required: true,
    index: true
  },
  agencyInfo: {
    agencyName: String,
    email: String,
    phone: String,
    logo: String
  },
  // Assigned admin/sub-admin
  assignedAdmin: {
    adminId: String,
    adminName: String,
    role: {
      type: String,
      enum: ['admin', 'sub-admin']
    },
    assignedAt: Date,
    lastActiveAt: Date
  },
  // Chat status
  status: {
    type: String,
    enum: ['active', 'ended', 'closed'],
    default: 'active',
    index: true
  },
  // Messages
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
      enum: ['agency', 'admin', 'sub-admin'],
      required: true
    },
    senderName: String,
    messageType: {
      type: String,
      enum: ['text', 'file', 'voice', 'call'],
      default: 'text'
    },
    content: String,
    file: {
      fileName: String,
      fileUrl: String,
      fileType: String
    },
    voice: {
      voiceUrl: String,
      voiceDuration: Number
    },
    callDuration: Number,
    sentAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    isRead: {
      type: Boolean,
      default: false
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  }],
  // Chat settings
  settings: {
    messageEnabled: {
      type: Boolean,
      default: true
    },
    callEnabled: {
      type: Boolean,
      default: false
    },
    fileUploadEnabled: {
      type: Boolean,
      default: false
    },
    voiceUploadEnabled: {
      type: Boolean,
      default: false
    },
    blocked: {
      type: Boolean,
      default: false
    },
    blockedBy: String,
    blockedAt: Date,
    blockReason: String,
    messageExpirationDays: {
      type: Number,
      default: 7
    }
  },
  // Track if admin has replied
  adminHasReplied: {
    type: Boolean,
    default: false
  },
  firstAdminReplyAt: Date,
  // Track forwarded messages
  forwardedTo: [{
    adminId: String,
    adminName: String,
    forwardedAt: Date,
    forwardedBy: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

AgencyChatSchema.statics.generateChatId = function() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9).toUpperCase();
  return `AGENCY${timestamp}${random}`;
};

AgencyChatSchema.statics.generateMessageId = function() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `MSG${timestamp}${random}`;
};

AgencyChatSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

AgencyChatSchema.index({ agencyId: 1, status: 1 });
AgencyChatSchema.index({ 'messages.sentAt': 1 });

module.exports = mongoose.model('AgencyChat', AgencyChatSchema);

