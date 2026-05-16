import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import MetricCard from '../components/MetricCard';
import HealthChart from '../components/HealthChart';
import GaugeChart from '../components/GaugeChart';
import { healthAPI } from '../utils/api';
import { Activity, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [healthData, setHealthData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('normal');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('healthData', (data) => {
        setHealthData(data);
        updateStatus(data);
      });
      return () => socket.off('healthData');
    }
  }, [socket]);

  const loadData = async () => {
    try {
      const data = await healthAPI.getRealtimeData();
      if (data) {
        setHealthData(data);
        updateStatus(data);
      }
      const history = await healthAPI.getHistoricalData('day');
      if (history && history.length > 0) {
        const formattedHistory = history.map((item, index) => ({
          time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          heartRate: item.heartRate,
          spO2: item.spO2,
          temperature: item.temperature
        }));
        setHistoryData(formattedHistory.slice(-20));
      }
    } catch (error) {
      console.error('Error loading health data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = (data) => {
    if (data.heartRate > 100 || data.spO2 < 90 || data.temperature > 38) {
      setStatus('warning');
    } else if (data.heartRate > 120 || data.spO2 < 85) {
      setStatus('critical');
    } else {
      setStatus('normal');
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'critical': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-green-400';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'critical': return <XCircle className="w-6 h-6" />;
      case 'warning': return <AlertTriangle className="w-6 h-6" />;
      default: return <CheckCircle className="w-6 h-6" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'critical': return 'Critical - Immediate Attention Required';
      case 'warning': return 'Warning - Please Monitor';
      default: return 'All Metrics Normal';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-medical-cyan"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name}</h1>
          <p className="text-gray-400">Real-time Health Monitoring Dashboard</p>
        </div>

        <div className={`glass rounded-2xl p-6 mb-6 flex items-center justify-between ${getStatusColor()}`}>
          <div className="flex items-center space-x-4">
            {getStatusIcon()}
            <div>
              <h2 className="font-semibold text-lg">Health Status</h2>
              <p className="text-sm opacity-80">{getStatusText()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span className="text-sm">Last updated: {healthData ? new Date(healthData.timestamp).toLocaleTimeString() : 'N/A'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <MetricCard
            title="Heart Rate"
            value={healthData?.heartRate || '--'}
            unit="bpm"
            icon="heart"
            color="red"
            trend={2}
          />
          <MetricCard
            title="Blood Oxygen"
            value={healthData?.spO2 || '--'}
            unit="%"
            icon="droplet"
            color="blue"
          />
          <MetricCard
            title="Temperature"
            value={healthData?.temperature ? healthData.temperature.toFixed(1) : '--'}
            unit="°C"
            icon="thermometer"
            color="orange"
          />
          <MetricCard
            title="Steps"
            value={healthData?.steps || '--'}
            unit="steps"
            icon="footprints"
            color="green"
          />
          <MetricCard
            title="Sleep"
            value={healthData?.sleepHours ? healthData.sleepHours.toFixed(1) : '--'}
            unit="hours"
            icon="moon"
            color="purple"
          />
          <GaugeChart
            value={healthData?.heartRate || 0}
            max={150}
            min={40}
            label="Heart Rate Gauge"
            unit="bpm"
            color="#10b981"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HealthChart
            data={historyData}
            dataKey="heartRate"
            color="#ef4444"
            name="Heart Rate Trend"
            type="area"
          />
          <HealthChart
            data={historyData}
            dataKey="spO2"
            color="#3b82f6"
            name="Blood Oxygen Trend"
            type="area"
          />
        </div>

        <div className="mt-6 glass rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Health Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
              <h4 className="text-blue-400 font-medium mb-2">Heart Health</h4>
              <p className="text-gray-400 text-sm">Your heart rate is within the normal range. Keep maintaining regular exercise.</p>
            </div>
            <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
              <h4 className="text-green-400 font-medium mb-2">Oxygen Level</h4>
              <p className="text-gray-400 text-sm">Blood oxygen saturation is healthy. Continue deep breathing exercises.</p>
            </div>
            <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
              <h4 className="text-purple-400 font-medium mb-2">Activity</h4>
              <p className="text-gray-400 text-sm">Try to maintain at least 30 minutes of light activity daily.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;