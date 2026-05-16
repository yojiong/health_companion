const API_URL = 'https://health-companion-2.onrender.com';

const getAuthHeader = () => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const token = JSON.parse(userInfo).token;
    return { headers: { Authorization: `Bearer ${token}` } };
  }
  return {};
};

export const authAPI = {
  login: (email, password) => fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  }).then(res => res.json()),

  register: (userData) => fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  }).then(res => res.json()),

  getProfile: () => fetch(`${API_URL}/auth/profile`, getAuthHeader()).then(res => res.json()),

  getPatients: () => fetch(`${API_URL}/auth/patients`, getAuthHeader()).then(res => res.json())
};

export const healthAPI = {
  getRealtimeData: () => fetch(`${API_URL}/health/realtime`, getAuthHeader()).then(res => res.json()),

  getHistoricalData: (period) => fetch(`${API_URL}/health/history?period=${period}`, getAuthHeader()).then(res => res.json()),

  getPatientData: (patientId) => fetch(`${API_URL}/health/patient/${patientId}`, getAuthHeader()).then(res => res.json()),

  getPatientHistory: (patientId, period) => fetch(`${API_URL}/health/patient/${patientId}/history?period=${period}`, getAuthHeader()).then(res => res.json()),

  getStats: () => fetch(`${API_URL}/health/stats`, getAuthHeader()).then(res => res.json())
};

export const medicationAPI = {
  getReminders: () => fetch(`${API_URL}/medications`, getAuthHeader()).then(res => res.json()),

  createReminder: (data) => fetch(`${API_URL}/medications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader().headers },
    body: JSON.stringify(data)
  }).then(res => res.json()),

  updateReminder: (id, data) => fetch(`${API_URL}/medications/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader().headers },
    body: JSON.stringify(data)
  }).then(res => res.json()),

  markAsTaken: (id) => fetch(`${API_URL}/medications/${id}/take`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader().headers }
  }).then(res => res.json())
};

export const alertAPI = {
  getAlerts: () => fetch(`${API_URL}/alerts`, getAuthHeader()).then(res => res.json()),

  getCaregiverAlerts: () => fetch(`${API_URL}/alerts/caregiver`, getAuthHeader()).then(res => res.json()),

  getUnreadAlerts: () => fetch(`${API_URL}/alerts/unread`, getAuthHeader()).then(res => res.json()),

  markAsRead: (id) => fetch(`${API_URL}/alerts/${id}/read`, {
    method: 'PUT',
    headers: { ...getAuthHeader().headers }
  }).then(res => res.json()),

  resolveAlert: (id) => fetch(`${API_URL}/alerts/${id}/resolve`, {
    method: 'PUT',
    headers: { ...getAuthHeader().headers }
  }).then(res => res.json()),

  getStats: () => fetch(`${API_URL}/alerts/stats`, getAuthHeader()).then(res => res.json())
};
