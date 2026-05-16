const HealthData = require('../models/HealthData');
const Alert = require('../models/Alert');
const User = require('../models/User');

/**
 * 生成模拟数据（只用于没有数据时 fallback）
 */
const generateSimulationData = (userId, count = 1, startDate = new Date()) => {
  const data = [];

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(startDate.getTime() - (count - 1 - i) * 5000);

    data.push({
      userId,
      heartRate: Math.floor(Math.random() * 40) + 60,
      spO2: Math.floor(Math.random() * 8) + 92,
      temperature: Math.random() * 2 + 36,
      steps: Math.floor(Math.random() * 500),
      sleepHours: Math.random() * 4 + 6,
      timestamp
    });
  }

  return data;
};

const healthController = {

  // =========================
  // 上传数据
  // =========================
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

      // 心率异常
      if (heartRate > 100 || heartRate < 50) {
        const exists = await Alert.findOne({
          userId: req.user._id,
          alertType: 'heart_rate',
          isResolved: false
        });

        if (!exists) {
          await Alert.create({
            userId: req.user._id,
            alertType: 'heart_rate',
            severity: heartRate > 120 ? 'critical' : 'high',
            message: `Abnormal heart rate: ${heartRate} bpm`,
            value: heartRate
          });
        }
      }

      // 血氧异常
      if (spO2 < 90) {
        await Alert.create({
          userId: req.user._id,
          alertType: 'spO2',
          severity: 'critical',
          message: `Low SpO2 detected: ${spO2}%`,
          value: spO2
        });
      }

      // 体温异常
      if (temperature > 38.5 || temperature < 35) {
        await Alert.create({
          userId: req.user._id,
          alertType: 'temperature',
          severity: 'high',
          message: `Abnormal temperature: ${temperature}°C`,
          value: temperature
        });
      }

      res.status(201).json(healthData);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // =========================
  // 实时数据
  // =========================
  getRealtimeData: async (req, res) => {
    try {
      let latest = await HealthData.findOne({ userId: req.user._id })
        .sort({ createdAt: -1 });

      if (!latest) {
        const sim = generateSimulationData(req.user._id, 1)[0];
        latest = await HealthData.create(sim);
      }

      res.json(latest);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // =========================
  // 历史数据（重点优化）
  // =========================
 getHistoricalData: async (req, res) => {
  try {
    const { period = 'day' } = req.query;

    let count = 24;
    if (period === 'week') count = 7 * 24;
    if (period === 'month') count = 30 * 24;

    let data = await HealthData.find({ userId: req.user._id })
      .sort({ createdAt: 1 });

    // ❗关键：如果没数据 → 强制生成
    if (!data || data.length < 10) {
      data = Array.from({ length: count }, (_, i) => ({
        userId: req.user._id,
        heartRate: 60 + Math.random() * 40,
        spO2: 92 + Math.random() * 6,
        temperature: 36 + Math.random(),
        steps: Math.floor(Math.random() * 300),
        sleepHours: 6 + Math.random() * 2,
        createdAt: new Date(Date.now() - i * 60000)
      }));
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

  // =========================
  // 病人实时数据
  // =========================
  getPatientData: async (req, res) => {
    try {
      const { patientId } = req.params;

      let latest = await HealthData.findOne({ userId: patientId })
        .sort({ createdAt: -1 });

      if (!latest) {
        latest = generateSimulationData(patientId, 1)[0];
        await HealthData.create(latest);
      }

      res.json(latest);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // =========================
  // 病人历史数据
  // =========================
  getPatientHistoricalData: async (req, res) => {
    try {
      const { patientId } = req.params;
      const { period = 'week' } = req.query;

      let startDate = new Date();
      let limit = 200;

      if (period === 'day') {
        startDate.setDate(startDate.getDate() - 1);
        limit = 100;
      } else if (period === 'week') {
        startDate.setDate(startDate.getDate() - 7);
      } else if (period === 'month') {
        startDate.setMonth(startDate.getMonth() - 1);
        limit = 300;
      }

      let data = await HealthData.find({
        userId: patientId,
        createdAt: { $gte: startDate }
      }).sort({ createdAt: 1 });

      if (data.length === 0) {
        data = generateSimulationData(patientId, limit, new Date());
      }

      res.json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // =========================
  // 统计
  // =========================
  getStats: async (req, res) => {
    try {
      const patientCount = await User.countDocuments({ role: 'patient' });
      const caregiverCount = await User.countDocuments({ role: 'caregiver' });

      const todayAlerts = await Alert.countDocuments({
        createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
      });

      const criticalAlerts = await Alert.countDocuments({
        severity: 'critical',
        isResolved: false
      });

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
