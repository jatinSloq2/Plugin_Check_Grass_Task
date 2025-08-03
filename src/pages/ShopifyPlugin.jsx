import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ShopifyIntegration() {
  const [shop, setShop] = useState('');
  const { user } = useAuth();

  const handleConnect = () => {
    const formattedShop = shop.trim().replace(/^https?:\/\//, '').toLowerCase();

    if (!formattedShop || !formattedShop.endsWith('.myshopify.com')) {
      alert('Please enter a valid Shopify store (e.g. your-store.myshopify.com)');
      return;
    }

    if (!user?.id) {
      alert('User not logged in. Please log in to continue.');
      return;
    }

    window.location.href = `https://grasspluginserver.onrender.com/auth/shopify?shop=${formattedShop}&userId=${user.id}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-emerald-100 via-white to-green-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 text-center">

        {/* Shopify Logo Image */}
        <div className="flex justify-center mb-6">
          <img
            src="https://cdn.shopify.com/assets/images/logos/shopify-bag.png"
            alt="Shopify Logo"
            className="w-20 h-20"
          />
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Connect Your Shopify Store
        </h2>
        <p className="text-gray-500 mb-6 text-sm">
          Enter your store URL to start the integration
        </p>

        <input
          type="text"
          value={shop}
          onChange={(e) => setShop(e.target.value)}
          placeholder="your-store.myshopify.com"
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
        />

        <button
          onClick={handleConnect}
          className="w-full py-3 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-md transition"
        >
          Connect Store
        </button>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Make sure your store URL ends with <code>.myshopify.com</code>
        </p>
      </div>
    </div>
  );
}
