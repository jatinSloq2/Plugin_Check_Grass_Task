import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import WidgetPlugin from '../components/Shopify/WidgetPlugin';
import AutomatedMsgSettings from '../components/Shopify/AutomatedMsgSettings';
import { 
  Trash2, 
  Puzzle, 
  MessageCircle, 
  Save, 
  Store, 
  Settings, 
  ChevronDown,
  Loader2,
  AlertCircle,
  CheckCircle,
  Sparkles
} from 'lucide-react';

export default function ShopifySites() {
  const { user } = useAuth();
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState('');
  const [selectedSection, setSelectedSection] = useState('widget');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [widgetSettings, setWidgetSettings] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    const fetchShops = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/shop-tokens/${userId}`);
        setShops(data);
        if (data.length > 0) setSelectedShop(data[0].shop);
        else setError('No connected stores found.');
      } catch (err) {
        console.error(err);
        setError('Failed to load stores.');
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, [userId]);

  useEffect(() => {
    if (!selectedShop) return;
    const fetchSettings = async () => {
      try {
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

  const handleDeleteShop = async () => {
    if (!selectedShop) return alert("Please select a shop.");
    const confirmDelete = confirm(`Delete store: ${selectedShop}?`);
    if (!confirmDelete) return;
    
    setDeleting(true);
    try {
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}/shop-tokens/delete/${selectedShop}`);
      const updatedShops = shops.filter(shop => shop.shop !== selectedShop);
      setShops(updatedShops);
      setSelectedShop(updatedShops[0]?.shop || '');
      if (!updatedShops.length) setError('No stores remaining.');
      alert(`Deleted ${selectedShop}`);
    } catch (err) {
      console.error(err);
      alert('Error deleting shop.');
    } finally {
      setDeleting(false);
    }
  };

  const sectionClass = (section) =>
    `group w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
      selectedSection === section
        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200'
        : 'bg-white hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 text-gray-700 hover:text-emerald-700 border border-gray-200 hover:border-emerald-200'
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="flex">
        {/* Enhanced Sidebar */}
        <aside className="w-80 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-xl p-6 flex flex-col gap-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-20 h-20 bg-emerald-500 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-16 h-16 bg-teal-500 rounded-full blur-xl"></div>
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Store Manager</h1>
                <p className="text-sm text-gray-500">Configure your integrations</p>
              </div>
            </div>

            {/* Store Selector */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200/50">
              <label htmlFor="shopSelector" className="text-sm font-semibold text-gray-800 mb-3 block flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Connected Store
              </label>
              <div className="relative">
                <select
                  id="shopSelector"
                  value={selectedShop}
                  onChange={handleShopChange}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 appearance-none cursor-pointer text-gray-800 font-medium"
                >
                  {shops.map((shop, idx) => (
                    <option key={idx} value={shop.shop}>{shop.shop}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              <button
                onClick={handleDeleteShop}
                disabled={deleting}
                className="mt-4 w-full text-sm bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:transform-none disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Store
                  </>
                )}
              </button>
            </div>

            {/* Navigation */}
            <nav className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Configuration
              </h3>
              
              <button 
                onClick={() => setSelectedSection('widget')} 
                className={sectionClass('widget')}
              >
                <div className={`p-2 rounded-lg ${
                  selectedSection === 'widget' 
                    ? 'bg-white/20' 
                    : 'bg-emerald-100 group-hover:bg-emerald-200'
                }`}>
                  <Puzzle className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold">Widget Settings</div>
                  <div className={`text-xs ${
                    selectedSection === 'widget' 
                      ? 'text-emerald-100' 
                      : 'text-gray-500'
                  }`}>
                    Customize chat widget
                  </div>
                </div>
              </button>
              
              <button 
                onClick={() => setSelectedSection('automatedMsg')} 
                className={sectionClass('automatedMsg')}
              >
                <div className={`p-2 rounded-lg ${
                  selectedSection === 'automatedMsg' 
                    ? 'bg-white/20' 
                    : 'bg-emerald-100 group-hover:bg-emerald-200'
                }`}>
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold">Auto Messages</div>
                  <div className={`text-xs ${
                    selectedSection === 'automatedMsg' 
                      ? 'text-emerald-100' 
                      : 'text-gray-500'
                  }`}>
                    WhatsApp automation
                  </div>
                </div>
              </button>
            </nav>
          </div>
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
                        className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-200 ${
                          hasChanges && !saving
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
                        className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-200 ${
                          hasChanges && !saving
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