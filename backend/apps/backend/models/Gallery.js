const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  categoryId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  categoryName: {
    type: String,
    required: true,
    index: true
  },
  images: [{
    imageUrl: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    displayOrder: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
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

GallerySchema.statics.generateCategoryId = function() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `GAL${timestamp}${random}`;
};

GallerySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Gallery', GallerySchema);

