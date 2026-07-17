const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  orderType: {
    type: String,
    enum: ['technical', 'construction', 'real-estate', 'import-export', 'visa-traveling', 'solutions'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'payment', 'waiting', 'working', 'stopped', 'complete', 'delivery', 'refund', 'cancel'],
    default: 'pending'
  },
  // User/Agency who created the order
  createdBy: {
    userId: {
      type: String,
      required: true
    },
    accountType: {
      type: String,
      enum: ['user', 'agency', 'business'],
      required: true
    },
    fullName: String,
    email: String,
    phone: String
  },
  // Agency assigned to work on the order (if applicable)
  assignedTo: {
    userId: String,
    agencyName: String,
    accountType: {
      type: String,
      enum: ['user', 'agency', 'business']
    }
  },
  // Service information
  serviceName: {
    type: String,
    required: true
  },
  // Common fields for all order types
  clientInfo: {
    fullName: {
      type: String,
      required: true
    },
    nationality: String,
    dateOfBirth: Date,
    governmentId: String, // NID/Passport/Driving License
    permanentAddress: {
      country: String,
      state: String,
      city: String,
      zipCode: String,
      address: String
    },
    email: String,
    phone: String
  },
  // Order financial details
  pricing: {
    totalAmount: {
      type: Number,
      required: true,
      default: 0
    },
    paidAmount: {
      type: Number,
      default: 0
    },
    dueAmount: {
      type: Number,
      default: 0
    },
    profitAmount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    paymentHistory: [{
      amount: Number,
      transactionId: String,
      paymentMethod: String,
      paidAt: Date,
      status: String
    }]
  },
  // Order-specific fields (flexible based on order type)
  orderDetails: {
    // Technical Order
    projectType: String, // Personal, Company, Client, Non-Profit, Government, Collaboration, Developmental
    priorityLevel: String, // Low Priority, Normal, Medium, High Priority
    expectedEndDate: Date,
    // Construction Order
    workplace: {
      country: String,
      state: String,
      city: String,
      zipCode: String,
      address: String
    },
    // Real Estate Order
    rentalAgreementPeriod: String,
    contractDate: Date,
    contractDuration: String,
    // Import/Export Order
    productModelId: String,
    shippingMethod: String, // Standard Shipping, International Shipping, etc.
    quantity: Number,
    weight: Number,
    shippingAddress: {
      country: String,
      state: String,
      city: String,
      zipCode: String,
      address: String
    },
    estimatedArrivalDate: Date,
    // Visa Traveling Order
    passportNumber: String,
    passportExpiryDate: Date,
    visaStatus: String, // Present, To Be Processed
    visaNumber: String,
    visaExpirationDate: Date,
    visaType: String, // Tourist, Business, Work, Student, etc.
    travelClass: String, // Suite Class, First Class, Economy Class, etc.
    destinationAddress: {
      country: String,
      state: String,
      city: String,
      zipCode: String,
      address: String
    },
    passengersNo: Number,
    departureDate: Date,
    returnDate: Date,
    currentAddress: {
      country: String,
      state: String,
      city: String,
      zipCode: String,
      address: String
    },
    // Real Estate Post Order (if orderType is real-estate)
    propertyDetails: {
      propertyType: String, // Houses, Flats, Apartments, etc.
      propertyStatus: String, // Buyer, Seller, Rental, Mortgage
      currentStatus: String, // Vacant, Currently Rented, Under Construction, Ready-to-Move
      propertyAddress: {
        country: String,
        state: String,
        city: String,
        zipCode: String,
        address: String
      },
      sizeSquareFeet: Number,
      beds: Number, // For residential
      bathroom: Number, // For residential
      kitchen: Number, // For residential
      features: [String], // Air conditioning, Parking, etc.
      photos: [String] // Photo URLs
    }
  },
  // Documents and files
  documents: [{
    fileName: String,
    fileUrl: String,
    fileType: String, // pdf, photo, audio, video
    uploadedBy: String, // userId
    uploadedAt: Date
  }],
  // Admin-added files (only accessible when status is delivery)
  adminFiles: [{
    fileName: String,
    fileUrl: String,
    fileType: String,
    addedBy: String, // Admin email
    addedAt: Date
  }],
  // Reference and description
  referenceName: String,
  description: {
    type: String,
    minlength: 10,
    maxlength: 1000
  },
  // Status history
  statusHistory: [{
    status: String,
    reason: String,
    changedBy: String, // userId or admin email
    changedAt: Date
  }],
  // Access control
  access: {
    type: String,
    enum: ['everyone', 'only-me'],
    default: 'everyone'
  },
  // Real Estate Post visibility (only for real-estate orders with propertyDetails)
  isPublic: {
    type: Boolean,
    default: false
  },
  // Chat enabled (only when status is pending or working)
  chatEnabled: {
    type: Boolean,
    default: true
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

// Generate order ID - static method
OrderSchema.statics.generateOrderId = async function() {
  try {
    const count = await this.countDocuments();
    const nextId = String(count + 1).padStart(6, '0');
    return `ORDER${nextId}`;
  } catch (error) {
    // Fallback if count fails
    const random = Math.floor(Math.random() * 999999);
    const nextId = String(random).padStart(6, '0');
    return `ORDER${nextId}`;
  }
};

// Auto-update dueAmount when paidAmount changes
OrderSchema.pre('save', function(next) {
  if (this.isModified('pricing.paidAmount') || this.isModified('pricing.totalAmount')) {
    this.pricing.dueAmount = this.pricing.totalAmount - this.pricing.paidAmount;
  }
  this.updatedAt = new Date();
  next();
});

// Auto-change status to delivery when paidAmount equals totalAmount and status is complete
OrderSchema.pre('save', function(next) {
  if (this.status === 'complete' && 
      this.pricing.paidAmount >= this.pricing.totalAmount && 
      this.pricing.dueAmount === 0) {
    this.status = 'delivery';
    this.statusHistory.push({
      status: 'delivery',
      reason: 'Full payment received',
      changedBy: 'system',
      changedAt: new Date()
    });
  }
  next();
});

module.exports = mongoose.model('Order', OrderSchema);

