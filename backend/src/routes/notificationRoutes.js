const router = require('express').Router();
const notificationController = require('../controllers/notificationController');
const authenticate = require('../middleware/auth');

// ============ PROTECTED ROUTES ============
router.get('/', authenticate, notificationController.getMyNotifications);
router.get('/unread/count', authenticate, notificationController.getUnreadCount);
router.put('/:notificationId/read', authenticate, notificationController.markAsRead);
router.put('/read-all', authenticate, notificationController.markAllAsRead);
router.delete('/:notificationId', authenticate, notificationController.deleteNotification);

module.exports = router;