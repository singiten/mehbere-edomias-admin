const router = require('express').Router();
const memberController = require('../controllers/memberController');
const authenticate = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');

// ============ PROTECTED ROUTES ============

// Get my own profile (any authenticated user)
router.get('/me/profile', authenticate, memberController.getMyProfile);

// Update my own profile (any authenticated user)
router.put('/me/profile', authenticate, memberController.updateMyProfile);

// Admin only routes
router.get('/', authenticate, isAdmin, memberController.getAllMembers);
router.get('/stats', authenticate, isAdmin, memberController.getMemberStats);
router.get('/:memberId', authenticate, isAdmin, memberController.getMemberById);
router.put('/:memberId/status', authenticate, isAdmin, memberController.updateMemberStatus);
router.put('/:memberId/role', authenticate, isAdmin, memberController.updateMemberRole);
router.delete('/:memberId', authenticate, isAdmin, memberController.deleteMember);

module.exports = router;