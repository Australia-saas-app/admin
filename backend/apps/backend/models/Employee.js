const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  photo: {
    type: String, // Employee photo URL
    default: ''
  },
  name: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    index: true
  },
  officeAddress: {
    type: String,
    default: ''
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

EmployeeSchema.statics.generateEmployeeId = function() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `EMP${timestamp}${random}`;
};

EmployeeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

EmployeeSchema.index({ name: 'text', title: 'text' }); // Text search index

module.exports = mongoose.model('Employee', EmployeeSchema);

