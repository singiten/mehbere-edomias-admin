const router = require('express').Router();
const blogController = require('../controllers/blogController');
const authenticate = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');

// ============ PUBLIC ROUTES ============
router.get('/published', blogController.getPublishedBlogPosts);
router.get('/featured', blogController.getFeaturedBlogPosts);
router.get('/:slug', blogController.getBlogPostBySlug);

// ============ ADMIN ROUTES ============
router.get('/', authenticate, isAdmin, blogController.getAllBlogPosts);
router.post('/', authenticate, isAdmin, blogController.createBlogPost);
router.get('/id/:blogId', authenticate, isAdmin, blogController.getBlogPostById);
router.put('/:blogId', authenticate, isAdmin, blogController.updateBlogPost);
router.delete('/:blogId', authenticate, isAdmin, blogController.deleteBlogPost);

module.exports = router;