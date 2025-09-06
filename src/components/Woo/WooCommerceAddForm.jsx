import { Globe, Key, Loader2, Lock, Plus, Store } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from "../../context/AuthContext";

const InputField = ({ label, icon: Icon, type = "text", name, value, onChange, placeholder, required }) => (
    <div className="space-y-1">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="h-5 w-5 text-gray-400" />
            </div>
            <input
                id={name}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="w-full pl-10 pr-4 py-3 bg-white border rounded-lg 
                   border-gray-200 focus:ring-2 focus:ring-blue-500 
                   focus:border-blue-500 transition-colors duration-200 
                   placeholder-gray-400"
            />
        </div>
    </div>
);

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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, ...formData })
            });

            const data = await response.json();
            if (response.status === 201) {
                setSuccess(true);
                setFormData({ shopName: '', shopUrl: '', consumerKey: '', consumerSecret: '' });
                setTimeout(() => onShopAdded?.(data), 2000);
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <img
                        src="https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/logos/woo-0pimxgd1jnfnv4a5ygnvxj.png/woo-nb1n5l8athnrm1fpythf.png?_a=DATAg1XyZAA0"
                        alt="Woo Commerce Logo"
                        className="w-20 h-20 mx-auto object-contain mb-4"
                    />
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Woo Commerce</h1>
                    <p className="text-gray-600 text-lg">Enter your Woo-Commerce store details to connect</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-gray-50 rounded p-8 space-y-6">
                    <InputField
                        label="Shop Name"
                        icon={Store}
                        name="shopName"
                        value={formData.shopName}
                        onChange={handleChange}
                        placeholder="Enter your shop name"
                        required
                    />
                    <InputField
                        label="Store URL"
                        icon={Globe}
                        type="url"
                        name="shopUrl"
                        value={formData.shopUrl}
                        onChange={handleChange}
                        placeholder="Enter your store URL"
                        required
                    />
                    <InputField
                        label="Consumer Key"
                        icon={Key}
                        name="consumerKey"
                        value={formData.consumerKey}
                        onChange={handleChange}
                        placeholder="ck_xxxxxxxxxxxxxxxx"
                        required
                    />
                    <InputField
                        label="Consumer Secret"
                        icon={Lock}
                        type="password"
                        name="consumerSecret"
                        value={formData.consumerSecret}
                        onChange={handleChange}
                        placeholder="cs_xxxxxxxxxxxxxxxx"
                        required
                    />

                    {/* Error / Success */}
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    {success && <p className="text-sm text-green-600">Shop added successfully!</p>}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 bg-green-600 text-white py-3 px-4 rounded font-medium 
                       hover:bg-green-700 focus:ring-4 focus:ring-green-200 
                       transition-all duration-200 disabled:opacity-50 
                       flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" /> Adding Shop...
                            </>
                        ) : (
                            <>
                                <Plus className="w-5 h-5" /> Add Shop
                            </>
                        )}
                    </button>
                </form>

                {/* Help */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Need help finding your API credentials?{' '}
                        <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                            View our guide
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WooShopIntegration;
