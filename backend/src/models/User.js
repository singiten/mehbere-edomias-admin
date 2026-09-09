const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'member', 'visitor'],
    default: 'visitor',
  },
  isVerified: {
    type: Boolean,
    default: true,
  },
  profilePhoto: String,
  notificationPreferences: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: true },
  },
  lastLogin: Date,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual populate for member
UserSchema.virtual('member', {
  ref: 'Member',
  localField: '_id',
  foreignField: 'userId',
  justOne: true,
});

module.exports = mongoose.model('User', UserSchema);