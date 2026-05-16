const express = require('express');
const router = express.Router();
const { createReminder, updateReminder, getReminders, deleteReminder, markAsTaken } = require('../controllers/medicationController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createReminder);
router.get('/', protect, getReminders);
router.put('/:id', protect, updateReminder);
router.delete('/:id', protect, deleteReminder);
router.put('/:id/take', protect, markAsTaken);

module.exports = router;