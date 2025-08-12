import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const WooNotificationSettings = () => {
  const { user } = useAuth();
  const [shops, setShops] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState('');
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

  // Fetch all shops for the user
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/woo/shop/user/${user.id}`);
        setShops(res.data);
      } catch (err) {
        setError('Failed to load shops');
      }
    };
    if (user?.id) {
      fetchShops();
    }
  }, [user]);

  // Fetch settings when a shop is selected
  useEffect(() => {
    const fetchSettings = async () => {
      if (!selectedShopId) return;
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/woo/shop/${selectedShopId}/settings`);
        setSettings(res.data);
      } catch {
        setError('Failed to load settings');
      }
    };
    fetchSettings();
  }, [selectedShopId]);

  const handleToggle = (e) => {
    const { name, checked } = e.target;
    setSettings((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSave = async () => {
    if (!selectedShopId) {
      setError('Please select a shop first');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/woo/shop/${selectedShopId}/settings`, {
        userId: user.id,
        notificationSettings: settings,
      });
      setSuccessMsg('Settings saved successfully!');
    } catch {
      setError('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h3 className="text-lg font-semibold mb-4">WooCommerce Notification Settings</h3>

      {/* Shop selector */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Select Shop</label>
        <select
          value={selectedShopId}
          onChange={(e) => setSelectedShopId(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="">-- Choose a shop --</option>
          {shops.map((shop) => (
            <option key={shop._id} value={shop._id}>
              {shop.shopName}
            </option>
          ))}
        </select>
      </div>

      {/* Show settings only if shop is selected */}
      {selectedShopId && (
        <>
          {Object.keys(settings).map((key) => (
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
        </>
      )}

      {error && <p className="mt-2 text-red-600">{error}</p>}
      {successMsg && <p className="mt-2 text-green-600">{successMsg}</p>}
    </div>
  );
};

export default WooNotificationSettings;
