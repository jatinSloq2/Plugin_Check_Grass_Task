import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import WidgetPlugin from '../components/Shopify/WidgetPlugin';
import AutomatedMsgSettings from '../components/Shopify/AutomatedMsgSettings';

// Dummy components for Test1 and Test2 sections
const Test1Component = () => <div className="bg-white p-6 rounded shadow">This is <strong>Test 1</strong> content.</div>;
const Test2Component = () => <div className="bg-white p-6 rounded shadow">This is <strong>Test 2</strong> content.</div>;

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

  // Fetch shop list on initial load
  useEffect(() => {
    if (!userId) return;
    const fetchShops = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/shop-tokens/${userId}`);
        setShops(data);
        if (data.length > 0) {
          setSelectedShop(data[0].shop);
        } else {
          setError('No shops found for this user.');
        }
      } catch (err) {
        console.error('Failed to fetch shops:', err);
        setError('Error fetching shops.');
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, [userId]);

  // Fetch settings when selectedShop changes
  useEffect(() => {
    if (!selectedShop) return;
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/shop-tokens/single/${selectedShop}`);
        console.log('Fetched settings:', data);
        setWidgetSettings({
          chatSettings: data.chatSettings || {},
          brandSettings: data.brandSettings || {},
          widgetEnabled: data.widgetEnabled || false,
          automatedMsg: data.automatedMsg || {}

        });
        setHasChanges(false);
      } catch (err) {
        console.error('Failed to fetch shop settings:', err);
        setError('Failed to load settings for selected shop.');
      }
    };
    fetchSettings();
  }, [selectedShop]);

  const handleShopChange = (e) => {
    setSelectedShop(e.target.value);
  };

  const handleSave = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_SERVER_URL}/shop-tokens/update/${selectedShop}`, widgetSettings);
      setHasChanges(false);
      alert('Widget settings saved!');
    } catch (err) {
      console.error('Failed to save settings:', err);
      alert('Error saving settings');
    }
  };

  const sectionClass = (section) =>
    `w-full text-left px-4 py-2 rounded transition ${selectedSection === section
      ? 'bg-emerald-600 text-white'
      : 'bg-gray-50 hover:bg-emerald-100 text-gray-800'
    }`;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md border-r border-gray-200 p-6 space-y-6">
        <div>
          <label htmlFor="shopSelector" className="block text-sm font-medium text-gray-700 mb-1">
            Select Store:
          </label>
          <select
            id="shopSelector"
            value={selectedShop}
            onChange={handleShopChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          >
            {shops.map((shop, index) => (
              <option key={index} value={shop.shop}>
                {shop.shop}
              </option>
            ))}
          </select>
        </div>

        <nav className="space-y-2">
          <button onClick={() => setSelectedSection('widget')} className={sectionClass('widget')}>
            🧩 Widget
          </button>
          <button onClick={() => setSelectedSection('automatedMsg')} className={sectionClass('automatedMsg')}>
            🧪 Automated Messages
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            {selectedSection === 'widget' && (
              <div className="max-w-3xl bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Widget Settings for {selectedShop}</h2>

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
                    className={`px-5 py-2 rounded font-semibold transition ${hasChanges
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
            {selectedSection === 'automatedMsg' && (
              <div className="max-w-3xl bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Automated Message Settings for {selectedShop}</h2>

                <AutomatedMsgSettings
                  settings={widgetSettings.automatedMsg}
                  onChange={(updatedAutomatedMsg) => {
                    setWidgetSettings((prev) => ({ ...prev, automatedMsg: updatedAutomatedMsg }));
                    setHasChanges(true);
                  }}
                />

                <div className="pt-6 flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={!hasChanges}
                    className={`px-5 py-2 rounded font-semibold transition ${hasChanges
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

          </>
        )}
      </main>
    </div>
  );
}
