const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authController = {
  register: async (req, res) => {
    try {
      const { name, email, password, role, phone, address, dateOfBirth, gender, institutionName } = req.body;

      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const user = await User.create({
        name,
        email,
        password,
        role,
        phone,
        address,
        dateOfBirth,
        gender,
        institutionName
      });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'health_companion_jwt_secret_key_2024', {
        expiresIn: '30d'
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (user && (await user.matchPassword(password))) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'health_companion_jwt_secret_key_2024', {
          expiresIn: '30d'
        });

        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token
        });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select('-password');
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const { name, phone, address, emergencyContact, medicalHistory } = req.body;
      const user = await User.findById(req.user._id);

      if (user) {
        user.name = name || user.name;
        user.phone = phone || user.phone;
        user.address = address || user.address;
        user.emergencyContact = emergencyContact || user.emergencyContact;
        user.medicalHistory = medicalHistory || user.medicalHistory;

        const updatedUser = await user.save();
        res.json({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          phone: updatedUser.phone,
          address: updatedUser.address
        });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAllPatients: async (req, res) => {
    try {
      const patients = await User.find({ role: 'patient' }).select('-password');
      res.json(patients);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  assignPatient: async (req, res) => {
    try {
      const { patientId } = req.body;
      const caregiver = await User.findById(req.user._id);

      if (!caregiver.assignedPatients.includes(patientId)) {
        caregiver.assignedPatients.push(patientId);
        await caregiver.save();
      }

      res.json({ message: 'Patient assigned successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = authController;