import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Import your components
import ShopifySite from '../ShopifySite'; // Adjust path as needed
import ShopifyPlugin from '../ShopifyPlugin'; // Adjust path as needed
import { useAuth } from '../../context/AuthContext';

const Shopify = () => {
  const { user } = useAuth();
  const [shops, setShops] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = user?.id;

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/shop-tokens/${userId}`);
        setShops(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [userId]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading shops...</span>
      </div>
    );
  }

  // Check if shops exist and have length > 0
  // Handle both array response and object with message
  const hasShops = shops && Array.isArray(shops) && shops.length > 0;

  return (
    <div>
      {hasShops ? <ShopifySite shops={shops} /> : <ShopifyPlugin />}
    </div>
  );
};

export default Shopify;