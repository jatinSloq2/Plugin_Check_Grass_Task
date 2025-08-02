import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ShopifyIntegration() {
  const [shop, setShop] = useState('');
  const { user } = useAuth();

  const handleConnect = () => {
    const formattedShop = shop.trim().replace(/^https?:\/\//, '');

    if (!formattedShop.endsWith('.myshopify.com')) {
      alert('Invalid Shopify store');
      return;
    }

    if (!user?._id) {
      alert('User not logged in');
      return;
    }
    window.location.href = `http://localhost:3000/auth/shopify?shop=${formattedShop}&userId=${user._id}`;
  };

  return (
    <div>
      <h1>Connect your Shopify Store</h1>
      <input
        type="text"
        value={shop}
        onChange={(e) => setShop(e.target.value)}
        placeholder="your-store.myshopify.com"
      />
      <button onClick={handleConnect}>Connect</button>
    </div>
  );
}
