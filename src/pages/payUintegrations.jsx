import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Settings, Trash2, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PayuIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [integrationData, setIntegrationData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    merchantId: '',
    merchantKey: '',
    merchantSalt: '',
    environment: 'test'
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const {user} = useAuth()
  // Check integration status on component mount
  useEffect(() => {
    checkIntegrationStatus();
  }, []);

  const checkIntegrationStatus = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/integrations/payu/status?userId=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setIsConnected(data.connected);
        setIntegrationData(data.data);
      }
    } catch (error) {
      console.error('Failed to check integration status:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.merchantId.trim()) {
      newErrors.merchantId = 'Merchant ID is required';
    }
    
    if (!formData.merchantKey.trim()) {
      newErrors.merchantKey = 'Merchant Key is required';
    }
    
    if (!formData.merchantSalt.trim()) {
      newErrors.merchantSalt = 'Merchant Salt is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConnect = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/integrations/payu/connect?userId=${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage('PayU integration connected successfully!');
        setIsConnected(true);
        setIntegrationData(data.data);
        setShowForm(false);
        setFormData({
          merchantId: '',
          merchantKey: '',
          merchantSalt: '',
          environment: 'test'
        });
      } else {
        setMessage(data.message || 'Failed to connect PayU integration');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      console.error('Connection error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect PayU integration? This will remove all webhooks.')) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/integrations/payu/disconnect?userId=${user.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setMessage('PayU integration disconnected successfully!');
        setIsConnected(false);
        setIntegrationData(null);
      } else {
        setMessage(data.message || 'Failed to disconnect PayU integration');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      console.error('Disconnection error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">PayU Integration</h2>
                <p className="text-sm text-gray-500">
                  Connect your PayU account to receive payment webhooks
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <span className="flex items-center space-x-1 text-green-600 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  <span>Connected</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1 text-gray-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>Not Connected</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Message */}
          {message && (
            <div className={`mb-4 p-3 rounded-md ${
              message.includes('success') 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          {!isConnected ? (
            <div>
              {!showForm ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ExternalLink className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Connect your PayU account
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Enter your PayU merchant credentials to enable automatic webhook management 
                    for payment events.
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition-colors"
                  >
                    Connect PayU
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Enter PayU Credentials
                  </h3>
                  
                  <form onSubmit={handleConnect} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Merchant ID *
                      </label>
                      <input
                        type="text"
                        name="merchantId"
                        value={formData.merchantId}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                          errors.merchantId ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Your PayU Merchant ID"
                        disabled={loading}
                      />
                      {errors.merchantId && (
                        <p className="text-sm text-red-600 mt-1">{errors.merchantId}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Merchant Key *
                      </label>
                      <input
                        type="password"
                        name="merchantKey"
                        value={formData.merchantKey}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                          errors.merchantKey ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Your PayU Merchant Key"
                        disabled={loading}
                      />
                      {errors.merchantKey && (
                        <p className="text-sm text-red-600 mt-1">{errors.merchantKey}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Merchant Salt *
                      </label>
                      <input
                        type="password"
                        name="merchantSalt"
                        value={formData.merchantSalt}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                          errors.merchantSalt ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Your PayU Merchant Salt"
                        disabled={loading}
                      />
                      {errors.merchantSalt && (
                        <p className="text-sm text-red-600 mt-1">{errors.merchantSalt}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Environment
                      </label>
                      <select
                        name="environment"
                        value={formData.environment}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        disabled={loading}
                      >
                        <option value="test">Test</option>
                        <option value="production">Production</option>
                      </select>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {loading ? 'Connecting...' : 'Connect PayU'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          setErrors({});
                          setMessage('');
                        }}
                        disabled={loading}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Integration Details
              </h3>
              
              <div className="bg-gray-50 rounded-md p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Merchant ID:</span>
                  <span className="text-sm text-gray-900">{integrationData?.merchantId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Environment:</span>
                  <span className={`text-sm px-2 py-1 rounded-full text-xs font-medium ${
                    integrationData?.environment === 'production' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {integrationData?.environment?.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Connected:</span>
                  <span className="text-sm text-gray-900">
                    {integrationData?.connectedAt ? new Date(integrationData.connectedAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Status:</span>
                  <span className={`text-sm px-2 py-1 rounded-full text-xs font-medium ${
                    integrationData?.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {integrationData?.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleDisconnect}
                  disabled={loading}
                  className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{loading ? 'Disconnecting...' : 'Disconnect PayU'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 mb-1">
                Important Information
              </h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Your credentials are encrypted and stored securely</li>
                <li>• Webhooks will be automatically configured for payment events</li>
                <li>• You can disconnect anytime to remove all webhooks</li>
                <li>• Test environment is recommended for development</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Need help? Check PayU documentation</span>
              <a 
                href="https://docs.payu.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                View Docs →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayuIntegration;