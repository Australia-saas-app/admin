const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  type: {
    type: String,
    enum: ['payment', 'refund'],
    required: true,
    index: true
  },
  // Payment type for payments
  paymentType: {
    type: String,
    enum: ['order', 'annual-fee', 'security-deposit', 'penalty', 'recovery-fee'],
    required: function() {
      return this.type === 'payment';
    }
  },
  // User/Agency who made the transaction
  userId: {
    type: String,
    required: true,
    index: true
  },
  userType: {
    type: String,
    enum: ['user', 'agency', 'business'],
    required: true
  },
  userFullName: String,
  userEmail: String,
  userPhone: String,
  // Related order ID (if payment/refund is for an order)
  orderId: {
    type: String,
    index: true
  },
  // Payment method
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal'],
    required: true
  },
  // Payment gateway transaction ID (from Stripe/PayPal)
  gatewayTransactionId: String,
  // Currency
  currency: {
    type: String,
    required: true,
    default: 'USD',
    index: true
  },
  // Amount details
  amount: {
    type: Number,
    required: true
  },
  charge: {
    type: Number,
    default: 0 // Payment gateway fees
  },
  totalAmount: {
    type: Number,
    required: true // amount + charge
  },
  // For refunds
  originalTransactionId: String, // Reference to original payment
  refundAmount: Number, // Amount being refunded
  feesRefundedAmount: Number, // Fees refunded (if applicable)
  refundReason: String,
  // Status
  status: {
    type: String,
    enum: ['succeeded', 'failed', 'disputed', 'unacceptable', 'refunded', 'pending', 'processing'],
    default: 'pending',
    index: true
  },
  // Refund history (for original payments that were refunded)
  refundHistory: [{
    refundTransactionId: String,
    refundAmount: Number,
    refundedBy: String, // Admin email
    refundedAt: Date,
    reason: String
  }],
  // Payment intent/session details (for Stripe/PayPal)
  paymentIntentId: String, // Stripe payment intent
  paypalOrderId: String, // PayPal order ID
  // Webhook data
  webhookData: mongoose.Schema.Types.Mixed,
  // Timestamps
  transactionDate: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  completedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate transaction ID
TransactionSchema.statics.generateTransactionId = function() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9).toUpperCase();
  return `TXN${timestamp}${random}`;
};

// Auto-calculate totalAmount
TransactionSchema.pre('save', function(next) {
  if (this.isModified('amount') || this.isModified('charge')) {
    this.totalAmount = this.amount + (this.charge || 0);
  }
  this.updatedAt = new Date();
  if (this.status === 'succeeded' && !this.completedAt) {
    this.completedAt = new Date();
  }
  next();
});

// Indexes for efficient queries
TransactionSchema.index({ userId: 1, transactionDate: -1 });
TransactionSchema.index({ orderId: 1, type: 1 });
TransactionSchema.index({ paymentMethod: 1, status: 1 });
TransactionSchema.index({ type: 1, paymentType: 1 });
TransactionSchema.index({ transactionDate: 1 });

module.exports = mongoose.model('Transaction', TransactionSchema);

