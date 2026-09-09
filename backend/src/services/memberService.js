const { User, Member } = require('../models');
const { generateMembershipId } = require('../utils/auth');

/**
 * Get all members with pagination
 */
const getAllMembers = async (query = {}) => {
  const { page = 1, limit = 10, status, region, search } = query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build filter
  const filter = {};
  if (status) filter.membershipStatus = status;
  if (region) filter.region = region;
  if (search) {
    const users = await User.find({
      $or: [
        { fullName: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ]
    }).select('_id');
    filter.userId = { $in: users.map(u => u._id) };
  }

  const members = await Member.find(filter)
    .populate('userId', '-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Member.countDocuments(filter);

  return {
    data: members,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    }
  };
};

/**
 * Get member by ID
 */
const getMemberById = async (memberId) => {
  const member = await Member.findById(memberId).populate('userId', '-password');
  if (!member) {
    throw new Error('Member not found');
  }
  return member;
};

/**
 * Get member by user ID
 */
const getMemberByUserId = async (userId) => {
  const member = await Member.findOne({ userId }).populate('userId', '-password');
  if (!member) {
    throw new Error('Member not found');
  }
  return member;
};

/**
 * Update member profile
 */
const updateMember = async (memberId, updateData) => {
  const member = await Member.findByIdAndUpdate(
    memberId,
    updateData,
    { new: true, runValidators: true }
  ).populate('userId', '-password');

  if (!member) {
    throw new Error('Member not found');
  }

  return member;
};

/**
 * Update member status
 */
const updateMemberStatus = async (memberId, status) => {
  const member = await Member.findByIdAndUpdate(
    memberId,
    { membershipStatus: status },
    { new: true }
  ).populate('userId', '-password');

  if (!member) {
    throw new Error('Member not found');
  }

  return member;
};

/**
 * Delete member (soft delete - deactivate)
 */
const deleteMember = async (memberId) => {
  const member = await Member.findByIdAndUpdate(
    memberId,
    { membershipStatus: 'inactive' },
    { new: true }
  );

  if (!member) {
    throw new Error('Member not found');
  }

  return member;
};

/**
 * Get member stats (for dashboard)
 */
const getMemberStats = async () => {
  const total = await Member.countDocuments();
  const active = await Member.countDocuments({ membershipStatus: 'active' });
  const inactive = await Member.countDocuments({ membershipStatus: 'inactive' });
  const suspended = await Member.countDocuments({ membershipStatus: 'suspended' });
  const newThisMonth = await Member.countDocuments({
    createdAt: { $gte: new Date(new Date().setDate(1)) }
  });

  return { total, active, inactive, suspended, newThisMonth };
};

module.exports = {
  getAllMembers,
  getMemberById,
  getMemberByUserId,
  updateMember,
  updateMemberStatus,
  deleteMember,
  getMemberStats,
};