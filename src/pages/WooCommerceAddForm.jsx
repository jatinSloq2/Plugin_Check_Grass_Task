import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const WooShopIntegration = () => {
    const {user} = useAuth();
    const [formData, setFormData] = useState({

        shopName: '',
        shopUrl: '',
        consumerKey: '',
        consumerSecret: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = e => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/woo/shop/add`, { userId : `${user.id}`,...formData});
            if (res.data) {
                alert('Shop added successfully!');
            }
            setFormData({ shopName: '', shopUrl: '', consumerKey: '', consumerSecret: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add shop');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-semibold mb-4">Add WooCommerce Store</h2>
            <input
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                placeholder="Shop Name"
                required
                className="w-full mb-3 px-3 py-2 border rounded"
            />
            <input
                name="shopUrl"
                value={formData.shopUrl}
                onChange={handleChange}
                placeholder="Shop URL"
                required
                className="w-full mb-3 px-3 py-2 border rounded"
            />
            <input
                name="consumerKey"
                value={formData.consumerKey}
                onChange={handleChange}
                placeholder="Consumer Key"
                required
                className="w-full mb-3 px-3 py-2 border rounded"
            />
            <input
                name="consumerSecret"
                value={formData.consumerSecret}
                onChange={handleChange}
                placeholder="Consumer Secret"
                required
                className="w-full mb-3 px-3 py-2 border rounded"
            />
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
                {loading ? 'Adding...' : 'Add Shop'}
            </button>
            {error && <p className="mt-2 text-red-600">{error}</p>}
        </form>
    );
};

export default WooShopIntegration;
