import { useState, useEffect } from 'react';
import { medicationAPI } from '../utils/api';
import { Pill, Clock, CheckCircle, AlertCircle, Plus } from 'lucide-react';

const Medications = () => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    medicationName: '',
    dosage: '',
    frequency: '',
    scheduledTime: '',
    notes: ''
  });

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    try {
      const data = await medicationAPI.getReminders();
      setMedications(data);
    } catch (error) {
      console.error('Error loading medications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await medicationAPI.createReminder(formData);
      setFormData({ medicationName: '', dosage: '', frequency: '', scheduledTime: '', notes: '' });
      setShowForm(false);
      loadMedications();
    } catch (error) {
      console.error('Error creating medication:', error);
    }
  };

  const handleTakeMedication = async (id) => {
    try {
      await medicationAPI.markAsTaken(id);
      loadMedications();
    } catch (error) {
      console.error('Error taking medication:', error);
    }
  };

  const getCurrentMedications = () => {
    const now = new Date();
    const currentHour = now.getHours();
    return medications.filter(med => {
      const medHour = parseInt(med.scheduledTime.split(':')[0]);
      return Math.abs(medHour - currentHour) <= 2;
    });
  };

  const getTakenCount = () => medications.filter(med => med.taken).length;
  const getTotalCount = () => medications.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-medical-cyan"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Medication Reminders</h1>
          <p className="text-gray-400">Manage your daily medications and reminders</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Today's Progress</p>
                <p className="text-3xl font-bold text-white">{getTakenCount()}/{getTotalCount()}</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                <Pill className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="mt-4 bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-400 to-emerald-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getTotalCount() > 0 ? (getTakenCount() / getTotalCount()) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Next Dose</p>
                <p className="text-xl font-semibold text-white">
                  {getCurrentMedications().length > 0 ? getCurrentMedications()[0].scheduledTime : 'No upcoming'}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="glass rounded-2xl p-6 hover:bg-white/10 transition flex items-center justify-center space-x-3"
          >
            <Plus className="w-6 h-6 text-medical-cyan" />
            <span className="text-white font-medium">Add Medication</span>
          </button>
        </div>

        {showForm && (
          <div className="glass rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Add New Medication</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Medication Name</label>
                <input
                  type="text"
                  value={formData.medicationName}
                  onChange={(e) => setFormData({ ...formData, medicationName: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-medical-cyan"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Dosage</label>
                <input
                  type="text"
                  value={formData.dosage}
                  onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-medical-cyan"
                  placeholder="e.g., 500mg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Frequency</label>
                <input
                  type="text"
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-medical-cyan"
                  placeholder="e.g., Twice daily"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Scheduled Time</label>
                <input
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-medical-cyan"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-medical-cyan h-24 resize-none"
                />
              </div>
              <div className="md:col-span-2 flex space-x-4">
                <button
                  type="submit"
                  className="gradient-bg text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition flex-1"
                >
                  Add Medication
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="glass text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Today's Medications</h2>
          {medications.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center">
              <Pill className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No medications added yet. Click "Add Medication" to get started.</p>
            </div>
          ) : (
            medications.map((med) => (
              <div
                key={med._id}
                className={`glass rounded-2xl p-6 flex items-center justify-between transition ${
                  med.taken ? 'border-green-500/30' : 'border-yellow-500/30'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                    med.taken ? 'bg-green-500/20' : 'bg-yellow-500/20'
                  }`}>
                    {med.taken ? (
                      <CheckCircle className="w-7 h-7 text-green-400" />
                    ) : (
                      <AlertCircle className="w-7 h-7 text-yellow-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{med.medicationName}</h3>
                    <p className="text-gray-400">{med.dosage} • {med.frequency}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-500 text-sm">{med.scheduledTime}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {med.taken ? (
                    <span className="text-green-400 font-semibold">Taken at {new Date(med.takenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  ) : (
                    <button
                      onClick={() => handleTakeMedication(med._id)}
                      className="gradient-bg text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition text-lg"
                    >
                      Mark as Taken
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Medications;