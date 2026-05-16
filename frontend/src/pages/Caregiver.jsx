import { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { authAPI, healthAPI, alertAPI } from '../utils/api';
import MetricCard from '../components/MetricCard';
import HealthChart from '../components/HealthChart';
import { Users, AlertTriangle, Activity, MapPin, Bell, CheckCircle, XCircle } from 'lucide-react';

const Caregiver = () => {
  const { socket } = useSocket();
  const [patients, setPatients] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    if (socket) {
      socket.on('alert', (alert) => {
        setAlerts(prev => [alert, ...prev]);
        if (Notification.permission === 'granted') {
          new Notification('New Alert', { body: alert.message });
        }
      });
      return () => socket.off('alert');
    }
  }, [socket]);

  useEffect(() => {
    if (selectedPatient) {
      loadPatientData(selectedPatient);
    }
  }, [selectedPatient]);

  const loadData = async () => {
    try {
      const patientsData = await authAPI.getPatients();
      setPatients(patientsData);
      if (patientsData.length > 0) {
        setSelectedPatient(patientsData[0]._id);
      }
      const alertsData = await alertAPI.getCaregiverAlerts();
      setAlerts(alertsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPatientData = async (patientId) => {
    try {
      const data = await healthAPI.getPatientData(patientId);
      setPatientData(data);
      const history = await healthAPI.getPatientHistory(patientId, 'day');
      if (history && history.length > 0) {
        const formattedHistory = history.map((item) => ({
          time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          heartRate: item.heartRate,
          spO2: item.spO2,
          temperature: item.temperature
        }));
        setHistoryData(formattedHistory.slice(-20));
      }
    } catch (error) {
      console.error('Error loading patient data:', error);
    }
  };

  const handleResolveAlert = async (alertId) => {
    try {
      await alertAPI.resolveAlert(alertId);
      setAlerts(prev => prev.map(a => a._id === alertId ? { ...a, isResolved: true } : a));
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  const getUnreadCount = () => alerts.filter(a => !a.isRead && !a.isResolved).length;

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
          <h1 className="text-3xl font-bold text-white mb-2">Caregiver Dashboard</h1>
          <p className="text-gray-400">Monitor your patients and respond to alerts</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="glass rounded-2xl p-4 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Patients</p>
              <p className="text-2xl font-bold text-white">{patients.length}</p>
            </div>
          </div>
          <div className="glass rounded-2xl p-4 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Active Alerts</p>
              <p className="text-2xl font-bold text-white">{getUnreadCount()}</p>
            </div>
          </div>
          <div className="glass rounded-2xl p-4 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Resolved Today</p>
              <p className="text-2xl font-bold text-white">{alerts.filter(a => a.isResolved).length}</p>
            </div>
          </div>
          <div className="glass rounded-2xl p-4 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Bell className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Notifications</p>
              <p className="text-2xl font-bold text-white">{getUnreadCount()}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Patient Selection</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patients.map(patient => (
                <button
                  key={patient._id}
                  onClick={() => setSelectedPatient(patient._id)}
                  className={`p-4 rounded-xl transition ${
                    selectedPatient === patient._id
                      ? 'bg-medical-cyan/20 border-2 border-medical-cyan'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold">{patient.name}</p>
                      <p className="text-gray-400 text-sm">{patient.email}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Real-time Patient Data</h2>
            {patientData ? (
              <div className="space-y-4">
                <MetricCard
                  title="Heart Rate"
                  value={patientData.heartRate || '--'}
                  unit="bpm"
                  icon="heart"
                  color="red"
                />
                <MetricCard
                  title="Blood Oxygen"
                  value={patientData.spO2 || '--'}
                  unit="%"
                  icon="droplet"
                  color="blue"
                />
                <MetricCard
                  title="Temperature"
                  value={patientData.temperature ? patientData.temperature.toFixed(1) : '--'}
                  unit="°C"
                  icon="thermometer"
                  color="orange"
                />
              </div>
            ) : (
              <p className="text-gray-400">Select a patient to view data</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <HealthChart
            data={historyData}
            dataKey="heartRate"
            color="#ef4444"
            name="Patient Heart Rate Trend"
            type="area"
          />
          <HealthChart
            data={historyData}
            dataKey="spO2"
            color="#3b82f6"
            name="Patient Blood Oxygen Trend"
            type="area"
          />
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Alerts</h2>
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No alerts at this time</p>
            ) : (
              alerts.slice(0, 10).map(alert => (
                <div
                  key={alert._id}
                  className={`p-4 rounded-xl flex items-center justify-between ${
                    alert.isResolved
                      ? 'bg-green-500/10 border border-green-500/20'
                      : alert.severity === 'critical'
                      ? 'bg-red-500/10 border border-red-500/20'
                      : 'bg-yellow-500/10 border border-yellow-500/20'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    {alert.severity === 'critical' ? (
                      <XCircle className="w-6 h-6 text-red-400" />
                    ) : alert.isResolved ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-yellow-400" />
                    )}
                    <div>
                      <p className="text-white font-medium">{alert.message}</p>
                      <p className="text-gray-400 text-sm">
                        {alert.userId?.name || 'Unknown Patient'} • {new Date(alert.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {!alert.isResolved && (
                    <button
                      onClick={() => handleResolveAlert(alert._id)}
                      className="gradient-bg text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Patient Locations (Simulated)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patients.map(patient => (
              <div key={patient._id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center space-x-3 mb-3">
                  <MapPin className="w-5 h-5 text-medical-cyan" />
                  <span className="text-white font-medium">{patient.name}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <Activity className="w-4 h-4" />
                  <span>Location: Room {Math.floor(Math.random() * 100) + 1}, Floor {Math.floor(Math.random() * 5) + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Caregiver;