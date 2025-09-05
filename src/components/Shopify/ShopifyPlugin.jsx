import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function WooCommercePlugin() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    shopUrl: '',
    consumerKey: '',
    consumerSecret: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const handleInstall = async () => {
    if (!formData.shopUrl || !formData.consumerKey || !formData.consumerSecret) {
      setError('Please fill in all fields');
      return;
    }

    if (!user?.id) {
      setError('User not logged in. Please log in to continue.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/woo/shop/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          ...formData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to connect store');
      }

      setSuccess(true);
      setFormData({ shopUrl: '', consumerKey: '', consumerSecret: '' });
    } catch (err) {
      setError(err.message || 'Failed to connect store. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <img
              src="https://woocommerce.com/wp-content/themes/woo/images/logo-woocommerce.svg"
              alt="WooCommerce Logo"
              className="w-20 h-20 mx-auto object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            WooCommerce App
          </h1>
          <p className="text-gray-600 text-xl font-light leading-relaxed max-w-md mx-auto">
            Connect your WooCommerce store with API credentials
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-700 font-medium">Store connected successfully!</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          <div className="shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            <input
              type="url"
              name="shopUrl"
              value={formData.shopUrl}
              onChange={handleChange}
              placeholder="https://yourstore.com"
              className="w-full px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none border-b border-gray-200"
            />
            <input
              type="text"
              name="consumerKey"
              value={formData.consumerKey}
              onChange={handleChange}
              placeholder="Consumer Key (ck_...)"
              className="w-full px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none border-b border-gray-200"
            />
            <input
              type="password"
              name="consumerSecret"
              value={formData.consumerSecret}
              onChange={handleChange}
              placeholder="Consumer Secret (cs_...)"
              className="w-full px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none"
            />
          </div>

          <button
            onClick={handleInstall}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 transition-all duration-200 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Connecting...
              </>
            ) : (
              'Connect Store'
            )}
          </button>
        </div>

        {/* Help Link */}
        <p className="mt-8 text-center text-sm text-gray-500">
          Need help finding your API credentials?{" "}
          <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">
            View guide
          </a>
        </p>
      </div>
    </div>
  );
}