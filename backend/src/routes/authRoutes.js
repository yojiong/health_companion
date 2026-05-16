const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, getAllPatients, assignPatient } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/patients', protect, authorize('caregiver', 'institution'), getAllPatients);
router.post('/assign-patient', protect, authorize('caregiver'), assignPatient);

module.exports = router;