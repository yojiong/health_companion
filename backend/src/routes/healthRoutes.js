const express = require('express');
const router = express.Router();
const { uploadData, getRealtimeData, getHistoricalData, getPatientData, getPatientHistoricalData, getStats } = require('../controllers/healthController');
const { protect, authorize } = require('../middleware/auth');

router.post('/upload', protect, uploadData);
router.get('/realtime', protect, getRealtimeData);
router.get('/history', protect, getHistoricalData);
router.get('/patient/:patientId', protect, authorize('caregiver', 'institution'), getPatientData);
router.get('/patient/:patientId/history', protect, authorize('caregiver', 'institution'), getPatientHistoricalData);
router.get('/stats', protect, authorize('institution'), getStats);

module.exports = router;