import { useState } from 'react';
import { integrations } from '../Constants';

const Integrations = () => {

    const [integrationName, setIntegrationName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleIntegrationClick = (link) => {
        console.log(`Navigating to: ${link}`);
        window.location.href = link;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!integrationName.trim()) {
            setError('Please input integration name.');
            return;
        }
        setError('');
        console.log(`Request submitted: ${integrationName}, Email: ${email}`);
        // You can replace with API call
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB]">
            <div className="mx-auto p-8">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-2xl font-bold text-black mb-3">
                        Connect <span className="text-green-600">AI Green Tick</span> to your favorite services
                    </h1>
                    <p className="text-md text-muted-foreground max-w-4xl">
                        Our powerful integrations make it quick and easy to get the most out of AI Green Tick —
                        from automating customer communications to seamless CRM integration and workflow
                        automation.
                    </p>
                </div>

                {/* Integrations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {integrations.map((integration) => (
                        <div
                            key={integration.id}
                            onClick={() => handleIntegrationClick(integration.link)}
                            className="h-70 rounded p-8 bg-white border border-gray-200 hover:shadow-lg hover:shadow-green-100/50 
                         transition-all duration-300 cursor-pointer hover:scale-105 group relative overflow-hidden"
                        >
                            {/* Card Content */}
                            <div className="relative z-10">
                                <div className="flex items-start mb-4">
                                    <div className="mr-4 flex-shrink-0">
                                        <img
                                            src={integration.logo}
                                            alt={`${integration.name} logo`}
                                            className="w-36 h-16 object-contain"
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {integration.featured?.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="px-1 text-xs font-medium rounded-full 
                         bg-green-100 text-green-700 border border-green-200"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-balck text-lg leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                                    {integration.description}
                                </p>
                            </div>

                            {/* Hover Arrow */}
                            <div div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0" >
                                <svg
                                    className="w-5 h-5 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                                    />
                                </svg>
                            </div>
                        </div>
                    ))}
                    {/* Request Form Section */}
                    <div className="h-60 rounded p-8 bg-white border border-gray-200 hover:shadow-lg hover:shadow-green-100/50 
                         transition-all duration-300 cursor-pointer hover:scale-105 group relative overflow-hidden">
                        <h2 className="text-md font-semibold text-gray-900 mb-1">
                            Didn’t find what you’re looking for?
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-2">
                            {/* Integration Request */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Request an integration
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Salesforce, HubSpot, etc."
                                    value={integrationName}
                                    onChange={(e) => setIntegrationName(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm 
                   focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                   placeholder-gray-400 text-sm transition-all"
                                />
                            </div>

                            {/* Email Notify */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Notify me
                                </label>
                                <div className="flex">
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                     placeholder-gray-400 text-sm transition-all"
                                    />
                                    <button
                                        type="submit"
                                        className="px-5 bg-green-600 text-white font-medium rounded-r-lg hover:bg-green-700 
                     transition-colors flex items-center justify-center"
                                    >
                                        →
                                    </button>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && <p className="text-red-600 text-sm">{error}</p>}
                        </form>
                    </div>

                </div>
            </div >
        </div >
    );
};

export default Integrations;
