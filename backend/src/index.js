require('dotenv').config();


const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const healthRoutes = require('./routes/healthRoutes');
const medicationRoutes = require('./routes/medicationRoutes');
const alertRoutes = require('./routes/alertRoutes');

const User = require('./models/User');
const HealthData = require('./models/HealthData');
const Alert = require('./models/Alert');

const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://health-companion-1-nfd5.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

const initDemoUsers = async () => {
  try {
    const demoUsers = [
      {
        name: 'Demo Patient',
        email: 'patient@demo.com',
        password: 'password',
        role: 'patient',
        phone: '123-456-7890'
      },
      {
        name: 'Demo Caregiver',
        email: 'care@demo.com',
        password: 'password',
        role: 'caregiver',
        phone: '098-765-4321'
      },
      {
        name: 'Demo Institution',
        email: 'inst@demo.com',
        password: 'password',
        role: 'institution',
        phone: '111-222-3333',
        institutionName: 'Health Care Institution'
      }
    ];

    for (const userData of demoUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        await User.create(userData);
        console.log(`Created demo user: ${userData.email}`);
      }
    }
  } catch (error) {
    console.error('Error initializing demo users:', error);
  }
};

connectDB().then(() => {
  initDemoUsers();
});


app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/alerts', alertRoutes);

app.get('/api/health-check', (req, res) => {
  res.json({ status: 'ok', message: 'Health Companion API is running' });
});

const simulateSensorData = async () => {
  try {
    const patients = await User.find({ role: 'patient' });

    for (const patient of patients) {
      const heartRate = Math.floor(Math.random() * 40) + 60;
      const spO2 = Math.floor(Math.random() * 8) + 92;
      const temperature = (Math.random() * 2) + 36;
      const steps = Math.floor(Math.random() * 500);
      const sleepHours = Math.random() * 4 + 6;

      const healthData = await HealthData.create({
        userId: patient._id,
        heartRate,
        spO2,
        steps,
        sleepHours,
        temperature
      });

      io.to(patient._id.toString()).emit('healthData', healthData);

      if (heartRate > 100) {
        const existingAlert = await Alert.findOne({
          userId: patient._id,
          alertType: 'high_heart_rate',
          isResolved: false,
          createdAt: { $gte: new Date(Date.now() - 60000) }
        });

        if (!existingAlert) {
          const alert = await Alert.create({
            userId: patient._id,
            alertType: 'high_heart_rate',
            severity: heartRate > 120 ? 'critical' : 'high',
            message: `High heart rate detected: ${heartRate} bpm`,
            value: heartRate
          });

          const caregivers = await User.find({ role: 'caregiver' });
          caregivers.forEach(caregiver => {
            io.to(caregiver._id.toString()).emit('alert', alert);
          });
        }
      }

      if (spO2 < 90) {
        const existingAlert = await Alert.findOne({
          userId: patient._id,
          alertType: 'low_spO2',
          isResolved: false,
          createdAt: { $gte: new Date(Date.now() - 60000) }
        });

        if (!existingAlert) {
          const alert = await Alert.create({
            userId: patient._id,
            alertType: 'low_spO2',
            severity: 'critical',
            message: `Low blood oxygen detected: ${spO2}%`,
            value: spO2
          });

          const caregivers = await User.find({ role: 'caregiver' });
          caregivers.forEach(caregiver => {
            io.to(caregiver._id.toString()).emit('alert', alert);
          });
        }
      }
    }
  } catch (error) {
    console.error('Sensor simulation error:', error);
  }
};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

setInterval(simulateSensorData, 5000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
