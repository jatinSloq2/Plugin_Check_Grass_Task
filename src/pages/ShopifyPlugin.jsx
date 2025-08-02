import { useState } from 'react';

export default function ShopifyIntegration() {
  const [shop, setShop] = useState('');
  const userId = '123456';

  const handleConnect = () => {
    let formattedShop = shop.trim().replace(/^https?:\/\//, '');

    if (!formattedShop.endsWith('.myshopify.com')) {
      alert('Invalid Shopify store');
      return;
    }

    // 👉 Pass userId in the query
    window.location.href = `http://localhost:3000/auth/shopify?shop=${formattedShop}&userId=${userId}`;
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