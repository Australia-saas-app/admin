const express = require('express');
const router = express.Router();
const OrderChat = require('../models/OrderChat');
const Order = require('../models/Order');
const User = require('../models/User');
const Admin = require('../models/Admin');
const { authenticate, authenticateAdmin } = require('../middleware/auth');

// ==========================================
// USER/AGENCY ORDER CHAT ROUTES
// ==========================================

// Send Message to Order Chat
router.post('/orders/:orderId/chat/messages', authenticate, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;
    const { message, messageType = 'text' } = req.body;

    // Validate message type
    const validMessageTypes = ['text', 'voice', 'call'];
    if (!validMessageTypes.includes(messageType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid message type. Must be one of: ${validMessageTypes.join(', ')}`
      });
    }

    // Validate text message content
    if (messageType === 'text' && (!message || message.trim().length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required for text messages'
      });
    }

    // Get user info
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
        message: 'Account is blocked or closed. Cannot send messages.'
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
        message: 'You can only chat in your own orders'
      });
    }

    // Check if order is in pending or working status
    if (!['pending', 'working'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order chat is only available when order status is pending or working'
      });
    }

    // Find or create chat
    let chat = await OrderChat.findOne({ orderId });

    if (!chat) {
      // Create new chat
      chat = await OrderChat.create({
        orderId,
        messages: [],
        participant: {
          userId: user.userId,
          accountType: user.accountType,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone
        },
        settings: {
          messageEnabled: true,
          callEnabled: true,
          blocked: false,
          messageExpirationDays: 7
        },
        adminHasReplied: false
      });
    }

    // Check if chat is blocked
    if (chat.settings.blocked) {
      return res.status(403).json({
        success: false,
        message: 'Chat is blocked by admin'
      });
    }

    // Check if messaging is enabled
    if (!chat.settings.messageEnabled) {
      return res.status(403).json({
        success: false,
        message: 'Messaging is disabled for this chat'
      });
    }

    // For call messages, check if call is enabled and admin has replied
    if (messageType === 'call') {
      if (!chat.settings.callEnabled) {
        return res.status(403).json({
          success: false,
          message: 'Calling is disabled for this chat'
        });
      }
      if (!chat.adminHasReplied) {
        return res.status(403).json({
          success: false,
          message: 'You can only initiate calls after an admin has replied to your message'
        });
      }
    }

    // Generate message ID
    const messageId = OrderChat.generateMessageId();

    // Create message object
    const newMessage = {
      messageId,
      senderId: user.userId,
      senderType: user.accountType === 'agency' ? 'agency' : 'user',
      senderName: user.fullName,
      messageType: messageType,
      content: messageType === 'text' ? message : undefined,
      timestamp: new Date(),
      readBy: [],
      isDeleted: false
    };

    // Add voice/call specific fields if provided
    if (messageType === 'voice' && req.body.voiceUrl) {
      newMessage.voiceUrl = req.body.voiceUrl;
      newMessage.voiceDuration = req.body.voiceDuration || 0;
    }

    if (messageType === 'call' && req.body.callDuration) {
      newMessage.callDuration = req.body.callDuration;
    }

    // Add message to chat
    chat.messages.push(newMessage);
    
    // If first message, reset assigned admin (available to all admins)
    if (chat.messages.length === 1) {
      chat.assignedAdmin = null;
    }

    // Reset assigned admin if current admin is offline for 10+ minutes
    if (chat.assignedAdmin && chat.assignedAdmin.lastActiveAt) {
      const minutesSinceLastActive = (Date.now() - chat.assignedAdmin.lastActiveAt.getTime()) / (1000 * 60);
      if (minutesSinceLastActive >= 10) {
        chat.assignedAdmin = null;
      }
    }

    await chat.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        messageId: newMessage.messageId,
        orderId: orderId,
        timestamp: newMessage.timestamp,
        assignedToAllAdmins: !chat.assignedAdmin
      }
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get Order Chat Messages
router.get('/orders/:orderId/chat/messages', authenticate, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;

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
        message: 'Access denied'
      });
    }

    // Get chat
    const chat = await OrderChat.findOne({ orderId });

    if (!chat) {
      return res.json({
        success: true,
        data: {
          orderId,
          messages: [],
          assignedAdmin: null,
          settings: {
            messageEnabled: true,
            callEnabled: true,
            blocked: false
          },
          adminHasReplied: false
        }
      });
    }

    // Filter out deleted messages
    const activeMessages = chat.messages.filter(msg => !msg.isDeleted);

    res.json({
      success: true,
      data: {
        orderId: chat.orderId,
        messages: activeMessages,
        assignedAdmin: chat.assignedAdmin,
        settings: chat.settings,
        adminHasReplied: chat.adminHasReplied,
        participant: chat.participant
      }
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Upload File to Order Chat
router.post('/orders/:orderId/chat/files', authenticate, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;
    const { fileName, fileUrl, fileType } = req.body;

    // Validate required fields
    if (!fileName || !fileUrl || !fileType) {
      return res.status(400).json({
        success: false,
        message: 'fileName, fileUrl, and fileType are required'
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
        message: 'Access denied'
      });
    }

    // Check if order is in pending or working status
    if (!['pending', 'working'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'File upload is only available when order status is pending or working'
      });
    }

    // Get chat
    let chat = await OrderChat.findOne({ orderId });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found. Please send a message first.'
      });
    }

    // Check if admin has replied (required for file upload)
    if (!chat.adminHasReplied) {
      return res.status(403).json({
        success: false,
        message: 'You can only upload files after an admin has replied to your message'
      });
    }

    // Check if chat is blocked
    if (chat.settings.blocked) {
      return res.status(403).json({
        success: false,
        message: 'Chat is blocked by admin'
      });
    }

    // Generate message ID
    const messageId = OrderChat.generateMessageId();

    // Create file message
    const fileMessage = {
      messageId,
      senderId: user.userId,
      senderType: user.accountType === 'agency' ? 'agency' : 'user',
      senderName: user.fullName,
      messageType: 'file',
      fileName: fileName,
      fileUrl: fileUrl,
      fileType: fileType, // pdf, photo, audio, video
      timestamp: new Date(),
      readBy: [],
      isDeleted: false
    };

    chat.messages.push(fileMessage);
    await chat.save();

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        messageId: fileMessage.messageId,
        fileName: fileMessage.fileName,
        fileUrl: fileMessage.fileUrl,
        timestamp: fileMessage.timestamp
      }
    });

  } catch (error) {
    console.error('Upload file error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Upload Voice Message to Order Chat
router.post('/orders/:orderId/chat/voice', authenticate, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;
    const { voiceUrl, voiceDuration } = req.body;

    // Validate required fields
    if (!voiceUrl) {
      return res.status(400).json({
        success: false,
        message: 'voiceUrl is required'
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
        message: 'Access denied'
      });
    }

    // Check if order is in pending or working status
    if (!['pending', 'working'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Voice upload is only available when order status is pending or working'
      });
    }

    // Get chat
    let chat = await OrderChat.findOne({ orderId });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found. Please send a message first.'
      });
    }

    // Check if admin has replied (required for voice upload after first voice message)
    // But allow first voice message without admin reply
    const hasVoiceMessage = chat.messages.some(msg => 
      msg.messageType === 'voice' && msg.senderId === userId && !msg.isDeleted
    );

    if (hasVoiceMessage && !chat.adminHasReplied) {
      return res.status(403).json({
        success: false,
        message: 'You can only upload additional voice messages after an admin has replied'
      });
    }

    // Check if chat is blocked
    if (chat.settings.blocked) {
      return res.status(403).json({
        success: false,
        message: 'Chat is blocked by admin'
      });
    }

    // Generate message ID
    const messageId = OrderChat.generateMessageId();

    // Create voice message
    const voiceMessage = {
      messageId,
      senderId: user.userId,
      senderType: user.accountType === 'agency' ? 'agency' : 'user',
      senderName: user.fullName,
      messageType: 'voice',
      voiceUrl: voiceUrl,
      voiceDuration: voiceDuration || 0,
      timestamp: new Date(),
      readBy: [],
      isDeleted: false
    };

    chat.messages.push(voiceMessage);
    await chat.save();

    res.status(201).json({
      success: true,
      message: 'Voice message uploaded successfully',
      data: {
        messageId: voiceMessage.messageId,
        voiceUrl: voiceMessage.voiceUrl,
        voiceDuration: voiceMessage.voiceDuration,
        timestamp: voiceMessage.timestamp
      }
    });

  } catch (error) {
    console.error('Upload voice error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// ==========================================
// ADMIN ORDER CHAT ROUTES
// ==========================================

// Get All Order Chats (Admin)
router.get('/admin/orders/chats', authenticateAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      orderId,
      status,
      assignedToMe
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    const adminEmail = req.admin.email;

    // Build query
    const query = {};

    // Filter by orderId
    if (orderId) {
      query.orderId = orderId;
    }

    // Filter by assigned admin
    if (assignedToMe === 'true') {
      query['assignedAdmin.adminId'] = adminEmail;
    } else if (assignedToMe === 'false') {
      query.$or = [
        { 'assignedAdmin.adminId': { $exists: false } },
        { 'assignedAdmin.adminId': null },
        { 'assignedAdmin.adminId': { $ne: adminEmail } }
      ];
    }

    // Filter by order status
    if (status) {
      const orders = await Order.find({ status }).select('orderId');
      const orderIds = orders.map(o => o.orderId);
      query.orderId = { $in: orderIds };
    }

    // Get total count
    const total = await OrderChat.countDocuments(query);

    // Get chats with populated order info
    const chats = await OrderChat.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Enrich with order info
    const enrichedChats = await Promise.all(chats.map(async (chat) => {
      const order = await Order.findOne({ orderId: chat.orderId }).select('orderId serviceName status');
      return {
        ...chat.toObject(),
        order: order || null
      };
    }));

    res.json({
      success: true,
      data: {
        chats: enrichedChats,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Get all chats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get Single Order Chat (Admin)
router.get('/admin/orders/:orderId/chat', authenticateAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;

    // Verify order exists
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order is in pending or working status
    if (!['pending', 'working'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order chat is only available when order status is pending or working'
      });
    }

    // Get chat
    const chat = await OrderChat.findOne({ orderId });

    if (!chat) {
      return res.json({
        success: true,
        data: {
          orderId,
          order: {
            orderId: order.orderId,
            serviceName: order.serviceName,
            status: order.status
          },
          messages: [],
          assignedAdmin: null,
          settings: {
            messageEnabled: true,
            callEnabled: true,
            blocked: false,
            messageExpirationDays: 7
          },
          adminHasReplied: false
        }
      });
    }

    // Filter out deleted messages
    const activeMessages = chat.messages.filter(msg => !msg.isDeleted);

    res.json({
      success: true,
      data: {
        orderId: chat.orderId,
        order: {
          orderId: order.orderId,
          serviceName: order.serviceName,
          status: order.status
        },
        messages: activeMessages,
        assignedAdmin: chat.assignedAdmin,
        settings: chat.settings,
        adminHasReplied: chat.adminHasReplied,
        participant: chat.participant
      }
    });

  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Admin Reply to Order Chat
router.post('/admin/orders/:orderId/chat/messages', authenticateAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const adminEmail = req.admin.email;
    const adminName = req.admin.fullName || adminEmail;
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
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

    // Check if order is in pending or working status
    if (!['pending', 'working'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order chat is only available when order status is pending or working'
      });
    }

    // Get chat
    let chat = await OrderChat.findOne({ orderId });

    if (!chat) {
      // Create chat if it doesn't exist
      const user = await User.findOne({ userId: order.createdBy.userId });
      chat = await OrderChat.create({
        orderId,
        messages: [],
        participant: {
          userId: order.createdBy.userId,
          accountType: order.createdBy.accountType,
          fullName: order.createdBy.fullName,
          email: order.createdBy.email,
          phone: order.createdBy.phone
        },
        settings: {
          messageEnabled: true,
          callEnabled: true,
          blocked: false,
          messageExpirationDays: 7
        },
        adminHasReplied: false
      });
    }

    // Generate message ID
    const messageId = OrderChat.generateMessageId();

    // Create admin message
    const adminMessage = {
      messageId,
      senderId: adminEmail,
      senderType: req.admin.role === 'admin' ? 'admin' : 'sub-admin',
      senderName: adminName,
      messageType: 'text',
      content: message,
      timestamp: new Date(),
      readBy: [],
      isDeleted: false
    };

    // Add message
    chat.messages.push(adminMessage);

    // Mark that admin has replied
    chat.adminHasReplied = true;
    chat.firstAdminReplyAt = chat.firstAdminReplyAt || new Date();

    // Assign this admin to the chat
    chat.assignedAdmin = {
      adminId: adminEmail,
      adminName: adminName,
      assignedAt: new Date(),
      lastActiveAt: new Date()
    };

    await chat.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        messageId: adminMessage.messageId,
        orderId: orderId,
        timestamp: adminMessage.timestamp,
        assignedTo: adminEmail
      }
    });

  } catch (error) {
    console.error('Admin reply error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Update Admin Last Active Time
router.patch('/admin/orders/:orderId/chat/activity', authenticateAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const adminEmail = req.admin.email;

    const chat = await OrderChat.findOne({ orderId });

    if (!chat || !chat.assignedAdmin || chat.assignedAdmin.adminId !== adminEmail) {
      return res.status(403).json({
        success: false,
        message: 'You are not assigned to this chat'
      });
    }

    chat.assignedAdmin.lastActiveAt = new Date();
    await chat.save();

    res.json({
      success: true,
      message: 'Activity updated'
    });

  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Block/Unblock User in Order Chat
router.patch('/admin/orders/:orderId/chat/block', authenticateAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { blocked, reason } = req.body;
    const adminEmail = req.admin.email;

    if (typeof blocked !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'blocked field must be a boolean'
      });
    }

    const chat = await OrderChat.findOne({ orderId });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    chat.settings.blocked = blocked;
    if (blocked) {
      chat.settings.blockedBy = adminEmail;
      chat.settings.blockedAt = new Date();
      chat.settings.blockReason = reason || 'Blocked by admin';
    } else {
      chat.settings.blockedBy = null;
      chat.settings.blockedAt = null;
      chat.settings.blockReason = null;
    }

    await chat.save();

    res.json({
      success: true,
      message: `Chat ${blocked ? 'blocked' : 'unblocked'} successfully`,
      data: {
        blocked: chat.settings.blocked,
        reason: chat.settings.blockReason
      }
    });

  } catch (error) {
    console.error('Block chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Toggle Message/Call Settings
router.patch('/admin/orders/:orderId/chat/settings', authenticateAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { messageEnabled, callEnabled } = req.body;

    const chat = await OrderChat.findOne({ orderId });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    if (typeof messageEnabled === 'boolean') {
      chat.settings.messageEnabled = messageEnabled;
    }

    if (typeof callEnabled === 'boolean') {
      chat.settings.callEnabled = callEnabled;
    }

    await chat.save();

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: {
        messageEnabled: chat.settings.messageEnabled,
        callEnabled: chat.settings.callEnabled
      }
    });

  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Set Custom Message Expiration
router.patch('/admin/orders/:orderId/chat/expiration', authenticateAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { messageExpirationDays } = req.body;

    if (!messageExpirationDays || messageExpirationDays < 1) {
      return res.status(400).json({
        success: false,
        message: 'messageExpirationDays must be a number greater than 0'
      });
    }

    const chat = await OrderChat.findOne({ orderId });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    chat.settings.messageExpirationDays = messageExpirationDays;
    // Update expiresAt based on new expiration days
    const expirationDays = messageExpirationDays;
    chat.expiresAt = new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000);

    await chat.save();

    res.json({
      success: true,
      message: 'Message expiration updated successfully',
      data: {
        messageExpirationDays: chat.settings.messageExpirationDays,
        expiresAt: chat.expiresAt
      }
    });

  } catch (error) {
    console.error('Update expiration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;

