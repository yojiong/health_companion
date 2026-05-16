const HealthData = require('../models/HealthData');
const Alert = require('../models/Alert');
const User = require('../models/User');

const healthController = {
  uploadData: async (req, res) => {
    try {
      const { heartRate, spO2, steps, sleepHours, temperature } = req.body;

      const healthData = await HealthData.create({
        userId: req.user._id,
        heartRate,
        spO2,
        steps,
        sleepHours,
        temperature
      });

      if (heartRate > 100 || heartRate < 50) {
        await Alert.create({
          userId: req.user._id,
          alertType: 'high_heart_rate',
          severity: heartRate > 120 ? 'critical' : 'high',
          message: `Abnormal heart rate detected: ${heartRate} bpm`,
          value: heartRate
        });
      }

      if (spO2 < 90) {
        await Alert.create({
          userId: req.user._id,
          alertType: 'low_spO2',
          severity: 'critical',
          message: `Low blood oxygen detected: ${spO2}%`,
          value: spO2
        });
      }

      if (temperature > 38.5 || temperature < 35) {
        await Alert.create({
          userId: req.user._id,
          alertType: 'abnormal_temperature',
          severity: 'high',
          message: `Abnormal temperature detected: ${temperature}°C`,
          value: temperature
        });
      }

      res.status(201).json(healthData);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getRealtimeData: async (req, res) => {
    try {
      const latestData = await HealthData.findOne({ userId: req.user._id })
        .sort({ timestamp: -1 })
        .limit(1);

      if (!latestData) {
        return res.status(404).json({ message: 'No health data found' });
      }

      res.json(latestData);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getHistoricalData: async (req, res) => {
    try {
      const { period } = req.query;
      let startDate = new Date();

      if (period === 'day') {
        startDate.setHours(startDate.getHours() - 24);
      } else if (period === 'week') {
        startDate.setDate(startDate.getDate() - 7);
      } else if (period === 'month') {
        startDate.setMonth(startDate.getMonth() - 1);
      } else {
        startDate.setDate(startDate.getDate() - 7);
      }

      const data = await HealthData.find({
        userId: req.user._id,
        timestamp: { $gte: startDate }
      }).sort({ timestamp: 1 });

      res.json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getPatientData: async (req, res) => {
    try {
      const { patientId } = req.params;
      const latestData = await HealthData.findOne({ userId: patientId })
        .sort({ timestamp: -1 })
        .limit(1);

      res.json(latestData || {});
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getPatientHistoricalData: async (req, res) => {
    try {
      const { patientId } = req.params;
      const { period } = req.query;
      let startDate = new Date();

      if (period === 'day') {
        startDate.setHours(startDate.getHours() - 24);
      } else if (period === 'week') {
        startDate.setDate(startDate.getDate() - 7);
      } else if (period === 'month') {
        startDate.setMonth(startDate.getMonth() - 1);
      } else {
        startDate.setDate(startDate.getDate() - 7);
      }

      const data = await HealthData.find({
        userId: patientId,
        timestamp: { $gte: startDate }
      }).sort({ timestamp: 1 });

      res.json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getStats: async (req, res) => {
    try {
      const patientCount = await User.countDocuments({ role: 'patient' });
      const caregiverCount = await User.countDocuments({ role: 'caregiver' });
      const todayAlerts = await Alert.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      });
      const criticalAlerts = await Alert.countDocuments({ severity: 'critical', isResolved: false });

      res.json({
        patientCount,
        caregiverCount,
        todayAlerts,
        criticalAlerts
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = healthController;
