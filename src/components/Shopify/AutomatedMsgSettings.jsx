import { useState, useEffect } from 'react';

export default function AutomatedMsgSettings({ settings = {}, onChange }) {
    const [localSettings, setLocalSettings] = useState(settings);

    useEffect(() => {
        if (JSON.stringify(settings) !== JSON.stringify(localSettings)) {
            setLocalSettings(settings);
        }
    }, [settings]);

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

    const renderMsgType = (type, label) => {
        const msgSetting = localSettings[type] || { enabled: false, subject: '', body: '' };
        return (
            <div className="border rounded p-4 mb-6 bg-gray-50 shadow-sm">
                <h3 className="font-semibold text-lg mb-2">{label}</h3>

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

                {msgSetting.enabled && (
                    <>
                        <div className="mb-3">
                            <label className="block font-medium text-sm mb-1">Subject</label>
                            <input
                                type="text"
                                className="w-full border rounded px-3 py-2"
                                value={msgSetting.subject}
                                onChange={(e) => handleInputChange(type, 'subject', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-sm mb-1">Body</label>
                            <textarea
                                className="w-full border rounded px-3 py-2"
                                value={msgSetting.body}
                                onChange={(e) => handleInputChange(type, 'body', e.target.value)}
                            />
                        </div>
                    </>
                )}
            </div>
        );
    };

    return (
        <div>
            {renderMsgType('orderCreated', 'Order Created')}
            {renderMsgType('orderFulfilled', 'Order Fulfilled')}
            {renderMsgType('orderCanceled', 'Order Canceled')}
            {renderMsgType('cartAbandoned', 'Cart Abandoned')} {/* ✅ Add this line */}
        </div>
    );
}
