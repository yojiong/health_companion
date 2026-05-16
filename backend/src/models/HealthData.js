const mongoose = require('mongoose');

const healthDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  heartRate: { type: Number, required: true },
  spO2: { type: Number, required: true },
  steps: { type: Number, default: 0 },
  sleepHours: { type: Number, default: 0 },
  temperature: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HealthData', healthDataSchema);