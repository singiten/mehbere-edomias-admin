const donationService = require('../services/donationService');
const { Member } = require('../models');

// ============ SUBMIT DONATION ============
const submitDonation = async (req, res) => {
  try {
    // ✅ Check if req.user exists
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    // ✅ Get member using userId from token
    const member = await Member.findOne({ userId: req.user.userId });
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member profile not found. Please contact admin.',
      });
    }

    const donationData = {
      ...req.body,
      memberId: member._id,
      userId: req.user.userId,
    };

    const donation = await donationService.submitDonation(donationData);
    res.status(201).json({
      success: true,
      message: 'Donation submitted successfully. Awaiting verification.',
      data: donation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET MY DONATIONS ============
const getMyDonations = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    const member = await Member.findOne({ userId: req.user.userId });
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member profile not found.',
      });
    }

    const donations = await donationService.getMemberDonations(member._id, req.query);
    res.status(200).json({
      success: true,
      data: donations,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET ALL DONATIONS ============
const getAllDonations = async (req, res) => {
  try {
    const result = await donationService.getAllDonations(req.query);
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

// ============ GET DONATION BY ID ============
const getDonationById = async (req, res) => {
  try {
    const donation = await donationService.getDonationById(req.params.donationId);
    res.status(200).json({
      success: true,
      data: donation,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET PENDING DONATIONS ============
const getPendingDonations = async (req, res) => {
  try {
    const donations = await donationService.getPendingDonations();
    res.status(200).json({
      success: true,
      data: donations,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ VERIFY DONATION ============
const verifyDonation = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    const { adminNotes } = req.body;
    const donation = await donationService.verifyDonation(
      req.params.donationId,
      req.user.userId,
      adminNotes
    );
    res.status(200).json({
      success: true,
      message: 'Donation verified successfully',
      data: donation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ REJECT DONATION ============
const rejectDonation = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    const { adminNotes } = req.body;
    if (!adminNotes) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required',
      });
    }
    const donation = await donationService.rejectDonation(
      req.params.donationId,
      req.user.userId,
      adminNotes
    );
    res.status(200).json({
      success: true,
      message: 'Donation rejected',
      data: donation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET DONATION STATS ============
const getDonationStats = async (req, res) => {
  try {
    const stats = await donationService.getDonationStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  submitDonation,
  getAllDonations,
  getDonationById,
  getMyDonations,
  getPendingDonations,
  verifyDonation,
  rejectDonation,
  getDonationStats,
};