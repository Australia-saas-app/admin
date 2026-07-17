const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const ChatTopic = require('../models/ChatTopic');
const PredefinedMessage = require('../models/PredefinedMessage');
const User = require('../models/User');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');
const { authenticateAdmin } = require('../middleware/auth');
const bcrypt = require('bcrypt');

// ==========================================
// ADMIN SETTINGS
// ==========================================

// Change Admin Password
router.patch('/admin/settings/password', authenticateAdmin, async (req, res) => {
  try {
    const adminEmail = req.admin.email;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Old password, new password, and confirm password are required'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirm password do not match'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long'
      });
    }

    const admin = await Admin.findOne({ email: adminEmail });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Verify old password
    const isMatch = await admin.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Old password is incorrect'
      });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// ==========================================
// SUB-ADMIN MANAGEMENT
// ==========================================

// Get All Admins/Sub-Admins
router.get('/admin/admins', authenticateAdmin, async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const query = {};
    if (role && role !== 'all') {
      query.role = role;
    }

    const total = await Admin.countDocuments(query);
    const admins = await Admin.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      data: {
        admins,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Create Sub-Admin (Main Admin only)
router.post('/admin/admins', authenticateAdmin, async (req, res) => {
  try {
    if (req.admin.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only main admins can create sub-admins'
      });
    }

    const { email, password, fullName, role, permissions } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and full name are required'
      });
    }

    // Check if admin exists
    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists'
      });
    }

    // Create sub-admin (role defaults to 'sub-admin')
    const newAdmin = await Admin.create({
      email: email.toLowerCase(),
      password,
      fullName,
      role: role === 'admin' ? 'admin' : 'sub-admin',
      permissions: permissions || []
    });

    res.status(201).json({
      success: true,
      message: 'Sub-admin created successfully',
      data: {
        email: newAdmin.email,
        fullName: newAdmin.fullName,
        role: newAdmin.role,
        permissions: newAdmin.permissions
      }
    });

  } catch (error) {
    console.error('Create sub-admin error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Update Sub-Admin (Main Admin only)
router.patch('/admin/admins/:adminEmail', authenticateAdmin, async (req, res) => {
  try {
    if (req.admin.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only main admins can update sub-admins'
      });
    }

    const { adminEmail } = req.params;
    const updateData = req.body;

    // Don't allow changing main admin's role
    if (updateData.role && adminEmail === req.admin.email) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own role'
      });
    }

    delete updateData.email; // Email cannot be changed
    delete updateData.password; // Use separate endpoint for password

    const admin = await Admin.findOneAndUpdate(
      { email: adminEmail },
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.json({
      success: true,
      message: 'Admin updated successfully',
      data: admin
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Delete Sub-Admin (Main Admin only)
router.delete('/admin/admins/:adminEmail', authenticateAdmin, async (req, res) => {
  try {
    if (req.admin.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only main admins can delete sub-admins'
      });
    }

    const { adminEmail } = req.params;

    if (adminEmail === req.admin.email) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    const admin = await Admin.findOneAndDelete({ email: adminEmail });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.json({
      success: true,
      message: 'Sub-admin deleted successfully'
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// ==========================================
// CHAT TOPIC MANAGEMENT
// ==========================================

// Get All Chat Topics (Admin)
router.get('/admin/chat/topics', authenticateAdmin, async (req, res) => {
  try {
    const { isActive } = req.query;
    const query = {};
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const topics = await ChatTopic.find(query)
      .sort({ displayOrder: 1, name: 1 });

    res.json({
      success: true,
      data: topics
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Create Chat Topic (Admin)
router.post('/admin/chat/topics', authenticateAdmin, async (req, res) => {
  try {
    const adminEmail = req.admin.email;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Topic name is required'
      });
    }

    // Check if topic exists
    const existing = await ChatTopic.findOne({ name });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Topic already exists'
      });
    }

    const topicId = ChatTopic.generateTopicId();
    const topic = await ChatTopic.create({
      topicId,
      name,
      description: description || '',
      createdBy: adminEmail,
      updatedBy: adminEmail
    });

    res.status(201).json({
      success: true,
      message: 'Chat topic created successfully',
      data: topic
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Update Chat Topic (Admin)
router.patch('/admin/chat/topics/:topicId', authenticateAdmin, async (req, res) => {
  try {
    const { topicId } = req.params;
    const adminEmail = req.admin.email;
    const updateData = req.body;

    delete updateData.topicId;
    delete updateData.createdAt;
    updateData.updatedBy = adminEmail;

    const topic = await ChatTopic.findOneAndUpdate(
      { topicId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    res.json({
      success: true,
      message: 'Topic updated successfully',
      data: topic
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Assign Topic to Sub-Admin (Admin)
router.post('/admin/chat/topics/:topicId/assign', authenticateAdmin, async (req, res) => {
  try {
    if (req.admin.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only main admins can assign topics'
      });
    }

    const { topicId } = req.params;
    const { subAdminId } = req.body;
    const adminEmail = req.admin.email;

    if (!subAdminId) {
      return res.status(400).json({
        success: false,
        message: 'subAdminId is required'
      });
    }

    const topic = await ChatTopic.findOne({ topicId });
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    // Verify sub-admin exists
    const subAdmin = await Admin.findOne({ email: subAdminId, role: 'sub-admin' });
    if (!subAdmin) {
      return res.status(404).json({
        success: false,
        message: 'Sub-admin not found'
      });
    }

    // Check if already assigned
    const alreadyAssigned = topic.assignedSubAdmins.some(sub => sub.adminId === subAdminId);
    if (alreadyAssigned) {
      return res.status(400).json({
        success: false,
        message: 'Topic already assigned to this sub-admin'
      });
    }

    // Add assignment
    topic.assignedSubAdmins.push({
      adminId: subAdminId,
      adminName: subAdmin.fullName || subAdminId,
      assignedAt: new Date(),
      assignedBy: adminEmail
    });

    topic.updatedBy = adminEmail;
    await topic.save();

    res.json({
      success: true,
      message: 'Topic assigned to sub-admin successfully',
      data: topic
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Unassign Topic from Sub-Admin (Admin)
router.delete('/admin/chat/topics/:topicId/assign/:subAdminId', authenticateAdmin, async (req, res) => {
  try {
    if (req.admin.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only main admins can unassign topics'
      });
    }

    const { topicId, subAdminId } = req.params;

    const topic = await ChatTopic.findOne({ topicId });
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    topic.assignedSubAdmins = topic.assignedSubAdmins.filter(sub => sub.adminId !== subAdminId);
    topic.updatedBy = req.admin.email;
    await topic.save();

    res.json({
      success: true,
      message: 'Topic unassigned successfully',
      data: topic
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Delete Chat Topic (Admin)
router.delete('/admin/chat/topics/:topicId', authenticateAdmin, async (req, res) => {
  try {
    const { topicId } = req.params;

    const topic = await ChatTopic.findOneAndDelete({ topicId });
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    res.json({
      success: true,
      message: 'Topic deleted successfully'
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// ==========================================
// PREDEFINED MESSAGES
// ==========================================

// Get All Predefined Messages (Admin)
router.get('/admin/chat/predefined-messages', authenticateAdmin, async (req, res) => {
  try {
    const { category, page = 1, limit = 50 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const query = {};
    if (category && category !== 'all') {
      query.category = category;
    }

    const total = await PredefinedMessage.countDocuments(query);
    const messages = await PredefinedMessage.find(query)
      .sort({ usageCount: -1, lastUsedAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Create Predefined Message (Admin)
router.post('/admin/chat/predefined-messages', authenticateAdmin, async (req, res) => {
  try {
    const adminEmail = req.admin.email;
    const { title, message, category } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required'
      });
    }

    const messageId = PredefinedMessage.generateMessageId();
    const predefinedMessage = await PredefinedMessage.create({
      messageId,
      title,
      message,
      category: category || 'general',
      createdBy: adminEmail,
      updatedBy: adminEmail
    });

    res.status(201).json({
      success: true,
      message: 'Predefined message created successfully',
      data: predefinedMessage
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Update Predefined Message (Admin)
router.patch('/admin/chat/predefined-messages/:messageId', authenticateAdmin, async (req, res) => {
  try {
    const { messageId } = req.params;
    const adminEmail = req.admin.email;
    const updateData = req.body;

    delete updateData.messageId;
    delete updateData.createdAt;
    delete updateData.usageCount;
    delete updateData.lastUsedAt;
    updateData.updatedBy = adminEmail;

    const predefinedMessage = await PredefinedMessage.findOneAndUpdate(
      { messageId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!predefinedMessage) {
      return res.status(404).json({
        success: false,
        message: 'Predefined message not found'
      });
    }

    res.json({
      success: true,
      message: 'Predefined message updated successfully',
      data: predefinedMessage
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Delete Predefined Message (Admin)
router.delete('/admin/chat/predefined-messages/:messageId', authenticateAdmin, async (req, res) => {
  try {
    const { messageId } = req.params;

    const predefinedMessage = await PredefinedMessage.findOneAndDelete({ messageId });
    if (!predefinedMessage) {
      return res.status(404).json({
        success: false,
        message: 'Predefined message not found'
      });
    }

    res.json({
      success: true,
      message: 'Predefined message deleted successfully'
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Use Predefined Message (Admin) - Increments usage count
router.post('/admin/chat/predefined-messages/:messageId/use', authenticateAdmin, async (req, res) => {
  try {
    const { messageId } = req.params;

    const predefinedMessage = await PredefinedMessage.findOne({ messageId });
    if (!predefinedMessage) {
      return res.status(404).json({
        success: false,
        message: 'Predefined message not found'
      });
    }

    predefinedMessage.usageCount = (predefinedMessage.usageCount || 0) + 1;
    predefinedMessage.lastUsedAt = new Date();
    await predefinedMessage.save();

    res.json({
      success: true,
      message: 'Predefined message usage tracked',
      data: {
        message: predefinedMessage.message,
        usageCount: predefinedMessage.usageCount
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// ==========================================
// ADMIN DASHBOARD ANALYTICS
// ==========================================

// Get Dashboard Analytics (Admin)
router.get('/admin/dashboard/analytics', authenticateAdmin, async (req, res) => {
  try {
    // Card Analytics
    const [
      totalUsers,
      activeUsers,
      totalAgencies,
      activeAgencies,
      totalProjects,
      deliveryProjects,
      canceledProjects,
      totalSecurityDeposit,
      totalPenalty,
      totalPayment,
      totalReturn,
      closedAccounts
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: 'active' }),
      User.countDocuments({ accountType: 'agency' }),
      User.countDocuments({ accountType: 'agency', status: 'active' }),
      Order.countDocuments(),
      Order.countDocuments({ status: 'delivery' }),
      Order.countDocuments({ status: 'cancel' }),
      Transaction.aggregate([
        { $match: { paymentType: 'security-deposit', status: 'succeeded' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).then(r => r[0]?.total || 0),
      Transaction.aggregate([
        { $match: { paymentType: 'penalty', status: 'succeeded' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).then(r => r[0]?.total || 0),
      Transaction.aggregate([
        { $match: { type: 'payment', status: 'succeeded' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).then(r => r[0]?.total || 0),
      Transaction.aggregate([
        { $match: { type: 'refund', status: 'succeeded' } },
        { $group: { _id: null, total: { $sum: '$refundAmount' } } }
      ]).then(r => r[0]?.total || 0),
      User.countDocuments({ status: 'closed' })
    ]);

    // Visitor Statistics (placeholder - would need analytics service)
    const visitorStats = {
      totalUsers,
      totalAgencies,
      newVisitors: 0, // Would come from analytics service
      returningVisitors: 0,
      lastMonthsVisitors: 0,
      averageDailyVisitors: 0
    };

    res.json({
      success: true,
      data: {
        cards: {
          totalUsers,
          totalActiveUsers: activeUsers,
          totalAgencies,
          totalActiveAgencies: activeAgencies,
          totalProjects,
          totalDeliveryProjects: deliveryProjects,
          totalCanceledProjects: canceledProjects,
          totalSecurityDeposit,
          totalPenalty,
          totalPayment,
          totalReturn,
          totalClosedAccounts: closedAccounts
        },
        visitorStatistics: visitorStats,
        trafficByDevice: [], // Would come from analytics service
        trafficByLocation: [] // Would come from analytics service
      }
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// ==========================================
// NOTIFICATIONS
// ==========================================

// Get All Notifications (Admin)
router.get('/admin/notifications', authenticateAdmin, async (req, res) => {
  try {
    const {
      type,
      isRead,
      priority,
      page = 1,
      limit = 20
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const query = {};
    const adminEmail = req.admin.email;

    // Filter by type
    if (type && type !== 'all') {
      query.type = type;
    }

    // Filter by read status
    if (isRead !== undefined) {
      if (isRead === 'true') {
        query.readBy = { $elemMatch: { adminId: adminEmail } };
      } else {
        query.$or = [
          { readBy: { $not: { $elemMatch: { adminId: adminEmail } } } },
          { readBy: [] }
        ];
      }
    }

    // Filter by priority
    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    // Target filter
    if (req.admin.role === 'sub-admin') {
      query.$or = [
        { target: 'all-sub-admins' },
        { target: 'specific-sub-admin', targetAdminId: adminEmail },
        { target: 'all-admins' }
      ];
    }

    const total = await Notification.countDocuments(query);
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Mark Notification as Read (Admin)
router.patch('/admin/notifications/:notificationId/read', authenticateAdmin, async (req, res) => {
  try {
    const { notificationId } = req.params;
    const adminEmail = req.admin.email;

    const notification = await Notification.findOne({ notificationId });
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if already read by this admin
    const alreadyRead = notification.readBy.some(r => r.adminId === adminEmail);
    if (!alreadyRead) {
      notification.readBy.push({
        adminId: adminEmail,
        readAt: new Date()
      });
      await notification.save();
    }

    res.json({
      success: true,
      message: 'Notification marked as read'
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Mark All Notifications as Read (Admin)
router.patch('/admin/notifications/read-all', authenticateAdmin, async (req, res) => {
  try {
    const adminEmail = req.admin.email;

    await Notification.updateMany(
      { 'readBy.adminId': { $ne: adminEmail } },
      {
        $push: {
          readBy: {
            adminId: adminEmail,
            readAt: new Date()
          }
        }
      }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

module.exports = router;

