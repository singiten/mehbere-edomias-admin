// routes/serviceRoutes.js
const router = require('express').Router();
const serviceController = require('../controllers/serviceController');
const authenticate = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');

// ============ PUBLIC ROUTES ============
router.get('/', serviceController.getAllServices);
router.get('/:serviceId', serviceController.getServiceById);

// ============ ADMIN ROUTES ============
router.post('/', authenticate, isAdmin, serviceController.createService);
router.put('/:serviceId', authenticate, isAdmin, serviceController.updateService);
router.delete('/:serviceId', authenticate, isAdmin, serviceController.deleteService);

module.exports = router;