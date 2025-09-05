import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

// Import your existing components
import { useAuth } from '../../context/AuthContext';
import WooShopIntegration from '../../components/Woo/WooCommerceAddForm';
import WooNotificationSettings from '../../components/Woo/WooNotificationSettings';

const WooCommerce = () => {
  const { user } = useAuth();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch shops when component mounts or when refreshTrigger changes
  useEffect(() => {
    if (!user?.id) return;

    const fetchShops = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/woo/shop/user/${user.id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch shops');
        }

        const data = await response.json();
        setShops(data);
      } catch (err) {
        console.error('Failed to fetch shops:', err);
        setError('Failed to load shops');
        // If shops fetch fails, assume no shops exist and show add form
        setShops([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [user?.id, refreshTrigger]);

  const handleShopAdded = (newShop) => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleAllShopsDeleted = () => {
    // Force a refresh to check if there are really no shops left
    setRefreshTrigger(prev => prev + 1);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your shops...</p>
        </div>
      </div>
    );
  }

  // Conditionally render based on whether shops exist
  if (shops.length > 0) {
    // Show notification settings if shops exist
    return <WooNotificationSettings onAllShopsDeleted={handleAllShopsDeleted} />;
  } else {
    // Show add shop form if no shops exist
    return <WooShopIntegration onShopAdded={handleShopAdded} />;
  }
};

export default WooCommerce;