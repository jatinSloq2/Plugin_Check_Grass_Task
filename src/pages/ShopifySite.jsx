import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import WidgetPlugin from '../components/Shopify/WidgetPlugin';
import AutomatedMsgSettings from '../components/Shopify/AutomatedMsgSettings';
import { Trash2, Puzzle, MessageCircle, Save } from 'lucide-react';

export default function ShopifySites() {
  const { user } = useAuth();
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState('');
  const [selectedSection, setSelectedSection] = useState('widget');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [widgetSettings, setWidgetSettings] = useState({});
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
    try {
      await axios.put(`${import.meta.env.VITE_SERVER_URL}/shop-tokens/update/${selectedShop}`, widgetSettings);
      setHasChanges(false);
      alert('✅ Changes saved successfully!');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to save changes.');
    }
  };

  const handleDeleteShop = async () => {
    if (!selectedShop) return alert("Please select a shop.");
    const confirmDelete = confirm(`Delete store: ${selectedShop}?`);
    if (!confirmDelete) return;
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
    }
  };

  const sectionClass = (section) =>
    `w-full flex items-center gap-2 text-left px-4 py-2 rounded-md transition-all font-medium ${
      selectedSection === section
        ? 'bg-emerald-600 text-white shadow'
        : 'bg-gray-100 hover:bg-emerald-100 text-gray-700'
    }`;

  return (
    <div className="min-h-screen flex bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 shadow-md p-6 flex flex-col gap-6">
        <div>
          <label htmlFor="shopSelector" className="text-sm font-semibold text-gray-800 mb-2 block">
            Connected Store
          </label>
          <select
            id="shopSelector"
            value={selectedShop}
            onChange={handleShopChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          >
            {shops.map((shop, idx) => (
              <option key={idx} value={shop.shop}>{shop.shop}</option>
            ))}
          </select>

          <button
            onClick={handleDeleteShop}
            className="mt-4 w-full text-sm bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-md transition flex items-center justify-center gap-2"
          >
            <Trash2 size={16} /> Delete Store
          </button>
        </div>

        <nav className="space-y-2">
          <button onClick={() => setSelectedSection('widget')} className={sectionClass('widget')}>
            <Puzzle size={18} /> Widget Settings
          </button>
          <button onClick={() => setSelectedSection('automatedMsg')} className={sectionClass('automatedMsg')}>
            <MessageCircle size={18} /> Automated Messages
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {loading ? (
          <p className="text-gray-500">Loading store settings...</p>
        ) : error ? (
          <p className="text-red-500 font-medium">{error}</p>
        ) : (
          <>
            {selectedSection === 'widget' && (
              <section className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Widget Settings <span className="text-sm text-gray-500">({selectedShop})</span>
                </h2>

                <WidgetPlugin
                  settings={widgetSettings}
                  widgetEnabled={widgetSettings.widgetEnabled}
                  onChange={(newSettings) => {
                    setWidgetSettings(newSettings);
                    setHasChanges(true);
                  }}
                />

                <div className="pt-6 flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={!hasChanges}
                    className={`flex items-center gap-2 px-6 py-2 rounded-md font-semibold transition ${
                      hasChanges
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Save size={16} /> Save Changes
                  </button>
                </div>
              </section>
            )}

            {selectedSection === 'automatedMsg' && (
              <section className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  WhatsApp Automation <span className="text-sm text-gray-500">({selectedShop})</span>
                </h2>

                <AutomatedMsgSettings
                  settings={widgetSettings.automatedMsg}
                  onChange={(updatedAutomatedMsg) => {
                    setWidgetSettings(prev => ({ ...prev, automatedMsg: updatedAutomatedMsg }));
                    setHasChanges(true);
                  }}
                />

                <div className="pt-6 flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={!hasChanges}
                    className={`flex items-center gap-2 px-6 py-2 rounded-md font-semibold transition ${
                      hasChanges
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Save size={16} /> Save Changes
                  </button>
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
