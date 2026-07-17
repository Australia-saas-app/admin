const express = require('express');
const router = express.Router();
const AgencyChat = require('../models/AgencyChat');
const User = require('../models/User');
const { authenticate, authenticateAdmin } = require('../middleware/auth');

// ==========================================
// AGENCY CHAT ROUTES
// ==========================================

// Start Agency Chat (Agency only)
router.post('/agency/chat/start', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findOne({ userId });

    if (!user || user.accountType !== 'agency') {
      return res.status(403).json({
        success: false,
        message: 'Only agencies can start agency chat'
      });
    }

    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Agency must be active to start chat'
      });
    }

    // Check existing active chat
    const existingChat = await AgencyChat.findOne({
      agencyId: user.userId,
      status: 'active'
    });

    if (existingChat) {
      return res.json({
        success: true,
        message: 'Existing chat found',
        data: {
          chatId: existingChat.chatId,
          messageCount: existingChat.messages.length
        }
      });
    }

    // Create new chat
    const chatId = AgencyChat.generateChatId();
    const chat = await AgencyChat.create({
      chatId,
      agencyId: user.userId,
      agencyInfo: {
        agencyName: user.agencyInfo?.agencyName || user.fullName,
        email: user.email,
        phone: user.phone,
        logo: user.agencyInfo?.agencyLogo
      },
      status: 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Agency chat started successfully',
      data: {
        chatId: chat.chatId,
        assignedAdmin: null
      }
    });

  } catch (error) {
    console.error('Start agency chat error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Send Message (Agency)
router.post('/agency/chat/:chatId/messages', authenticate, async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.userId;
    const { message, messageType, file, voice, callDuration } = req.body;

    const user = await User.findOne({ userId });
    if (user.accountType !== 'agency' || user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Only active agencies can send messages'
      });
    }

    const chat = await AgencyChat.findOne({ chatId, agencyId: userId });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    if (chat.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Chat is not active'
      });
    }

    if (chat.settings.blocked || !chat.settings.messageEnabled) {
      return res.status(403).json({
        success: false,
        message: 'You cannot send messages in this chat'
      });
    }

    // Check restrictions
    const msgType = messageType || 'text';
    if (msgType === 'file' && !chat.settings.fileUploadEnabled) {
      return res.status(403).json({
        success: false,
        message: 'File upload requires admin reply first'
      });
    }
    if (msgType === 'voice' && !chat.settings.voiceUploadEnabled) {
      return res.status(403).json({
        success: false,
        message: 'Voice upload requires admin reply first'
      });
    }
    if (msgType === 'call' && !chat.settings.callEnabled) {
      return res.status(403).json({
        success: false,
        message: 'Calling requires admin reply first'
      });
    }

    const messageId = AgencyChat.generateMessageId();
    const newMessage = {
      messageId,
      senderId: user.userId,
      senderType: 'agency',
      senderName: user.agencyInfo?.agencyName || user.fullName,
      messageType: msgType,
      content: msgType === 'text' ? message : undefined,
      file: msgType === 'file' && file ? file : undefined,
      voice: msgType === 'voice' && voice ? voice : undefined,
      callDuration: msgType === 'call' ? callDuration : undefined,
      sentAt: new Date(),
      isRead: false,
      isDeleted: false
    };

    chat.messages.push(newMessage);

    // Reset assigned admin if offline for 10+ minutes
    if (chat.assignedAdmin && chat.assignedAdmin.lastActiveAt) {
      const minutesSinceActive = (Date.now() - chat.assignedAdmin.lastActiveAt.getTime()) / (1000 * 60);
      if (minutesSinceActive >= 10) {
        chat.assignedAdmin = null;
      }
    }

    await chat.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        messageId: newMessage.messageId,
        sentAt: newMessage.sentAt
      }
    });

  } catch (error) {
    console.error('Send agency message error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Get Agency Chat Messages
router.get('/agency/chat/:chatId/messages', authenticate, async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.userId;

    const user = await User.findOne({ userId });
    if (user.accountType !== 'agency') {
      return res.status(403).json({
        success: false,
        message: 'Only agencies can access this chat'
      });
    }

    const chat = await AgencyChat.findOne({ chatId, agencyId: userId });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    res.json({
      success: true,
      data: {
        chatId: chat.chatId,
        assignedAdmin: chat.assignedAdmin,
        messages: chat.messages.filter(m => !m.isDeleted),
        settings: chat.settings,
        status: chat.status,
        adminHasReplied: chat.adminHasReplied
      }
    });

  } catch (error) {
    console.error('Get agency messages error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// ==========================================
// ADMIN AGENCY CHAT ROUTES
// ==========================================

// Get All Agency Chats (Admin)
router.get('/admin/agency/chat', authenticateAdmin, async (req, res) => {
  try {
    const {
      status,
      agencyId,
      page = 1,
      limit = 20
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const query = {};
    if (status && status !== 'all') query.status = status;
    if (agencyId) query.agencyId = agencyId;

    // Filter by assigned admin for sub-admins
    const adminEmail = req.admin.email;
    if (req.admin.role === 'sub-admin') {
      query['assignedAdmin.adminId'] = adminEmail;
    } else if (req.query.assignedTo === 'me') {
      query['assignedAdmin.adminId'] = adminEmail;
    } else if (req.query.assignedTo === 'unassigned') {
      query.$or = [
        { 'assignedAdmin': null },
        { 'assignedAdmin': { $exists: false } }
      ];
    }

    const total = await AgencyChat.countDocuments(query);
    const chats = await AgencyChat.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      data: {
        chats,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Get agency chats error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Admin Reply to Agency Chat
router.post('/admin/agency/chat/:chatId/messages', authenticateAdmin, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message } = req.body;
    const adminEmail = req.admin.email;
    const adminName = req.admin.fullName || req.admin.email;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const chat = await AgencyChat.findOne({ chatId });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    const messageId = AgencyChat.generateMessageId();
    const adminMessage = {
      messageId,
      senderId: adminEmail,
      senderType: req.admin.role,
      senderName: adminName,
      messageType: 'text',
      content: message,
      sentAt: new Date(),
      isRead: false,
      isDeleted: false
    };

    chat.messages.push(adminMessage);
    chat.adminHasReplied = true;
    chat.firstAdminReplyAt = chat.firstAdminReplyAt || new Date();

    chat.assignedAdmin = {
      adminId: adminEmail,
      adminName: adminName,
      role: req.admin.role,
      assignedAt: chat.assignedAdmin?.assignedAt || new Date(),
      lastActiveAt: new Date()
    };

    // Enable features after admin reply
    chat.settings.callEnabled = true;
    chat.settings.fileUploadEnabled = true;
    chat.settings.voiceUploadEnabled = true;

    await chat.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        messageId: adminMessage.messageId,
        assignedTo: adminEmail
      }
    });

  } catch (error) {
    console.error('Admin agency reply error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Update Admin Activity
router.patch('/admin/agency/chat/:chatId/activity', authenticateAdmin, async (req, res) => {
  try {
    const { chatId } = req.params;
    const adminEmail = req.admin.email;

    const chat = await AgencyChat.findOne({ chatId });
    if (!chat || chat.assignedAdmin?.adminId !== adminEmail) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found or not assigned to you'
      });
    }

    chat.assignedAdmin.lastActiveAt = new Date();
    await chat.save();

    res.json({
      success: true,
      message: 'Activity updated'
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Block/Unblock Agency (Admin)
router.patch('/admin/agency/chat/:chatId/block', authenticateAdmin, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { blocked, reason } = req.body;
    const adminEmail = req.admin.email;

    if (typeof blocked !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'blocked must be a boolean'
      });
    }

    const chat = await AgencyChat.findOne({ chatId });
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
      message: `Agency ${blocked ? 'blocked' : 'unblocked'} successfully`,
      data: chat.settings
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Toggle Message/Call Settings (Admin)
router.patch('/admin/agency/chat/:chatId/settings', authenticateAdmin, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { messageEnabled, callEnabled } = req.body;

    const chat = await AgencyChat.findOne({ chatId });
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
      data: chat.settings
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Set Message Expiration (Admin)
router.patch('/admin/agency/chat/:chatId/expiration', authenticateAdmin, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { expirationDays } = req.body;

    if (!expirationDays || expirationDays < 1) {
      return res.status(400).json({
        success: false,
        message: 'expirationDays must be at least 1'
      });
    }

    const chat = await AgencyChat.findOne({ chatId });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    chat.settings.messageExpirationDays = parseInt(expirationDays);
    await chat.save();

    res.json({
      success: true,
      message: 'Message expiration updated successfully',
      data: {
        expirationDays: chat.settings.messageExpirationDays
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Forward Agency Chat (Admin)
router.post('/admin/agency/chat/:chatId/forward', authenticateAdmin, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { targetAdminId } = req.body;
    const adminEmail = req.admin.email;

    if (!targetAdminId) {
      return res.status(400).json({
        success: false,
        message: 'targetAdminId is required'
      });
    }

    const chat = await AgencyChat.findOne({ chatId });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    const Admin = require('../models/Admin');
    const targetAdmin = await Admin.findOne({ email: targetAdminId });
    if (!targetAdmin) {
      return res.status(404).json({
        success: false,
        message: 'Target admin not found'
      });
    }

    chat.forwardedTo.push({
      adminId: targetAdminId,
      adminName: targetAdmin.fullName || targetAdminId,
      forwardedAt: new Date(),
      forwardedBy: adminEmail
    });

    chat.assignedAdmin = {
      adminId: targetAdminId,
      adminName: targetAdmin.fullName || targetAdminId,
      role: targetAdmin.role,
      assignedAt: new Date(),
      lastActiveAt: new Date()
    };

    await chat.save();

    res.json({
      success: true,
      message: 'Chat forwarded successfully',
      data: {
        forwardedTo: targetAdminId
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

module.exports = router;

