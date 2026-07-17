const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const Category = require('../models/Category');
const { authenticate, authenticateAdmin } = require('../middleware/auth');

// ==========================================
// PUBLIC ROUTES (User/Agency - View Only)
// ==========================================

// Get All Visible Services (Public)
router.get('/services', async (req, res) => {
  try {
    const {
      serviceType,
      category,
      search,
      page = 1,
      limit = 10,
      propertyType,
      propertyStatus,
      minPrice,
      maxPrice
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query - only visible services
    const query = { isVisible: true };

    // Service type filter
    if (serviceType) {
      query.serviceType = serviceType;
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Real Estate specific filters
    if (propertyType) {
      query.propertyType = propertyType;
    }

    if (propertyStatus) {
      query.propertyStatus = propertyStatus;
    }

    if (minPrice || maxPrice) {
      query.$or = [
        { price: {} },
        { budget: {} }
      ];
      if (minPrice) {
        query.$or[0].price = { ...query.$or[0].price, $gte: parseFloat(minPrice) };
        query.$or[1].budget = { ...query.$or[1].budget, $gte: parseFloat(minPrice) };
      }
      if (maxPrice) {
        query.$or[0].price = { ...query.$or[0].price, $lte: parseFloat(maxPrice) };
        query.$or[1].budget = { ...query.$or[1].budget, $lte: parseFloat(maxPrice) };
      }
    }

    // Search filter
    if (search) {
      query.$text = { $search: search };
    }

    // Get total count
    const total = await Service.countDocuments(query);

    // Get services, sorted by displayOrder then createdAt
    const services = await Service.find(query)
      .sort({ displayOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('-createdBy -updatedBy'); // Hide admin info

    res.json({
      success: true,
      data: {
        services,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get Single Service (Public)
router.get('/services/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await Service.findOne({ serviceId, isVisible: true });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found or not visible'
      });
    }

    res.json({
      success: true,
      data: service
    });

  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get Categories by Service Type (Public)
router.get('/services/:serviceType/categories', async (req, res) => {
  try {
    const { serviceType } = req.params;

    const categories = await Category.find({
      serviceType,
      isActive: true
    }).sort({ displayOrder: 1, name: 1 });

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// ==========================================
// ADMIN ROUTES
// ==========================================

// Get All Services (Admin) - All services including hidden
router.get('/admin/services', authenticateAdmin, async (req, res) => {
  try {
    const {
      serviceType,
      category,
      search,
      isVisible,
      page = 1,
      limit = 10
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    const query = {};

    // Service type filter
    if (serviceType) {
      query.serviceType = serviceType;
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Visibility filter
    if (isVisible !== undefined) {
      query.isVisible = isVisible === 'true';
    }

    // Search filter
    if (search) {
      query.$text = { $search: search };
    }

    // Get total count
    const total = await Service.countDocuments(query);

    // Get services, sorted by displayOrder then createdAt
    const services = await Service.find(query)
      .sort({ displayOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      data: {
        services,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Get admin services error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get Single Service (Admin)
router.get('/admin/services/:serviceId', authenticateAdmin, async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await Service.findOne({ serviceId });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });

  } catch (error) {
    console.error('Get admin service error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Create Service (Admin)
router.post('/admin/services', authenticateAdmin, async (req, res) => {
  try {
    const adminEmail = req.admin.email;
    const {
      serviceType,
      title,
      photo,
      photos,
      tag,
      category,
      description,
      // Real Estate specific
      propertyType,
      propertyStatus,
      size,
      price,
      budget,
      features,
      beds,
      bathrooms,
      kitchen
    } = req.body;

    // Validate required fields
    if (!serviceType || !title || !category || !description) {
      return res.status(400).json({
        success: false,
        message: 'Service type, title, category, and description are required'
      });
    }

    // Validate service type
    const validServiceTypes = ['technical', 'construction', 'real-estate', 'import-export', 'visa-traveling', 'solutions'];
    if (!validServiceTypes.includes(serviceType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid service type. Must be one of: ${validServiceTypes.join(', ')}`
      });
    }

    // Check if category exists or create it
    let categoryDoc = await Category.findOne({
      name: category,
      serviceType: serviceType
    });

    if (!categoryDoc) {
      // Create new category
      const categoryId = Category.generateCategoryId();
      categoryDoc = await Category.create({
        categoryId,
        name: category,
        serviceType: serviceType,
        description: `Category for ${serviceType} services`
      });
    }

    // Get max display order for this service type
    const maxOrder = await Service.findOne({ serviceType })
      .sort({ displayOrder: -1 })
      .select('displayOrder');
    const nextDisplayOrder = (maxOrder?.displayOrder || 0) + 1;

    // Generate service ID
    const serviceId = Service.generateServiceId(serviceType);

    // Create service
    const serviceData = {
      serviceId,
      serviceType,
      title,
      category: categoryDoc.name,
      categoryId: categoryDoc._id,
      description,
      displayOrder: nextDisplayOrder,
      createdBy: adminEmail,
      updatedBy: adminEmail
    };

    // Add optional fields
    if (photo) serviceData.photo = photo;
    if (photos && Array.isArray(photos)) serviceData.photos = photos;
    if (tag) serviceData.tag = tag;

    // Real Estate specific fields
    if (serviceType === 'real-estate') {
      if (propertyType) serviceData.propertyType = propertyType;
      if (propertyStatus) serviceData.propertyStatus = propertyStatus;
      if (size) serviceData.size = size;
      if (price) serviceData.price = price;
      if (budget) serviceData.budget = budget;
      if (features && Array.isArray(features)) serviceData.features = features;
      if (beds !== undefined) serviceData.beds = beds;
      if (bathrooms !== undefined) serviceData.bathrooms = bathrooms;
      if (kitchen !== undefined) serviceData.kitchen = kitchen;
    }

    const service = await Service.create(serviceData);

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service
    });

  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Update Service (Admin)
router.patch('/admin/services/:serviceId', authenticateAdmin, async (req, res) => {
  try {
    const { serviceId } = req.params;
    const adminEmail = req.admin.email;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.serviceId;
    delete updateData.createdAt;
    delete updateData.createdBy;

    // Update updatedBy
    updateData.updatedBy = adminEmail;

    // Handle category update
    if (updateData.category) {
      const service = await Service.findOne({ serviceId });
      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }

      // Check if category exists or create it
      let categoryDoc = await Category.findOne({
        name: updateData.category,
        serviceType: service.serviceType
      });

      if (!categoryDoc) {
        const categoryId = Category.generateCategoryId();
        categoryDoc = await Category.create({
          categoryId,
          name: updateData.category,
          serviceType: service.serviceType,
          description: `Category for ${service.serviceType} services`
        });
      }

      updateData.categoryId = categoryDoc._id;
    }

    const service = await Service.findOneAndUpdate(
      { serviceId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: 'Service updated successfully',
      data: service
    });

  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Delete Service (Admin)
router.delete('/admin/services/:serviceId', authenticateAdmin, async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await Service.findOneAndDelete({ serviceId });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });

  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Toggle Service Visibility (Admin)
router.patch('/admin/services/:serviceId/visibility', authenticateAdmin, async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { isVisible } = req.body;
    const adminEmail = req.admin.email;

    if (typeof isVisible !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isVisible must be a boolean value'
      });
    }

    const service = await Service.findOneAndUpdate(
      { serviceId },
      {
        $set: {
          isVisible,
          updatedBy: adminEmail
        }
      },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: `Service ${isVisible ? 'made visible' : 'hidden'} successfully`,
      data: service
    });

  } catch (error) {
    console.error('Toggle visibility error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Reorder Services (Admin) - Move Up or Down
router.patch('/admin/services/:serviceId/reorder', authenticateAdmin, async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { direction } = req.body; // 'up' or 'down'
    const adminEmail = req.admin.email;

    if (!['up', 'down'].includes(direction)) {
      return res.status(400).json({
        success: false,
        message: 'Direction must be "up" or "down"'
      });
    }

    const service = await Service.findOne({ serviceId });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Find the service to swap with
    let swapQuery = { serviceType: service.serviceType };
    
    if (direction === 'up') {
      // Find service with displayOrder less than current
      swapQuery.displayOrder = { $lt: service.displayOrder };
      const swapService = await Service.findOne(swapQuery).sort({ displayOrder: -1 });
      
      if (!swapService) {
        return res.status(400).json({
          success: false,
          message: 'Service is already at the top'
        });
      }

      // Swap display orders
      const tempOrder = service.displayOrder;
      service.displayOrder = swapService.displayOrder;
      swapService.displayOrder = tempOrder;

      await service.save();
      await swapService.save();

    } else {
      // Find service with displayOrder greater than current
      swapQuery.displayOrder = { $gt: service.displayOrder };
      const swapService = await Service.findOne(swapQuery).sort({ displayOrder: 1 });
      
      if (!swapService) {
        return res.status(400).json({
          success: false,
          message: 'Service is already at the bottom'
        });
      }

      // Swap display orders
      const tempOrder = service.displayOrder;
      service.displayOrder = swapService.displayOrder;
      swapService.displayOrder = tempOrder;

      await service.save();
      await swapService.save();
    }

    res.json({
      success: true,
      message: `Service moved ${direction} successfully`,
      data: {
        serviceId: service.serviceId,
        displayOrder: service.displayOrder
      }
    });

  } catch (error) {
    console.error('Reorder service error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// ==========================================
// CATEGORY MANAGEMENT (Admin)
// ==========================================

// Get All Categories (Admin)
router.get('/admin/categories', authenticateAdmin, async (req, res) => {
  try {
    const { serviceType, isActive, page = 1, limit = 50 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const query = {};

    if (serviceType) {
      query.serviceType = serviceType;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const total = await Category.countDocuments(query);

    const categories = await Category.find(query)
      .sort({ displayOrder: 1, name: 1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      data: {
        categories,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Create Category (Admin)
router.post('/admin/categories', authenticateAdmin, async (req, res) => {
  try {
    const { name, serviceType, description } = req.body;

    if (!name || !serviceType) {
      return res.status(400).json({
        success: false,
        message: 'Name and service type are required'
      });
    }

    // Check if category already exists
    const existing = await Category.findOne({ name, serviceType });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists for this service type'
      });
    }

    const categoryId = Category.generateCategoryId();
    const category = await Category.create({
      categoryId,
      name,
      serviceType,
      description: description || ''
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });

  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Update Category (Admin)
router.patch('/admin/categories/:categoryId', authenticateAdmin, async (req, res) => {
  try {
    const { categoryId } = req.params;
    const updateData = req.body;

    delete updateData.categoryId;
    delete updateData.createdAt;

    const category = await Category.findOneAndUpdate(
      { categoryId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });

  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Delete Category (Admin)
router.delete('/admin/categories/:categoryId', authenticateAdmin, async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Check if any services are using this category
    const servicesCount = await Service.countDocuments({ categoryId });
    
    if (servicesCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. ${servicesCount} service(s) are using it.`
      });
    }

    const category = await Category.findOneAndDelete({ categoryId });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });

  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;

