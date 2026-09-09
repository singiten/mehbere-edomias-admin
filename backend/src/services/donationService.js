const { Donation, Member, User } = require('../models');

/**
 * Submit a new donation
 */
const submitDonation = async (donationData) => {
  const { memberId, userId, donationType, amount, bankName, referenceNumber, receiptPhotoUrl } = donationData;

  // Check if member exists
  const member = await Member.findById(memberId);
  if (!member) {
    throw new Error('Member not found');
  }

  // Check if reference number already exists
  const existing = await Donation.findOne({ referenceNumber });
  if (existing) {
    throw new Error('Reference number already exists');
  }

  const donation = await Donation.create({
    memberId,
    userId,
    donationType,
    amount,
    bankName,
    referenceNumber,
    receiptPhotoUrl,
  });

  return donation;
};

/**
 * Get all donations with filters
 */
const getAllDonations = async (query = {}) => {
  const { page = 1, limit = 10, status, type, startDate, endDate } = query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = {};
  if (status) filter.status = status;
  if (type) filter.donationType = type;
  if (startDate && endDate) {
    filter.donationDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  const donations = await Donation.find(filter)
    .populate('memberId')
    .populate('userId', '-password')
    .populate('verifiedBy', '-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Donation.countDocuments(filter);

  return {
    data: donations,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    }
  };
};

/**
 * Get donation by ID
 */
const getDonationById = async (donationId) => {
  const donation = await Donation.findById(donationId)
    .populate('memberId')
    .populate('userId', '-password')
    .populate('verifiedBy', '-password');

  if (!donation) {
    throw new Error('Donation not found');
  }

  return donation;
};

/**
 * Get member's donations
 */
const getMemberDonations = async (memberId, query = {}) => {
  const { status } = query;
  const filter = { memberId };
  if (status) filter.status = status;

  const donations = await Donation.find(filter)
    .sort({ createdAt: -1 });

  return donations;
};

/**
 * Get pending donations
 */
const getPendingDonations = async () => {
  const donations = await Donation.find({ status: 'pending' })
    .populate('memberId')
    .populate('userId', '-password')
    .sort({ createdAt: 1 });

  return donations;
};

/**
 * Verify a donation
 */
const verifyDonation = async (donationId, adminId, adminNotes = '') => {
  const donation = await Donation.findById(donationId);
  if (!donation) {
    throw new Error('Donation not found');
  }

  if (donation.status !== 'pending') {
    throw new Error('Donation already processed');
  }

  // Generate receipt number
  const year = new Date().getFullYear();
  const count = await Donation.countDocuments({
    status: 'verified',
    donationDate: {
      $gte: new Date(year, 0, 1),
      $lte: new Date(year, 11, 31),
    }
  });
  const receiptNumber = `REC-${year}-${String(count + 1).padStart(5, '0')}`;

  donation.status = 'verified';
  donation.verifiedBy = adminId;
  donation.verifiedAt = new Date();
  donation.adminNotes = adminNotes;
  donation.receiptNumber = receiptNumber;
  donation.isTaxReceiptGenerated = true;
  await donation.save();

  return donation;
};

/**
 * Reject a donation
 */
const rejectDonation = async (donationId, adminId, adminNotes) => {
  if (!adminNotes) {
    throw new Error('Rejection reason is required');
  }

  const donation = await Donation.findById(donationId);
  if (!donation) {
    throw new Error('Donation not found');
  }

  if (donation.status !== 'pending') {
    throw new Error('Donation already processed');
  }

  donation.status = 'rejected';
  donation.verifiedBy = adminId;
  donation.verifiedAt = new Date();
  donation.adminNotes = adminNotes;
  await donation.save();

  return donation;
};

/**
 * Get donation stats
 */
const getDonationStats = async () => {
  const total = await Donation.aggregate([
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  const byType = await Donation.aggregate([
    { $group: { _id: '$donationType', total: { $sum: '$amount' } } }
  ]);

  const pending = await Donation.countDocuments({ status: 'pending' });
  const verified = await Donation.countDocuments({ status: 'verified' });
  const rejected = await Donation.countDocuments({ status: 'rejected' });
  const totalCount = await Donation.countDocuments();

  const thisMonth = await Donation.aggregate([
    {
      $match: {
        donationDate: { $gte: new Date(new Date().setDate(1)) }
      }
    },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  return {
    totalAmount: total[0]?.total || 0,
    byType,
    pending,
    verified,
    rejected,
    totalCount,
    thisMonth: thisMonth[0]?.total || 0,
  };
};

module.exports = {
  submitDonation,
  getAllDonations,
  getDonationById,
  getMemberDonations,
  getPendingDonations,
  verifyDonation,
  rejectDonation,
  getDonationStats,
};