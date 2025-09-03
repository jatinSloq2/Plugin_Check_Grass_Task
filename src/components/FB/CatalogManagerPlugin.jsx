import {
    AlertCircle,
    ArrowLeft,
    CheckCircle,
    Copy,
    ExternalLink,
    Loader2,
    Package,
    Phone,
    Plus
} from 'lucide-react';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useCatalogManager } from '../hooks/useCatalogManager';

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Main component wrapper with QueryClient
const CatalogManagerPlugin = ({ userId, apiBase }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <CatalogManager userId={userId} apiBase={apiBase} />
    </QueryClientProvider>
  );
};

// Internal component
const CatalogManager = ({ userId, apiBase = '/api' }) => {
  const {
    catalogs,
    currentStep,
    selectedConnection,
    isLoading,
    connectingCatalog,
    verifyingPartner,
    error,
    connectCatalog,
    verifyPartner,
    resetFlow,
    goToStep,
    setSelectedConnection
  } = useCatalogManager(userId);

  // Form state
  const [formData, setFormData] = useState({
    catalogId: '',
    catalogName: '',
    whatsappPhone: ''
  });

  const [showInstructions, setShowInstructions] = useState(false);

  // Constants
  const PARTNER_ID = '272761826427695';
  const FB_BUSINESS_URL = 'https://business.facebook.com';

  // Handlers
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitCatalog = (e) => {
    e.preventDefault();
    if (formData.catalogId && formData.catalogName && formData.whatsappPhone) {
      connectCatalog(formData);
    }
  };

  const handleVerifyPartner = () => {
    if (selectedConnection?.id) {
      verifyPartner(selectedConnection.id);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const openFacebookBusiness = () => {
    window.open(FB_BUSINESS_URL, '_blank');
  };

  // Error display component
  const ErrorMessage = ({ error, onDismiss }) => {
    if (!error) return null;
    
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-start">
        <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm">{error.message || error}</p>
          {onDismiss && (
            <button 
              onClick={onDismiss}
              className="text-red-500 hover:text-red-700 text-xs mt-1 underline"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    );
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <Loader2 className="w-5 h-5 animate-spin" />
  );

  // Step 1: Catalog Connection Form
  const renderStep1 = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Package className="w-5 h-5 mr-2" />
        Connect Your WhatsApp Catalog
      </h3>
      
      {/* Progress Steps */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center p-3 bg-blue-50 rounded-lg">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-semibold">
            1
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">Create Catalog in Facebook</p>
            <p className="text-xs text-gray-600">Create your product catalog in Facebook Business Manager</p>
          </div>
        </div>
        
        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
          <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center mr-3 text-sm font-semibold">
            2
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm text-gray-600">Connect WhatsApp to Catalog</p>
            <p className="text-xs text-gray-500">Link your WhatsApp Business API to the catalog</p>
          </div>
        </div>
        
        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
          <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center mr-3 text-sm font-semibold">
            3
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm text-gray-600">Enter Catalog Details</p>
            <p className="text-xs text-gray-500">Provide your catalog ID and WhatsApp number</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmitCatalog} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Facebook Catalog ID *
          </label>
          <input
            type="text"
            value={formData.catalogId}
            onChange={(e) => handleInputChange('catalogId', e.target.value)}
            placeholder="Enter your Facebook Catalog ID"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            pattern="\d{15,20}"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Find this in Facebook Business Manager → Data Sources → Catalogs
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Catalog Name *
          </label>
          <input
            type="text"
            value={formData.catalogName}
            onChange={(e) => handleInputChange('catalogName', e.target.value)}
            placeholder="My Product Catalog"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            WhatsApp Business Phone *
          </label>
          <input
            type="tel"
            value={formData.whatsappPhone}
            onChange={(e) => handleInputChange('whatsappPhone', e.target.value)}
            placeholder="+919876543210"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            pattern="\+\d{10,15}"
            required
          />
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={openFacebookBusiness}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Go to Facebook Business Manager
          </button>

          <button
            type="submit"
            disabled={connectingCatalog || !formData.catalogId || !formData.catalogName || !formData.whatsappPhone}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center"
          >
            {connectingCatalog ? (
              <>
                <LoadingSpinner />
                <span className="ml-2">Connecting...</span>
              </>
            ) : (
              'Next Step'
            )}
          </button>
        </div>
      </form>

      <button
        type="button"
        onClick={() => setShowInstructions(!showInstructions)}
        className="w-full text-blue-600 hover:text-blue-700 text-sm mt-4 underline"
      >
        {showInstructions ? 'Hide Instructions' : 'Need Help? View Instructions'}
      </button>

      {showInstructions && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm">
          <h4 className="font-medium mb-2">Step-by-Step Instructions:</h4>
          <ol className="list-decimal list-inside space-y-1 text-gray-700">
            <li>Go to Facebook Business Manager</li>
            <li>Navigate to Data Sources → Catalogs</li>
            <li>Create a new catalog or select existing one</li>
            <li>Add your products to the catalog</li>
            <li>Connect your WhatsApp Business API to the catalog</li>
            <li>Copy the Catalog ID and enter it above</li>
          </ol>
        </div>
      )}
    </div>
  );

  // Step 2: Partner Assignment
  const renderStep2 = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Assign Catalog Partner</h3>
        <button 
          onClick={() => goToStep(1)}
          className="text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>
      
      <p className="text-gray-600 mb-6">
        Follow these steps to assign our platform as your catalog partner:
      </p>
      
      <div className="space-y-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="font-medium mb-2">Platform Business Manager ID:</p>
          <div className="flex items-center justify-between bg-white p-2 rounded border">
            <span className="font-mono text-lg flex-1">{PARTNER_ID}</span>
            <button 
              onClick={() => copyToClipboard(PARTNER_ID)}
              className="text-blue-600 hover:text-blue-700 p-1"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start">
            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">
              1
            </span>
            <p className="text-sm">Go to Facebook Business Manager → Data Sources → Catalogs</p>
          </div>
          <div className="flex items-start">
            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">
              2
            </span>
            <p className="text-sm">Select your catalog → Settings → Catalog Access</p>
          </div>
          <div className="flex items-start">
            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">
              3
            </span>
            <p className="text-sm">Add Partner → Enter our Business Manager ID above</p>
          </div>
          <div className="flex items-start">
            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">
              4
            </span>
            <p className="text-sm">Grant "Manage Catalog" permissions</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={openFacebookBusiness}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Go to Facebook Business Manager
        </button>
        
        <button
          onClick={handleVerifyPartner}
          disabled={verifyingPartner}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center"
        >
          {verifyingPartner ? (
            <>
              <LoadingSpinner />
              <span className="ml-2">Verifying...</span>
            </>
          ) : (
            'Verify Partner Assignment'
          )}
        </button>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Important:</strong> Make sure to grant "Manage Catalog" permissions when adding our platform as a partner.
        </p>
      </div>
    </div>
  );

  // Step 4: Success
  const renderStep4 = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Catalog Connected Successfully!</h3>
        <p className="text-gray-600">Your catalog is now managed by our platform.</p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h4 className="font-medium mb-2">What you can do now:</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
            Manage products through our platform
          </li>
          <li className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
            Send catalog messages via WhatsApp
          </li>
          <li className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
            Track orders and customer interactions
          </li>
          <li className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
            Sync inventory automatically
          </li>
        </ul>
      </div>

      <button
        onClick={resetFlow}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
      >
        Go to Catalog Management
      </button>
    </div>
  );

  // Catalogs List View
  const renderCatalogsList = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Package className="w-5 h-5 mr-2" />
          Your Connected Catalogs
        </h3>
      </div>
      
      {catalogs.length === 0 ? (
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No catalogs connected yet</p>
          <button
            onClick={() => goToStep(1)}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center mx-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Connect Your First Catalog
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {catalogs.map((catalog) => (
            <div key={catalog._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{catalog.catalogName}</h4>
                  <div className="space-y-1 mt-1">
                    <p className="text-sm text-gray-600">ID: {catalog.catalogId}</p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Package className="w-3 h-3 mr-1" />
                      {catalog.productCount} products
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Phone className="w-3 h-3 mr-1" />
                      {catalog.whatsappPhone}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    catalog.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : catalog.status === 'connected'
                      ? 'bg-blue-100 text-blue-800'
                      : catalog.status === 'error'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {catalog.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(catalog.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              {catalog.status === 'error' && catalog.errorMessage && (
                <div className="mt-3 p-2 bg-red-50 rounded text-sm text-red-700">
                  {catalog.errorMessage}
                </div>
              )}
            </div>
          ))}
          
          <button
            onClick={() => goToStep(1)}
            className="w-full border-2 border-dashed border-gray-300 py-3 px-4 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Connect Another Catalog
          </button>
        </div>
      )}
    </div>
  );

  // Main render logic
  return (
    <div className="w-full max-w-md mx-auto">
      <ErrorMessage error={error} />

      {isLoading && currentStep === 1 && (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      )}

      {!isLoading && (
        <>
          {catalogs.length > 0 && currentStep === 1 && renderCatalogsList()}
          {(catalogs.length === 0 || currentStep !== 1) && (
            <>
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 4 && renderStep4()}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CatalogManagerPlugin;