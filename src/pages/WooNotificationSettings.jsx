import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const WooNotificationSettings = () => {
  const { user } = useAuth();
  const [shops, setShops] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState('');
  const [settings, setSettings] = useState({});
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const api_token = user?.api_token;

  // Fetch all shops
  useEffect(() => {
    if (!user?.id) return;
    const fetchShops = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/woo/shop/user/${user.id}`);
        setShops(res.data);
      } catch {
        setError('Failed to load shops');
      }
    };
    fetchShops();
  }, [user]);

  // Fetch settings when a shop is selected
  useEffect(() => {
    if (!selectedShopId) return;
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/woo/shop/${selectedShopId}/settings`);
        setSettings(res.data);
      } catch {
        setError('Failed to load settings');
      }
    };
    fetchSettings();
  }, [selectedShopId]);

  useEffect(() => {
    if (!api_token) return;

    const fetchTemplates = async () => {
      try {
        const res = await fetch(`https://aigreentick.com/api/v1/wa-templates?type=get&page=1`, {
          headers: {
            'Authorization': `Bearer ${api_token}`,
          },
        });
        const json = await res.json();
        const templatesArray = json?.data?.data || [];
        const formattedTemplates = templatesArray.map(t => ({
          id: t.id,
          name: t.name,
        }));
        setTemplates(formattedTemplates);
      } catch (err) {
        console.error('Failed to fetch templates:', err);
      }
    };

    fetchTemplates();
  }, [api_token]);

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key]?.enabled },
    }));
  };

  const handleTemplateChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: { ...prev[key], templateId: value },
    }));
  };

  const handleDelayChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      afterOrderFulfilled: {
        ...prev.afterOrderFulfilled,
        delay: { ...prev.afterOrderFulfilled.delay, [field]: value },
      },
    }));
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
          {shops.map(shop => (
            <option key={shop._id} value={shop._id}>
              {shop.shopName}
            </option>
          ))}
        </select>
      </div>

      {/* Notification settings */}
      {selectedShopId && Object.keys(settings).length > 0 && (
        <div className="space-y-4">
          {Object.keys(settings)
            .filter(key => key !== '_id')
            .map(key => {
              const setting = settings[key];
              console.log("settings", settings,
                "setting", setting
              )
              if (templates.length === 0) return null;
              return (
                <div key={key} className="border p-3 rounded">
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={setting?.enabled || false}
                      onChange={() => handleToggle(key)}
                      className="mr-3 w-5 h-5"
                    />
                    <span className="font-medium capitalize">{key}</span>
                  </div>

                  {/* Template select */}
                  {templates.length > 0 && (
                    <select
                      value={setting?.templateId || ''}
                      onChange={(e) => handleTemplateChange(key, e.target.value)}
                      className="w-full border rounded p-2 mb-2"
                      disabled={!setting?.enabled}
                    >
                      <option value="">-- Select Template --</option>
                      {templates.map((t) => (
                        <option key={t.id} value={String(t.id)}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Delay input for afterOrderFulfilled */}
                  {key === 'afterOrderFulfilled' && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min={1}
                        value={setting?.delay?.value || 10}
                        onChange={(e) => handleDelayChange('value', Number(e.target.value))}
                        disabled={!setting?.enabled}
                        className="border rounded p-1 w-16"
                      />
                      <span>{setting?.delay?.unit || 'days'}</span>
                    </div>
                  )}
                </div>
              );
            })}

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      )}

      {error && <p className="mt-2 text-red-600">{error}</p>}
      {successMsg && <p className="mt-2 text-green-600">{successMsg}</p>}
    </div>
  );
};

export default WooNotificationSettings;




