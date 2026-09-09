const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    required: true,
  },
  excerpt: String,
  category: {
    type: String,
    enum: ['spiritual_teaching', 'association_news', 'event_recap', 'announcement'],
    required: true,
  },
  featuredImage: String,
  tags: [String],
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  publishedAt: Date,
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  readTime: Number,
  views: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Index for better query performance
BlogPostSchema.index({ status: 1, isFeatured: 1, createdAt: -1 });
BlogPostSchema.index({ slug: 1 });

module.exports = mongoose.model('BlogPost', BlogPostSchema);