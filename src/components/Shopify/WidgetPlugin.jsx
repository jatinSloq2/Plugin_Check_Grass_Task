export default function WidgetPlugin({ settings, widgetEnabled, onChange }) {
    console.log("settings", settings)
    const chat = settings.chatSettings || {};
    const brand = settings.brandSettings || {};

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100 p-6">
            <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl border border-emerald-300 overflow-hidden">
                {/* Header */}
                <div className="p-5 bg-emerald-100 border-b border-emerald-300 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-emerald-900 tracking-tight">
                        Chat Widget Settings
                    </h1>
                    <button className="text-gray-600 hover:text-red-600 text-2xl leading-none">×</button>
                </div>

                {/* Widget Toggle */}
                <div className="p-6 border-b border-gray-200">
                    <label className="block text-sm font-medium mb-1">Enable Widget</label>
                    <select
                        name="widgetEnabled"
                        value={widgetEnabled ? "true" : "false"}
                        onChange={(e) =>
                            onChange({ ...settings, widgetEnabled: e.target.value === "true" })
                        }
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-400"
                    >
                        <option value="true">Enabled</option>
                        <option value="false">Disabled</option>
                    </select>
                </div>

                {!widgetEnabled ? (
                    <div className="p-6 text-sm text-gray-500">
                        Widget is disabled. Enable it to view settings.
                    </div>
                ) : (
                    <>
                        {/* Chat Settings */}
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-emerald-700 mb-4 border-l-4 border-emerald-400 pl-3">
                                Button Style
                            </h2>
                            <div className="grid md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Background Color</label>
                                    <input
                                        type="color"
                                        name="backgroundColor"
                                        value={chat.backgroundColor || "#10b981"}
                                        onChange={(e) =>
                                            onChange({
                                                ...settings,
                                                chatSettings: { ...chat, backgroundColor: e.target.value },
                                            })
                                        }
                                        disabled={!widgetEnabled}
                                        className="w-full h-12 rounded-md border shadow-inner"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">CTA Text</label>
                                    <input
                                        type="text"
                                        name="ctaText"
                                        placeholder="Chat Now"
                                        maxLength="24"
                                        value={chat.ctaText || ""}
                                        onChange={(e) =>
                                            onChange({
                                                ...settings,
                                                chatSettings: { ...chat, ctaText: e.target.value },
                                            })
                                        }
                                        disabled={!widgetEnabled}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-400"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-1">Position</label>
                                    <div className="flex gap-6 mt-1">
                                        {["left", "right"].map((pos) => (
                                            <label key={pos} className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="position"
                                                    value={pos}
                                                    checked={chat.position === pos}
                                                    onChange={(e) =>
                                                        onChange({
                                                            ...settings,
                                                            chatSettings: { ...chat, position: e.target.value },
                                                        })
                                                    }
                                                    disabled={!widgetEnabled}
                                                />
                                                Bottom-{pos.charAt(0).toUpperCase() + pos.slice(1)}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Brand Settings */}
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-emerald-700 mb-4 border-l-4 border-emerald-400 pl-3">
                                Brand Settings
                            </h2>
                            <div className="grid md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Brand Name</label>
                                    <input
                                        type="text"
                                        name="brandName"
                                        placeholder="Your Brand"
                                        value={brand.brandName || ""}
                                        onChange={(e) =>
                                            onChange({
                                                ...settings,
                                                brandSettings: { ...brand, brandName: e.target.value },
                                            })
                                        }
                                        disabled={!widgetEnabled}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        placeholder="e.g. 919000012345"
                                        value={brand.phoneNumber || ""}
                                        onChange={(e) =>
                                            onChange({
                                                ...settings,
                                                brandSettings: { ...brand, phoneNumber: e.target.value },
                                            })
                                        }
                                        disabled={!widgetEnabled}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-400"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-1">Message Text</label>
                                    <textarea
                                        name="messageText"
                                        placeholder="Type your message here..."
                                        value={brand.messageText || ""}
                                        onChange={(e) =>
                                            onChange({
                                                ...settings,
                                                brandSettings: { ...brand, messageText: e.target.value },
                                            })
                                        }
                                        disabled={!widgetEnabled}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-400"
                                    />
                                </div>

                                {/* Auto Show Checkbox */}
                                <div className="md:col-span-2 flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="autoShow"
                                        checked={brand.autoShow ?? true}
                                        onChange={(e) =>
                                            onChange({
                                                ...settings,
                                                brandSettings: { ...brand, autoShow: e.target.checked },
                                            })
                                        }
                                        disabled={!widgetEnabled}
                                        className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-400"
                                    />
                                    <label htmlFor="autoShow" className="text-sm font-medium text-gray-700">
                                        Auto Show
                                    </label>
                                </div>
                            </div>
                        </div>

                    </>
                )}
            </div>
        </div>
    );
}
