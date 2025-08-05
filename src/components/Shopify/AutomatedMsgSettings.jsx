import { useState, useEffect } from 'react';

export default function AutomatedMsgSettings({ settings = {}, onChange }) {
    const [localSettings, setLocalSettings] = useState(settings);

    useEffect(() => {
        if (JSON.stringify(settings) !== JSON.stringify(localSettings)) {
            setLocalSettings(settings);
        }
    }, [settings, localSettings]);

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

    const renderPhoneMockup = (message) => (
        <div className="relative w-[300px] h-[600px] bg-gray-200 border shadow-2xl rounded-[40px] overflow-hidden">
            <img
                src="https://cdn.pixabay.com/photo/2017/06/13/22/42/iphone-2402069_1280.png"
                alt="Phone Mockup"
                className="absolute w-full h-full object-cover"
            />
            <div className="absolute top-[120px] left-[25px] right-[25px] bg-white rounded-xl p-4 shadow-inner">
                <h1 className="text-md font-bold mb-2 text-gray-800">{message?.subject || "No Subject"}</h1>
                <p className="text-sm text-gray-700 whitespace-pre-line">{message?.body || "Message body preview..."}</p>
            </div>
        </div>
    );

    const renderLeftText = () => (
        <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Automated Messaging Settings</h2>
            <p className="text-gray-600 text-base leading-relaxed">
                Customize automated messages sent to your customers when they create, fulfill, or cancel orders. For abandoned carts, you can schedule up to 3 timed reminders. Use the live phone preview to visualize how your message will appear.
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
                        <div key={index} className="border-t pt-4 mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
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
                                    <label className="block text-sm font-medium mb-1">Subject</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded px-3 py-2"
                                        value={msg.subject}
                                        onChange={(e) => updateCartAbandonedMessage(index, 'subject', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Body</label>
                                    <textarea
                                        className="w-full border rounded px-3 py-2"
                                        value={msg.body}
                                        onChange={(e) => updateCartAbandonedMessage(index, 'body', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-center items-start">
                                {renderPhoneMockup(msg)}
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        const fallback = msgSetting || { enabled: false, subject: '', body: '' };

        return (
            <div className="border rounded p-4 mb-6 bg-white shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
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
                        <>
                            <div className="mb-3">
                                <label className="block font-medium text-sm mb-1">Subject</label>
                                <input
                                    type="text"
                                    className="w-full border rounded px-3 py-2"
                                    value={fallback.subject}
                                    onChange={(e) => handleInputChange(type, 'subject', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-sm mb-1">Body</label>
                                <textarea
                                    className="w-full border rounded px-3 py-2"
                                    value={fallback.body}
                                    onChange={(e) => handleInputChange(type, 'body', e.target.value)}
                                />
                            </div>
                        </>
                    )}
                </div>
                <div className="flex justify-center items-start">
                    {fallback.enabled && renderPhoneMockup(fallback)}
                </div>
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
