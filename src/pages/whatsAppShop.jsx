import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { FaPaperPlane, FaShoppingCart, FaTimes } from "react-icons/fa";

const WhatsAppShop = () => {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [cartOpen, setCartOpen] = useState(false); // for mobile

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/shop/id/${id}`);
        const data = await res.json();
        setShop(data);
      } catch (err) {
        console.error("Failed to load shop:", err);
      }
    };
    fetchShop();
  }, [id]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.name === product.name);
      if (existing) {
        return prev.map((p) =>
          p.name === product.name ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (name) => {
    setCart((prev) =>
      prev
        .map((p) => (p.name === name ? { ...p, qty: p.qty - 1 } : p))
        .filter((p) => p.qty > 0)
    );
  };

  const getTotalPrice = () =>
    cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const categories = useMemo(() => {
    if (!shop?.products) return [];
    const uniqueCats = [...new Set(shop.products.map((p) => p.category))];
    return ["All", ...uniqueCats];
  }, [shop]);

  const filteredProducts = useMemo(() => {
    if (!shop?.products) return [];
    if (activeCategory === "All") return shop.products;
    return shop.products.filter((p) => p.category === activeCategory);
  }, [shop, activeCategory]);

  const handleCheckout = () => {
    if (!cart.length || !shop) return;
    const itemsList = cart
      .map(
        (item, i) =>
          `${i + 1}. ${item.name} x${item.qty} – ₹${item.price * item.qty}`
      )
      .join("\n");
    const totalPrice = getTotalPrice();
    const message = encodeURIComponent(
      `✨ Hello from ${shop.shopName}!\n\nYour Order:\n${itemsList}\n\nTotal: ₹${totalPrice}\n✅ Please confirm your order.`
    );
    window.open(`https://wa.me/${shop.phoneNumber}?text=${message}`, "_blank");
  };

  if (!shop) return <div className="p-4 text-center">Loading shop...</div>;

  return (
    <div className="bg-[#f0f2f5] min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#075E54] text-white px-4 py-3 flex justify-between items-center">
        <span className="font-bold text-lg">{shop.shopName} 🛍️</span>
        <button
          className="sm:hidden bg-[#25D366] px-3 py-1 rounded flex items-center gap-2"
          onClick={() => setCartOpen(true)}
        >
          <FaShoppingCart /> ({cart.length})
        </button>
      </header>

      {/* Description */}
      <div className="bg-[#e0f2e9] text-center py-2 text-sm text-gray-700">
        {shop.description}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center bg-white shadow p-3 sticky top-0 z-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1 rounded-full border ${
              activeCategory === cat
                ? "bg-[#25D366] text-white border-[#25D366]"
                : "border-gray-300 hover:bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto flex flex-1 p-4 gap-6">
        {/* Products */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.name}
              className="bg-white rounded-lg shadow p-3 flex flex-col"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="font-semibold mt-2">{product.name}</h3>
              <p className="text-sm text-gray-600 flex-1">
                {product.description}
              </p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-green-700 font-bold">
                  ₹{product.price}
                </span>
                <button
                  className="bg-[#25D366] text-white text-xs px-3 py-1 rounded hover:bg-green-500"
                  onClick={() => addToCart(product)}
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Cart */}
        <aside className="hidden sm:block w-80 bg-white rounded-lg shadow p-4 sticky top-4 h-fit">
          <h2 className="text-lg font-semibold mb-3 text-[#075E54]">🧾 Cart</h2>
          {cart.length === 0 ? (
            <p className="text-sm text-gray-500">Your cart is empty.</p>
          ) : (
            <>
              <ul className="space-y-3 max-h-72 overflow-auto pr-1">
                {cart.map((item) => (
                  <li
                    key={item.name}
                    className="flex justify-between items-center text-sm border-b pb-1"
                  >
                    <span>
                      {item.name} x{item.qty}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        className="px-2 bg-gray-200 rounded"
                        onClick={() => removeFromCart(item.name)}
                      >
                        -
                      </button>
                      <button
                        className="px-2 bg-gray-200 rounded"
                        onClick={() => addToCart(item)}
                      >
                        +
                      </button>
                      <span className="text-green-700">
                        ₹{item.price * item.qty}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 font-semibold flex justify-between">
                <span>Total:</span>
                <span>₹{getTotalPrice()}</span>
              </div>
              <button
                className="mt-4 w-full bg-[#25D366] text-white flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-green-500"
                onClick={handleCheckout}
              >
                <FaPaperPlane /> Send on WhatsApp
              </button>
            </>
          )}
        </aside>
      </div>

      {/* Mobile Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-80 h-full p-4 flex flex-col">
            <div className="flex justify-between items-center border-b pb-2 mb-2">
              <h2 className="text-lg font-semibold text-[#075E54]">🧾 Cart</h2>
              <button onClick={() => setCartOpen(false)}>
                <FaTimes size={20} />
              </button>
            </div>
            {cart.length === 0 ? (
              <p className="text-sm text-gray-500 flex-1">Your cart is empty.</p>
            ) : (
              <>
                <ul className="space-y-3 flex-1 overflow-auto">
                  {cart.map((item) => (
                    <li
                      key={item.name}
                      className="flex justify-between items-center text-sm border-b pb-1"
                    >
                      <span>
                        {item.name} x{item.qty}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          className="px-2 bg-gray-200 rounded"
                          onClick={() => removeFromCart(item.name)}
                        >
                          -
                        </button>
                        <button
                          className="px-2 bg-gray-200 rounded"
                          onClick={() => addToCart(item)}
                        >
                          +
                        </button>
                        <span className="text-green-700">
                          ₹{item.price * item.qty}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 font-semibold flex justify-between">
                  <span>Total:</span>
                  <span>₹{getTotalPrice()}</span>
                </div>
                <button
                  className="mt-4 w-full bg-[#25D366] text-white flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-green-500"
                  onClick={handleCheckout}
                >
                  <FaPaperPlane /> Send on WhatsApp
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Branding Footer */}
      <footer className="bg-[#075E54] text-white text-center py-3 text-sm">
        ✅ Powered by <span className="font-bold">AI Green Tick</span> – Create
        your own WhatsApp Shop in minutes!
      </footer>
    </div>
  );
};

export default WhatsAppShop;
