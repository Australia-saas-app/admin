const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
  noticeId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  document: {
    type: String, // PDF URL
    required: true
  },
  title: {
    type: String,
    required: true,
    index: true
  },
  uploadDate: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  isVisible: {
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

NoticeSchema.statics.generateNoticeId = function() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `NOTICE${timestamp}${random}`;
};

NoticeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

NoticeSchema.index({ title: 'text' }); // Text search index

module.exports = mongoose.model('Notice', NoticeSchema);

