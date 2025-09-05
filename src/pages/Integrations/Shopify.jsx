import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import ShopifyPlugin from '../../components/Shopify/ShopifyPlugin';
import ShopifySite from '../../components/Shopify/ShopifySite';
import { useAuth } from '../../context/AuthContext';

const Shopify = () => {
  const { user } = useAuth();
  const [shops, setShops] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = user?.id;

  const fetchShops = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/shop-tokens/${userId}`);
      setShops(data);
      if (!data || !Array.isArray(data) || data.length === 0) {
        setShops([]);
      }
    } catch (err) {
      console.error('Error fetching shops:', err);
      setError(err.message);
      setShops([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) fetchShops();
  }, [userId, fetchShops]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading shops...</span>
      </div>
    );
  }

  // More explicit checking for shops
  const hasShops = shops && Array.isArray(shops) && shops.length > 0;

  return (
    <div>
      {hasShops ? (
        <ShopifySite shops={shops} refreshShops={fetchShops} />
      ) : (
        <ShopifyPlugin refreshShops={fetchShops} />
      )}
    </div>
  );
};

export default Shopify;