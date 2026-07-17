const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  accountType: {
    type: String,
    enum: ['user', 'agency', 'business'],
    required: true,
    default: 'user'
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    lowercase: true
  },
  phone: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  profilePhoto: String,
  dateOfBirth: Date,
  gender: String,
  nationality: String,
  passportNumber: String, // For business accounts
  permanentAddress: {
    country: String,
    city: String,
    state: String,
    zipCode: String,
    address: String
  },
  governmentId: {
    type: String
  },
  idDocument: String, // Document upload URL
  status: {
    type: String,
    enum: ['active', 'pending', 'inactive', 'suspended', 'blocked', 'dormant', 'closed'],
    default: 'active'
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorMethod: {
    type: String,
    enum: ['email', 'phone']
  },
  // Agency-specific fields
  agencyInfo: {
    agencyLogo: String,
    agencyName: String, // Must be unique
    businessType: {
      type: String,
      enum: ['Technology', 'Construction', 'Real Estate', 'Commercial & Industrial', 'Visa & Travel', 'Education', 'Careers', 'Healthcare', 'Marketplace', 'Investment', 'Donations', 'Import & Export', 'Solutions']
    },
    serviceArea: {
      country: String,
      state: String
    },
    grade: {
      type: String,
      enum: ['A', 'B', 'C', 'D', 'E']
    },
    supportedLanguages: [String],
    employeeRange: {
      type: String,
      enum: ['01-30', '30-70', '70-150', '150-300', '300-500', '500-700', '700-1000+']
    },
    businessRegistrationNumber: String,
    taxIdentificationNumber: String,
    officeAddress: {
      country: String,
      state: String,
      city: String,
      zipCode: String,
      address: String
    },
    businessRegistrationCertificate: String, // Document upload URL
    taxVatCertificate: String, // Document upload URL
    ag64Form: String, // Document upload URL
    descriptionOfServices: String,
    annualFee: {
      type: Number,
      default: 0
    },
    securityDeposit: {
      type: Number,
      default: 0
    },
    totalDepositBalance: {
      type: Number,
      default: 0
    },
    totalDueDeposit: {
      type: Number,
      default: 0
    },
    totalPenaltyFee: {
      type: Number,
      default: 0
    },
    renewalFee: {
      type: Number,
      default: 0
    },
    renewalDate: Date,
    establishmentDate: Date,
    ranking: {
      type: Number,
      default: 0
    },
    contactInfoStatus: {
      type: String,
      enum: ['private', 'public'],
      default: 'public'
    }
  },
  // Business-specific fields
  businessInfo: {
    businessName: String,
    businessIndustry: {
      type: String,
      enum: ['Technology', 'Construction', 'Real Estate', 'Commercial & Industrial', 'Visa & Travel', 'Education', 'Careers', 'Healthcare', 'Marketplace', 'Investment', 'Donations']
    },
    businessLogo: String, // Size: 50-150px, Format: PNG/SVG
    category: [String], // Multi-select
    subcategory: [String], // Multi-select
    requiredSkills: [String], // Multi-select
    serviceArea: {
      country: String,
      state: String,
      city: String
    },
    supportedLanguages: [String],
    employeeRange: {
      type: String,
      enum: ['01-30', '30-70', '70-150', '150-300', '300-500', '500-700', '700-1000+']
    },
    businessRegistrationNumber: String,
    taxIdentificationNumber: String,
    officeAddress: {
      country: String,
      state: String,
      city: String,
      zipCode: String,
      address: String
    },
    businessRegistrationCertificate: String, // Document upload URL
    taxVatCertificate: String, // Document upload URL
    ag64Form: String, // Document upload URL
    descriptionOfServices: String
  },
  statusHistory: [{
    status: {
      type: String,
      enum: ['active', 'pending', 'inactive', 'suspended', 'blocked', 'dormant', 'closed']
    },
    reason: String,
    changedBy: {
      type: String, // Admin email or 'system'
      default: 'system'
    },
    changedAt: {
      type: Date,
      default: Date.now
    }
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

// Set default status based on account type before saving
UserSchema.pre('save', async function(next) {
  // Set default status based on account type
  if (this.isNew && !this.status) {
    if (this.accountType === 'agency') {
      this.status = 'pending'; // Agencies start as pending
    } else {
      this.status = 'active'; // Users and businesses start as active
    }
  }
  next();
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);

