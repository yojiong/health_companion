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

/* =========================
   CORS（统一修复）
========================= */
const allowedOrigins = [
  'http://localhost:5173',
  'https://health-companion-1.onrender.com',
  'https://health-companion-2.onrender.com'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

/* =========================
   HTTP + Socket
========================= */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

/* =========================
   DB Init
========================= */
connectDB().then(() => {
  console.log('DB connected');
  initDemoUsers();
});

/* =========================
   Demo users
========================= */
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
      }
    ];

    for (const userData of demoUsers) {
      const exists = await User.findOne({ email: userData.email });
      if (!exists) {
        await User.create(userData);
        console.log(`Created demo user: ${userData.email}`);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

/* =========================
   Routes
========================= */
app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/alerts', alertRoutes);

app.get('/api/health-check', (req, res) => {
  res.json({ status: 'ok' });
});

/* =========================
   Socket
========================= */
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join', (userId) => {
    if (!userId) return;
    socket.join(userId);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });
});

/* =========================
   防止重复 interval
========================= */
let intervalStarted = false;

const simulateSensorData = async () => {
  try {
    const patients = await User.find({ role: 'patient' });

    for (const patient of patients) {
      const heartRate = Math.floor(Math.random() * 40) + 60;
      const spO2 = Math.floor(Math.random() * 8) + 92;
      const temperature = Math.random() * 2 + 36;

      const data = await HealthData.create({
        userId: patient._id,
        heartRate,
        spO2,
        temperature,
        steps: Math.floor(Math.random() * 500),
        sleepHours: Math.random() * 4 + 6
      });

      io.to(patient._id.toString()).emit('healthData', data);

      // heart alert
      if (heartRate > 100) {
        const alert = await Alert.create({
          userId: patient._id,
          alertType: 'heart_rate',
          severity: heartRate > 120 ? 'critical' : 'high',
          message: `Heart rate: ${heartRate}`,
          value: heartRate
        });

        io.to(patient._id.toString()).emit('alert', alert);
      }

      // oxygen alert
      if (spO2 < 90) {
        const alert = await Alert.create({
          userId: patient._id,
          alertType: 'spO2',
          severity: 'critical',
          message: `Low SpO2: ${spO2}%`,
          value: spO2
        });

        io.to(patient._id.toString()).emit('alert', alert);
      }
    }
  } catch (err) {
    console.error('Simulation error:', err);
  }
};

/* =========================
   start interval ONLY ONCE
========================= */
if (!intervalStarted) {
  setInterval(simulateSensorData, 5000);
  intervalStarted = true;
}

/* =========================
   Start server
========================= */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
