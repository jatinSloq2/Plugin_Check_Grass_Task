import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-green-50 dark:bg-green-950 text-gray-800 dark:text-white flex flex-col items-center justify-center px-4">
      
      {/* Header */}
      <header className="w-full max-w-5xl py-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-700 dark:text-green-400">
          eWhatsApp Plugin
        </h1>

        {/* Conditional Login/Logout */}
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

      {/* Main Content */}
      <main className="text-center mt-10">
        <h2 className="text-4xl font-extrabold mb-4 text-green-800 dark:text-green-300">
          Automate WhatsApp Messaging for Your Store
        </h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
          Send order updates, abandoned cart reminders, promotional offers, and more with our seamless WhatsApp plugin for Shopify and custom stores.
        </p>
        <Link
          to="/signup"
          className="inline-block bg-green-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-green-700 transition"
        >
          Get Started
        </Link>
      </main>

      {/* Features Section */}
      <section className="mt-20 w-full max-w-4xl grid md:grid-cols-3 gap-6">
        {[
          {
            title: 'Recover Abandoned Carts',
            desc: 'Automatically message users who left items in their cart to boost sales.',
          },
          {
            title: 'Send Order Updates',
            desc: 'Notify customers instantly when orders are placed, shipped, or delivered.',
          },
          {
            title: 'Broadcast Offers',
            desc: 'Send personalized offers via WhatsApp to increase engagement.',
          },
        ].map((f, i) => (
          <div key={i} className="bg-white dark:bg-green-800 rounded-xl p-6 shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-green-700 dark:text-white mb-2">{f.title}</h3>
            <p className="text-gray-600 dark:text-gray-200">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="mt-20 text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} eWhatsApp Plugin. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
