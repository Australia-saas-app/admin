const mongoose = require('mongoose');

const SupportLogoSchema = new mongoose.Schema({
  logoId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  logoUrl: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: ''
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

SupportLogoSchema.statics.generateLogoId = function() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `LOGO${timestamp}${random}`;
};

SupportLogoSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('SupportLogo', SupportLogoSchema);

