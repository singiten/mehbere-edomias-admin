const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  donationType: {
    type: String,
    enum: ['tithe', 'offering', 'building_fund', 'social_service', 'general', 'other'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: 'ETB',
  },
  bankName: {
    type: String,
    required: true,
  },
  referenceNumber: {
    type: String,
    required: true,
    unique: true,
  },
  receiptPhotoUrl: {
    type: String,
    required: true,
  },
  donationDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending',
  },
  adminNotes: String,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  verifiedAt: Date,
  receiptNumber: String,
  isTaxReceiptGenerated: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Donation', DonationSchema);