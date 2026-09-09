
const mongoose = require('mongoose');
const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  time: {
    type: String,
  },
  location: {
    name: String,
    address: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  eventType: {
    type: String,
    enum: ['liturgy', 'fasting', 'feast', 'seminar', 'conference', 'community_service', 'fundraising', 'other'],
    default: 'other',
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming',
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  isVirtual: {
    type: Boolean,
    default: false,
  },
  meetingLink: {
    type: String,
  },
  capacity: {
    type: Number,
  },
  registeredCount: {
    type: Number,
    default: 0,
  },
  featuredImage: {
    type: String,
  },
  organizer: {
    type: String,
  },
  contactEmail: {
    type: String,
  },
  contactPhone: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Index for better query performance
EventSchema.index({ date: 1, status: 1, isPublic: 1 });

module.exports = mongoose.model('Event', EventSchema);