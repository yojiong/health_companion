const Alert = require('../models/Alert');

const alertController = {
  getAlerts: async (req, res) => {
    try {
      const alerts = await Alert.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .limit(50);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getCaregiverAlerts: async (req, res) => {
    try {
      const alerts = await Alert.find()
        .populate('userId', 'name')
        .sort({ createdAt: -1 })
        .limit(100);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getUnreadAlerts: async (req, res) => {
    try {
      const alerts = await Alert.find({ isRead: false, isResolved: false })
        .populate('userId', 'name')
        .sort({ createdAt: -1 });
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  markAsRead: async (req, res) => {
    try {
      const { id } = req.params;
      const alert = await Alert.findByIdAndUpdate(id, { isRead: true }, { new: true });
      res.json(alert);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  resolveAlert: async (req, res) => {
    try {
      const { id } = req.params;
      const alert = await Alert.findByIdAndUpdate(id, { isResolved: true }, { new: true });
      res.json(alert);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAlertStats: async (req, res) => {
    try {
      const total = await Alert.countDocuments();
      const unread = await Alert.countDocuments({ isRead: false });
      const critical = await Alert.countDocuments({ severity: 'critical', isResolved: false });
      const today = await Alert.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      });

      res.json({ total, unread, critical, today });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = alertController;