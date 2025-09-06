import axios from 'axios';
import { AlertTriangle, Bell, Check, Clock, Settings, Store, Trash2, X, Plus, Loader2, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import TemplatePreview from '../TemplatePreview';

const WooNotificationSettings = ({ onAllShopsDeleted }) => {
  const { user } = useAuth();
  const [shops, setShops] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState('');
  const [selectedSection, setSelectedSection] = useState('notifications');
  const [settings, setSettings] = useState({});
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    if (!user?.id) return;
    const fetchShops = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/woo/shop/user/${user.id}`);
        setShops(data);
        if (data.length > 0) {
          setSelectedShopId(data[0]._id);
        }
        if (data.length === 0 && onAllShopsDeleted) {
          onAllShopsDeleted();
        }
      } catch {
        setError('Failed to load shops');
        if (onAllShopsDeleted) {
          onAllShopsDeleted();
        }
      }
    };
    fetchShops();
  }, [user, onAllShopsDeleted]);

  useEffect(() => {
    if (!selectedShopId) return;
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/woo/shop/${selectedShopId}/settings`);
        setSettings(data);
        setHasChanges(false);
      } catch {
        setError('Failed to load settings');
      } finally {
        setLoading(false);
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
    setHasChanges(true);
  };

  const handleTemplateChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: { ...prev[key], templateId: value },
    }));
    setHasChanges(true);
  };

  const handleCampaignNameChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: { ...prev[key], campaign_name: value },
    }));
    setHasChanges(true);
  };

  const handleDelayChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      afterOrderFulfilled: {
        ...prev.afterOrderFulfilled,
        delay: { ...prev.afterOrderFulfilled?.delay, [field]: value },
      },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!selectedShopId) {
      setError('Please select a shop first');
      return;
    }
    setSaving(true);
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
      setHasChanges(false);
    } catch {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
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

      if (data.success) {
        setSuccessMsg(
          `Shop "${data.shopName}" successfully disconnected. ${data.webhooks.deleted}/${data.webhooks.total} webhooks removed.`
        );

        // Update local shops state
        const updatedShops = shops.filter(shop => shop._id !== selectedShopId);
        setShops(updatedShops);
        setSelectedShopId('');
        setSettings({});
        setShowDeleteConfirm(false);

        if (updatedShops.length === 0 && onAllShopsDeleted) {
          setTimeout(() => {
            onAllShopsDeleted();
          }, 2000);
        }
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

  const getNotificationDescription = (key) => {
    const map = {
      orderCreated: "This automated WhatsApp notification is triggered immediately after a customer successfully places an order on your store. It provides instant confirmation and reassurance to the buyer that their order has been received. Since these templates are pre-approved by WhatsApp, their content and structure cannot be customized or modified.",
      orderFulfilled: "Once the order has been processed and shipped, this message is sent to notify the customer that their items are on the way. It improves transparency in the buying journey and helps build trust with your customers. As with other templates, the content is pre-approved by WhatsApp and cannot be modified.",
      orderCanceled: "This message is automatically sent when an order is canceled, either by the customer or the merchant. Keeps customers informed about order status.",
      cartAbandoned: "If a customer leaves items in their cart without completing the purchase, this automated reminder is sent about 5 minutes after the cart is abandoned. It helps recover lost sales by prompting customers to return and finish their checkout. As with all WhatsApp automated templates, the content cannot be modified because WhatsApp requires prior approval before use.",
      afterOrderFulfilled: "This follow-up message is sent after the order has been successfully delivered. It is designed to re-engage customers, encourage repeat purchases, and open opportunities for feedback or reviews. Since WhatsApp requires template approval, this message must follow pre-approved formats and cannot be freely edited."
    };

    return map[key] || "Default notification description.";
  };
  const selectedShop = shops.find(shop => shop._id === selectedShopId);

  if (shops.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Enhanced Sidebar */}
        <aside className="w-72 min-h-screen border-r border-gray-300 bg-white flex flex-col p-5 text-gray-700">
          {/* Brand */}
          <h2 className="text-3xl font-bold tracking-wide mb-10 text-gray-900">WooCommerce</h2>

          {/* Store Selector or Display */}
          {shops.length === 1 ? (
            <div className="w-full border border-gray-300 rounded px-3 py-2 mb-6 text-sm bg-gray-50">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-emerald-600" />
                <span className="font-medium text-gray-800">
                  {shops[0].shopName || 'Unknown Shop'}
                </span>
              </div>
            </div>
          ) : (
            <select
              value={selectedShopId}
              onChange={(e) => setSelectedShopId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-6 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="">-- Choose a shop --</option>
              {shops.map(shop => {
                const shopName = shop.shopName || 'Unknown Shop';
                return (
                  <option key={shop._id} value={shop._id}>
                    {shopName}
                  </option>
                );
              })}
            </select>
          )}

          {/* Manage Stores */}
          <button
            onClick={() => setIsManageModalOpen(true)}
            className="text-sm hover:border hover:border-gray-200 text-black hover:bg-blue-50 py-2 px-3 rounded-lg flex items-center gap-2 font-medium transition-all duration-200"
          >
            <Store className="w-4 h-4" />
            Manage Stores
          </button>

          {/* Manage Stores Modal */}
          {isManageModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Store className="w-5 h-5 text-emerald-600" />
                    Manage Stores
                  </h2>
                  <button
                    onClick={() => setIsManageModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Existing Stores List */}
                {shops.length > 0 ? (
                  <ul className="space-y-3 flex-grow overflow-y-auto">
                    {shops.map((shop) => {
                      const shopName = shop.shopName || 'Unknown Shop';
                      return (
                        <li
                          key={shop._id}
                          className="flex justify-between items-center p-3 bg-white hover:shadow-sm transition"
                        >
                          <div>
                            <span className="text-gray-800 font-medium">{shopName}</span>
                            <p className="text-sm text-gray-600">{shop.storeUrl}</p>
                            <p className="text-xs text-gray-500">
                              {shop.webhooks?.length || 0} webhook(s) configured
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedShopId(shop._id);
                              setShowDeleteConfirm(true);
                              setIsManageModalOpen(false);
                            }}
                            disabled={disconnecting}
                            className="text-red-600 hover:text-red-700 flex gap-2 items-center hover:bg-red-100 p-3 rounded transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                            Disconnect
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center py-6 text-sm">
                    No stores connected.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Sidebar Menu */}
          <nav className="space-y-1 text-sm mt-2">
            <button
              onClick={() => setSelectedSection("notifications")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md w-full text-left transition ${selectedSection === "notifications"
                ? "bg-emerald-50 text-emerald-700 font-medium"
                : "hover:bg-gray-100 text-gray-700"
                }`}
            >
              <Bell className="w-4 h-4" />
              Notifications
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-0 overflow-y-auto">
          {/* Delete confirmation modal */}
          {showDeleteConfirm && selectedShop && (
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

          {loading ? (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500">
              <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mb-4" />
              <p className="text-lg font-medium">Loading store settings...</p>
              <p className="text-sm">Please wait while we fetch your data</p>
            </div>
          ) : error && !successMsg ? (
            <div className="flex flex-col items-center justify-center h-96">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h3>
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            </div>
          ) : (
            <section className="bg-gray-50 backdrop-blur-xl shadow-xl">
              {/* Section Header */}
              <div className="px-8 py-6">
                <div>
                  <h2 className="text-3xl font-bold tracking-wide text-gray-900">
                    Notification Settings
                  </h2>
                  <p className="text-muted-foreground">
                    Set up automated messages for{' '}
                    <span className="font-semibold">{selectedShop?.shopName || 'your store'}</span>
                  </p>
                </div>
              </div>

              <div className="p-8">
                {selectedShop && (
                  <div className="border border-gray-200 rounded p-12 bg-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className=" flex items-center gap-2 text-2xl font-semibold text-black mb-2">{selectedShop.shopName}</h4>
                        <p className="text-muted-foreground">{selectedShop.shopUrl}</p>
                        <p className="text-muted-foreground">
                          {selectedShop.webhooks?.length || 0} webhook(s) configured
                        </p>
                      </div>
                      {selectedShop.abandonCartWebhook && (
                        <div className="text-right">
                          <p className="text-muted-foreground">
                            <span className="font-medium">Cart webhook URL:</span>
                          </p>
                          <p className="text-xs text-blue-600 break-all max-w-xs">
                            {selectedShop.abandonCartWebhook}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Notification settings */}
                {selectedShopId &&
                  Object.keys(settings)
                    .filter(key => key !== '_id')
                    .map(key => {
                      const setting = settings[key];
                      if (templates.length === 0) return null;

                      return (
                        <div key={key} className="border border-gray-200 rounded p-12 bg-white">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

                            {/* LEFT COLUMN → Label + Description */}
                            <div>
                              <h3 className="text-2xl font-semibold text-black mb-2">
                                {getNotificationTypeLabel(key)}
                              </h3>
                              <p className="text-muted-foreground max-w-xl">
                                {getNotificationDescription(key)}
                              </p>
                            </div>

                            {/* RIGHT COLUMN → Controls */}
                            <div className="flex flex-col gap-6 bg-gray-50 p-6 rounded-lg">

                              {/* Enable/Disable Radios */}
                              <div className="flex items-center gap-6">
                                <label className={"flex items-center space-x-2 bg-white text-blue-100 px-3 py-2 rounded-lg border border-gray-200 cursor-pointer hover:border-green-500 transition"}>
                                  <input
                                    type="radio"
                                    className="text-green-600 focus:ring-green-500"
                                    name={`${key}_enabled`}
                                    checked={setting.enabled}
                                    onChange={() => handleToggle(key, true)}
                                  />
                                  <span className="text-gray-800 font-medium">Enabled</span>
                                </label>
                                <label className={"flex items-center space-x-2 bg-white text-blue-100 px-3 py-2 rounded-lg border border-gray-200 cursor-pointer hover:border-green-500 transition"}>
                                  <input
                                    type="radio"
                                    className="text-green-600 focus:ring-green-500"
                                    name={`${key}_enabled`}
                                    checked={!setting.enabled}
                                    onChange={() => handleToggle(key, false)}
                                  />
                                  <span className="text-gray-800 font-medium">Disabled</span>
                                </label>
                              </div>

                              {/* Template Selector */}
                              {setting.enabled && (
                                <div className="w-full">
                                  <label className="block text-sm font-medium mb-1 text-gray-700">
                                    WhatsApp Template
                                  </label>
                                  <select
                                    value={setting.templateId || ''}
                                    onChange={e => handleTemplateChange(key, e.target.value)}
                                    className="w-full border border-gray-300 rounded p-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100"
                                    disabled={!setting.enabled}
                                  >
                                    <option value="">-- Select Template --</option>
                                    {templates.map(t => (
                                      <option key={t.id} value={String(t.id)}>
                                        {t.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}

                              {/* Campaign Name */}
                              {setting.enabled && (
                                <div className="w-full">
                                  <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Campaign Name (Optional)
                                  </label>
                                  <input
                                    type="text"
                                    value={setting.campaign_name || ''}
                                    onChange={e => handleCampaignNameChange(key, e.target.value)}
                                    placeholder="Enter campaign name for tracking"
                                    className="w-full border border-gray-300 rounded p-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100"
                                    disabled={!setting.enabled}
                                  />
                                </div>
                              )}

                              {/* Delay for afterOrderFulfilled */}
                              {key === 'afterOrderFulfilled' && setting.enabled && (
                                <div className="flex items-center gap-3">
                                  <input
                                    type="number"
                                    min={1}
                                    max={30}
                                    value={setting.delay?.value || 10}
                                    onChange={e => handleDelayChange('value', Number(e.target.value))}
                                    className="border border-gray-300 rounded p-3 w-24 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                  />
                                  <span className="text-gray-600">{setting.delay?.unit || 'days'} after order fulfillment</span>
                                </div>
                              )}

                              {/* Mobile Mockup Preview */}
                              {setting.enabled && (
                                <div className="w-full flex justify-center mt-4">
                                  {/* {renderTemplatePreview(setting.templateId)} */}
                                   <TemplatePreview templateId={setting.templateId} />
                                </div>
                              )}

                            </div>
                          </div>
                        </div>
                      );
                    })}


                {/* Empty state */}
                {selectedShopId && Object.keys(settings).length === 0 && !loading && (
                  <div className="text-center py-12 bg-white rounded">
                    <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">No notification settings found for this shop.</p>
                  </div>
                )}

                {/* Loading templates state */}
                {templates.length === 0 && api_token && !error && (
                  <div className="bg-blue-50 border border-blue-200 rounded p-6 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
                    <p className="text-blue-700">Loading WhatsApp templates...</p>
                  </div>
                )}

                {/* Messages */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <X className="w-5 h-5 text-red-500" />
                      <p className="text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                {successMsg && (
                  <div className="bg-green-50 border border-green-200 rounded p-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <p className="text-green-700">{successMsg}</p>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="pt-8 flex justify-end mt-8">
                  <button
                    onClick={handleSave}
                    disabled={!hasChanges || saving || !selectedShopId}
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-200 ${hasChanges && !saving && selectedShopId
                      ? `bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700
                        text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95`
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving Changes...
                      </>
                    ) : hasChanges ? (
                      <>
                        <Settings className="w-5 h-5" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        All Saved
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default WooNotificationSettings;