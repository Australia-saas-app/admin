const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Order = require('../models/Order');
const User = require('../models/User');
const { authenticate, authenticateAdmin } = require('../middleware/auth');

// ==========================================
// USER/AGENCY PAYMENT ROUTES
// ==========================================

// Process Payment for Order
router.post('/payments/order/:orderId', authenticate, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;
    const { amount, paymentMethod, paymentIntentId, paypalOrderId } = req.body;

    // Validate payment method
    if (!['stripe', 'paypal'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method. Must be stripe or paypal'
      });
    }

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }

    // Get user
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check user status
    if (user.status === 'blocked' || user.status === 'closed') {
      return res.status(403).json({
        success: false,
        message: 'Account is blocked or closed. Cannot make payments.'
      });
    }

    // Get order
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the order
    if (order.createdBy.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only pay for your own orders'
      });
    }

    // Check if order is in payment, working, or complete status
    if (!['payment', 'working', 'complete'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Payment can only be made when order status is payment, working, or complete'
      });
    }

    // Validate payment amount doesn't exceed due amount
    if (amount > order.pricing.dueAmount) {
      return res.status(400).json({
        success: false,
        message: `Payment amount cannot exceed due amount of ${order.pricing.dueAmount} ${order.pricing.currency}`
      });
    }

    // Calculate payment gateway charge (2.9% + $0.30 for Stripe, 3.4% + fixed for PayPal)
    const chargeRate = paymentMethod === 'stripe' ? 0.029 : 0.034;
    const fixedCharge = paymentMethod === 'stripe' ? 0.30 : 0.35;
    const charge = (amount * chargeRate) + fixedCharge;
    const totalAmount = amount + charge;

    // Generate transaction ID
    const transactionId = Transaction.generateTransactionId();

    // Create transaction
    const transaction = await Transaction.create({
      transactionId,
      type: 'payment',
      paymentType: 'order',
      userId: user.userId,
      userType: user.accountType,
      userFullName: user.fullName,
      userEmail: user.email,
      userPhone: user.phone,
      orderId: order.orderId,
      paymentMethod: paymentMethod,
      gatewayTransactionId: paymentIntentId || paypalOrderId || '',
      paymentIntentId: paymentIntentId || undefined,
      paypalOrderId: paypalOrderId || undefined,
      currency: order.pricing.currency,
      amount: amount,
      charge: charge,
      totalAmount: totalAmount,
      status: 'processing' // Will be updated via webhook
    });

    // Update order payment
    order.pricing.paidAmount += amount;
    order.pricing.dueAmount = order.pricing.totalAmount - order.pricing.paidAmount;
    
    // Add to payment history
    if (!order.pricing.paymentHistory) {
      order.pricing.paymentHistory = [];
    }
    order.pricing.paymentHistory.push({
      amount: amount,
      transactionId: transaction.transactionId,
      paymentMethod: paymentMethod,
      paidAt: new Date(),
      status: 'processing'
    });

    // Auto-change status to waiting when payment is completed
    if (order.status === 'payment' && order.pricing.paidAmount >= order.pricing.totalAmount) {
      order.status = 'waiting';
      if (!order.statusHistory) {
        order.statusHistory = [];
      }
      order.statusHistory.push({
        status: 'waiting',
        reason: 'Payment completed, automatically moved to waiting',
        changedBy: 'system',
        changedAt: new Date()
      });
    }

    // If status is complete and fully paid, change to delivery
    if (order.status === 'complete' && order.pricing.paidAmount >= order.pricing.totalAmount && order.pricing.dueAmount === 0) {
      order.status = 'delivery';
      order.statusHistory.push({
        status: 'delivery',
        reason: 'Full payment received',
        changedBy: 'system',
        changedAt: new Date()
      });
    }

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Payment processed successfully',
      data: {
        transactionId: transaction.transactionId,
        orderId: order.orderId,
        amount: amount,
        charge: charge,
        totalAmount: totalAmount,
        currency: order.pricing.currency,
        paymentMethod: paymentMethod,
        status: transaction.status,
        orderPaidAmount: order.pricing.paidAmount,
        orderDueAmount: order.pricing.dueAmount,
        orderStatus: order.status
      }
    });

  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Process Agency Payment (Annual Fee, Security Deposit, Penalty)
router.post('/payments/agency/:paymentType', authenticate, async (req, res) => {
  try {
    const { paymentType } = req.params; // 'annual-fee', 'security-deposit', or 'penalty'
    const userId = req.user.userId;
    const { amount, paymentMethod, paymentIntentId, paypalOrderId } = req.body;

    // Validate payment type
    if (!['annual-fee', 'security-deposit', 'penalty'].includes(paymentType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment type. Must be annual-fee, security-deposit, or penalty'
      });
    }

    // Validate payment method
    if (!['stripe', 'paypal'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method. Must be stripe or paypal'
      });
    }

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }

    // Get user
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is an agency
    if (user.accountType !== 'agency') {
      return res.status(403).json({
        success: false,
        message: 'Only agencies can make this payment'
      });
    }

    // Check user status
    if (user.status === 'blocked' || user.status === 'closed') {
      return res.status(403).json({
        success: false,
        message: 'Account is blocked or closed. Cannot make payments.'
      });
    }

    // Validate payment amount based on payment type
    if (paymentType === 'annual-fee') {
      const requiredAmount = user.agencyInfo.annualFee;
      if (amount < requiredAmount) {
        return res.status(400).json({
          success: false,
          message: `Annual fee payment must be at least ${requiredAmount} ${user.currency}`
        });
      }
    } else if (paymentType === 'security-deposit') {
      const requiredAmount = user.agencyInfo.totalDueDeposit;
      if (amount < requiredAmount) {
        return res.status(400).json({
          success: false,
          message: `Security deposit payment must be at least ${requiredAmount} ${user.currency}`
        });
      }
    } else if (paymentType === 'penalty') {
      const requiredAmount = user.agencyInfo.totalPenaltyFee;
      if (amount < requiredAmount) {
        return res.status(400).json({
          success: false,
          message: `Penalty payment must be at least ${requiredAmount} ${user.currency}`
        });
      }
    }

    // Calculate payment gateway charge
    const chargeRate = paymentMethod === 'stripe' ? 0.029 : 0.034;
    const fixedCharge = paymentMethod === 'stripe' ? 0.30 : 0.35;
    const charge = (amount * chargeRate) + fixedCharge;
    const totalAmount = amount + charge;

    // Generate transaction ID
    const transactionId = Transaction.generateTransactionId();

    // Create transaction
    const transaction = await Transaction.create({
      transactionId,
      type: 'payment',
      paymentType: paymentType,
      userId: user.userId,
      userType: user.accountType,
      userFullName: user.fullName,
      userEmail: user.email,
      userPhone: user.phone,
      paymentMethod: paymentMethod,
      gatewayTransactionId: paymentIntentId || paypalOrderId || '',
      paymentIntentId: paymentIntentId || undefined,
      paypalOrderId: paypalOrderId || undefined,
      currency: user.currency,
      amount: amount,
      charge: charge,
      totalAmount: totalAmount,
      status: 'processing'
    });

    // Update agency financials
    if (paymentType === 'annual-fee') {
      // Update annual fee payment
      const paidAmount = user.agencyInfo.annualFee || 0;
      // If payment covers or exceeds annual fee, mark as paid
      if (amount >= paidAmount) {
        user.agencyInfo.renewalFee = amount;
        user.agencyInfo.renewalDate = new Date();
        // Calculate next renewal date (1 year from now)
        const nextRenewal = new Date();
        nextRenewal.setFullYear(nextRenewal.getFullYear() + 1);
        user.agencyInfo.renewalDate = nextRenewal;
      }
    } else if (paymentType === 'security-deposit') {
      // Update security deposit
      user.agencyInfo.totalDepositBalance += amount;
      user.agencyInfo.totalDueDeposit = Math.max(0, user.agencyInfo.totalDueDeposit - amount);
    } else if (paymentType === 'penalty') {
      // Update penalty fee payment
      user.agencyInfo.totalPenaltyFee = Math.max(0, user.agencyInfo.totalPenaltyFee - amount);
    }

    // Activate agency if payment is for annual fee or deposit and user is inactive
    if (user.status === 'inactive' && paymentType !== 'penalty') {
      const hasPaidAnnualFee = user.agencyInfo.renewalFee && user.agencyInfo.renewalDate && new Date() <= user.agencyInfo.renewalDate;
      const hasPaidDeposit = user.agencyInfo.totalDueDeposit === 0;
      const hasPaidPenalty = user.agencyInfo.totalPenaltyFee === 0;
      
      if (hasPaidAnnualFee && hasPaidDeposit && hasPaidPenalty) {
        user.status = 'active';
        user.statusHistory.push({
          status: 'active',
          reason: 'Annual fee, security deposit, and penalties paid',
          changedBy: 'system',
          changedAt: new Date()
        });
      }
    }

    await user.save();

    res.status(201).json({
      success: true,
      message: `${paymentType.replace('-', ' ')} payment processed successfully`,
      data: {
        transactionId: transaction.transactionId,
        paymentType: paymentType,
        amount: amount,
        charge: charge,
        totalAmount: totalAmount,
        currency: user.currency,
        paymentMethod: paymentMethod,
        status: transaction.status,
        agencyStatus: user.status,
        depositBalance: user.agencyInfo.totalDepositBalance,
        dueDeposit: user.agencyInfo.totalDueDeposit,
        penaltyFee: user.agencyInfo.totalPenaltyFee
      }
    });

  } catch (error) {
    console.error('Process agency payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get User/Agency Transactions
router.get('/payments/transactions', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      page = 1,
      limit = 10,
      search,
      type,
      status,
      paymentMethod,
      startDate,
      endDate
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    const query = { userId };

    // Type filter
    if (type && type !== 'all') {
      query.type = type;
    }

    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // Payment method filter
    if (paymentMethod && paymentMethod !== 'all') {
      query.paymentMethod = paymentMethod;
    }

    // Date range filter
    if (startDate || endDate) {
      query.transactionDate = {};
      if (startDate) {
        query.transactionDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.transactionDate.$lte = new Date(endDate);
      }
    }

    // Search filter
    if (search) {
      query.$or = [
        { transactionId: { $regex: search, $options: 'i' } },
        { orderId: { $regex: search, $options: 'i' } },
        { gatewayTransactionId: { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count
    const total = await Transaction.countDocuments(query);

    // Get transactions
    const transactions = await Transaction.find(query)
      .sort({ transactionDate: -1 })
      .skip(skip)
      .limit(limitNum);

    // Calculate analytics
    const analytics = {
      all: await Transaction.countDocuments({ userId }),
      succeeded: await Transaction.countDocuments({ userId, status: 'succeeded' }),
      refunded: await Transaction.countDocuments({ userId, status: 'refunded' }),
      disputed: await Transaction.countDocuments({ userId, status: 'disputed' }),
      failed: await Transaction.countDocuments({ userId, status: 'failed' }),
      unacceptable: await Transaction.countDocuments({ userId, status: 'unacceptable' })
    };

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        },
        analytics
      }
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get Single Transaction Details
router.get('/payments/transactions/:transactionId', authenticate, async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user.userId;

    const transaction = await Transaction.findOne({ transactionId });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check if user owns the transaction
    if (transaction.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: transaction
    });

  } catch (error) {
    console.error('Get transaction details error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// ==========================================
// ADMIN PAYMENT ROUTES
// ==========================================

// Get All Transactions (Admin)
router.get('/admin/payments/transactions', authenticateAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      type,
      status,
      currency,
      paymentMethod,
      userId,
      orderId,
      agencyId,
      startDate,
      endDate
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    const query = {};

    // Type filter
    if (type && type !== 'all') {
      query.type = type;
    }

    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // Currency filter
    if (currency && currency !== 'all') {
      query.currency = currency.toUpperCase();
    }

    // Payment method filter
    if (paymentMethod && paymentMethod !== 'all') {
      query.paymentMethod = paymentMethod;
    }

    // User ID filter
    if (userId) {
      query.userId = userId;
    }

    // Agency ID filter
    if (agencyId) {
      query.userId = agencyId;
      query.userType = 'agency';
    }

    // Order ID filter
    if (orderId) {
      query.orderId = orderId;
    }

    // Date range filter
    if (startDate || endDate) {
      query.transactionDate = {};
      if (startDate) {
        query.transactionDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.transactionDate.$lte = new Date(endDate);
      }
    }

    // Search filter
    if (search) {
      query.$or = [
        { transactionId: { $regex: search, $options: 'i' } },
        { userId: { $regex: search, $options: 'i' } },
        { orderId: { $regex: search, $options: 'i' } },
        { gatewayTransactionId: { $regex: search, $options: 'i' } },
        { userFullName: { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count
    const total = await Transaction.countDocuments(query);

    // Get transactions
    const transactions = await Transaction.find(query)
      .sort({ transactionDate: -1 })
      .skip(skip)
      .limit(limitNum);

    // Calculate analytics
    const analytics = {
      totalPayment: await Transaction.aggregate([
        { $match: { type: 'payment' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).then(result => result[0]?.total || 0),
      totalSucceeded: await Transaction.aggregate([
        { $match: { status: 'succeeded' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).then(result => result[0]?.total || 0),
      totalRefunded: await Transaction.aggregate([
        { $match: { type: 'refund' } },
        { $group: { _id: null, total: { $sum: '$refundAmount' } } }
      ]).then(result => result[0]?.total || 0),
      totalDisputed: await Transaction.aggregate([
        { $match: { status: 'disputed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).then(result => result[0]?.total || 0),
      totalFailed: await Transaction.aggregate([
        { $match: { status: 'failed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).then(result => result[0]?.total || 0),
      totalUnacceptable: await Transaction.aggregate([
        { $match: { status: 'unacceptable' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).then(result => result[0]?.total || 0),
      totalCount: await Transaction.countDocuments(),
      succeededCount: await Transaction.countDocuments({ status: 'succeeded' }),
      refundedCount: await Transaction.countDocuments({ type: 'refund' }),
      disputedCount: await Transaction.countDocuments({ status: 'disputed' }),
      failedCount: await Transaction.countDocuments({ status: 'failed' }),
      unacceptableCount: await Transaction.countDocuments({ status: 'unacceptable' })
    };

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        },
        analytics
      }
    });

  } catch (error) {
    console.error('Get all transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get Transaction Details (Admin)
router.get('/admin/payments/transactions/:transactionId', authenticateAdmin, async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction.findOne({ transactionId });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      data: transaction
    });

  } catch (error) {
    console.error('Get transaction details error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Issue Refund (Admin)
router.post('/admin/payments/transactions/:transactionId/refund', authenticateAdmin, async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { refundAmount, feesRefundedAmount, reason } = req.body;
    const adminEmail = req.admin.email;

    if (!refundAmount || refundAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Refund amount must be greater than 0'
      });
    }

    // Get original transaction
    const originalTransaction = await Transaction.findOne({ transactionId });

    if (!originalTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check if transaction is a payment and succeeded
    if (originalTransaction.type !== 'payment' || originalTransaction.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Refund can only be issued for succeeded payments'
      });
    }

    // Validate refund amount doesn't exceed original amount
    if (refundAmount > originalTransaction.amount) {
      return res.status(400).json({
        success: false,
        message: `Refund amount cannot exceed original payment amount of ${originalTransaction.amount}`
      });
    }

    // Check if already fully refunded
    const existingRefunds = await Transaction.find({
      type: 'refund',
      originalTransactionId: transactionId,
      status: 'succeeded'
    });

    const totalRefunded = existingRefunds.reduce((sum, ref) => sum + (ref.refundAmount || 0), 0);
    if (totalRefunded + refundAmount > originalTransaction.amount) {
      return res.status(400).json({
        success: false,
        message: `Total refund amount cannot exceed original payment. Already refunded: ${totalRefunded}, attempting: ${refundAmount}`
      });
    }

    // Generate refund transaction ID
    const refundTransactionId = Transaction.generateTransactionId();

    // Calculate refund charge (if any)
    const feesRefunded = feesRefundedAmount || 0;

    // Create refund transaction
    const refundTransaction = await Transaction.create({
      transactionId: refundTransactionId,
      type: 'refund',
      userId: originalTransaction.userId,
      userType: originalTransaction.userType,
      userFullName: originalTransaction.userFullName,
      userEmail: originalTransaction.userEmail,
      userPhone: originalTransaction.userPhone,
      orderId: originalTransaction.orderId,
      paymentMethod: originalTransaction.paymentMethod,
      originalTransactionId: transactionId,
      refundAmount: refundAmount,
      feesRefundedAmount: feesRefunded,
      refundReason: reason || 'Refund issued by admin',
      currency: originalTransaction.currency,
      amount: -refundAmount, // Negative for refunds
      charge: -feesRefunded, // Negative for refunds
      totalAmount: -(refundAmount + feesRefunded), // Negative total
      status: 'processing'
    });

    // Update original transaction refund history
    if (!originalTransaction.refundHistory) {
      originalTransaction.refundHistory = [];
    }
    originalTransaction.refundHistory.push({
      refundTransactionId: refundTransactionId,
      refundAmount: refundAmount,
      refundedBy: adminEmail,
      refundedAt: new Date(),
      reason: reason || 'Refund issued by admin'
    });

    // Check if fully refunded
    const newTotalRefunded = totalRefunded + refundAmount;
    if (newTotalRefunded >= originalTransaction.amount) {
      originalTransaction.status = 'refunded';
    }

    await originalTransaction.save();

    // Update order if it's an order payment
    if (originalTransaction.orderId && originalTransaction.paymentType === 'order') {
      const order = await Order.findOne({ orderId: originalTransaction.orderId });
      if (order) {
        // Reduce paid amount
        order.pricing.paidAmount = Math.max(0, order.pricing.paidAmount - refundAmount);
        order.pricing.dueAmount = order.pricing.totalAmount - order.pricing.paidAmount;
        
        // Change order status to refund if fully refunded
        if (newTotalRefunded >= originalTransaction.amount) {
          order.status = 'refund';
          if (!order.statusHistory) {
            order.statusHistory = [];
          }
          order.statusHistory.push({
            status: 'refund',
            reason: reason || 'Payment refunded',
            changedBy: adminEmail,
            changedAt: new Date()
          });
        }
        await order.save();
      }
    }

    // Update agency if it's an agency payment
    if (originalTransaction.userType === 'agency') {
      const agency = await User.findOne({ userId: originalTransaction.userId });
      if (agency && originalTransaction.paymentType === 'security-deposit') {
        agency.agencyInfo.totalDepositBalance = Math.max(0, agency.agencyInfo.totalDepositBalance - refundAmount);
        agency.agencyInfo.totalDueDeposit += refundAmount;
        await agency.save();
      }
    }

    res.status(201).json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        refundTransactionId: refundTransactionId,
        originalTransactionId: transactionId,
        refundAmount: refundAmount,
        feesRefundedAmount: feesRefunded,
        reason: reason || null,
        refundedBy: adminEmail,
        refundedAt: new Date(),
        totalRefunded: newTotalRefunded,
        originalAmount: originalTransaction.amount,
        remainingAmount: originalTransaction.amount - newTotalRefunded
      }
    });

  } catch (error) {
    console.error('Issue refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get Payment Analytics with Filters (Admin)
router.get('/admin/payments/analytics', authenticateAdmin, async (req, res) => {
  try {
    const {
      filterType, // 'success-payment', 'penalty', 'security-deposit', 'success-refund', 'project-due', 'profile-amount'
      startDate,
      endDate,
      gateway, // 'all', 'paypal', 'stripe'
      currency
    } = req.query;

    let query = {};

    // Date range
    if (startDate || endDate) {
      query.transactionDate = {};
      if (startDate) {
        query.transactionDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.transactionDate.$lte = new Date(endDate);
      }
    }

    // Gateway filter
    if (gateway && gateway !== 'all') {
      query.paymentMethod = gateway;
    }

    // Currency filter
    if (currency && currency !== 'all') {
      query.currency = currency.toUpperCase();
    }

    let result = {};

    switch (filterType) {
      case 'success-payment':
        // All successful payments (including agency fees/deposits)
        query.type = 'payment';
        query.status = 'succeeded';
        result = {
          totalAmount: await Transaction.aggregate([
            { $match: query },
            { $group: { _id: null, total: { $sum: '$amount' } } }
          ]).then(r => r[0]?.total || 0),
          totalTransactions: await Transaction.countDocuments(query),
          transactions: await Transaction.find(query).sort({ transactionDate: -1 }).limit(100)
        };
        break;

      case 'penalty':
        // Penalty payments
        query.type = 'payment';
        query.paymentType = 'penalty';
        query.status = 'succeeded';
        result = {
          totalAmount: await Transaction.aggregate([
            { $match: query },
            { $group: { _id: null, total: { $sum: '$amount' } } }
          ]).then(r => r[0]?.total || 0),
          totalTransactions: await Transaction.countDocuments(query),
          transactions: await Transaction.find(query).sort({ transactionDate: -1 }).limit(100)
        };
        break;

      case 'security-deposit':
        // Security deposit payments
        query.type = 'payment';
        query.paymentType = 'security-deposit';
        query.status = 'succeeded';
        result = {
          totalAmount: await Transaction.aggregate([
            { $match: query },
            { $group: { _id: null, total: { $sum: '$amount' } } }
          ]).then(r => r[0]?.total || 0),
          totalTransactions: await Transaction.countDocuments(query),
          transactions: await Transaction.find(query).sort({ transactionDate: -1 }).limit(100)
        };
        break;

      case 'success-refund':
        // Successful refunds
        query.type = 'refund';
        query.status = 'succeeded';
        result = {
          totalAmount: await Transaction.aggregate([
            { $match: query },
            { $group: { _id: null, total: { $sum: '$refundAmount' } } }
          ]).then(r => r[0]?.total || 0),
          totalTransactions: await Transaction.countDocuments(query),
          transactions: await Transaction.find(query).sort({ transactionDate: -1 }).limit(100)
        };
        break;

      case 'project-due':
        // Project due amounts (orders with status: waiting, working, stopped, complete)
        const orders = await Order.find({
          status: { $in: ['waiting', 'working', 'stopped', 'complete'] }
        }).select('orderId pricing.totalAmount pricing.paidAmount pricing.dueAmount pricing.currency status');
        
        if (startDate || endDate) {
          const dateFilter = {};
          if (startDate) dateFilter.$gte = new Date(startDate);
          if (endDate) dateFilter.$lte = new Date(endDate);
          // Apply date filter to orders if needed
        }

        const dueOrders = orders.filter(order => order.pricing.dueAmount > 0);
        result = {
          totalDueAmount: dueOrders.reduce((sum, order) => sum + order.pricing.dueAmount, 0),
          totalOrders: dueOrders.length,
          orders: dueOrders
        };
        break;

      case 'profile-amount':
        // Profile amount (profit from delivered orders)
        const deliveredOrders = await Order.find({ status: 'delivery' });
        if (startDate || endDate) {
          const dateFilter = {};
          if (startDate) dateFilter.$gte = new Date(startDate);
          if (endDate) dateFilter.$lte = new Date(endDate);
          // Filter delivered orders by date
        }
        result = {
          totalProfitAmount: deliveredOrders.reduce((sum, order) => sum + (order.pricing.profitAmount || 0), 0),
          totalOrders: deliveredOrders.length,
          orders: deliveredOrders.map(order => ({
            orderId: order.orderId,
            profitAmount: order.pricing.profitAmount || 0,
            totalAmount: order.pricing.totalAmount,
            currency: order.pricing.currency
          }))
        };
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid filterType. Must be: success-payment, penalty, security-deposit, success-refund, project-due, or profile-amount'
        });
    }

    res.json({
      success: true,
      data: {
        filterType,
        ...result,
        filters: {
          startDate: startDate || null,
          endDate: endDate || null,
          gateway: gateway || 'all',
          currency: currency || 'all'
        }
      }
    });

  } catch (error) {
    console.error('Get payment analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Update Transaction Status (for webhooks)
router.post('/payments/webhooks/:gateway', async (req, res) => {
  try {
    const { gateway } = req.params; // 'stripe' or 'paypal'
    const webhookData = req.body;

    // Find transaction by gateway transaction ID
    let transaction = null;

    if (gateway === 'stripe') {
      // Stripe webhook processing
      const paymentIntentId = webhookData.data?.object?.id || webhookData.id;
      transaction = await Transaction.findOne({
        paymentMethod: 'stripe',
        $or: [
          { paymentIntentId: paymentIntentId },
          { gatewayTransactionId: paymentIntentId }
        ]
      });
    } else if (gateway === 'paypal') {
      // PayPal webhook processing
      const orderId = webhookData.resource?.id || webhookData.id;
      transaction = await Transaction.findOne({
        paymentMethod: 'paypal',
        $or: [
          { paypalOrderId: orderId },
          { gatewayTransactionId: orderId }
        ]
      });
    }

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Update transaction status based on webhook
    const eventType = webhookData.type || webhookData.event_type;
    
    if (eventType?.includes('succeeded') || eventType?.includes('completed') || webhookData.status === 'succeeded' || webhookData.status === 'completed') {
      transaction.status = 'succeeded';
      transaction.completedAt = new Date();
    } else if (eventType?.includes('failed') || webhookData.status === 'failed') {
      transaction.status = 'failed';
    } else if (eventType?.includes('disputed') || webhookData.status === 'disputed') {
      transaction.status = 'disputed';
    } else if (eventType?.includes('refunded') || webhookData.status === 'refunded') {
      transaction.status = 'refunded';
    }

    // Store webhook data
    transaction.webhookData = webhookData;

    await transaction.save();

    // Update related order if payment succeeded
    if (transaction.status === 'succeeded' && transaction.orderId && transaction.paymentType === 'order') {
      const order = await Order.findOne({ orderId: transaction.orderId });
      if (order) {
        // Update payment history status
        if (order.pricing.paymentHistory && order.pricing.paymentHistory.length > 0) {
          const paymentEntry = order.pricing.paymentHistory.find(p => p.transactionId === transaction.transactionId);
          if (paymentEntry) {
            paymentEntry.status = 'succeeded';
          }
        }
        // Auto-change status to waiting when payment is completed
        if (order.status === 'payment' && order.pricing.paidAmount >= order.pricing.totalAmount) {
          order.status = 'waiting';
          if (!order.statusHistory) {
            order.statusHistory = [];
          }
          order.statusHistory.push({
            status: 'waiting',
            reason: 'Payment completed via webhook',
            changedBy: 'system',
            changedAt: new Date()
          });
        }
        // If status is complete and fully paid, change to delivery
        if (order.status === 'complete' && order.pricing.paidAmount >= order.pricing.totalAmount && order.pricing.dueAmount === 0) {
          order.status = 'delivery';
          order.statusHistory.push({
            status: 'delivery',
            reason: 'Full payment received via webhook',
            changedBy: 'system',
            changedAt: new Date()
          });
        }
        await order.save();
      }
    }

    // Update agency financials if agency payment succeeded
    if (transaction.status === 'succeeded' && transaction.userType === 'agency') {
      const agency = await User.findOne({ userId: transaction.userId });
      if (agency && agency.accountType === 'agency') {
        if (transaction.paymentType === 'annual-fee') {
          // Annual fee already handled in payment route
          agency.agencyInfo.renewalDate = new Date();
          const nextRenewal = new Date();
          nextRenewal.setFullYear(nextRenewal.getFullYear() + 1);
          agency.agencyInfo.renewalDate = nextRenewal;
        } else if (transaction.paymentType === 'security-deposit') {
          // Security deposit already handled in payment route
          agency.agencyInfo.totalDepositBalance += transaction.amount;
          agency.agencyInfo.totalDueDeposit = Math.max(0, agency.agencyInfo.totalDueDeposit - transaction.amount);
        } else if (transaction.paymentType === 'penalty') {
          // Penalty payment
          agency.agencyInfo.totalPenaltyFee = Math.max(0, agency.agencyInfo.totalPenaltyFee - transaction.amount);
        }

        // Activate agency if all payments are complete
        if (agency.status === 'inactive') {
          const hasPaidAnnualFee = agency.agencyInfo.renewalFee && agency.agencyInfo.renewalDate && new Date() <= agency.agencyInfo.renewalDate;
          const hasPaidDeposit = agency.agencyInfo.totalDueDeposit === 0;
          const hasPaidPenalty = agency.agencyInfo.totalPenaltyFee === 0;
          
          if (hasPaidAnnualFee && hasPaidDeposit && hasPaidPenalty) {
            agency.status = 'active';
            if (!agency.statusHistory) {
              agency.statusHistory = [];
            }
            agency.statusHistory.push({
              status: 'active',
              reason: 'Annual fee, security deposit, and penalties paid (via webhook)',
              changedBy: 'system',
              changedAt: new Date()
            });
          }
        }
        await agency.save();
      }
    }

    res.json({
      success: true,
      message: 'Webhook processed successfully'
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;

