import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AutomatedMsgSettings({ settings = {}, onChange }) {
    const [localSettings, setLocalSettings] = useState(settings);
    const [templates, setTemplates] = useState([]);
    const [templateDetails, setTemplateDetails] = useState({});
    const [loadingId, setLoadingId] = useState(null);

    const { user } = useAuth();
    const api_token = user?.api_token;

    // Fetch all templates for dropdown selection
    useEffect(() => {
        const fetchTemplates = async () => {
            if (!api_token) return;

            try {
                const res = await fetch(`https://aigreentick.com/api/v1/wa-templates?type=get&page=1`, {
                    headers: {
                        'Authorization': `Bearer ${api_token}`
                    }
                });

                const json = await res.json();
                const templatesArray = json?.data?.data || [];

                const formattedTemplates = templatesArray.map(t => ({
                    id: t.id,
                    name: t.name
                }));

                setTemplates(formattedTemplates);
            } catch (err) {
                console.error('Failed to fetch templates:', err);
            }
        };

        fetchTemplates();
    }, [api_token]);

    // Sync with external settings
    useEffect(() => {
        if (JSON.stringify(settings) !== JSON.stringify(localSettings)) {
            setLocalSettings(settings);
        }
    }, [settings, localSettings]);

    // Fetch selected template body by ID
    const fetchTemplateById = async (id) => {
        if (!id || templateDetails[id] || !api_token) return;

        setLoadingId(id);
        try {
            const res = await fetch(`https://aigreentick.com/api/v1/wa-templates/${id}`, {
                headers: {
                    'Authorization': `Bearer ${api_token}`
                }
            });
            const json = await res.json();
            const components = json?.components || [];
            console.log(components)
            const body = components.find(c => c.type === 'BODY')?.text || 'No preview available';
            const header = components.find(c => c.type === 'HEADER');

            setTemplateDetails(prev => ({
                ...prev,
                [id]: {
                    body,
                    header,
                    components
                }
            }));
        } catch (err) {
            console.error(`Failed to fetch template ${id}:`, err);
            setTemplateDetails(prev => ({
                ...prev,
                [id]: {
                    body: 'Error loading template preview',
                    header: null,
                }
            }));
        } finally {
            setLoadingId(null);
        }
    };

    const handleToggle = (type, enabled) => {
        const updated = {
            ...localSettings,
            [type]: {
                ...localSettings[type],
                enabled,
            },
        };
        setLocalSettings(updated);
        onChange(updated);
    };

    const handleInputChange = (type, field, value) => {
        const updated = {
            ...localSettings,
            [type]: {
                ...localSettings[type],
                [field]: value,
            },
        };
        setLocalSettings(updated);
        onChange(updated);
        if (field === 'templateId') fetchTemplateById(value);
    };

    const updateCartAbandonedMessage = (index, field, value) => {
        const updatedMessages = [...(localSettings.cartAbandoned?.messages || [])];
        updatedMessages[index] = { ...updatedMessages[index], [field]: value };

        const updated = {
            ...localSettings,
            cartAbandoned: {
                ...localSettings.cartAbandoned,
                messages: updatedMessages,
            },
        };
        setLocalSettings(updated);
        onChange(updated);

        if (field === 'templateId') fetchTemplateById(value);
    };

    const updateCartAbandonedDelay = (index, delayField, value) => {
        const updatedMessages = [...(localSettings.cartAbandoned?.messages || [])];
        updatedMessages[index] = {
            ...updatedMessages[index],
            delay: {
                ...updatedMessages[index].delay,
                [delayField]: value,
            },
        };

        const updated = {
            ...localSettings,
            cartAbandoned: {
                ...localSettings.cartAbandoned,
                messages: updatedMessages,
            },
        };
        setLocalSettings(updated);
        onChange(updated);
    };

    const renderTemplatePreview = (templateId) => {
        if (!templateId) return null;
        const detail = templateDetails[templateId];

        if (loadingId === templateId) {
            return <div className="mt-2 text-sm text-gray-700">Loading preview...</div>;
        }

        if (!detail) {
            return <div className="mt-2 text-sm text-gray-700">No preview available</div>;
        }

        const { components = [] } = detail;

        return (
            <div className="bg-gray-50 border border-gray-300 p-3 rounded mt-2 text-sm text-gray-700">
                <strong>Preview:</strong>
                <div className="mt-2 space-y-2">
                    {components.map((component, i) => {
                        if (component.type === 'HEADER') {
                            if (component.format === 'IMAGE' && component.image_url) {
                                return (
                                    <img
                                        key={i}
                                        src={component.image_url}
                                        alt="Header"
                                        className="max-w-full h-auto rounded border"
                                    />
                                );
                            } else if (component.format === 'VIDEO' && component.image_url) {
                                return (
                                    <video
                                        key={i}
                                        controls
                                        className="max-w-full h-auto rounded border"
                                    >
                                        <source src={component.image_url} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                );
                            } else if (component.format === 'TEXT' && component.text) {
                                return <p key={i} className="font-semibold">{component.text}</p>;
                            }
                        }

                        if (component.type === 'BODY' && component.text) {
                            return <p key={i} className="whitespace-pre-line">{component.text}</p>;
                        }

                        if (component.type === 'FOOTER' && component.text) {
                            return <p key={i} className="text-gray-500 text-xs">{component.text}</p>;
                        }

                        if (component.type === 'BUTTONS' && component.buttons?.length > 0) {
                            return (
                                <div key={i} className="flex gap-2 flex-wrap">
                                    {component.buttons.map((btn, index) => {
                                        if (btn.type === 'URL') {
                                            return (
                                                <a
                                                    key={index}
                                                    href={btn.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-block bg-blue-600 text-white text-sm px-3 py-1 rounded"
                                                >
                                                    {btn.text}
                                                </a>
                                            );
                                        } else if (btn.type === 'PHONE_NUMBER') {
                                            return (
                                                <a
                                                    key={index}
                                                    href={`tel:${btn.number}`}
                                                    className="inline-block bg-green-600 text-white text-sm px-3 py-1 rounded"
                                                >
                                                    {btn.text}
                                                </a>
                                            );
                                        } else if (btn.type === 'QUICK_REPLY') {
                                            return (
                                                <button
                                                    key={index}
                                                    disabled
                                                    className="inline-block bg-gray-400 text-white text-sm px-3 py-1 rounded"
                                                >
                                                    {btn.text}
                                                </button>
                                            );
                                        }
                                        return null;
                                    })}
                                </div>
                            );
                        }

                        return null;
                    })}

                </div>
            </div>
        );
    };



    const renderLeftText = () => (
        <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Automated Messaging Settings</h2>
            <p className="text-gray-600 text-base leading-relaxed">
                Customize automated messages sent to your customers when they create, fulfill, or cancel orders. For abandoned carts, you can schedule up to 3 timed reminders.
            </p>
        </div>
    );

    const renderMsgType = (type, label) => {
        const msgSetting = localSettings[type];

        if (type === "cartAbandoned" && msgSetting?.messages?.length > 0) {
            return (
                <div className="border rounded p-4 mb-6 bg-white shadow-sm">
                    <h3 className="font-semibold text-lg mb-4">{label}</h3>

                    <div className="flex items-center mb-4 space-x-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name={`${type}_enabled`}
                                checked={msgSetting.enabled}
                                onChange={() => handleToggle(type, true)}
                            />
                            <span>Enabled</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name={`${type}_enabled`}
                                checked={!msgSetting.enabled}
                                onChange={() => handleToggle(type, false)}
                            />
                            <span>Disabled</span>
                        </label>
                    </div>

                    {msgSetting.enabled && msgSetting.messages.map((msg, index) => (
                        <div key={index} className="border-t pt-4 mt-4">
                            <h4 className="font-semibold text-md mb-2">Reminder {index + 1}</h4>

                            <div className="flex items-center mb-3 space-x-4">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={msg.enabled}
                                        onChange={(e) => updateCartAbandonedMessage(index, 'enabled', e.target.checked)}
                                    />
                                    <span>Enabled</span>
                                </label>
                            </div>

                            <div className="mb-3 flex items-center gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Delay Value</label>
                                    <input
                                        type="number"
                                        className="w-24 border rounded px-2 py-1"
                                        value={msg.delay?.value || 0}
                                        onChange={(e) => updateCartAbandonedDelay(index, 'value', Number(e.target.value))}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Delay Unit</label>
                                    <select
                                        className="border rounded px-2 py-1"
                                        value={msg.delay?.unit || 'minutes'}
                                        onChange={(e) => updateCartAbandonedDelay(index, 'unit', e.target.value)}
                                    >
                                        <option value="minutes">Minutes</option>
                                        <option value="hours">Hours</option>
                                        <option value="days">Days</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-1">Select Template</label>
                                <select
                                    className="w-full border rounded px-3 py-2"
                                    value={msg.templateId || ''}
                                    onChange={(e) =>
                                        updateCartAbandonedMessage(index, 'templateId', e.target.value)
                                    }
                                >
                                    <option value="">-- Select a Template --</option>
                                    {templates.map((tpl) => (
                                        <option key={tpl.id} value={tpl.id}>{tpl.name} ({tpl.id})</option>
                                    ))}
                                </select>
                                {renderTemplatePreview(msg.templateId)}
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        const fallback = msgSetting || { enabled: false, templateId: '' };

        return (
            <div className="border rounded p-4 mb-6 bg-white shadow-sm">
                <h3 className="font-semibold text-lg mb-2">{label}</h3>

                <div className="flex items-center mb-4 space-x-4">
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name={`${type}_enabled`}
                            checked={fallback.enabled}
                            onChange={() => handleToggle(type, true)}
                        />
                        <span>Enabled</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name={`${type}_enabled`}
                            checked={!fallback.enabled}
                            onChange={() => handleToggle(type, false)}
                        />
                        <span>Disabled</span>
                    </label>
                </div>

                {fallback.enabled && (
                    <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">Select Template</label>
                        <select
                            className="w-full border rounded px-3 py-2"
                            value={fallback.templateId || ''}
                            onChange={(e) => handleInputChange(type, 'templateId', e.target.value)}
                        >
                            <option value="">-- Select a Template --</option>
                            {templates.map((tpl) => (
                                <option key={tpl.id} value={tpl.id}>{tpl.name} ({tpl.id})</option>
                            ))}
                        </select>
                        {renderTemplatePreview(fallback.templateId)}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow">
            {renderLeftText()}
            {renderMsgType('orderCreated', 'Order Created')}
            {renderMsgType('orderFulfilled', 'Order Fulfilled')}
            {renderMsgType('orderCanceled', 'Order Canceled')}
            {renderMsgType('cartAbandoned', 'Cart Abandoned')}
        </div>
    );
}
