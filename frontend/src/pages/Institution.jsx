import { useState, useEffect } from 'react';
import { authAPI, healthAPI, alertAPI } from '../utils/api';
import MetricCard from '../components/MetricCard';
import HealthChart from '../components/HealthChart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Activity, AlertTriangle, TrendingUp, CheckCircle, Clock } from 'lucide-react';

const Institution = () => {
  const [stats, setStats] = useState({ patientCount: 0, caregiverCount: 0, todayAlerts: 0, criticalAlerts: 0 });
  const [patients, setPatients] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, patientsData, alertsData] = await Promise.all([
        healthAPI.getStats(),
        authAPI.getPatients(),
        alertAPI.getCaregiverAlerts()
      ]);
      setStats(statsData);
      setPatients(patientsData);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const alertDistribution = [
    { name: 'High Heart Rate', value: alerts.filter(a => a.alertType === 'high_heart_rate').length, color: '#ef4444' },
    { name: 'Low SpO2', value: alerts.filter(a => a.alertType === 'low_spO2').length, color: '#3b82f6' },
    { name: 'Abnormal Temp', value: alerts.filter(a => a.alertType === 'abnormal_temperature').length, color: '#f59e0b' },
    { name: 'Other', value: alerts.filter(a => !['high_heart_rate', 'low_spO2', 'abnormal_temperature'].includes(a.alertType)).length, color: '#8b5cf6' }
  ];

  const healthTrendData = [
    { day: 'Mon', avgHeartRate: 72, avgSpO2: 97 },
    { day: 'Tue', avgHeartRate: 75, avgSpO2: 96 },
    { day: 'Wed', avgHeartRate: 70, avgSpO2: 98 },
    { day: 'Thu', avgHeartRate: 73, avgSpO2: 97 },
    { day: 'Fri', avgHeartRate: 71, avgSpO2: 97 },
    { day: 'Sat', avgHeartRate: 74, avgSpO2: 96 },
    { day: 'Sun', avgHeartRate: 72, avgSpO2: 97 }
  ];

  const severityDistribution = [
    { name: 'Critical', value: alerts.filter(a => a.severity === 'critical').length, color: '#ef4444' },
    { name: 'High', value: alerts.filter(a => a.severity === 'high').length, color: '#f59e0b' },
    { name: 'Medium', value: alerts.filter(a => a.severity === 'medium').length, color: '#3b82f6' },
    { name: 'Low', value: alerts.filter(a => a.severity === 'low').length, color: '#10b981' }
  ];

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
          <h1 className="text-3xl font-bold text-white mb-2">Institution Dashboard</h1>
          <p className="text-gray-400">System overview and analytics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Patients"
            value={stats.patientCount}
            unit="patients"
            icon="heart"
            color="blue"
          />
          <MetricCard
            title="Caregivers"
            value={stats.caregiverCount}
            unit="staff"
            icon="activity"
            color="green"
          />
          <MetricCard
            title="Today's Alerts"
            value={stats.todayAlerts}
            unit="alerts"
            icon="alert"
            color="orange"
          />
          <MetricCard
            title="Critical Alerts"
            value={stats.criticalAlerts}
            unit="critical"
            icon="alert"
            color="red"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="w-6 h-6 text-medical-cyan" />
              <h2 className="text-xl font-semibold text-white">Weekly Health Trends</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={healthTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="avgHeartRate" fill="#ef4444" name="Avg Heart Rate" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgSpO2" fill="#3b82f6" name="Avg SpO2" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-medical-cyan" />
              <h2 className="text-xl font-semibold text-white">Alert Distribution</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={alertDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {alertDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {alertDistribution.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-300 text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Alert Severity</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={severityDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {severityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">System Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white">Database</span>
                </div>
                <span className="text-green-400 text-sm">Operational</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white">API Server</span>
                </div>
                <span className="text-green-400 text-sm">Operational</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white">Socket.io</span>
                </div>
                <span className="text-green-400 text-sm">Connected</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white">Sensor Simulation</span>
                </div>
                <span className="text-green-400 text-sm">Active</span>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert, index) => (
                <div key={index} className="flex items-start space-x-3 p-2">
                  <Clock className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-gray-300 text-sm">{alert.message}</p>
                    <p className="text-gray-500 text-xs">{new Date(alert.createdAt).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Users className="w-6 h-6 text-medical-cyan" />
            <h2 className="text-xl font-semibold text-white">Patient Overview</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Patient Name</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Last Reading</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Alerts</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4 text-white">{patient.name}</td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">Active</span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">{new Date().toLocaleTimeString()}</td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-sm">
                        {Math.floor(Math.random() * 3)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Institution;