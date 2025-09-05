import React from 'react';

const Integrations = () => {
    const integrations = [
        {
            id: 1,
            name: 'Shopify',
            logo: 'https://cdn.worldvectorlogo.com/logos/shopify.svg',
            description: 'Chat Widget, Cart Abandonment Emails, etc.',
            bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
            borderColor: 'border-green-200',
            hoverBg: 'hover:from-green-100 hover:to-green-200',
            link: '/integrations/shopify'
        },
        {
            id: 2,
            name: 'WhatsApp',
            logo: 'https://cdn.worldvectorlogo.com/logos/whatsapp-icon.svg',
            description: 'Add WhatsApp Chat Widget to your website',
            bgColor: 'bg-gradient-to-br from-green-50 to-emerald-100',
            borderColor: 'border-green-300',
            hoverBg: 'hover:from-green-100 hover:to-emerald-200',
            link: '/integrations/whatsapp'
        },
        {
            id: 3,
            name: 'Facebook',
            logo: 'https://cdn.worldvectorlogo.com/logos/facebook-3.svg',
            description: 'Connect your Facebook account to receive Ad insights and events from Facebook',
            bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
            borderColor: 'border-blue-200',
            hoverBg: 'hover:from-blue-100 hover:to-blue-200',
            link: '/integrations/facebook'
        },
        {
            id: 4,
            name: 'Google Sheets',
            logo: 'https://cdn.worldvectorlogo.com/logos/google-sheets.svg',
            description: 'Send Broadcast messages directly from Google Sheets',
            bgColor: 'bg-gradient-to-br from-green-50 to-teal-100',
            borderColor: 'border-green-200',
            hoverBg: 'hover:from-green-100 hover:to-teal-200',
            link: '/integrations/google-sheets'
        },
        {
            id: 5,
            name: 'WooCommerce',
            logo: 'https://cdn.worldvectorlogo.com/logos/woocommerce.svg',
            description: 'Chat Widget, Cart Abandonment, Emails for WooCommerce',
            bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
            borderColor: 'border-purple-200',
            hoverBg: 'hover:from-purple-100 hover:to-purple-200',
            link: '/integrations/woocommerce'
        },
        {
            id: 6,
            name: 'WhatsApp Shop',
            logo: 'https://cdn.worldvectorlogo.com/logos/whatsapp-icon.svg',
            description: 'Get Orders And Share Your Very Own Created Store',
            bgColor: 'bg-gradient-to-br from-emerald-50 to-green-100',
            borderColor: 'border-emerald-200',
            hoverBg: 'hover:from-emerald-100 hover:to-green-200',
            link: '/integrations/whatsapp-shop'
        },
        {
            id: 7,
            name: 'Zapier',
            logo: 'https://cdn.worldvectorlogo.com/logos/zapier.svg',
            description: 'Send an approved template WhatsApp message',
            bgColor: 'bg-gradient-to-br from-orange-50 to-yellow-100',
            borderColor: 'border-orange-200',
            hoverBg: 'hover:from-orange-100 hover:to-yellow-200',
            link: '/integrations/zapier'
        },
        {
            id: 8,
            name: 'HubSpot',
            logo: 'https://cdn.worldvectorlogo.com/logos/hubspot.svg',
            description: 'Integrate messages on the HubSpot CRM',
            bgColor: 'bg-gradient-to-br from-orange-50 to-red-100',
            borderColor: 'border-orange-200',
            hoverBg: 'hover:from-orange-100 hover:to-red-200',
            link: '/integrations/hubspot'
        },
        {
            id: 9,
            name: 'Zoho',
            logo: 'https://cdn.worldvectorlogo.com/logos/zoho.svg',
            description: 'Integrate messages on the Zoho CRM',
            bgColor: 'bg-gradient-to-br from-red-50 to-pink-100',
            borderColor: 'border-red-200',
            hoverBg: 'hover:from-red-100 hover:to-pink-200',
            link: '/integrations/zoho'
        },
        {
            id: 10,
            name: 'Pabbly',
            logo: 'https://pabbly.com/wp-content/uploads/2021/07/pabbly-logo.png',
            description: 'Automate or link with 700+ apps through Pabbly Connect',
            bgColor: 'bg-gradient-to-br from-teal-50 to-cyan-100',
            borderColor: 'border-teal-200',
            hoverBg: 'hover:from-teal-100 hover:to-cyan-200',
            link: '/integrations/pabbly'
        }
    ];

    const handleIntegrationClick = (link) => {
        console.log(`Navigating to: ${link}`);
        window.location.href = link;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
            <div className="mx-auto p-8">
                <div className="mb-12">
                    <h1 className="text-xl font-bold text-black bg-clip-text mb-2">
                        Connect AI Green Tick to your favorite services
                    </h1>
                    <p className="text-gray-600 text-lg max-w-4xl">
                        Our powerful integrations make it quick and easy to get the most out of AI Green Tick - from automating customer communications to seamless CRM integration and workflow automation.
                    </p>
                </div>

                {/* Integrations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {integrations.map((integration) => (
                        <div
                            key={integration.id}
                            onClick={() => handleIntegrationClick(integration.link)}
                            className={`h-60
                                rounded-md p-6 bg-gray-200 hover:shadow-xl hover:shadow-green-100/50 
                                transition-all duration-300 cursor-pointer hover:scale-105 
                                hover:border-green-300 group relative overflow-hidden`}
                        >
                            {/* Subtle background pattern */}
                            <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                                <svg className="w-full h-full text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.546 20.2c-.183.732.732 1.098 1.366.546l2.546-1.546C7.89 20.282 9.89 21 12 21c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                                </svg>
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-start mb-4">
                                    <div className="mr-4 flex-shrink-0 p-2">
                                        <img
                                            src={integration.logo}
                                            alt={`${integration.name} logo`}
                                            className="w-16 h-16 object-contain"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1 group-hover:text-green-700 transition-colors duration-300">
                                            {integration.name}
                                        </h3>
                                        <div className="w-8 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                                    {integration.description}
                                </p>
                            </div>

                            {/* Hover arrow indicator */}
                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Integrations;