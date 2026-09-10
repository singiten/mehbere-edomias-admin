// backend/models/Service.js
const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  detailedDescription: {
    type: String,
    default: '',
  },
  schedule: {
    type: String,
  },
  icon: {
    type: String,
    default: '⛪',
  },
  type: {
    type: String,
    enum: ['Liturgy', 'Fasting', 'Feast Days', 'Education', 'Outreach', 'Other'],
    default: 'Other',
  },
  // NEW: Image gallery
  images: [{
    url: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: '',
    },
    caption_amharic: {
      type: String,
      default: '',
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  // NEW: Impact statistics
  impact: {
    peopleServed: {
      type: Number,
      default: 0,
    },
    churchesSupported: {
      type: Number,
      default: 0,
    },
    eventsHeld: {
      type: Number,
      default: 0,
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Service', ServiceSchema);