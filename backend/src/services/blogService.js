const { BlogPost } = require('../models');
const { generateSlug, calculateReadTime } = require('../utils/helpers');

/**
 * Create a blog post
 */
const createBlogPost = async (blogData) => {
  const { title, content, authorId, status = 'draft', isFeatured = false } = blogData;
  
  // Generate slug
  const slug = generateSlug(title);
  
  // Check if slug already exists
  const existingPost = await BlogPost.findOne({ slug });
  if (existingPost) {
    throw new Error('A blog post with this title already exists');
  }
  
  // Calculate read time
  const readTime = calculateReadTime(content);

  // Prepare data
  const postData = {
    ...blogData,
    slug,
    readTime,
    status,
    isFeatured,
    isPublished: status === 'published',
    publishedAt: status === 'published' ? new Date() : null,
  };

  // Create blog post
  const blogPost = await BlogPost.create(postData);
  
  // Populate author
  return await BlogPost.findById(blogPost._id).populate('authorId', '-password');
};

/**
 * Get all blog posts with filters (Admin)
 */
const getAllBlogPosts = async (query = {}) => {
  const { 
    page = 1, 
    limit = 10, 
    category, 
    status, 
    search, 
    sortBy = 'createdAt', 
    sortOrder = 'desc' 
  } = query;
  
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = {};
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
    ];
  }

  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const blogPosts = await BlogPost.find(filter)
    .populate('authorId', '-password')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await BlogPost.countDocuments(filter);

  return {
    data: blogPosts,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    }
  };
};

/**
 * Get published blog posts (Public)
 */
const getPublishedBlogPosts = async (query = {}) => {
  const { page = 1, limit = 10, category, search } = query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = { 
    status: 'published', 
    isPublished: true 
  };
  
  if (category) filter.category = category;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
    ];
  }

  const blogPosts = await BlogPost.find(filter)
    .populate('authorId', '-password')
    .sort({ publishedAt: -1, createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await BlogPost.countDocuments(filter);

  return {
    data: blogPosts,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    }
  };
};

/**
 * Get blog post by slug (Public)
 */
const getBlogPostBySlug = async (slug) => {
  const blogPost = await BlogPost.findOne({ 
    slug, 
    status: 'published',
    isPublished: true 
  }).populate('authorId', '-password');
  
  if (!blogPost) {
    throw new Error('Blog post not found');
  }
  
  // Increment views
  blogPost.views += 1;
  await blogPost.save();

  return blogPost;
};

/**
 * Get blog post by ID (Admin)
 */
const getBlogPostById = async (blogId) => {
  const blogPost = await BlogPost.findById(blogId).populate('authorId', '-password');
  if (!blogPost) {
    throw new Error('Blog post not found');
  }
  return blogPost;
};

/**
 * Update blog post
 */
const updateBlogPost = async (blogId, updateData) => {
  // If title is updated, regenerate slug
  if (updateData.title) {
    const newSlug = generateSlug(updateData.title);
    // Check if new slug already exists (excluding current post)
    const existingPost = await BlogPost.findOne({ 
      slug: newSlug, 
      _id: { $ne: blogId } 
    });
    if (existingPost) {
      throw new Error('A blog post with this title already exists');
    }
    updateData.slug = newSlug;
  }

  // If content is updated, recalculate read time
  if (updateData.content) {
    updateData.readTime = calculateReadTime(updateData.content);
  }

  // Handle status change
  if (updateData.status === 'published' && !updateData.publishedAt) {
    updateData.publishedAt = new Date();
    updateData.isPublished = true;
  }
  
  if (updateData.status === 'draft') {
    updateData.isPublished = false;
    updateData.publishedAt = null;
  }

  const blogPost = await BlogPost.findByIdAndUpdate(
    blogId,
    updateData,
    { new: true, runValidators: true }
  ).populate('authorId', '-password');

  if (!blogPost) {
    throw new Error('Blog post not found');
  }

  return blogPost;
};

/**
 * Delete blog post
 */
const deleteBlogPost = async (blogId) => {
  const blogPost = await BlogPost.findByIdAndDelete(blogId);
  if (!blogPost) {
    throw new Error('Blog post not found');
  }
  return blogPost;
};

/**
 * Get featured blog posts
 */
const getFeaturedBlogPosts = async (limit = 3) => {
  const blogPosts = await BlogPost.find({
    status: 'published',
    isPublished: true,
    isFeatured: true,
  })
    .populate('authorId', '-password')
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(limit);

  return blogPosts;
};

/**
 * Get blog posts by category
 */
const getBlogPostsByCategory = async (category, limit = 10) => {
  const blogPosts = await BlogPost.find({
    status: 'published',
    isPublished: true,
    category,
  })
    .populate('authorId', '-password')
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(limit);

  return blogPosts;
};

module.exports = {
  createBlogPost,
  getAllBlogPosts,
  getPublishedBlogPosts,
  getBlogPostBySlug,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
  getFeaturedBlogPosts,
  getBlogPostsByCategory,
};