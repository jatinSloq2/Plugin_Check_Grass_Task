import { useState } from 'react';
import { ShoppingBag, ExternalLink, Shield, Zap } from 'lucide-react';
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

    console.log(`Redirecting to: ${import.meta.env.VITE_SERVER_URL || 'YOUR_SERVER_URL'}/auth/shopify?shop=${formattedShop}&userId=${user.id}`);
    window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/shopify?shop=${formattedShop}&userId=${user.id}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-200 to-teal-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-200 to-emerald-300 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 px-8 py-12 text-center relative">
            <div className="absolute inset-0 bg-black/10"></div>

            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-6 h-6 bg-white rounded-full animate-pulse"></div>
              <div className="absolute top-8 right-8 w-4 h-4 bg-white rounded-full animate-pulse delay-300"></div>
              <div className="absolute bottom-6 left-8 w-3 h-3 bg-white rounded-full animate-pulse delay-700"></div>
              <div className="absolute bottom-4 right-6 w-5 h-5 bg-white rounded-full animate-pulse delay-500"></div>
            </div>

            <div className="relative z-10">
              {/* Logo Container */}
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 transform hover:scale-105 transition-transform duration-300">
                <ShoppingBag className="w-12 h-12 text-white drop-shadow-lg" />
              </div>

              <h1 className="text-3xl font-bold text-white mb-3 drop-shadow-sm">
                Connect Your Shopify Store
              </h1>
              <p className="text-emerald-100 text-lg font-medium">
                Seamless integration in seconds
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-8 py-10">
            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
                <Zap className="w-4 h-4" />
                <span>Instant Setup</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                <Shield className="w-4 h-4" />
                <span>Secure OAuth</span>
              </div>
            </div>

            {/* Input Section */}
            <div className="space-y-2 mb-6">
              <label htmlFor="shop-input" className="block text-sm font-semibold text-gray-700 mb-2">
                Store URL
              </label>
              <div className="relative">
                <input
                  id="shop-input"
                  type="text"
                  value={shop}
                  onChange={(e) => setShop(e.target.value)}
                  placeholder="your-store.myshopify.com"
                  className="w-full px-6 py-4 bg-gray-50/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100 transition-all duration-300 text-lg"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Connect Button */}
            <button
              onClick={handleConnect}
              className="group w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center space-x-3 text-lg"
            >
              <span>Connect Store</span>
              <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Make sure your store URL ends with{' '}
                <code className="bg-white px-2 py-1 rounded text-emerald-600 font-mono font-semibold shadow-sm">
                  .myshopify.com
                </code>
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/30 text-center hover:bg-white/80 transition-all duration-300">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <Shield className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">Secure</p>
            <p className="text-xs text-gray-500">OAuth 2.0</p>
          </div>
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/30 text-center hover:bg-white/80 transition-all duration-300">
            <div className="w-8 h-8 bg-blue-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <Zap className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">Fast</p>
            <p className="text-xs text-gray-500"> 30 seconds</p>
          </div>
        </div>
      </div>
    </div>
  );
}