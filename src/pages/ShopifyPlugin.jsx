import { useState } from 'react';

export default function ShopifyIntegration() {
  const [shop, setShop] = useState('');

  const handleConnect = () => {
    if (!shop.endsWith('.myshopify.com')) {
      alert('Invalid shop domain');
      return;
    }
    window.location.href = `/auth/shopify?shop=${shop}`;
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