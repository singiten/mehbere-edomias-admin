const memberService = require('../services/memberService');
const { Member, User } = require('../models');

// ============ GET MY PROFILE ============
const getMyProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    let member = await Member.findOne({ userId: req.user.userId });
    if (!member) {
      member = await Member.create({
        userId: req.user.userId,
        region: 'Not Specified',
        subCity: null,
        spiritualRole: 'regular_member',
        membershipStatus: 'active',
      });
    }

    const user = await User.findById(req.user.userId).select('-password');
    
    return res.status(200).json({
      success: true,
      data: {
        ...member.toObject(),
        user: user
      },
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ UPDATE MY PROFILE ============
const updateMyProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    let member = await Member.findOne({ userId: req.user.userId });
    if (!member) {
      member = await Member.create({
        userId: req.user.userId,
        region: 'Not Specified',
        subCity: null,
        spiritualRole: 'regular_member',
        membershipStatus: 'active',
      });
    }

    const updated = await memberService.updateMember(member._id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updated,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET ALL MEMBERS ============
const getAllMembers = async (req, res) => {
  try {
    const result = await memberService.getAllMembers(req.query);
    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET MEMBER BY ID ============
const getMemberById = async (req, res) => {
  try {
    const member = await memberService.getMemberById(req.params.memberId);
    return res.status(200).json({
      success: true,
      data: member,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ UPDATE MEMBER STATUS ============
const updateMemberStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }
    const member = await memberService.updateMemberStatus(req.params.memberId, status);
    return res.status(200).json({
      success: true,
      message: 'Member status updated successfully',
      data: member,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ UPDATE MEMBER ROLE ============
const updateMemberRole = async (req, res) => {
  try {
    const { spiritualRole } = req.body;
    if (!spiritualRole) {
      return res.status(400).json({
        success: false,
        message: 'Spiritual role is required',
      });
    }
    const member = await memberService.updateMember(req.params.memberId, { spiritualRole });
    return res.status(200).json({
      success: true,
      message: 'Member role updated successfully',
      data: member,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ DELETE MEMBER ============
const deleteMember = async (req, res) => {
  try {
    const member = await memberService.deleteMember(req.params.memberId);
    return res.status(200).json({
      success: true,
      message: 'Member deactivated successfully',
      data: member,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET MEMBER STATS ============
const getMemberStats = async (req, res) => {
  try {
    const stats = await memberService.getMemberStats();
    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllMembers,
  getMemberById,
  getMyProfile,
  updateMyProfile,
  updateMemberStatus,
  updateMemberRole,
  deleteMember,
  getMemberStats,
};