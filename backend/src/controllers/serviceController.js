
const { Service } = require('../models');

// ============ CREATE SERVICE ============
const createService = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    const serviceData = {
      ...req.body,
      createdBy: req.user.userId || req.user._id,
    };

    const service = await Service.create(serviceData);
    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service,
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET ALL SERVICES ============
const getAllServices = async (req, res) => {
  try {
    const { type, isActive } = req.query;
    
    const filter = {};
    if (type) filter.type = type;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const services = await Service.find(filter)
      .sort({ order: 1, createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET SERVICE BY ID ============
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.serviceId);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error('Get service by id error:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ UPDATE SERVICE ============
const updateService = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    const service = await Service.findByIdAndUpdate(
      req.params.serviceId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: service,
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ DELETE SERVICE ============
const deleteService = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    const service = await Service.findByIdAndDelete(req.params.serviceId);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ ADD IMAGE TO SERVICE ============
const addServiceImage = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    const { serviceId } = req.params;
    const { url, caption, caption_amharic } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'Image URL is required',
      });
    }

    const service = await Service.findById(serviceId);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    // Add image to gallery
    service.images.push({
      url,
      caption: caption || '',
      caption_amharic: caption_amharic || '',
      uploadedAt: new Date(),
    });

    await service.save();

    res.status(200).json({
      success: true,
      message: 'Image added successfully',
      data: service,
    });
  } catch (error) {
    console.error('Add service image error:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ REMOVE IMAGE FROM SERVICE ============
const removeServiceImage = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    const { serviceId, imageId } = req.params;

    const service = await Service.findById(serviceId);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    // Remove image from gallery
    service.images = service.images.filter(
      img => img._id.toString() !== imageId
    );

    await service.save();

    res.status(200).json({
      success: true,
      message: 'Image removed successfully',
      data: service,
    });
  } catch (error) {
    console.error('Remove service image error:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET SERVICE STATS ============
const getServiceStats = async (req, res) => {
  try {
    const total = await Service.countDocuments();
    const active = await Service.countDocuments({ isActive: true });
    const inactive = await Service.countDocuments({ isActive: false });

    // Get services by type
    const byType = await Service.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        active,
        inactive,
        byType,
      },
    });
  } catch (error) {
    console.error('Get service stats error:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  addServiceImage,
  removeServiceImage,
  getServiceStats,
};