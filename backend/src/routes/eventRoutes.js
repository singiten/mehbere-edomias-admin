const router = require('express').Router();
const eventController = require('../controllers/eventController');
const authenticate = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');

// ============ PUBLIC ROUTES ============
router.get('/upcoming', eventController.getUpcomingEvents);
router.get('/', eventController.getAllEvents);
router.get('/:eventId', eventController.getEventById);

// ============ PROTECTED ROUTES ============
router.post('/', authenticate, isAdmin, eventController.createEvent);
router.put('/:eventId', authenticate, isAdmin, eventController.updateEvent);
router.delete('/:eventId', authenticate, isAdmin, eventController.deleteEvent);
router.put('/status/update-all', authenticate, isAdmin, eventController.updateEventStatuses);

module.exports = router;