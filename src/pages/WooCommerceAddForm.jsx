import React, { useState, useEffect } from 'react';
import { Store, Globe, Key, Lock, Plus, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from "../context/AuthContext";

// Updated WooShopIntegration component with real API and callback
const WooShopIntegration = ({ onShopAdded }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        shopName: '',
        shopUrl: '',
        consumerKey: '',
        consumerSecret: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = e => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (error) setError(null);
        if (success) setSuccess(false);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/woo/shop/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    ...formData
                })
            });

            const data = await response.json();

            // Check if the response status is 201 (Created)
            if (response.status === 201) {
                setSuccess(true);
                setFormData({ shopName: '', shopUrl: '', consumerKey: '', consumerSecret: '' });

                // Show success message for 2 seconds then notify parent
                setTimeout(() => {
                    if (onShopAdded) {
                        onShopAdded(data);
                    }
                }, 2000);
            } else {
                throw new Error(data.message || 'Failed to add shop');
            }
        } catch (err) {
            console.error('Error adding shop:', err);
            setError(err.message || 'Failed to add shop. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 shadow-lg">
                        <Store className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Store</h1>
                    <p className="text-gray-600">Add your WooCommerce shop to get started</p>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 animate-in fade-in duration-300">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <p className="text-green-800 font-medium">Shop added successfully!</p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 animate-in fade-in duration-300">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Form */}
                <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
                    <div className="space-y-6">
                        {/* Shop Name Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Shop Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Store className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="shopName"
                                    value={formData.shopName}
                                    onChange={handleChange}
                                    placeholder="My Awesome Store"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* Shop URL Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Shop URL
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Globe className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="url"
                                    name="shopUrl"
                                    value={formData.shopUrl}
                                    onChange={handleChange}
                                    placeholder="https://yourstore.com"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* Consumer Key Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Consumer Key
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Key className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="consumerKey"
                                    value={formData.consumerKey}
                                    onChange={handleChange}
                                    placeholder="ck_xxxxxxxxxxxxxxxx"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* Consumer Secret Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Consumer Secret
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    name="consumerSecret"
                                    value={formData.consumerSecret}
                                    onChange={handleChange}
                                    placeholder="cs_xxxxxxxxxxxxxxxx"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Adding Shop...
                            </>
                        ) : (
                            <>
                                <Plus className="w-5 h-5" />
                                Add Shop
                            </>
                        )}
                    </button>
                </div>

                {/* Help Text */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Need help finding your API credentials?{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                            View our guide
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WooShopIntegration;