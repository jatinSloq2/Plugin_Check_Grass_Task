import { useState } from 'react';

export default function ShopifyIntegration() {
  const [shop, setShop] = useState('');

  const handleConnect = () => {
    let formattedShop = shop.trim().replace(/^https?:\/\//, '');

    if (!formattedShop.endsWith('.myshopify.com')) {
      alert('Invalid Shopify store');
      return;
    }
    window.location.href = `http://localhost:3000/auth/shopify?shop=${formattedShop}`;
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