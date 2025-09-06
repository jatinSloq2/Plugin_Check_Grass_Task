import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AutomatedMsgSettings({ settings = {}, onChange }) {
    const [localSettings, setLocalSettings] = useState(settings);
    const [templates, setTemplates] = useState([]);
    const [templateDetails, setTemplateDetails] = useState({});
    const [loadingId, setLoadingId] = useState(null);
    const { user } = useAuth();
    const api_token = user?.api_token;

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

    useEffect(() => {
        if (JSON.stringify(settings) !== JSON.stringify(localSettings)) {
            setLocalSettings(settings);
        }
    }, [settings, localSettings]);

    useEffect(() => {
        const templateIds = new Set();

        ['orderCreated', 'orderFulfilled', 'orderCanceled'].forEach(type => {
            const id = settings?.[type]?.templateId;
            if (id) templateIds.add(id);
        });

        settings?.cartAbandoned?.messages?.forEach(msg => {
            if (msg?.templateId) templateIds.add(msg.templateId);
        });

        templateIds.forEach(id => {
            if (!templateDetails[id]) {
                fetchTemplateById(id);
            }
        });
    }, [settings, templateDetails]);

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


    const PhonePreview = ({ children }) => (
        <div className="relative w-[320px] h-[640px] mx-auto">
            {/* Phone Mockup */}
            <img
                src="https://mockuphone.com/images/devices_picture/apple-iphone13-blue-portrait.png"
                alt="phone"
                className="w-full h-full object-contain z-50"
            />

            {/* WhatsApp Screen Area */}
            <div className="absolute top-[10%] left-[11.5%] w-[76%] h-[80%] rounded-[1.5rem] overflow-hidden z-0
                    bg-[url('https://i.pinimg.com/564x/d2/a7/76/d2a77609f5d97b9081b117c8f699bd37.jpg')] 
                    bg-cover bg-center flex flex-col shadow-inner">
                {/* WhatsApp Header */}
                <div className="bg-green-600 text-white p-2 flex items-center gap-2">
                    <img
                        src="https://i.pravatar.cc/40"
                        alt="contact"
                        className="w-8 h-8 rounded-full"
                    />
                    <div>
                        <p className="font-semibold text-sm">John Doe</p>
                        <p className="text-xs text-green-100">online</p>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2 ">
                    {children}
                </div>
            </div>
        </div>
    );


    const renderTemplatePreview = (templateId) => {
        if (!templateId) return null;
        const detail = templateDetails[templateId];

        if (loadingId === templateId) {
            return <div className="text-gray-500 text-sm">Loading preview...</div>;
        }
        if (!detail) {
            return <div className="text-gray-500 text-sm">No preview available</div>;
        }

        const { components = [] } = detail;

        return (
            <PhonePreview>
                {components.length > 0 && (
                    <div
                        className={`max-w-[75%] p-3 rounded-xl flex flex-col gap-1 ${
                            // Decide bubble alignment by first component type (or default)
                            components[0].type === "BODY" ? "self-end bg-green-100" : "self-start bg-gray-200"
                            }`}
                    >
                        {components.map((component, i) => {
                            if ((component.type === "HEADER" || component.type === "BODY" || component.type === "FOOTER") && component.text) {
                                return (
                                    <p
                                        key={i}
                                        className={`text-sm ${component.type === "FOOTER" ? "text-gray-500 text-xs" : "text-gray-900"}`}
                                    >
                                        {component.text}
                                    </p>
                                );
                            }

                            if (component.type === "BUTTONS" && component.buttons?.length > 0) {
                                return (
                                    <div key={i} className="flex flex-col gap-2 mt-2">
                                        {component.buttons.map((btn, index) => (
                                            <button
                                                key={index}
                                                disabled
                                                className={`px-3 py-1 rounded-full text-sm ${btn.type === "PHONE_NUMBER"
                                                    ? "bg-green-600 text-white"
                                                    : btn.type === "URL"
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-gray-400 text-white"
                                                    }`}
                                            >
                                                {btn.text}
                                            </button>
                                        ))}
                                    </div>
                                );
                            }

                            return null;
                        })}
                    </div>
                )}

            </PhonePreview>
        );
    };

    const renderMsgType = (type, label, description = "Hi this is the description of this") => {
        const msgSetting = localSettings[type];

        const cardClasses =
            "border border-gray-200 rounded p-12 bg-white";

        const sectionTitle =
            "text-black flex items-center gap-2 text-2xl font-semibold text-black mb-2";

        const radioWrapper =
            "flex items-center space-x-2 bg-white text-blue-100 px-3 py-2 rounded-lg border border-gray-200 cursor-pointer hover:border-green-500 transition";

        const inputBase =
            "border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500";

        const descriptionText =
            "text-muted-foreground max-w-xl";

        if (type === "cartAbandoned" && msgSetting?.messages?.length > 0) {
            const [selectedReminder, setSelectedReminder] = useState(0); // default Reminder 1
            const currentMsg = msgSetting.messages[selectedReminder];

            return (
                <div className={cardClasses}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        {/* LEFT COLUMN */}
                        <div>
                            <h3 className={sectionTitle}>{label}</h3>
                            <p className={descriptionText}>{description}</p>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="flex flex-col items-start gap-6 w-full bg-gray-50 p-10">
                            {/* Enable/Disable */}
                            <div className="flex items-center gap-6">
                                <label className={radioWrapper}>
                                    <input
                                        type="radio"
                                        className="text-green-600 focus:ring-green-500"
                                        name={`${type}_enabled`}
                                        checked={msgSetting.enabled}
                                        onChange={() => handleToggle(type, true)}
                                    />
                                    <span className="text-gray-800 font-medium">Enabled</span>
                                </label>
                                <label className={radioWrapper}>
                                    <input
                                        type="radio"
                                        className="text-green-600 focus:ring-green-500"
                                        name={`${type}_enabled`}
                                        checked={!msgSetting.enabled}
                                        onChange={() => handleToggle(type, false)}
                                    />
                                    <span className="text-gray-800 font-medium">Disabled</span>
                                </label>
                            </div>

                            {/* Reminder Selection */}
                            {msgSetting.enabled && (
                                <div className="w-full">
                                    <label className="block text-sm font-medium mb-1 text-gray-700">
                                        Select Reminder
                                    </label>
                                    <select
                                        className={`${inputBase} w-full`}
                                        value={selectedReminder}
                                        onChange={(e) => setSelectedReminder(Number(e.target.value))}
                                    >
                                        {msgSetting.messages.map((_, index) => (
                                            <option key={index} value={index}>
                                                Reminder {index + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Reminder Settings */}
                            {msgSetting.enabled && currentMsg && (
                                <>
                                    {/* Checkbox */}
                                    <div className="flex items-center space-x-3">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                className="text-green-600 rounded focus:ring-green-500"
                                                checked={currentMsg.enabled}
                                                onChange={(e) =>
                                                    updateCartAbandonedMessage(
                                                        selectedReminder,
                                                        "enabled",
                                                        e.target.checked
                                                    )
                                                }
                                            />
                                            <span className="text-gray-800 font-medium">Enabled</span>
                                        </label>
                                    </div>

                                    {/* Delay */}
                                    <div className="flex items-center gap-6">
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                                Delay Value
                                            </label>
                                            <input
                                                type="number"
                                                className={`${inputBase} w-28`}
                                                value={currentMsg.delay?.value || 0}
                                                onChange={(e) =>
                                                    updateCartAbandonedDelay(
                                                        selectedReminder,
                                                        "value",
                                                        +e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                                Delay Unit
                                            </label>
                                            <select
                                                className={inputBase}
                                                value={currentMsg.delay?.unit || "minutes"}
                                                onChange={(e) =>
                                                    updateCartAbandonedDelay(
                                                        selectedReminder,
                                                        "unit",
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="minutes">Minutes</option>
                                                <option value="hours">Hours</option>
                                                <option value="days">Days</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Template Selector */}
                                    <div className="w-full">
                                        <label className="block text-sm font-medium mb-1 text-gray-700">
                                            Select Template
                                        </label>
                                        <select
                                            className={`${inputBase} w-full`}
                                            value={String(currentMsg.templateId || "")}
                                            onChange={(e) =>
                                                updateCartAbandonedMessage(
                                                    selectedReminder,
                                                    "templateId",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="">-- Select a Template --</option>
                                            {templates.map((tpl) => (
                                                <option key={tpl.id} value={String(tpl.id)}>
                                                    {tpl.name} ({tpl.id})
                                                </option>
                                            ))}
                                        </select>

                                        {currentMsg.templateId && (
                                            <div className="text-sm text-gray-600 mt-2">
                                                Selected:{" "}
                                                {
                                                    templates.find(
                                                        (t) => String(t.id) === String(currentMsg.templateId)
                                                    )?.name
                                                }
                                            </div>
                                        )}
                                    </div>

                                    {/* Preview */}
                                    <div className="w-full flex justify-center">
                                        {renderTemplatePreview(currentMsg.templateId)}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        // Fallback for others
        const fallback = msgSetting || { enabled: false, templateId: "" };

        return (
            <div className={cardClasses}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* LEFT COLUMN → Label + Description */}
                    <div>
                        <h3 className={sectionTitle}>{label}</h3>
                        <p className={descriptionText}>{description}</p>
                    </div>

                    {/* RIGHT COLUMN → Radios, Template, Preview */}
                    <div className="flex flex-col items-start gap-6 bg-gray-50 p-10">
                        {/* Radio Buttons */}
                        <div className="flex items-center gap-6">
                            <label className={radioWrapper}>
                                <input
                                    type="radio"
                                    className="text-green-600 focus:ring-green-500"
                                    name={`${type}_enabled`}
                                    checked={fallback.enabled}
                                    onChange={() => handleToggle(type, true)}
                                />
                                <span className="text-gray-800 font-medium">Enabled</span>
                            </label>
                            <label className={radioWrapper}>
                                <input
                                    type="radio"
                                    className="text-green-600 focus:ring-green-500"
                                    name={`${type}_enabled`}
                                    checked={!fallback.enabled}
                                    onChange={() => handleToggle(type, false)}
                                />
                                <span className="text-gray-800 font-medium">Disabled</span>
                            </label>
                        </div>

                        {/* Template Selector */}
                        {fallback.enabled && (
                            <div className="w-full">
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Select Template
                                </label>
                                <select
                                    className={`${inputBase} w-full`}
                                    value={fallback.templateId || ""}
                                    onChange={(e) =>
                                        handleInputChange(type, "templateId", e.target.value)
                                    }
                                >
                                    <option value="">-- Select a Template --</option>
                                    {templates.map((tpl) => (
                                        <option key={tpl.id} value={tpl.id}>
                                            {tpl.name} ({tpl.id})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Phone Preview */}
                        {fallback.enabled && (
                            <div className="w-full flex justify-center">
                                {renderTemplatePreview(fallback.templateId)}
                            </div>
                        )}
                    </div>
                </div>
            </div>

        );
    };

    return (
        <div className="">
            {renderMsgType(
                'orderCreated',
                'Order Created',
                'This automated WhatsApp notification is triggered immediately after a customer successfully places an order on your store. It provides instant confirmation and reassurance to the buyer that their order has been received. Since these templates are pre-approved by WhatsApp, their content and structure cannot be customized or modified.'
            )}
            {renderMsgType(
                'orderCanceled',
                'Order Canceled',
                'This message is automatically sent when an order is canceled, either by the customer or by the merchant. It helps keep customers informed about the status of their order and ensures clear communication. WhatsApp requires that all templates be pre-approved, so the wording of this notification cannot be changed once approved.'
            )}
            {renderMsgType(
                'orderFulfilled',
                'Order Fulfilled',
                'Once the order has been processed and shipped, this message is sent to notify the customer that their items are on the way. It improves transparency in the buying journey and helps build trust with your customers. As with other templates, the content is pre-approved by WhatsApp and cannot be modified.'
            )}
            {renderMsgType(
                'afterOrderFulfilled',
                'After Order Fulfilled',
                'This follow-up message is sent after the order has been successfully delivered. It is designed to re-engage customers, encourage repeat purchases, and open opportunities for feedback or reviews. Since WhatsApp requires template approval, this message must follow pre-approved formats and cannot be freely edited.'
            )}
            {renderMsgType(
                'cartAbandoned',
                'Abandoned Recovery Message',
                'If a customer leaves items in their cart without completing the purchase, this automated reminder is sent about 5 minutes after the cart is abandoned. It helps recover lost sales by prompting customers to return and finish their checkout. As with all WhatsApp automated templates, the content cannot be modified because WhatsApp requires prior approval before use.'
            )}
        </div>

    );
}
