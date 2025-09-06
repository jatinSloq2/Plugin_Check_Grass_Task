import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ShopifyPlugin() {
  const [shop, setShop] = useState('');
  const { user } = useAuth();

  const handleInstall = () => {
    const formattedShop = shop.trim()
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
      `Redirecting to: ${import.meta.env.VITE_SERVER_URL || 'YOUR_SERVER_URL'
      }/auth/shopify?shop=${formattedShop}&userId=${user.id}`
    );

    window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/shopify?shop=${formattedShop}&userId=${user.id}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="mb-8">
            <img
              src="https://cdn.shopify.com/shopifycloud/brochure/assets/brand-assets/shopify-logo-shopping-bag-full-color-66166b2e55d67988b56b4bd28b63c271e2b9713358cb723070a92bde17ad7d63.svg"
              alt="Shopify Logo"
              className="w-20 h-20 mx-auto object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Shopify App
          </h1>
          <p className="text-gray-600 text-xl font-light leading-relaxed max-w-md mx-auto">
            Enter your Shopify domain to log in or install this app
          </p>
        </div>

        {/* Main Form */}
        <div className="flex w-full mx-auto shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <input
            type="text"
            value={shop}
            onChange={(e) => setShop(e.target.value)}
            placeholder="example.myshopify.com"
            className="flex-grow px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none rounded-l-lg"
          />
          <button
            onClick={handleInstall}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 transition-all duration-200 rounded-r-lg"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
