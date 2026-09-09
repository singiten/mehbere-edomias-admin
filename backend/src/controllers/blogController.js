const blogService = require('../services/blogService');

// ============ CREATE BLOG POST ============
const createBlogPost = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    const blogData = {
      ...req.body,
      authorId: req.user.userId || req.user._id,
    };

    const blog = await blogService.createBlogPost(blogData);
    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: blog,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET ALL BLOG POSTS ============
const getAllBlogPosts = async (req, res) => {
  try {
    const result = await blogService.getAllBlogPosts(req.query);
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET PUBLISHED BLOG POSTS ============
const getPublishedBlogPosts = async (req, res) => {
  try {
    const result = await blogService.getPublishedBlogPosts(req.query);
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET BLOG POST BY SLUG ============
const getBlogPostBySlug = async (req, res) => {
  try {
    const blog = await blogService.getBlogPostBySlug(req.params.slug);
    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET BLOG POST BY ID ============
const getBlogPostById = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    const blog = await blogService.getBlogPostById(req.params.blogId);
    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ UPDATE BLOG POST ============
const updateBlogPost = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    const blog = await blogService.updateBlogPost(req.params.blogId, req.body);
    res.status(200).json({
      success: true,
      message: 'Blog post updated successfully',
      data: blog,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ DELETE BLOG POST ============
const deleteBlogPost = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    await blogService.deleteBlogPost(req.params.blogId);
    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET FEATURED BLOG POSTS ============
const getFeaturedBlogPosts = async (req, res) => {
  try {
    const blogs = await blogService.getFeaturedBlogPosts();
    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
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
};