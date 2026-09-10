
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
router.get('/stats/overview', authenticate, isAdmin, serviceController.getServiceStats);

// ============ IMAGE ROUTES ============
router.post('/:serviceId/images', authenticate, isAdmin, serviceController.addServiceImage);
router.delete('/:serviceId/images/:imageId', authenticate, isAdmin, serviceController.removeServiceImage);

module.exports = router;