import axios from 'axios';
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  MessageCircle,
  Puzzle,
  Save,
  Store
} from 'lucide-react';
import { useEffect, useState } from 'react';
import AutomatedMsgSettings from '../components/Shopify/AutomatedMsgSettings';
import WidgetPlugin from '../components/Shopify/WidgetPlugin';

export default function ShopifySites({ shops, refreshShops }) {
  const [selectedShop, setSelectedShop] = useState('');
  const [selectedSection, setSelectedSection] = useState('widget');
  const [widgetSettings, setWidgetSettings] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (shops.length > 0) {
      setSelectedShop(shops[0].shop);
    } else {
      setSelectedShop("");
    }
  }, [shops]);

  useEffect(() => {
    if (!selectedShop) return;
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/shop-tokens/single/${selectedShop}`);
        setWidgetSettings({
          chatSettings: data.chatSettings || {},
          brandSettings: data.brandSettings || {},
          widgetEnabled: data.widgetEnabled || false,
          automatedMsg: data.automatedMsg || {}
        });
        setHasChanges(false);
      } catch (err) {
        console.error(err);
        setError('Could not load store settings.');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [selectedShop]);

  const handleShopChange = (e) => setSelectedShop(e.target.value);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`${import.meta.env.VITE_SERVER_URL}/shop-tokens/update/${selectedShop}`, widgetSettings);
      setHasChanges(false);
      alert('✅ Changes saved successfully!');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteShop = async (shopName) => {
    if (!confirm(`Delete store: ${shopName}?`)) return;

    setDeleting(true);
    try {
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}/shop-tokens/delete/${shopName}`);
      alert(`Deleted ${shopName}`);
      setIsManageModalOpen(false);
      await refreshShops();
      if (selectedShop === shopName) {
        setSelectedShop('');
      }

    } catch (err) {
      console.error(err);
      alert("Error deleting shop.");
    } finally {
      setDeleting(false);
    }
  };




  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="flex">
        {/* Enhanced Sidebar */}
        <aside className="w-64 min-h-screen border-r bg-white flex flex-col p-4 text-gray-700">
          <h2 className="text-sm font-semibold mb-2">Shopify</h2>

          {/* Store Selector */}
          <select
            value={selectedShop}
            onChange={handleShopChange}
            className="w-full border rounded-lg px-3 py-2 mb-6 text-sm"
          >
            {shops.map((shop, idx) => {
              const shopName = shop.shop.split(".")[0]; // Get only the name before the dot
              return (
                <option key={idx} value={shop.shop}>
                  {shopName}
                </option>
              );
            })}
          </select>

          {/* Delete Store Button */}
          <button
            onClick={() => setIsManageModalOpen(true)}
            className="mb-6 text-sm bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-2"
          >
            <Store className="w-4 h-4" />
            Manage Stores
          </button>
          {isManageModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
                <h2 className="text-lg font-bold mb-4">Manage Stores</h2>
                {shops.length > 0 ? (
                  <ul className="space-y-3">
                    {shops.map((shop, idx) => {
                      const shopName = shop.shop.split(".")[0];
                      return (
                        <li key={idx} className="flex justify-between items-center border rounded-lg p-3">
                          <span>{shopName}</span>
                          <button
                            onClick={() => handleDeleteShop(shop.shop)}
                            disabled={deleting}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                          >
                            {deleting ? "Deleting..." : "Delete"}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p>No stores connected.</p>
                )}
              </div>
            </div>
          )}

          {/* Menu */}
          <nav className="space-y-1 text-sm">
            <button
              onClick={() => setSelectedSection("widget")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md w-full text-left ${selectedSection === "widget"
                ? "bg-emerald-50 text-emerald-700 font-medium"
                : "hover:bg-gray-100"
                }`}
            >
              <Puzzle className="w-4 h-4" />
              Widget Settings
            </button>

            <button
              onClick={() => setSelectedSection("automatedMsg")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md w-full text-left ${selectedSection === "automatedMsg"
                ? "bg-emerald-50 text-emerald-700 font-medium"
                : "hover:bg-gray-100"
                }`}
            >
              <MessageCircle className="w-4 h-4" />
              Automated Message
            </button>
          </nav>
        </aside>

        {/* Enhanced Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500">
              <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mb-4" />
              <p className="text-lg font-medium">Loading store settings...</p>
              <p className="text-sm">Please wait while we fetch your data</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-96">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h3>
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            </div>
          ) : (
            <>
              {selectedSection === 'widget' && (
                <section className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden">
                  {/* Section Header */}
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/20 rounded-xl">
                        <Puzzle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          Widget Settings
                        </h2>
                        <p className="text-emerald-100">
                          Configure your chat widget for <span className="font-semibold">{selectedShop}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <WidgetPlugin
                      settings={widgetSettings}
                      widgetEnabled={widgetSettings.widgetEnabled}
                      onChange={(newSettings) => {
                        setWidgetSettings(newSettings);
                        setHasChanges(true);
                      }}
                    />

                    {/* Save Button */}
                    <div className="pt-8 flex justify-end border-t border-gray-200 mt-8">
                      <button
                        onClick={handleSave}
                        disabled={!hasChanges || saving}
                        className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-200 ${hasChanges && !saving
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
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
                            <Save className="w-5 h-5" />
                            Save Changes
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            All Saved
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </section>
              )}

              {selectedSection === 'automatedMsg' && (
                <section className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden">
                  {/* Section Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/20 rounded-xl">
                        <MessageCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          WhatsApp Automation
                        </h2>
                        <p className="text-blue-100">
                          Set up automated messages for <span className="font-semibold">{selectedShop}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <AutomatedMsgSettings
                      settings={widgetSettings.automatedMsg}
                      onChange={(updatedAutomatedMsg) => {
                        setWidgetSettings(prev => ({ ...prev, automatedMsg: updatedAutomatedMsg }));
                        setHasChanges(true);
                      }}
                    />

                    {/* Save Button */}
                    <div className="pt-8 flex justify-end border-t border-gray-200 mt-8">
                      <button
                        onClick={handleSave}
                        disabled={!hasChanges || saving}
                        className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-200 ${hasChanges && !saving
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
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
                            <Save className="w-5 h-5" />
                            Save Changes
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            All Saved
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </section>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}