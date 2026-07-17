const mongoose = require('mongoose');

const LiveChatSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  // Topic selected by user/agency
  topic: {
    type: String,
    required: true,
    index: true
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatTopic'
  },
  // User/Agency who initiated the chat
  userId: {
    type: String,
    index: true
  },
  userType: {
    type: String,
    enum: ['user', 'agency', 'business', 'guest'], // guest for unauthorized users
    required: true
  },
  // User profile info (if authorized)
  userInfo: {
    fullName: String,
    email: String,
    phone: String,
    profilePhoto: String, // User photo or agency logo
    accountType: String // user, agency, business
  },
  // Assigned admin/sub-admin
  assignedAdmin: {
    adminId: String, // Admin email or ID
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
  // Rating after chat ends
  rating: {
    type: String,
    enum: ['yes', 'no', null],
    default: null
  },
  ratingSubmittedAt: Date,
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
      enum: ['user', 'agency', 'admin', 'sub-admin'],
      required: true
    },
    senderName: String,
    messageType: {
      type: String,
      enum: ['text', 'file', 'voice', 'call'],
      default: 'text'
    },
    content: String, // Text message
    file: {
      fileName: String,
      fileUrl: String,
      fileType: String // pdf, photo, audio, video
    },
    voice: {
      voiceUrl: String,
      voiceDuration: Number // seconds
    },
    callDuration: Number, // seconds
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
  // Chat settings (admin controls)
  settings: {
    messageEnabled: {
      type: Boolean,
      default: true
    },
    callEnabled: {
      type: Boolean,
      default: false // Starts false until admin replies
    },
    fileUploadEnabled: {
      type: Boolean,
      default: false // Starts false until admin replies
    },
    voiceUploadEnabled: {
      type: Boolean,
      default: false // Starts false until admin replies
    },
    blocked: {
      type: Boolean,
      default: false
    },
    blockedBy: String, // Admin email
    blockedAt: Date,
    blockReason: String
  },
  // Track if admin has replied (for restrictions)
  adminHasReplied: {
    type: Boolean,
    default: false
  },
  firstAdminReplyAt: Date,
  // Track last user/agency activity for 15-minute timer
  lastUserActivityAt: {
    type: Date,
    default: Date.now,
    index: true
  },
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

// Generate chat ID
LiveChatSchema.statics.generateChatId = function() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9).toUpperCase();
  return `LIVE${timestamp}${random}`;
};

// Generate message ID
LiveChatSchema.statics.generateMessageId = function() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `MSG${timestamp}${random}`;
};

// Auto-update updatedAt
LiveChatSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Indexes
LiveChatSchema.index({ userId: 1, status: 1 });
LiveChatSchema.index({ assignedAdmin: { adminId: 1 } });
LiveChatSchema.index({ topicId: 1 });
LiveChatSchema.index({ 'messages.sentAt': 1 });

module.exports = mongoose.model('LiveChat', LiveChatSchema);

