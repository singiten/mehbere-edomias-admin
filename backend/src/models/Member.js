const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  membershipId: {
    type: String,
    unique: true,
  },
  region: {
    type: String,
    required: true,
  },
  subCity: String,
  spiritualRole: {
    type: String,
    enum: ['priest', 'deacon', 'choir', 'youth_leader', 'elder', 'regular_member'],
    default: 'regular_member',
  },
  baptismalName: String,
  dateOfBaptism: Date,
  familyMembers: {
    type: [{
      name: String,
      relationship: String,
      age: Number,
    }],
    default: [],
  },
  membershipStatus: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
  },
  joinedDate: {
    type: Date,
    default: Date.now,
  },
  notes: String,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// ✅ Generate membership ID without using next()
MemberSchema.pre('save', async function() {
  if (!this.membershipId) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Member').countDocuments() + 1;
    this.membershipId = `ME-${year}-${String(count).padStart(4, '0')}`;
  }
});

module.exports = mongoose.model('Member', MemberSchema);