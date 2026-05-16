const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  caregiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  alertType: { type: String, enum: ['high_heart_rate', 'low_spO2', 'fall_detected', 'medication_missed', 'abnormal_temperature'], required: true },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
  message: { type: String, required: true },
  value: { type: Number },
  location: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  isRead: { type: Boolean, default: false },
  isResolved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', alertSchema);