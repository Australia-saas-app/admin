const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  blogId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  photo: {
    type: String, // Blog photo URL
    default: ''
  },
  title: {
    type: String,
    required: true,
    index: true
  },
  tag: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: true
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

BlogSchema.statics.generateBlogId = function() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `BLOG${timestamp}${random}`;
};

BlogSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

BlogSchema.index({ title: 'text', description: 'text' }); // Text search index

module.exports = mongoose.model('Blog', BlogSchema);

