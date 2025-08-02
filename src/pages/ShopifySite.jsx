import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function ShopifySites() {
  const { user } = useAuth();
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userId = user?.id;

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/shop-tokens/${userId}`);
        const shopList = data || [];
        if (shopList.length > 0) {
          setShops(shopList);
          setSelectedShop(shopList[0].shop);
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

  const handleChange = (e) => setSelectedShop(e.target.value);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
        
        {/* Shopify Image Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="https://cdn.shopify.com/assets/images/logos/shopify-bag.png"
            alt="Shopify Logo"
            className="w-20 h-20"
          />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Your Shopify Stores</h1>
        <p className="text-gray-500 mb-6 text-sm">Manage and view your connected stores below</p>

        {/* Loading/Error/Selector */}
        {loading ? (
          <p className="text-sm text-gray-500">🔄 Loading your stores...</p>
        ) : error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : (
          <>
            <label htmlFor="shopSelector" className="block text-sm text-left text-gray-700 mb-1">
              Select a store:
            </label>
            <select
              id="shopSelector"
              value={selectedShop}
              onChange={handleChange}
              className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            >
              {shops.map((shop, index) => (
                <option key={index} value={shop.shop}>
                  {shop.shop}
                </option>
              ))}
            </select>

            <p className="text-sm text-gray-700">
              Current Store:&nbsp;
              <span className="font-semibold text-emerald-600">{selectedShop}</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
