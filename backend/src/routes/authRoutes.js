
const router = require('express').Router();
const authController = require('../controllers/authController');
const authenticate = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');

console.log('🔍 authController methods:', Object.keys(authController));
console.log('🔍 register type:', typeof authController.register);
console.log('🔍 login type:', typeof authController.login);
console.log('🔍 logout type:', typeof authController.logout);
console.log('🔍 getCurrentUser type:', typeof authController.getCurrentUser);
console.log('🔍 createMember type:', typeof authController.createMember);
// ============ PUBLIC ROUTES ============
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// ============ PROTECTED ROUTES ============
router.get('/me', authenticate, authController.getCurrentUser);

// ============ ADMIN ROUTES ============
router.post('/admin/create-member', authenticate, isAdmin, authController.createMember);

module.exports = router;



// DEBUG: Log what's imported


// ... rest of routes