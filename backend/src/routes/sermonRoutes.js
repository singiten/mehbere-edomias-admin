const router = require('express').Router();
const sermonController = require('../controllers/sermonController');
const authenticate = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');

// ============ PUBLIC ROUTES ============
router.get('/public', sermonController.getPublicSermons);
router.get('/:sermonId', sermonController.getSermonById);

// ============ PROTECTED ROUTES ============
router.get('/', authenticate, isAdmin, sermonController.getAllSermons);
router.post('/', authenticate, isAdmin, sermonController.createSermon);
router.put('/:sermonId', authenticate, isAdmin, sermonController.updateSermon);
router.delete('/:sermonId', authenticate, isAdmin, sermonController.deleteSermon);
router.post('/:sermonId/download', authenticate, sermonController.incrementDownloads);

module.exports = router;