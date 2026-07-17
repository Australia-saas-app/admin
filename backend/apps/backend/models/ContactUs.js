const mongoose = require('mongoose');

const ContactUsSchema = new mongoose.Schema({
  contactId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    index: true
  },
  phoneNo: {
    type: String,
    required: true,
    index: true
  },
  message: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  // Optional: Track if submitted by logged-in user/agency
  submittedBy: {
    type: {
      userId: String,
      userType: {
        type: String,
        enum: ['user', 'agency', 'business', 'guest'],
        default: 'guest'
      }
    },
    default: {
      userType: 'guest'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

ContactUsSchema.statics.generateContactId = function() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `CONTACT${timestamp}${random}`;
};

ContactUsSchema.index({ email: 1, phoneNo: 1 });

module.exports = mongoose.model('ContactUs', ContactUsSchema);

