const mongoose = require('mongoose');

const SermonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  preacher: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  sermonType: {
    type: String,
    enum: ['video', 'audio', 'text', 'pdf'],
    default: 'text',
  },
  content: {
    type: String,
  },
  textContent: {
    type: String,
  },
  videoUrl: {
    type: String,
  },
  audioUrl: {
    type: String,
  },
  pdfUrl: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
  dateDelivered: {
    type: Date,
    default: Date.now,
  },
  duration: {
    type: String,
  },
  tags: {
    type: [String],
    default: [],
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
  },
  downloads: {
    type: Number,
    default: 0,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Index for better query performance
SermonSchema.index({ isPublic: 1, isFeatured: 1, dateDelivered: -1 });

module.exports = mongoose.model('Sermon', SermonSchema);