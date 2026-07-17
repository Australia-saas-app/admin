const mongoose = require('mongoose');

const SocialMediaSchema = new mongoose.Schema({
  socialMediaId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  icon: {
    type: String, // Icon URL or icon identifier
    required: true
  },
  url: {
    type: String,
    required: true
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

SocialMediaSchema.statics.generateSocialMediaId = function() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `SOCIAL${timestamp}${random}`;
};

SocialMediaSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('SocialMedia', SocialMediaSchema);

