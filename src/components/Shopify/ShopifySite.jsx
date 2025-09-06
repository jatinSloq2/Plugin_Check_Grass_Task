import axios from 'axios';
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  MessageCircle,
  Puzzle,
  Save,
  Store,
  Plus, X, Trash2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import AutomatedMsgSettings from './AutomatedMsgSettings';
import WidgetPlugin from './WidgetPlugin';
import { useAuth } from '../../context/AuthContext';

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
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [newShop, setNewShop] = useState('');
  const { user } = useAuth();

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

  const handleAddStore = () => {
    const formattedShop = newShop.trim()
      .replace(/^https?:\/\//, '')
      .replace(/\/+$/, '')
      .toLowerCase();

    if (!formattedShop || !formattedShop.endsWith('.myshopify.com')) {
      alert('Please enter a valid Shopify store (e.g. your-store.myshopify.com)');
      return;
    }

    if (!user?.id) {
      alert('User not logged in. Please log in to continue.');
      return;
    }

    console.log(
      `Adding new store: ${import.meta.env.VITE_SERVER_URL || 'YOUR_SERVER_URL'}/auth/shopify?shop=${formattedShop}&userId=${user.id}`
    );

    window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/shopify?shop=${formattedShop}&userId=${user.id}`;
  };


  return (
    <div className="min-h-screen bg-grag-50 ">
      <div className="flex">
        {/* Enhanced Sidebar */}
        <aside className="w-72 min-h-screen border-r border-gray-300 bg-white flex flex-col p-5 text-gray-700">
          {/* Brand */}
          <h2 className="text-3xl font-bold tracking-wide mb-10 text-gray-900">Shopify</h2>

          {/* Store Selector */}
          {shops.length > 1 ? (
            <select
              value={selectedShop}
              onChange={handleShopChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-6 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {shops.map((shop, idx) => {
                const shopName = shop.shop.split(".")[0];
                return (
                  <option key={idx} value={shop.shop}>
                    {shopName}
                  </option>
                );
              })}
            </select>
          ) : shops.length === 1 ? (
            <p className="mb-6 text-lg hover:border hover:border-gray-200 text-black hover:bg-blue-50 py-2 px-3 rounded-lg flex items-center gap-2 transition-all duration-200 font-medium">
              {shops[0].shop.split(".")[0]}
            </p>
          ) : null}

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

                {/* Add Store Form */}
                {isAddFormVisible ? (
                  <div className="p-5 border rounded-lg bg-gray-50">
                    <h3 className="text-md font-semibold mb-2 text-gray-900">Add New Shopify Store</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Enter your Shopify domain to securely connect your store.
                    </p>
                    <div className="flex w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                      <input
                        type="text"
                        value={newShop}
                        onChange={(e) => setNewShop(e.target.value)}
                        placeholder="example.myshopify.com"
                        className="flex-grow px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none"
                      />
                      <button
                        onClick={handleAddStore}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 transition"
                      >
                        Install
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Existing Stores List */}
                    {shops.length > 0 ? (
                      <ul className="space-y-3 flex-grow overflow-y-auto">
                        {shops.map((shop, idx) => {
                          const shopName = shop.shop.split(".")[0];
                          return (
                            <li
                              key={idx}
                              className="flex justify-between items-center  p-3 bg-white hover:shadow-sm transition"
                            >
                              <span className="text-gray-800 font-medium">{shopName}</span>
                              <button
                                onClick={() => handleDeleteShop(shop.shop)}
                                disabled={deleting}
                                className="text-red-600 hover:text-red-700 flex gap-2 items-center hover:bg-red-100 p-3 rounded transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                                Delete
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-center py-6 text-sm">
                        No stores connected. Click below to add one.
                      </p>
                    )}
                  </>
                )}

                {/* Footer Button */}
                <div className="mt-6 pt-4">
                  <button
                    onClick={() => setIsAddFormVisible(!isAddFormVisible)}
                    className="w-fit flex items-center justify-center gap-2 border border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-medium px-4 py-2 rounded-lg transition"
                  >
                    {isAddFormVisible ? (
                      <>
                        <X className="w-4 h-4" /> Cancel
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" /> Add New Store
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sidebar Menu */}
          <nav className="space-y-1 text-sm mt-2">
            <button
              onClick={() => setSelectedSection("widget")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md w-full text-left transition ${selectedSection === "widget"
                ? "bg-emerald-50 text-emerald-700 font-medium"
                : "hover:bg-gray-100 text-gray-700"
                }`}
            >
              <Puzzle className="w-4 h-4" />
              Widget Settings
            </button>

            <button
              onClick={() => setSelectedSection("automatedMsg")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md w-full text-left transition ${selectedSection === "automatedMsg"
                ? "bg-emerald-50 text-emerald-700 font-medium"
                : "hover:bg-gray-100 text-gray-700"
                }`}
            >
              <MessageCircle className="w-4 h-4" />
              Automated Messages
            </button>
          </nav>
        </aside>


        <main className="flex-1 p- overflow-y-auto">
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
              {(selectedSection === 'widget' || selectedSection === 'automatedMsg') && (
                <section className="bg-gray-50 backdrop-blur-xl shadow-xl">
                  {/* Section Header */}
                  <div
                    className={`px-8 py-6`}
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <h2 className="text-3xl font-bold text-foreground">
                          {selectedSection === 'widget' ? 'Widget Settings' : 'WhatsApp Automation'}
                        </h2>
                        <p
                          className={
                            selectedSection === 'widget'
                              ? 'text-muted-foreground'
                              : 'text-muted-foreground'
                          }
                        >
                          {selectedSection === 'widget'
                            ? <>Configure your chat widget for <span className="font-semibold">{selectedShop}</span></>
                            : <>Set up automated messages for <span className="font-semibold">{selectedShop}</span></>
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    {selectedSection === 'widget' ? (
                      <WidgetPlugin
                        settings={widgetSettings}
                        widgetEnabled={widgetSettings.widgetEnabled}
                        onChange={(newSettings) => {
                          setWidgetSettings(newSettings);
                          setHasChanges(true);
                        }}
                      />
                    ) : (
                      <AutomatedMsgSettings
                        settings={widgetSettings.automatedMsg}
                        onChange={(updatedAutomatedMsg) => {
                          setWidgetSettings((prev) => ({
                            ...prev,
                            automatedMsg: updatedAutomatedMsg,
                          }));
                          setHasChanges(true);
                        }}
                      />
                    )}

                    {/* 🔹 Single Save Button */}
                    <div className="pt-8 flex justify-end mt-8">
                      <button
                        onClick={handleSave}
                        disabled={!hasChanges || saving}
                        className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-200 ${hasChanges && !saving
                          ? `
                            bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700
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