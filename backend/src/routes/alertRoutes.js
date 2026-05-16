const express = require('express');
const router = express.Router();
const { getAlerts, getCaregiverAlerts, getUnreadAlerts, markAsRead, resolveAlert, getAlertStats } = require('../controllers/alertController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getAlerts);
router.get('/caregiver', protect, authorize('caregiver', 'institution'), getCaregiverAlerts);
router.get('/unread', protect, authorize('caregiver', 'institution'), getUnreadAlerts);
router.get('/stats', protect, authorize('caregiver', 'institution'), getAlertStats);
router.put('/:id/read', protect, markAsRead);
router.put('/:id/resolve', protect, resolveAlert);

module.exports = router;