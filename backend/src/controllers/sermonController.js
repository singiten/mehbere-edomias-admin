const sermonService = require('../services/sermonService');

// ============ CREATE SERMON ============
const createSermon = async (req, res) => {
  try {
    // ✅ Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    const sermonData = {
      ...req.body,
      uploadedBy: req.user.userId,
    };

    const sermon = await sermonService.createSermon(sermonData);
    res.status(201).json({
      success: true,
      message: 'Sermon created successfully',
      data: sermon,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET ALL SERMONS ============
const getAllSermons = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    const result = await sermonService.getAllSermons(req.query);
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET PUBLIC SERMONS ============
const getPublicSermons = async (req, res) => {
  try {
    const result = await sermonService.getPublicSermons(req.query);
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET SERMON BY ID ============
const getSermonById = async (req, res) => {
  try {
    const sermon = await sermonService.getSermonById(req.params.sermonId);
    res.status(200).json({
      success: true,
      data: sermon,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ UPDATE SERMON ============
const updateSermon = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    const sermon = await sermonService.updateSermon(req.params.sermonId, req.body);
    res.status(200).json({
      success: true,
      message: 'Sermon updated successfully',
      data: sermon,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ DELETE SERMON ============
const deleteSermon = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    await sermonService.deleteSermon(req.params.sermonId);
    res.status(200).json({
      success: true,
      message: 'Sermon deleted successfully',
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ INCREMENT DOWNLOADS ============
const incrementDownloads = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    const sermon = await sermonService.incrementDownloads(req.params.sermonId);
    res.status(200).json({
      success: true,
      data: sermon,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createSermon,
  getAllSermons,
  getPublicSermons,
  getSermonById,
  updateSermon,
  deleteSermon,
  incrementDownloads,
};