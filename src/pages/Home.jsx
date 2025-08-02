import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-green-100 via-white to-emerald-100 dark:from-green-950 dark:via-green-900 dark:to-green-800 text-gray-800 dark:text-white flex flex-col items-center px-4">

      {/* Header */}
      <header className="w-full max-w-6xl py-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src="https://cdn.shopify.com/assets/images/logos/shopify-bag.png"
            alt="Shopify Logo"
            className="w-8 h-8"
          />
          <h1 className="text-2xl font-bold text-green-700 dark:text-green-400">
            eWhatsApp Plugin
          </h1>
        </div>

        {token ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
          >
            Login
          </Link>
        )}
      </header>

      {/* Hero Section */}
      <main className="text-center mt-16 w-full max-w-4xl">
        <h2 className="text-4xl font-extrabold mb-4 text-green-800 dark:text-green-300 leading-tight">
          Power Your Business With WhatsApp & Shopify Integrations
        </h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
          Automate order updates, recover abandoned carts, send personalized messages, and more — across Shopify and other platforms.
        </p>
        <Link
          to="/signup"
          className="inline-block bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-emerald-700 transition shadow-lg"
        >
          🚀 Get Started
        </Link>
      </main>

      {/* Features */}
      <section className="mt-20 w-full max-w-5xl grid md:grid-cols-3 gap-6">
        {[
          {
            title: 'Recover Abandoned Carts',
            desc: 'Automatically message users who left items in their cart to boost sales.',
            icon: '🛒',
          },
          {
            title: 'Send Order Updates',
            desc: 'Notify customers instantly when orders are placed, shipped, or delivered.',
            icon: '📦',
          },
          {
            title: 'Broadcast Offers',
            desc: 'Send personalized offers via WhatsApp to increase engagement.',
            icon: '📢',
          },
        ].map((f, i) => (
          <div
            key={i}
            className="bg-white dark:bg-green-800 rounded-xl p-6 shadow-md hover:shadow-xl transition"
          >
            <div className="text-3xl mb-2">{f.icon}</div>
            <h3 className="text-xl font-semibold text-green-700 dark:text-white mb-2">
              {f.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-200">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Integrations Badge */}
      <section className="mt-24 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          Integrated with:
          <span className="inline-flex items-center gap-2 ml-2">
            <img src="https://cdn.shopify.com/assets/images/logos/shopify-bag.png" className="w-5 h-5" alt="Shopify" />
            Shopify
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-5 h-5" alt="WhatsApp" />
            WhatsApp
          </span>
        </p>
      </section>

      {/* Footer */}
      <footer className="mt-20 text-sm text-gray-500 dark:text-gray-400 text-center pb-6">
        © {new Date().getFullYear()} eWhatsApp Plugin. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
