const mongoose = require('mongoose');

const BranchSchema = new mongoose.Schema({
  branchId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  photo: {
    type: String, // URL to branch image
    default: ''
  },
  name: {
    type: String,
    required: true,
    index: true
  },
  call: {
    type: String, // Contact number
    required: true
  },
  email: {
    type: String,
    required: true
  },
  officeAddress: {
    type: String,
    required: true
  },
  socialLinks: [{
    name: String, // Social media platform name
    icon: String, // Icon URL or icon identifier
    url: String // Social media link URL
  }],
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

BranchSchema.statics.generateBranchId = function() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `BRANCH${timestamp}${random}`;
};

BranchSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

BranchSchema.index({ name: 'text' }); // Text search index

module.exports = mongoose.model('Branch', BranchSchema);

