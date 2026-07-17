const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  categoryId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    index: true
  },
  serviceType: {
    type: String,
    enum: ['technical', 'construction', 'real-estate', 'import-export', 'visa-traveling', 'solutions'],
    required: true,
    index: true
  },
  description: String,
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  displayOrder: {
    type: Number,
    default: 0,
    index: true
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

// Generate category ID
CategorySchema.statics.generateCategoryId = function() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `CAT${timestamp}${random}`;
};

// Auto-update updatedAt
CategorySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Ensure unique category name per service type
CategorySchema.index({ name: 1, serviceType: 1 }, { unique: true });

module.exports = mongoose.model('Category', CategorySchema);

