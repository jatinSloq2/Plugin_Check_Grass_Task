import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const WhatsAppShop = () => {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/shop/id/${id}`);
        const data = await res.json();
        setShop(data);
      } catch (err) {
        console.error('Failed to load shop:', err);
      }
    };

    fetchShop();
  }, [id]);

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const getTotalItems = () => cart.length;

  const getCartSummary = () => {
    if (!cart.length) return 'No items in cart.';
    const summary = cart.map((item, i) => `${i + 1}. ${item.name} - ${item.category}`).join('\n');
    return `🛒 Your Cart:\n${summary}\n\nTotal items: ${cart.length}`;
  };

  const handleCheckout = () => {
    if (!cart.length || !shop) return;

    const message = encodeURIComponent(getCartSummary());
    const whatsappURL = `https://wa.me/${shop.phoneNumber}?text=${message}`;
    window.open(whatsappURL, '_blank');
  };

  if (!shop) return <div className="p-4 text-center">Loading shop...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">{shop.shopName}'s Shop</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {shop.products.map((product, index) => (
          <div key={index} className="border p-4 rounded shadow">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover mb-2 rounded" />
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-sm text-gray-600">{product.category}</p>
            <p className="text-sm mt-1">{product.description}</p>
            <button
              className="mt-3 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t pt-4 text-center">
        <h2 className="text-2xl font-semibold">🧾 Cart Summary</h2>
        <pre className="bg-gray-100 p-3 mt-2 rounded text-left whitespace-pre-wrap">{getCartSummary()}</pre>
        <button
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          onClick={handleCheckout}
        >
          Checkout on WhatsApp ({getTotalItems()} items)
        </button>
      </div>
    </div>
  );
};

export default WhatsAppShop;
