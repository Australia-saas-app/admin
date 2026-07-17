const express = require('express');
const router = express.Router();
const Branch = require('../models/Branch');
const Notice = require('../models/Notice');
const Employee = require('../models/Employee');
const Blog = require('../models/Blog');
const ContactUs = require('../models/ContactUs');
const Company = require('../models/Company');
const Gallery = require('../models/Gallery');
const SocialMedia = require('../models/SocialMedia');
const SupportLogo = require('../models/SupportLogo');
const { authenticate, authenticateAdmin } = require('../middleware/auth');

// ==========================================
// HELPER FUNCTIONS
// ==========================================

// Generic reorder function
async function reorderItem(Model, itemId, direction, idField = 'Id') {
  const item = await Model.findOne({ [`${idField}`]: itemId });
  if (!item) {
    throw new Error('Item not found');
  }

  let swapQuery = {};
  let swapItem = null;

  if (direction === 'up') {
    swapQuery.displayOrder = { $lt: item.displayOrder };
    swapItem = await Model.findOne(swapQuery).sort({ displayOrder: -1 });
    if (!swapItem) {
      throw new Error('Item is already at the top');
    }
  } else {
    swapQuery.displayOrder = { $gt: item.displayOrder };
    swapItem = await Model.findOne(swapQuery).sort({ displayOrder: 1 });
    if (!swapItem) {
      throw new Error('Item is already at the bottom');
    }
  }

  const tempOrder = item.displayOrder;
  item.displayOrder = swapItem.displayOrder;
  swapItem.displayOrder = tempOrder;

  await item.save();
  await swapItem.save();

  return item;
}

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Get Visible Branches (Public)
router.get('/branches', async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const query = { isVisible: true };
    if (search) {
      query.$text = { $search: search };
    }

    const total = await Branch.countDocuments(query);
    const branches = await Branch.find(query)
      .sort({ displayOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('-createdBy -updatedBy');

    res.json({
      success: true,
      data: {
        branches,
        pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Get Visible Notices (Public)
router.get('/notices', async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const query = { isVisible: true };
    if (search) {
      query.$text = { $search: search };
    }

    const total = await Notice.countDocuments(query);
    const notices = await Notice.find(query)
      .sort({ displayOrder: 1, uploadDate: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('-createdBy -updatedBy');

    res.json({
      success: true,
      data: {
        notices,
        pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Get Visible Employees (Public)
router.get('/employees', async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const query = { isVisible: true };
    if (search) {
      query.$text = { $search: search };
    }

    const total = await Employee.countDocuments(query);
    const employees = await Employee.find(query)
      .sort({ displayOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('-createdBy -updatedBy');

    res.json({
      success: true,
      data: {
        employees,
        pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Get Visible Blogs (Public)
router.get('/blogs', async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const query = { isVisible: true };
    if (search) {
      query.$text = { $search: search };
    }

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .sort({ displayOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('-createdBy -updatedBy');

    res.json({
      success: true,
      data: {
        blogs,
        pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Get Company Categories (Public)
router.get('/company', async (req, res) => {
  try {
    const categories = await Company.find({ isVisible: true })
      .sort({ displayOrder: 1 })
      .select('-createdBy -updatedBy');

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Get Gallery Categories (Public)
router.get('/gallery', async (req, res) => {
  try {
    const { categoryId } = req.query;
    
    if (categoryId) {
      const category = await Gallery.findOne({ categoryId, isVisible: true })
        .select('-createdBy -updatedBy');
      if (!category) {
        return res.status(404).json({ success: false, message: 'Gallery category not found' });
      }
      return res.json({ success: true, data: category });
    }

    const categories = await Gallery.find({ isVisible: true })
      .sort({ displayOrder: 1 })
      .select('-createdBy -updatedBy');

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Get Social Media Links (Public)
router.get('/social-media', async (req, res) => {
  try {
    const socialMedia = await SocialMedia.find()
      .sort({ displayOrder: 1 });

    res.json({
      success: true,
      data: socialMedia
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Get Support Logos (Public)
router.get('/support-logos', async (req, res) => {
  try {
    const logos = await SupportLogo.find()
      .sort({ displayOrder: 1 });

    res.json({
      success: true,
      data: logos
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Submit Contact Us (Public)
router.post('/contact-us', async (req, res) => {
  try {
    const { name, email, phoneNo, message } = req.body;
    const userId = req.user?.userId || null;
    const userType = req.user?.accountType || 'guest';

    if (!name || !email || !phoneNo || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone number, and message are required'
      });
    }

    const contactId = ContactUs.generateContactId();
    const contact = await ContactUs.create({
      contactId,
      name,
      email,
      phoneNo,
      message,
      date: new Date(),
      submittedBy: userId ? { userId, userType } : { userType: 'guest' }
    });

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: contact
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// ==========================================
// ADMIN ROUTES - BRANCH
// ==========================================

router.get('/admin/branches', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, isVisible } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const query = {};
    if (isVisible !== undefined) query.isVisible = isVisible === 'true';
    if (search) query.$text = { $search: search };

    const total = await Branch.countDocuments(query);
    const branches = await Branch.find(query)
      .sort({ displayOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      data: {
        branches,
        pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.post('/admin/branches', authenticateAdmin, async (req, res) => {
  try {
    const adminEmail = req.admin.email;
    const { photo, name, call, email, officeAddress, socialLinks } = req.body;

    if (!name || !call || !email || !officeAddress) {
      return res.status(400).json({
        success: false,
        message: 'Name, call, email, and office address are required'
      });
    }

    const maxOrder = await Branch.findOne().sort({ displayOrder: -1 }).select('displayOrder');
    const branchId = Branch.generateBranchId();

    const branch = await Branch.create({
      branchId,
      photo: photo || '',
      name,
      call,
      email,
      officeAddress,
      socialLinks: socialLinks || [],
      displayOrder: (maxOrder?.displayOrder || 0) + 1,
      createdBy: adminEmail,
      updatedBy: adminEmail
    });

    res.status(201).json({ success: true, message: 'Branch created successfully', data: branch });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.patch('/admin/branches/:branchId', authenticateAdmin, async (req, res) => {
  try {
    const { branchId } = req.params;
    const adminEmail = req.admin.email;
    const updateData = req.body;

    delete updateData.branchId;
    delete updateData.createdAt;
    delete updateData.createdBy;
    updateData.updatedBy = adminEmail;

    const branch = await Branch.findOneAndUpdate(
      { branchId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!branch) {
      return res.status(404).json({ success: false, message: 'Branch not found' });
    }

    res.json({ success: true, message: 'Branch updated successfully', data: branch });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.delete('/admin/branches/:branchId', authenticateAdmin, async (req, res) => {
  try {
    const { branchId } = req.params;
    const branch = await Branch.findOneAndDelete({ branchId });

    if (!branch) {
      return res.status(404).json({ success: false, message: 'Branch not found' });
    }

    res.json({ success: true, message: 'Branch deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.patch('/admin/branches/:branchId/visibility', authenticateAdmin, async (req, res) => {
  try {
    const { branchId } = req.params;
    const { isVisible } = req.body;
    const adminEmail = req.admin.email;

    if (typeof isVisible !== 'boolean') {
      return res.status(400).json({ success: false, message: 'isVisible must be a boolean' });
    }

    const branch = await Branch.findOneAndUpdate(
      { branchId },
      { $set: { isVisible, updatedBy: adminEmail } },
      { new: true }
    );

    if (!branch) {
      return res.status(404).json({ success: false, message: 'Branch not found' });
    }

    res.json({
      success: true,
      message: `Branch ${isVisible ? 'made visible' : 'hidden'} successfully`,
      data: branch
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.patch('/admin/branches/:branchId/reorder', authenticateAdmin, async (req, res) => {
  try {
    const { branchId } = req.params;
    const { direction } = req.body;

    if (!['up', 'down'].includes(direction)) {
      return res.status(400).json({ success: false, message: 'Direction must be "up" or "down"' });
    }

    await reorderItem(Branch, branchId, direction, 'branchId');
    res.json({ success: true, message: `Branch moved ${direction} successfully` });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ==========================================
// ADMIN ROUTES - NOTICE
// ==========================================

router.get('/admin/notices', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, isVisible } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const query = {};
    if (isVisible !== undefined) query.isVisible = isVisible === 'true';
    if (search) query.$text = { $search: search };

    const total = await Notice.countDocuments(query);
    const notices = await Notice.find(query)
      .sort({ displayOrder: 1, uploadDate: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      data: {
        notices,
        pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.post('/admin/notices', authenticateAdmin, async (req, res) => {
  try {
    const adminEmail = req.admin.email;
    const { document, title, uploadDate } = req.body;

    if (!document || !title) {
      return res.status(400).json({
        success: false,
        message: 'Document and title are required'
      });
    }

    const maxOrder = await Notice.findOne().sort({ displayOrder: -1 }).select('displayOrder');
    const noticeId = Notice.generateNoticeId();

    const notice = await Notice.create({
      noticeId,
      document,
      title,
      uploadDate: uploadDate ? new Date(uploadDate) : new Date(),
      displayOrder: (maxOrder?.displayOrder || 0) + 1,
      createdBy: adminEmail,
      updatedBy: adminEmail
    });

    res.status(201).json({ success: true, message: 'Notice created successfully', data: notice });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.patch('/admin/notices/:noticeId', authenticateAdmin, async (req, res) => {
  try {
    const { noticeId } = req.params;
    const adminEmail = req.admin.email;
    const updateData = req.body;

    delete updateData.noticeId;
    delete updateData.createdAt;
    delete updateData.createdBy;
    if (updateData.uploadDate) updateData.uploadDate = new Date(updateData.uploadDate);
    updateData.updatedBy = adminEmail;

    const notice = await Notice.findOneAndUpdate(
      { noticeId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }

    res.json({ success: true, message: 'Notice updated successfully', data: notice });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.delete('/admin/notices/:noticeId', authenticateAdmin, async (req, res) => {
  try {
    const { noticeId } = req.params;
    const notice = await Notice.findOneAndDelete({ noticeId });

    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }

    res.json({ success: true, message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.patch('/admin/notices/:noticeId/visibility', authenticateAdmin, async (req, res) => {
  try {
    const { noticeId } = req.params;
    const { isVisible } = req.body;
    const adminEmail = req.admin.email;

    if (typeof isVisible !== 'boolean') {
      return res.status(400).json({ success: false, message: 'isVisible must be a boolean' });
    }

    const notice = await Notice.findOneAndUpdate(
      { noticeId },
      { $set: { isVisible, updatedBy: adminEmail } },
      { new: true }
    );

    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }

    res.json({
      success: true,
      message: `Notice ${isVisible ? 'made visible' : 'hidden'} successfully`,
      data: notice
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.patch('/admin/notices/:noticeId/reorder', authenticateAdmin, async (req, res) => {
  try {
    const { noticeId } = req.params;
    const { direction } = req.body;

    if (!['up', 'down'].includes(direction)) {
      return res.status(400).json({ success: false, message: 'Direction must be "up" or "down"' });
    }

    await reorderItem(Notice, noticeId, direction, 'noticeId');
    res.json({ success: true, message: `Notice moved ${direction} successfully` });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ==========================================
// ADMIN ROUTES - EMPLOYEE
// ==========================================

router.get('/admin/employees', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, isVisible } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const query = {};
    if (isVisible !== undefined) query.isVisible = isVisible === 'true';
    if (search) query.$text = { $search: search };

    const total = await Employee.countDocuments(query);
    const employees = await Employee.find(query)
      .sort({ displayOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      data: {
        employees,
        pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.post('/admin/employees', authenticateAdmin, async (req, res) => {
  try {
    const adminEmail = req.admin.email;
    const { photo, name, title, officeAddress, socialLinks } = req.body;

    if (!name || !title) {
      return res.status(400).json({
        success: false,
        message: 'Name and title are required'
      });
    }

    const maxOrder = await Employee.findOne().sort({ displayOrder: -1 }).select('displayOrder');
    const employeeId = Employee.generateEmployeeId();

    const employee = await Employee.create({
      employeeId,
      photo: photo || '',
      name,
      title,
      officeAddress: officeAddress || '',
      socialLinks: socialLinks || [],
      displayOrder: (maxOrder?.displayOrder || 0) + 1,
      createdBy: adminEmail,
      updatedBy: adminEmail
    });

    res.status(201).json({ success: true, message: 'Employee created successfully', data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.patch('/admin/employees/:employeeId', authenticateAdmin, async (req, res) => {
  try {
    const { employeeId } = req.params;
    const adminEmail = req.admin.email;
    const updateData = req.body;

    delete updateData.employeeId;
    delete updateData.createdAt;
    delete updateData.createdBy;
    updateData.updatedBy = adminEmail;

    const employee = await Employee.findOneAndUpdate(
      { employeeId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.json({ success: true, message: 'Employee updated successfully', data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.delete('/admin/employees/:employeeId', authenticateAdmin, async (req, res) => {
  try {
    const { employeeId } = req.params;
    const employee = await Employee.findOneAndDelete({ employeeId });

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.patch('/admin/employees/:employeeId/visibility', authenticateAdmin, async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { isVisible } = req.body;
    const adminEmail = req.admin.email;

    if (typeof isVisible !== 'boolean') {
      return res.status(400).json({ success: false, message: 'isVisible must be a boolean' });
    }

    const employee = await Employee.findOneAndUpdate(
      { employeeId },
      { $set: { isVisible, updatedBy: adminEmail } },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.json({
      success: true,
      message: `Employee ${isVisible ? 'made visible' : 'hidden'} successfully`,
      data: employee
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.patch('/admin/employees/:employeeId/reorder', authenticateAdmin, async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { direction } = req.body;

    if (!['up', 'down'].includes(direction)) {
      return res.status(400).json({ success: false, message: 'Direction must be "up" or "down"' });
    }

    await reorderItem(Employee, employeeId, direction, 'employeeId');
    res.json({ success: true, message: `Employee moved ${direction} successfully` });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ==========================================
// ADMIN ROUTES - BLOG
// ==========================================

router.get('/admin/blogs', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, isVisible } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const query = {};
    if (isVisible !== undefined) query.isVisible = isVisible === 'true';
    if (search) query.$text = { $search: search };

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .sort({ displayOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      data: {
        blogs,
        pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.post('/admin/blogs', authenticateAdmin, async (req, res) => {
  try {
    const adminEmail = req.admin.email;
    const { photo, title, tag, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    const maxOrder = await Blog.findOne().sort({ displayOrder: -1 }).select('displayOrder');
    const blogId = Blog.generateBlogId();

    const blog = await Blog.create({
      blogId,
      photo: photo || '',
      title,
      tag: tag || '',
      description,
      displayOrder: (maxOrder?.displayOrder || 0) + 1,
      createdBy: adminEmail,
      updatedBy: adminEmail
    });

    res.status(201).json({ success: true, message: 'Blog created successfully', data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.patch('/admin/blogs/:blogId', authenticateAdmin, async (req, res) => {
  try {
    const { blogId } = req.params;
    const adminEmail = req.admin.email;
    const updateData = req.body;

    delete updateData.blogId;
    delete updateData.createdAt;
    delete updateData.createdBy;
    updateData.updatedBy = adminEmail;

    const blog = await Blog.findOneAndUpdate(
      { blogId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    res.json({ success: true, message: 'Blog updated successfully', data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.delete('/admin/blogs/:blogId', authenticateAdmin, async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findOneAndDelete({ blogId });

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.patch('/admin/blogs/:blogId/visibility', authenticateAdmin, async (req, res) => {
  try {
    const { blogId } = req.params;
    const { isVisible } = req.body;
    const adminEmail = req.admin.email;

    if (typeof isVisible !== 'boolean') {
      return res.status(400).json({ success: false, message: 'isVisible must be a boolean' });
    }

    const blog = await Blog.findOneAndUpdate(
      { blogId },
      { $set: { isVisible, updatedBy: adminEmail } },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    res.json({
      success: true,
      message: `Blog ${isVisible ? 'made visible' : 'hidden'} successfully`,
      data: blog
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.patch('/admin/blogs/:blogId/reorder', authenticateAdmin, async (req, res) => {
  try {
    const { blogId } = req.params;
    const { direction } = req.body;

    if (!['up', 'down'].includes(direction)) {
      return res.status(400).json({ success: false, message: 'Direction must be "up" or "down"' });
    }

    await reorderItem(Blog, blogId, direction, 'blogId');
    res.json({ success: true, message: `Blog moved ${direction} successfully` });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ==========================================
// ADMIN ROUTES - CONTACT US
// ==========================================

router.get('/admin/contact-us', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const query = {};
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { phoneNo: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await ContactUs.countDocuments(query);
    const contacts = await ContactUs.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      data: {
        contacts,
        pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.delete('/admin/contact-us/:contactId', authenticateAdmin, async (req, res) => {
  try {
    const { contactId } = req.params;
    const contact = await ContactUs.findOneAndDelete({ contactId });

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.json({ success: true, message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.delete('/admin/contact-us', authenticateAdmin, async (req, res) => {
  try {
    const { contactIds } = req.body; // Array of contact IDs

    if (!Array.isArray(contactIds) || contactIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'contactIds array is required'
      });
    }

    const result = await ContactUs.deleteMany({ contactId: { $in: contactIds } });

    res.json({
      success: true,
      message: `${result.deletedCount} contact(s) deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// ==========================================
// ADMIN ROUTES - COMPANY
// ==========================================

router.get('/admin/company', authenticateAdmin, async (req, res) => {
  try {
    const { isVisible } = req.query;
    const query = {};
    if (isVisible !== undefined) query.isVisible = isVisible === 'true';

    const categories = await Company.find(query).sort({ displayOrder: 1 });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.post('/admin/company', authenticateAdmin, async (req, res) => {
  try {
    const adminEmail = req.admin.email;
    const { categoryName, description } = req.body;

    if (!categoryName) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    // Check if category exists
    let company = await Company.findOne({ categoryName });
    
    if (company) {
      // Add description to existing category
      if (description) {
        const maxDescOrder = company.descriptions.length > 0
          ? Math.max(...company.descriptions.map(d => d.displayOrder || 0))
          : -1;
        
        company.descriptions.push({
          description,
          displayOrder: maxDescOrder + 1
        });
        company.updatedBy = adminEmail;
        await company.save();
      }
      return res.json({ success: true, message: 'Description added to category', data: company });
    }

    // Create new category
    const maxOrder = await Company.findOne().sort({ displayOrder: -1 }).select('displayOrder');
    const categoryId = Company.generateCategoryId();

    company = await Company.create({
      categoryId,
      categoryName,
      descriptions: description ? [{
        description,
        displayOrder: 0
      }] : [],
      displayOrder: (maxOrder?.displayOrder || 0) + 1,
      createdBy: adminEmail,
      updatedBy: adminEmail
    });

    res.status(201).json({ success: true, message: 'Company category created successfully', data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.delete('/admin/company/:categoryId', authenticateAdmin, async (req, res) => {
  try {
    const { categoryId } = req.params;
    const company = await Company.findOneAndDelete({ categoryId });

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company category not found' });
    }

    res.json({ success: true, message: 'Company category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.delete('/admin/company/:categoryId/descriptions/:descriptionIndex', authenticateAdmin, async (req, res) => {
  try {
    const { categoryId, descriptionIndex } = req.params;
    const index = parseInt(descriptionIndex);

    const company = await Company.findOne({ categoryId });
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company category not found' });
    }

    if (index < 0 || index >= company.descriptions.length) {
      return res.status(400).json({ success: false, message: 'Invalid description index' });
    }

    company.descriptions.splice(index, 1);
    company.updatedBy = req.admin.email;
    await company.save();

    res.json({ success: true, message: 'Description deleted successfully', data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.patch('/admin/company/:categoryId/visibility', authenticateAdmin, async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { isVisible } = req.body;
    const adminEmail = req.admin.email;

    if (typeof isVisible !== 'boolean') {
      return res.status(400).json({ success: false, message: 'isVisible must be a boolean' });
    }

    const company = await Company.findOneAndUpdate(
      { categoryId },
      { $set: { isVisible, updatedBy: adminEmail } },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company category not found' });
    }

    res.json({
      success: true,
      message: `Company category ${isVisible ? 'made visible' : 'hidden'} successfully`,
      data: company
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// ==========================================
// ADMIN ROUTES - GALLERY
// ==========================================

router.get('/admin/gallery', authenticateAdmin, async (req, res) => {
  try {
    const { categoryId, isVisible } = req.query;
    
    if (categoryId) {
      const category = await Gallery.findOne({ categoryId });
      if (!category) {
        return res.status(404).json({ success: false, message: 'Gallery category not found' });
      }
      return res.json({ success: true, data: category });
    }

    const query = {};
    if (isVisible !== undefined) query.isVisible = isVisible === 'true';

    const categories = await Gallery.find(query).sort({ displayOrder: 1 });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.post('/admin/gallery', authenticateAdmin, async (req, res) => {
  try {
    const adminEmail = req.admin.email;
    const { categoryName, images } = req.body; // images: [{ imageUrl, title }]

    if (!categoryName) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    // Check if category exists
    let gallery = await Gallery.findOne({ categoryName });
    
    if (gallery) {
      // Add images to existing category
      if (images && Array.isArray(images) && images.length > 0) {
        const maxImgOrder = gallery.images.length > 0
          ? Math.max(...gallery.images.map(img => img.displayOrder || 0))
          : -1;
        
        const newImages = images.map((img, idx) => ({
          imageUrl: img.imageUrl,
          title: img.title,
          displayOrder: maxImgOrder + 1 + idx
        }));
        
        gallery.images.push(...newImages);
        gallery.updatedBy = adminEmail;
        await gallery.save();
      }
      return res.json({ success: true, message: 'Images added to gallery category', data: gallery });
    }

    // Create new category
    const maxOrder = await Gallery.findOne().sort({ displayOrder: -1 }).select('displayOrder');
    const categoryId = Gallery.generateCategoryId();

    gallery = await Gallery.create({
      categoryId,
      categoryName,
      images: images && Array.isArray(images) ? images.map((img, idx) => ({
        imageUrl: img.imageUrl,
        title: img.title,
        displayOrder: idx
      })) : [],
      displayOrder: (maxOrder?.displayOrder || 0) + 1,
      createdBy: adminEmail,
      updatedBy: adminEmail
    });

    res.status(201).json({ success: true, message: 'Gallery category created successfully', data: gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.delete('/admin/gallery/:categoryId', authenticateAdmin, async (req, res) => {
  try {
    const { categoryId } = req.params;
    const gallery = await Gallery.findOneAndDelete({ categoryId });

    if (!gallery) {
      return res.status(404).json({ success: false, message: 'Gallery category not found' });
    }

    res.json({ success: true, message: 'Gallery category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.delete('/admin/gallery/:categoryId/images/:imageIndex', authenticateAdmin, async (req, res) => {
  try {
    const { categoryId, imageIndex } = req.params;
    const index = parseInt(imageIndex);

    const gallery = await Gallery.findOne({ categoryId });
    if (!gallery) {
      return res.status(404).json({ success: false, message: 'Gallery category not found' });
    }

    if (index < 0 || index >= gallery.images.length) {
      return res.status(400).json({ success: false, message: 'Invalid image index' });
    }

    gallery.images.splice(index, 1);
    gallery.updatedBy = req.admin.email;
    await gallery.save();

    res.json({ success: true, message: 'Image deleted successfully', data: gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.patch('/admin/gallery/:categoryId/visibility', authenticateAdmin, async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { isVisible } = req.body;
    const adminEmail = req.admin.email;

    if (typeof isVisible !== 'boolean') {
      return res.status(400).json({ success: false, message: 'isVisible must be a boolean' });
    }

    const gallery = await Gallery.findOneAndUpdate(
      { categoryId },
      { $set: { isVisible, updatedBy: adminEmail } },
      { new: true }
    );

    if (!gallery) {
      return res.status(404).json({ success: false, message: 'Gallery category not found' });
    }

    res.json({
      success: true,
      message: `Gallery category ${isVisible ? 'made visible' : 'hidden'} successfully`,
      data: gallery
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// ==========================================
// ADMIN ROUTES - SOCIAL MEDIA
// ==========================================

router.get('/admin/social-media', authenticateAdmin, async (req, res) => {
  try {
    const socialMedia = await SocialMedia.find().sort({ displayOrder: 1 });

    res.json({
      success: true,
      data: socialMedia
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.post('/admin/social-media', authenticateAdmin, async (req, res) => {
  try {
    const adminEmail = req.admin.email;
    const { name, icon, url } = req.body;

    if (!name || !icon || !url) {
      return res.status(400).json({
        success: false,
        message: 'Name, icon, and url are required'
      });
    }

    const maxOrder = await SocialMedia.findOne().sort({ displayOrder: -1 }).select('displayOrder');
    const socialMediaId = SocialMedia.generateSocialMediaId();

    const socialMedia = await SocialMedia.create({
      socialMediaId,
      name,
      icon,
      url,
      displayOrder: (maxOrder?.displayOrder || 0) + 1,
      createdBy: adminEmail,
      updatedBy: adminEmail
    });

    res.status(201).json({ success: true, message: 'Social media link created successfully', data: socialMedia });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.patch('/admin/social-media/:socialMediaId', authenticateAdmin, async (req, res) => {
  try {
    const { socialMediaId } = req.params;
    const adminEmail = req.admin.email;
    const updateData = req.body;

    delete updateData.socialMediaId;
    delete updateData.createdAt;
    delete updateData.createdBy;
    updateData.updatedBy = adminEmail;

    const socialMedia = await SocialMedia.findOneAndUpdate(
      { socialMediaId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!socialMedia) {
      return res.status(404).json({ success: false, message: 'Social media link not found' });
    }

    res.json({ success: true, message: 'Social media link updated successfully', data: socialMedia });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.delete('/admin/social-media/:socialMediaId', authenticateAdmin, async (req, res) => {
  try {
    const { socialMediaId } = req.params;
    const socialMedia = await SocialMedia.findOneAndDelete({ socialMediaId });

    if (!socialMedia) {
      return res.status(404).json({ success: false, message: 'Social media link not found' });
    }

    res.json({ success: true, message: 'Social media link deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// ==========================================
// ADMIN ROUTES - SUPPORT LOGO
// ==========================================

router.get('/admin/support-logos', authenticateAdmin, async (req, res) => {
  try {
    const logos = await SupportLogo.find().sort({ displayOrder: 1 });

    res.json({
      success: true,
      data: logos
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.post('/admin/support-logos', authenticateAdmin, async (req, res) => {
  try {
    const adminEmail = req.admin.email;
    const { logoUrl, name } = req.body;

    if (!logoUrl) {
      return res.status(400).json({
        success: false,
        message: 'Logo URL is required'
      });
    }

    const maxOrder = await SupportLogo.findOne().sort({ displayOrder: -1 }).select('displayOrder');
    const logoId = SupportLogo.generateLogoId();

    const logo = await SupportLogo.create({
      logoId,
      logoUrl,
      name: name || '',
      displayOrder: (maxOrder?.displayOrder || 0) + 1,
      createdBy: adminEmail,
      updatedBy: adminEmail
    });

    res.status(201).json({ success: true, message: 'Support logo created successfully', data: logo });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.patch('/admin/support-logos/:logoId', authenticateAdmin, async (req, res) => {
  try {
    const { logoId } = req.params;
    const adminEmail = req.admin.email;
    const updateData = req.body;

    delete updateData.logoId;
    delete updateData.createdAt;
    delete updateData.createdBy;
    updateData.updatedBy = adminEmail;

    const logo = await SupportLogo.findOneAndUpdate(
      { logoId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!logo) {
      return res.status(404).json({ success: false, message: 'Support logo not found' });
    }

    res.json({ success: true, message: 'Support logo updated successfully', data: logo });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.delete('/admin/support-logos/:logoId', authenticateAdmin, async (req, res) => {
  try {
    const { logoId } = req.params;
    const logo = await SupportLogo.findOneAndDelete({ logoId });

    if (!logo) {
      return res.status(404).json({ success: false, message: 'Support logo not found' });
    }

    res.json({ success: true, message: 'Support logo deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

module.exports = router;

