const { Sermon } = require('../models');

/**
 * Create a sermon
 */
const createSermon = async (sermonData) => {
  const sermon = await Sermon.create(sermonData);
  return sermon;
};

/**
 * Get all sermons with filters
 */
const getAllSermons = async (query = {}) => {
  const { page = 1, limit = 10, type, search } = query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = {};
  if (type) filter.sermonType = type;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { preacher: { $regex: search, $options: 'i' } },
    ];
  }

  const sermons = await Sermon.find(filter)
    .populate('uploadedBy', '-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Sermon.countDocuments(filter);

  return {
    data: sermons,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    }
  };
};

/**
 * Get public sermons
 */
const getPublicSermons = async (query = {}) => {
  const { page = 1, limit = 10, type } = query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = { isPublic: true };
  if (type) filter.sermonType = type;

  const sermons = await Sermon.find(filter)
    .populate('uploadedBy', '-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Sermon.countDocuments(filter);

  return {
    data: sermons,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    }
  };
};

/**
 * Get sermon by ID
 */
const getSermonById = async (sermonId) => {
  const sermon = await Sermon.findById(sermonId).populate('uploadedBy', '-password');
  if (!sermon) {
    throw new Error('Sermon not found');
  }

  // Increment views
  sermon.views += 1;
  await sermon.save();

  return sermon;
};

/**
 * Update sermon
 */
const updateSermon = async (sermonId, updateData) => {
  const sermon = await Sermon.findByIdAndUpdate(
    sermonId,
    updateData,
    { new: true, runValidators: true }
  ).populate('uploadedBy', '-password');

  if (!sermon) {
    throw new Error('Sermon not found');
  }

  return sermon;
};

/**
 * Delete sermon
 */
const deleteSermon = async (sermonId) => {
  const sermon = await Sermon.findByIdAndDelete(sermonId);
  if (!sermon) {
    throw new Error('Sermon not found');
  }
  return sermon;
};

/**
 * Increment sermon downloads
 */
const incrementDownloads = async (sermonId) => {
  const sermon = await Sermon.findById(sermonId);
  if (!sermon) {
    throw new Error('Sermon not found');
  }

  sermon.downloads += 1;
  await sermon.save();

  return sermon;
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