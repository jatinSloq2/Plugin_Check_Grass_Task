import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import WidgetPlugin from '../components/Shopify/WidgetPlugin';

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
    const fetchShops = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/shop-tokens/${userId}`);
        if (data.length > 0) {
          setShops(data);
          setSelectedShop(data[0].shop);
          setWidgetSettings({
            chatSettings: data[0].chatSettings || {},
            brandSettings: data[0].brandSettings || {},
            widgetEnabled: data[0].widgetEnabled || false
          });
        } else {
          setError('No shops found for this user.');
        }
      } catch (err) {
        console.error('Failed to fetch shop tokens:', err);
        setError('Error fetching shops.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchShops();
  }, [userId]);

  const handleShopChange = (e) => {
    const shopDomain = e.target.value;
    const selected = shops.find(s => s.shop === shopDomain);
    setSelectedShop(shopDomain);
    if (selected) {
      setWidgetSettings({
        chatSettings: selected.chatSettings || {},
        brandSettings: selected.brandSettings || {},
        widgetEnabled: selected.widgetEnabled || false
      });
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:3000/shop-tokens/update/${selectedShop}`, {
        ...widgetSettings
      });
      setHasChanges(false);
      alert('Widget settings saved!');
    } catch (err) {
      console.error('Failed to save settings:', err);
      alert('Error saving settings');
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md border-r border-gray-200 p-6 space-y-6">
        <div>
          <label htmlFor="shopSelector" className="block text-sm text-gray-700 mb-1">Select Store:</label>
          <select
            id="shopSelector"
            value={selectedShop}
            onChange={handleShopChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            {shops.map((shop, index) => (
              <option key={index} value={shop.shop}>{shop.shop}</option>
            ))}
          </select>
        </div>

        <nav className="space-y-3">
          <button onClick={() => setSelectedSection('widget')} className="w-full text-left px-4 py-2 bg-emerald-100 hover:bg-emerald-200 rounded">
            🧩 Widget
          </button>
          <button onClick={() => setSelectedSection('test1')} className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded">
            🧪 Test1
          </button>
          <button onClick={() => setSelectedSection('test2')} className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded">
            🧪 Test2
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-8">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : selectedSection === 'widget' ? (
          <div className="max-w-xl bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Widget Settings for {selectedShop}</h2>

            <WidgetPlugin
              settings={widgetSettings}
              widgetEnabled={widgetSettings.widgetEnabled}
              onChange={(newSettings) => {
                setWidgetSettings(newSettings);
                setHasChanges(true);
              }}
            />

            <div className="flex justify-between pt-6">
              {hasChanges && widgetSettings.widgetEnabled && (
                <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">
                  Save
                </button>
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-700">You selected: <strong>{selectedSection}</strong></p>
        )}
      </div>
    </div>
  );
}
