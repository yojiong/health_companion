const Medication = require('../models/Medication');

const medicationController = {
  createReminder: async (req, res) => {
    try {
      const { medicationName, dosage, frequency, scheduledTime, notes } = req.body;

      const medication = await Medication.create({
        userId: req.user._id,
        medicationName,
        dosage,
        frequency,
        scheduledTime,
        notes
      });

      res.status(201).json(medication);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateReminder: async (req, res) => {
    try {
      const { id } = req.params;
      const { taken, medicationName, dosage, frequency, scheduledTime, notes } = req.body;

      const medication = await Medication.findById(id);

      if (!medication) {
        return res.status(404).json({ message: 'Medication not found' });
      }

      if (taken !== undefined) {
        medication.taken = taken;
        if (taken) {
          medication.takenAt = new Date();
        }
      }

      if (medicationName) medication.medicationName = medicationName;
      if (dosage) medication.dosage = dosage;
      if (frequency) medication.frequency = frequency;
      if (scheduledTime) medication.scheduledTime = scheduledTime;
      if (notes) medication.notes = notes;

      await medication.save();
      res.json(medication);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getReminders: async (req, res) => {
    try {
      const medications = await Medication.find({ userId: req.user._id })
        .sort({ scheduledTime: 1 });
      res.json(medications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteReminder: async (req, res) => {
    try {
      const { id } = req.params;
      const medication = await Medication.findByIdAndDelete(id);

      if (!medication) {
        return res.status(404).json({ message: 'Medication not found' });
      }

      res.json({ message: 'Medication deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  markAsTaken: async (req, res) => {
    try {
      const { id } = req.params;
      const medication = await Medication.findById(id);

      if (!medication) {
        return res.status(404).json({ message: 'Medication not found' });
      }

      medication.taken = true;
      medication.takenAt = new Date();
      await medication.save();

      res.json(medication);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = medicationController;