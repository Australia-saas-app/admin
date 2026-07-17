const express = require('express');
const router = express.Router();
const LiveChat = require('../models/LiveChat');
const ChatTopic = require('../models/ChatTopic');
const User = require('../models/User');
const { authenticate, authenticateAdmin } = require('../middleware/auth');

// ==========================================
// USER/AGENCY LIVE CHAT ROUTES
// ==========================================

// Get Available Topics (Public)
router.get('/chat/topics', async (req, res) => {
  try {
    const topics = await ChatTopic.find({ isActive: true })
      .sort({ displayOrder: 1, name: 1 })
      .select('topicId name description');

    res.json({
      success: true,
      data: topics
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Start Live Chat (User/Agency)
router.post('/chat/start', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { topicId, topic } = req.body;

    if (!topic && !topicId) {
      return res.status(400).json({
        success: false,
        message: 'Topic or topicId is required'
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

    // Get topic
    let chatTopic = null;
    if (topicId) {
      chatTopic = await ChatTopic.findOne({ topicId });
      if (!chatTopic) {
        return res.status(404).json({
          success: false,
          message: 'Topic not found'
        });
      }
    } else {
      // Find topic by name or create new
      chatTopic = await ChatTopic.findOne({ name: topic });
      if (!chatTopic) {
        // Create topic (admin will manage later)
        const newTopicId = ChatTopic.generateTopicId();
        chatTopic = await ChatTopic.create({
          topicId: newTopicId,
          name: topic,
          isActive: true,
          createdBy: 'system'
        });
      }
    }

    // Check if user has existing active chat
    const existingChat = await LiveChat.findOne({
      userId,
      status: 'active'
    });

    if (existingChat) {
      return res.json({
        success: true,
        message: 'Existing chat found',
        data: {
          chatId: existingChat.chatId,
          topic: existingChat.topic,
          assignedAdmin: existingChat.assignedAdmin,
          messageCount: existingChat.messages.length
        }
      });
    }

    // Create new chat
    const chatId = LiveChat.generateChatId();
    const chat = await LiveChat.create({
      chatId,
      topic: chatTopic.name,
      topicId: chatTopic._id,
      userId: user.userId,
      userType: user.accountType || 'user',
      userInfo: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        profilePhoto: user.accountType === 'agency' ? user.agencyInfo?.agencyLogo : user.profilePhoto,
        accountType: user.accountType
      },
      lastUserActivityAt: new Date(),
      status: 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Chat started successfully',
      data: {
        chatId: chat.chatId,
        topic: chat.topic,
        assignedAdmin: null // Available to all admins initially
      }
    });

  } catch (error) {
    console.error('Start chat error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Send Message (User/Agency)
router.post('/chat/:chatId/messages', authenticate, async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.userId;
    const { message, messageType, file, voice, callDuration } = req.body;

    const chat = await LiveChat.findOne({ chatId, userId });
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

    if (chat.settings.blocked) {
      return res.status(403).json({
        success: false,
        message: 'You have been blocked from this chat'
      });
    }

    if (!chat.settings.messageEnabled) {
      return res.status(403).json({
        success: false,
        message: 'Messaging is disabled for this chat'
      });
    }

    // Check restrictions for file/voice/call
    const msgType = messageType || 'text';
    if (msgType === 'file' && !chat.settings.fileUploadEnabled) {
      return res.status(403).json({
        success: false,
        message: 'File upload is not enabled. Admin must reply first.'
      });
    }
    if (msgType === 'voice' && !chat.settings.voiceUploadEnabled) {
      return res.status(403).json({
        success: false,
        message: 'Voice upload is not enabled. Admin must reply first.'
      });
    }
    if (msgType === 'call' && !chat.settings.callEnabled) {
      return res.status(403).json({
        success: false,
        message: 'Calling is not enabled. Admin must reply first.'
      });
    }

    const user = await User.findOne({ userId });
    const messageId = LiveChat.generateMessageId();

    const newMessage = {
      messageId,
      senderId: user.userId,
      senderType: user.accountType === 'agency' ? 'agency' : 'user',
      senderName: user.fullName,
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
    chat.lastUserActivityAt = new Date();
    
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
    console.error('Send message error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Get Chat Messages (User/Agency)
router.get('/chat/:chatId/messages', authenticate, async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.userId;

    const chat = await LiveChat.findOne({ chatId, userId });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check 15-minute offline timer
    const minutesSinceActivity = (Date.now() - chat.lastUserActivityAt.getTime()) / (1000 * 60);
    if (minutesSinceActivity >= 15 && chat.status === 'active') {
      // Delete messages but keep chat record
      chat.messages = [];
      chat.status = 'ended';
      await chat.save();
    } else {
      // Update last activity
      chat.lastUserActivityAt = new Date();
      await chat.save();
    }

    res.json({
      success: true,
      data: {
        chatId: chat.chatId,
        topic: chat.topic,
        assignedAdmin: chat.assignedAdmin,
        messages: chat.messages.filter(m => !m.isDeleted),
        settings: chat.settings,
        status: chat.status,
        adminHasReplied: chat.adminHasReplied
      }
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Submit Rating (User/Agency)
router.post('/chat/:chatId/rating', authenticate, async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.userId;
    const { rating } = req.body; // 'yes' or 'no'

    if (!['yes', 'no'].includes(rating)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be "yes" or "no"'
      });
    }

    const chat = await LiveChat.findOne({ chatId, userId });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    if (chat.rating) {
      return res.status(400).json({
        success: false,
        message: 'Rating already submitted'
      });
    }

    // Only 'yes' counts as positive rating
    chat.rating = rating === 'yes' ? 'yes' : 'no';
    chat.ratingSubmittedAt = new Date();
    chat.status = 'ended';

    await chat.save();

    res.json({
      success: true,
      message: 'Rating submitted successfully',
      data: {
        rating: chat.rating,
        counted: rating === 'yes' // Only yes counts
      }
    });

  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// ==========================================
// ADMIN LIVE CHAT ROUTES
// ==========================================

// Get All Live Chats (Admin)
router.get('/admin/chat', authenticateAdmin, async (req, res) => {
  try {
    const {
      status,
      topicId,
      assignedTo,
      page = 1,
      limit = 20
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (topicId) {
      query.topicId = topicId;
    }

    // Filter by assigned admin
    const adminEmail = req.admin.email;
    const isSubAdmin = req.admin.role === 'sub-admin';

    if (isSubAdmin) {
      // Sub-admins can only see chats assigned to them or their assigned topics
      const topics = await ChatTopic.find({
        'assignedSubAdmins.adminId': adminEmail
      });
      const topicIds = topics.map(t => t._id);

      query.$or = [
        { 'assignedAdmin.adminId': adminEmail },
        { topicId: { $in: topicIds } }
      ];
    } else if (assignedTo === 'me') {
      query['assignedAdmin.adminId'] = adminEmail;
    } else if (assignedTo === 'unassigned') {
      query.$or = [
        { 'assignedAdmin': null },
        { 'assignedAdmin': { $exists: false } }
      ];
    }

    const total = await LiveChat.countDocuments(query);
    const chats = await LiveChat.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('topicId', 'name description');

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
    console.error('Get chats error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Get Single Live Chat (Admin)
router.get('/admin/chat/:chatId', authenticateAdmin, async (req, res) => {
  try {
    const { chatId } = req.params;
    const adminEmail = req.admin.email;
    const isSubAdmin = req.admin.role === 'sub-admin';

    const chat = await LiveChat.findOne({ chatId }).populate('topicId', 'name description');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check permissions for sub-admin
    if (isSubAdmin) {
      const topic = await ChatTopic.findOne({ _id: chat.topicId });
      const hasAccess = topic?.assignedSubAdmins.some(sub => sub.adminId === adminEmail) ||
                        chat.assignedAdmin?.adminId === adminEmail;

      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. This topic is not assigned to you.'
        });
      }
    }

    res.json({
      success: true,
      data: chat
    });

  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Admin Reply to Live Chat
router.post('/admin/chat/:chatId/messages', authenticateAdmin, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message } = req.body;
    const adminEmail = req.admin.email;
    const adminName = req.admin.fullName || req.admin.email;
    const adminRole = req.admin.role;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const chat = await LiveChat.findOne({ chatId });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check permissions for sub-admin
    if (adminRole === 'sub-admin') {
      const topic = await ChatTopic.findOne({ _id: chat.topicId });
      const hasAccess = topic?.assignedSubAdmins.some(sub => sub.adminId === adminEmail);

      if (!hasAccess && chat.assignedAdmin?.adminId !== adminEmail) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. This topic is not assigned to you.'
        });
      }
    }

    const messageId = LiveChat.generateMessageId();
    const adminMessage = {
      messageId,
      senderId: adminEmail,
      senderType: adminRole,
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

    // Assign admin to chat
    chat.assignedAdmin = {
      adminId: adminEmail,
      adminName: adminName,
      role: adminRole,
      assignedAt: chat.assignedAdmin?.assignedAt || new Date(),
      lastActiveAt: new Date()
    };

    // Enable file/voice/call after admin replies
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
    console.error('Admin reply error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Update Admin Activity (prevents auto-unassignment)
router.patch('/admin/chat/:chatId/activity', authenticateAdmin, async (req, res) => {
  try {
    const { chatId } = req.params;
    const adminEmail = req.admin.email;

    const chat = await LiveChat.findOne({ chatId });
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

// Block/Unblock User in Live Chat (Admin)
router.patch('/admin/chat/:chatId/block', authenticateAdmin, async (req, res) => {
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

    const chat = await LiveChat.findOne({ chatId });
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
      message: `User ${blocked ? 'blocked' : 'unblocked'} successfully`,
      data: chat.settings
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Toggle Message/Call Settings (Admin)
router.patch('/admin/chat/:chatId/settings', authenticateAdmin, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { messageEnabled, callEnabled } = req.body;

    const chat = await LiveChat.findOne({ chatId });
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

// Forward Chat to Another Admin (Admin)
router.post('/admin/chat/:chatId/forward', authenticateAdmin, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { targetAdminId } = req.body;
    const adminEmail = req.admin.email;
    const adminName = req.admin.fullName || req.admin.email;

    if (!targetAdminId) {
      return res.status(400).json({
        success: false,
        message: 'targetAdminId is required'
      });
    }

    const chat = await LiveChat.findOne({ chatId });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Get target admin
    const Admin = require('../models/Admin');
    const targetAdmin = await Admin.findOne({ email: targetAdminId });
    if (!targetAdmin) {
      return res.status(404).json({
        success: false,
        message: 'Target admin not found'
      });
    }

    // Add to forwarded list
    chat.forwardedTo.push({
      adminId: targetAdminId,
      adminName: targetAdmin.fullName || targetAdminId,
      forwardedAt: new Date(),
      forwardedBy: adminEmail
    });

    // Reassign to target admin
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
        forwardedTo: targetAdminId,
        assignedAdmin: chat.assignedAdmin
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

module.exports = router;

