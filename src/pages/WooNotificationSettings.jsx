import axios from 'axios';
import { AlertTriangle, Bell, Check, Clock, Settings, Store, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const WooNotificationSettings = () => {
  const { user } = useAuth();
  const [shops, setShops] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState('');
  const [settings, setSettings] = useState({});
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const api_token = user?.api_token;

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || successMsg) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccessMsg(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, successMsg]);

  // Fetch all shops
  useEffect(() => {
    if (!user?.id) return;
    const fetchShops = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/woo/shop/user/${user.id}`);
        setShops(data);
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
        const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/woo/shop/${selectedShopId}/settings`);
        setSettings(data);
      } catch {
        setError('Failed to load settings');
      }
    };
    fetchSettings();
  }, [selectedShopId]);

  // Fetch templates
  useEffect(() => {
    if (!api_token) return;

    const fetchTemplates = async () => {
      try {
        const { data } = await axios.get(`https://aigreentick.com/api/v1/wa-templates?type=get&page=1`, {
          headers: { Authorization: `Bearer ${api_token}` },
        });
        const templatesArray = data?.data?.data || [];
        const formattedTemplates = templatesArray.map(t => ({
          id: t.id,
          name: t.name,
        }));
        setTemplates(formattedTemplates);
      } catch (err) {
        console.error('Failed to fetch templates:', err);
        setError('Failed to load WhatsApp templates');
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

  const handleCampaignNameChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: { ...prev[key], campaign_name: value },
    }));
  };

  const handleDelayChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      afterOrderFulfilled: {
        ...prev.afterOrderFulfilled,
        delay: { ...prev.afterOrderFulfilled?.delay, [field]: value },
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
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/woo/shop/${selectedShopId}/settings`,
        {
          userId: user.id,
          notificationSettings: settings,
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setSuccessMsg('Settings saved successfully!');
    } catch {
      setError('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!selectedShopId) {
      setError('Please select a shop first');
      return;
    }

    setDisconnecting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/woo/shop/woocommerce/disconnect/${selectedShopId}`,
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log("data", data)

      if (data.success) {
        setSuccessMsg(
          `Shop "${data.shopName}" successfully disconnected. ${data.webhooks.deleted}/${data.webhooks.total} webhooks removed.`
        );
        setShops(prev => prev.filter(shop => shop._id !== selectedShopId));
        setSelectedShopId('');
        setSettings({});
        setShowDeleteConfirm(false);
      } else {
        setError(data.message || 'Failed to disconnect shop');
      }
    } catch (err) {
      setError('Failed to disconnect shop');
    } finally {
      setDisconnecting(false);
    }
  };

  const getNotificationTypeLabel = (key) => {
    const labels = {
      orderCreated: 'Order Created',
      orderFulfilled: 'Order Fulfilled',
      orderCanceled: 'Order Canceled',
      cartAbandoned: 'Cart Abandoned',
      afterOrderFulfilled: 'Post-Order Feedback'
    };
    return labels[key] || key;
  };

  const getNotificationTypeIcon = (key) => {
    const icons = {
      orderCreated: <Bell className="w-4 h-4 text-blue-500" />,
      orderFulfilled: <Check className="w-4 h-4 text-green-500" />,
      orderCanceled: <X className="w-4 h-4 text-red-500" />,
      cartAbandoned: <AlertTriangle className="w-4 h-4 text-orange-500" />,
      afterOrderFulfilled: <Clock className="w-4 h-4 text-purple-500" />
    };
    return icons[key] || <Bell className="w-4 h-4 text-gray-500" />;
  };

  const selectedShop = shops.find(shop => shop._id === selectedShopId);
  console.log("selectedShop", selectedShop)

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Settings className="w-6 h-6 text-blue-600" />
          <h3 className="text-2xl font-bold text-gray-800">WooCommerce Notifications</h3>
        </div>
      </div>

      {/* Shop selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Store className="w-4 h-4 inline mr-2" />
          Select Shop
        </label>
        <select
          value={selectedShopId}
          onChange={(e) => setSelectedShopId(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">-- Choose a shop --</option>
          {shops.map(shop => (
            <option key={shop._id} value={shop._id}>
              {shop.shopName} ({shop.storeUrl})
            </option>
          ))}
        </select>
      </div>

      {/* Shop info and disconnect button */}
      {selectedShop && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-800">{selectedShop.shopName}</h4>
              <p className="text-sm text-gray-600">{selectedShop.storeUrl}</p>
              <p className="text-xs text-gray-500">
                {selectedShop.webhooks?.length || 0} webhook(s) configured
              </p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Disconnect</span>
              </button>

              {selectedShop.abandonCartWebhook && (
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Your cart webhook URL:</span>{' '}
                  <span className="break-all text-blue-600">{selectedShop.abandonCartWebhook}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h4 className="text-lg font-semibold">Confirm Disconnect</h4>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to disconnect "{selectedShop?.shopName}"?
              This will remove all webhooks and delete the shop from your account. This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDisconnect}
                disabled={disconnecting}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {disconnecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Disconnecting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Yes, Disconnect</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={disconnecting}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification settings */}
      {selectedShopId && Object.keys(settings).length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Notification Types</h4>

          {Object.keys(settings)
            .filter(key => key !== '_id')
            .map(key => {
              const setting = settings[key];

              if (templates.length === 0) return null;

              return (
                <div key={key} className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getNotificationTypeIcon(key)}
                      <span className="font-medium text-gray-800">
                        {getNotificationTypeLabel(key)}
                      </span>
                    </div>

                    {/* Toggle switch */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={setting?.enabled || false}
                        onChange={() => handleToggle(key)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Template selection */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp Template
                    </label>
                    <select
                      value={setting?.templateId || ''}
                      onChange={(e) => handleTemplateChange(key, e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      disabled={!setting?.enabled}
                    >
                      <option value="">-- Select Template --</option>
                      {templates.map((t) => (
                        <option key={t.id} value={String(t.id)}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Campaign name */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Campaign Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={setting?.campaign_name || ''}
                      onChange={(e) => handleCampaignNameChange(key, e.target.value)}
                      placeholder="Enter campaign name for tracking"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      disabled={!setting?.enabled}
                    />
                  </div>

                  {/* Delay input for afterOrderFulfilled */}
                  {key === 'afterOrderFulfilled' && (
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Send After Delay
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="number"
                          min={1}
                          max={30}
                          value={setting?.delay?.value || 10}
                          onChange={(e) => handleDelayChange('value', Number(e.target.value))}
                          disabled={!setting?.enabled}
                          className="border border-gray-300 rounded-lg p-3 w-20 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        />
                        <span className="text-gray-600">{setting?.delay?.unit || 'days'} after order fulfillment</span>
                      </div>
                    </div>
                  )}

                  {/* Status indicator */}
                  <div className="flex items-center space-x-2 text-sm">
                    {setting?.enabled ? (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-600">Active</span>
                        {setting?.templateId && (
                          <span className="text-gray-500">
                            • Template: {templates.find(t => String(t.id) === setting.templateId)?.name || 'Unknown'}
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-gray-500">Disabled</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}

          {/* Action buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleSave}
              disabled={loading || !selectedShopId}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {selectedShopId && Object.keys(settings).length === 0 && (
        <div className="text-center py-8">
          <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No notification settings found for this shop.</p>
        </div>
      )}

      {/* No shops state */}
      {shops.length === 0 && (
        <div className="text-center py-8">
          <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No WooCommerce shops connected yet.</p>
        </div>
      )}

      {/* Messages */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <X className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Check className="w-5 h-5 text-green-500" />
            <p className="text-green-700">{successMsg}</p>
          </div>
        </div>
      )}

      {/* Loading templates state */}
      {templates.length === 0 && api_token && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-700">Loading WhatsApp templates...</p>
        </div>
      )}
    </div>
  );
};

export default WooNotificationSettings;