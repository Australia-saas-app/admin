const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { authenticate, authenticateAdmin } = require('../middleware/auth');

// ==========================================
// USER/AGENCY ORDER ROUTES
// ==========================================

// Create Order
router.post('/orders', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findOne({ userId });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user status allows order creation
    if (user.status === 'blocked' || user.status === 'closed') {
      return res.status(403).json({
        success: false,
        message: 'Account is blocked or closed. Cannot create orders.'
      });
    }

    const {
      orderType,
      serviceName,
      clientInfo,
      pricing,
      orderDetails,
      documents,
      referenceName,
      description,
      propertyDetails // For real estate post orders
    } = req.body;

    // Validate required fields
    if (!orderType || !serviceName || !clientInfo?.fullName) {
      return res.status(400).json({
        success: false,
        message: 'Order type, service name, and client full name are required'
      });
    }

    // Validate order type
    const validOrderTypes = ['technical', 'construction', 'real-estate', 'import-export', 'visa-traveling', 'solutions'];
    if (!validOrderTypes.includes(orderType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order type. Must be one of: ${validOrderTypes.join(', ')}`
      });
    }

    // Validate description length (10-1000 keywords as mentioned in requirements)
    if (description && (description.length < 10 || description.length > 1000)) {
      return res.status(400).json({
        success: false,
        message: 'Description must be between 10 and 1000 characters'
      });
    }

    // Generate order ID
    const orderId = await Order.generateOrderId();

    // Build order object
    const orderData = {
      orderId,
      orderType,
      status: 'pending',
      createdBy: {
        userId: user.userId,
        accountType: user.accountType,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone
      },
      serviceName,
      clientInfo: {
        fullName: clientInfo.fullName,
        nationality: clientInfo.nationality,
        dateOfBirth: clientInfo.dateOfBirth ? new Date(clientInfo.dateOfBirth) : undefined,
        governmentId: clientInfo.governmentId,
        permanentAddress: clientInfo.permanentAddress,
        email: clientInfo.email || user.email,
        phone: clientInfo.phone || user.phone
      },
      pricing: {
        totalAmount: pricing?.totalAmount || 0,
        paidAmount: 0,
        dueAmount: pricing?.totalAmount || 0,
        profitAmount: 0,
        currency: pricing?.currency || user.currency || 'USD'
      },
      orderDetails: orderDetails || {},
      documents: documents || [],
      referenceName: referenceName,
      description: description
    };

    // Add property details for real estate orders
    if (orderType === 'real-estate' && propertyDetails) {
      orderData.orderDetails.propertyDetails = propertyDetails;
      orderData.isPublic = propertyDetails.isPublic || false;
    }

    // Add status history
    orderData.statusHistory = [{
      status: 'pending',
      reason: 'Order created',
      changedBy: user.userId,
      changedAt: new Date()
    }];

    const order = await Order.create(orderData);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: order.orderId,
        orderType: order.orderType,
        status: order.status,
        serviceName: order.serviceName
      }
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get User's Orders (with pagination, search, and filters)
router.get('/orders', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      page = 1,
      limit = 10,
      search,
      orderType,
      status
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    const query = {
      'createdBy.userId': userId
    };

    // Order type filter
    if (orderType) {
      query.orderType = orderType;
    }

    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // Search filter
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { serviceName: { $regex: search, $options: 'i' } },
        { 'clientInfo.fullName': { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count
    const total = await Order.countDocuments(query);

    // Get orders
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Calculate analytics
    const analytics = {
      all: await Order.countDocuments({ 'createdBy.userId': userId }),
      pending: await Order.countDocuments({ 'createdBy.userId': userId, status: 'pending' }),
      payment: await Order.countDocuments({ 'createdBy.userId': userId, status: 'payment' }),
      waiting: await Order.countDocuments({ 'createdBy.userId': userId, status: 'waiting' }),
      working: await Order.countDocuments({ 'createdBy.userId': userId, status: 'working' }),
      stopped: await Order.countDocuments({ 'createdBy.userId': userId, status: 'stopped' }),
      delivery: await Order.countDocuments({ 'createdBy.userId': userId, status: 'delivery' }),
      refund: await Order.countDocuments({ 'createdBy.userId': userId, status: 'refund' }),
      cancel: await Order.countDocuments({ 'createdBy.userId': userId, status: 'cancel' }),
      projectAmount: await Order.aggregate([
        { $match: { 'createdBy.userId': userId } },
        { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
      ]).then(result => result[0]?.total || 0),
      paidAmount: await Order.aggregate([
        { $match: { 'createdBy.userId': userId } },
        { $group: { _id: null, total: { $sum: '$pricing.paidAmount' } } }
      ]).then(result => result[0]?.total || 0),
      dueAmount: await Order.aggregate([
        { $match: { 'createdBy.userId': userId } },
        { $group: { _id: null, total: { $sum: '$pricing.dueAmount' } } }
      ]).then(result => result[0]?.total || 0)
    };

    res.json({
      success: true,
      data: {
        orders,
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
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get Single Order Details
router.get('/orders/:orderId', authenticate, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user has access to this order
    if (order.createdBy.userId !== userId && order.access === 'only-me') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Update Order (only when status is pending)
router.patch('/orders/:orderId', authenticate, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;
    const updateData = req.body;

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
        message: 'You can only update your own orders'
      });
    }

    // Check if order is in pending status
    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Order can only be edited when status is pending'
      });
    }

    // Update allowed fields
    if (updateData.serviceName) order.serviceName = updateData.serviceName;
    if (updateData.clientInfo) order.clientInfo = { ...order.clientInfo, ...updateData.clientInfo };
    if (updateData.orderDetails) order.orderDetails = { ...order.orderDetails, ...updateData.orderDetails };
    if (updateData.description) {
      if (updateData.description.length < 10 || updateData.description.length > 1000) {
        return res.status(400).json({
          success: false,
          message: 'Description must be between 10 and 1000 characters'
        });
      }
      order.description = updateData.description;
    }
    if (updateData.referenceName) order.referenceName = updateData.referenceName;
    if (updateData.documents) order.documents = updateData.documents;
    if (updateData.pricing?.totalAmount !== undefined) {
      order.pricing.totalAmount = updateData.pricing.totalAmount;
      order.pricing.dueAmount = order.pricing.totalAmount - order.pricing.paidAmount;
    }

    order.updatedAt = new Date();
    await order.save();

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: order
    });

  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Download Order Files (only when status is delivery)
router.get('/orders/:orderId/download', authenticate, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;

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
        message: 'Access denied'
      });
    }

    // Check if order is in delivery status
    if (order.status !== 'delivery') {
      return res.status(400).json({
        success: false,
        message: 'Order files can only be downloaded when status is delivery'
      });
    }

    // Return all files (documents + adminFiles)
    const allFiles = [
      ...order.documents.map(doc => ({
        fileName: doc.fileName,
        fileUrl: doc.fileUrl,
        fileType: doc.fileType,
        uploadedBy: doc.uploadedBy,
        uploadedAt: doc.uploadedAt,
        source: 'order'
      })),
      ...order.adminFiles.map(file => ({
        fileName: file.fileName,
        fileUrl: file.fileUrl,
        fileType: file.fileType,
        addedBy: file.addedBy,
        addedAt: file.addedAt,
        source: 'admin'
      }))
    ];

    res.json({
      success: true,
      data: {
        orderId: order.orderId,
        files: allFiles
      }
    });

  } catch (error) {
    console.error('Download order files error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// ==========================================
// ADMIN ORDER ROUTES
// ==========================================

// Get All Orders (Admin)
router.get('/admin/orders', authenticateAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      orderType,
      status,
      createdBy,
      startDate,
      endDate
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    const query = {};

    // Order type filter
    if (orderType && orderType !== 'all') {
      query.orderType = orderType;
    }

    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // Created by filter
    if (createdBy) {
      query['createdBy.userId'] = createdBy;
    }

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Search filter
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { serviceName: { $regex: search, $options: 'i' } },
        { 'clientInfo.fullName': { $regex: search, $options: 'i' } },
        { 'createdBy.fullName': { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count
    const total = await Order.countDocuments(query);

    // Get orders
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Calculate analytics
    const analytics = {
      all: await Order.countDocuments(),
      pending: await Order.countDocuments({ status: 'pending' }),
      payment: await Order.countDocuments({ status: 'payment' }),
      waiting: await Order.countDocuments({ status: 'waiting' }),
      working: await Order.countDocuments({ status: 'working' }),
      stopped: await Order.countDocuments({ status: 'stopped' }),
      delivery: await Order.countDocuments({ status: 'delivery' }),
      refund: await Order.countDocuments({ status: 'refund' }),
      cancel: await Order.countDocuments({ status: 'cancel' }),
      projectAmount: await Order.aggregate([
        { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
      ]).then(result => result[0]?.total || 0),
      paidAmount: await Order.aggregate([
        { $group: { _id: null, total: { $sum: '$pricing.paidAmount' } } }
      ]).then(result => result[0]?.total || 0),
      dueAmount: await Order.aggregate([
        { $group: { _id: null, total: { $sum: '$pricing.dueAmount' } } }
      ]).then(result => result[0]?.total || 0)
    };

    res.json({
      success: true,
      data: {
        orders,
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
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get Single Order Details (Admin)
router.get('/admin/orders/:orderId', authenticateAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Update Order (Admin - only when status is pending)
router.patch('/admin/orders/:orderId', authenticateAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const adminEmail = req.admin.email;
    const updateData = req.body;

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order is in pending status
    if (order.status !== 'pending' && !updateData.force) {
      return res.status(400).json({
        success: false,
        message: 'Order can only be edited when status is pending. Use force flag to override.'
      });
    }

    // Update allowed fields
    if (updateData.serviceName) order.serviceName = updateData.serviceName;
    if (updateData.clientInfo) order.clientInfo = { ...order.clientInfo, ...updateData.clientInfo };
    if (updateData.orderDetails) order.orderDetails = { ...order.orderDetails, ...updateData.orderDetails };
    if (updateData.description) {
      if (updateData.description.length < 10 || updateData.description.length > 1000) {
        return res.status(400).json({
          success: false,
          message: 'Description must be between 10 and 1000 characters'
        });
      }
      order.description = updateData.description;
    }
    if (updateData.referenceName) order.referenceName = updateData.referenceName;
    if (updateData.documents) order.documents = updateData.documents;
    if (updateData.pricing?.totalAmount !== undefined) {
      order.pricing.totalAmount = updateData.pricing.totalAmount;
      order.pricing.dueAmount = order.pricing.totalAmount - order.pricing.paidAmount;
    }
    if (updateData.access) order.access = updateData.access;

    order.updatedAt = new Date();
    await order.save();

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: order
    });

  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Change Order Status (Admin)
router.patch('/admin/orders/:orderId/status', authenticateAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, reason } = req.body;
    const adminEmail = req.admin.email;

    // Validate status
    const validStatuses = ['pending', 'payment', 'waiting', 'working', 'stopped', 'complete', 'delivery', 'refund', 'cancel'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Save previous status
    const previousStatus = order.status;

    // Don't allow status change if already in the same status
    if (order.status === status) {
      return res.status(400).json({
        success: false,
        message: `Order is already in ${status} status`
      });
    }

    // Add to status history
    if (!order.statusHistory) {
      order.statusHistory = [];
    }

    order.statusHistory.push({
      status: previousStatus,
      reason: reason || 'Status changed by admin',
      changedBy: adminEmail,
      changedAt: new Date()
    });

    // Update status
    order.status = status;
    
    // Auto-change to waiting when payment is completed (payment status)
    if (status === 'payment' && order.pricing.paidAmount >= order.pricing.totalAmount) {
      order.status = 'waiting';
      order.statusHistory.push({
        status: 'waiting',
        reason: 'Payment completed, automatically moved to waiting',
        changedBy: 'system',
        changedAt: new Date()
      });
    }

    order.updatedAt = new Date();
    await order.save();

    res.json({
      success: true,
      message: `Order status updated to ${order.status} successfully`,
      data: {
        orderId: order.orderId,
        previousStatus: previousStatus,
        newStatus: order.status,
        reason: reason || null,
        changedBy: adminEmail,
        statusHistory: order.statusHistory
      }
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Add Profit to Order (Admin - only when status is waiting)
router.patch('/admin/orders/:orderId/profit', authenticateAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { profitAmount, reason } = req.body;
    const adminEmail = req.admin.email;

    if (!profitAmount || profitAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Profit amount must be greater than 0'
      });
    }

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order is in waiting status
    if (order.status !== 'waiting') {
      return res.status(400).json({
        success: false,
        message: 'Profit can only be added when order status is waiting'
      });
    }

    // Update profit amount and recalculate total
    const oldTotalAmount = order.pricing.totalAmount;
    order.pricing.profitAmount = profitAmount;
    order.pricing.totalAmount = oldTotalAmount + profitAmount;
    order.pricing.dueAmount = order.pricing.totalAmount - order.pricing.paidAmount;

    order.statusHistory.push({
      status: order.status,
      reason: reason || `Profit of ${profitAmount} ${order.pricing.currency} added by admin`,
      changedBy: adminEmail,
      changedAt: new Date()
    });

    order.updatedAt = new Date();
    await order.save();

    res.json({
      success: true,
      message: 'Profit added successfully',
      data: {
        orderId: order.orderId,
        oldTotalAmount: oldTotalAmount,
        newTotalAmount: order.pricing.totalAmount,
        profitAmount: order.pricing.profitAmount,
        dueAmount: order.pricing.dueAmount,
        reason: reason || null
      }
    });

  } catch (error) {
    console.error('Add profit error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Add Admin Files to Order (Admin - accessible when status is delivery)
router.post('/admin/orders/:orderId/files', authenticateAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { files } = req.body; // Array of {fileName, fileUrl, fileType}
    const adminEmail = req.admin.email;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Files array is required'
      });
    }

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order is in working status or beyond
    if (!['working', 'complete', 'delivery'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Files can only be added when order status is working, complete, or delivery'
      });
    }

    // Initialize adminFiles if it doesn't exist
    if (!order.adminFiles) {
      order.adminFiles = [];
    }

    // Add files
    const newFiles = files.map(file => ({
      fileName: file.fileName,
      fileUrl: file.fileUrl,
      fileType: file.fileType,
      addedBy: adminEmail,
      addedAt: new Date()
    }));

    order.adminFiles.push(...newFiles);
    order.updatedAt = new Date();
    await order.save();

    res.json({
      success: true,
      message: 'Files added successfully',
      data: {
        orderId: order.orderId,
        filesAdded: newFiles.length,
        totalAdminFiles: order.adminFiles.length
      }
    });

  } catch (error) {
    console.error('Add admin files error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Delete Order (Admin)
router.delete('/admin/orders/:orderId', authenticateAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOneAndDelete({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order deleted successfully',
      data: {
        orderId: order.orderId
      }
    });

  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get Order Status History (Admin)
router.get('/admin/orders/:orderId/status-history', authenticateAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId }).select('statusHistory orderId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: {
        orderId: order.orderId,
        statusHistory: order.statusHistory || []
      }
    });

  } catch (error) {
    console.error('Get status history error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;

