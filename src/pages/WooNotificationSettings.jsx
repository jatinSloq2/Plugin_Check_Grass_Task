import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WooNotificationSettings = ({ shopId }) => {
  const [settings, setSettings] = useState({
    orderCreated: false,
    orderFulfilled: false,
    orderCanceled: false,
    afterOrderFulfilled: false,
    cartAbandoned: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/woo/shop/${shopId}/settings`);
        setSettings(res.data);
      } catch {
        setError('Failed to load settings');
      }
    };
    fetchSettings();
  }, [shopId, token]);

  const handleToggle = e => {
    const { name, checked } = e.target;
    setSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await axios.put(`http://localhost:3000/api/woo/shop/${shopId}/settings`, { notificationSettings: settings });
      setSuccessMsg('Settings saved successfully!');
    } catch {
      setError('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
      {Object.keys(settings).map(key => (
        <label key={key} className="flex items-center mb-3 cursor-pointer">
          <input
            type="checkbox"
            name={key}
            checked={settings[key]}
            onChange={handleToggle}
            className="mr-3 w-5 h-5"
          />
          <span className="capitalize">{key}</span>
        </label>
      ))}
      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
      >
        {loading ? 'Saving...' : 'Save Settings'}
      </button>
      {error && <p className="mt-2 text-red-600">{error}</p>}
      {successMsg && <p className="mt-2 text-green-600">{successMsg}</p>}
    </div>
  );
};

export default WooNotificationSettings;
