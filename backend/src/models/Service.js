// models/Service.js
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