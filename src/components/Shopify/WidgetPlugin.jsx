export default function WidgetPlugin({ settings, widgetEnabled, onChange }) {
    const chat = settings.chatSettings || {};
    const brand = settings.brandSettings || {};

    const cardClasses = "border border-gray-200 rounded p-6 bg-white";
    const sectionTitle = "text-2xl font-semibold text-black mb-2";
    const inputBase = "w-60 p-2 border rounded-md focus:ring-2 focus:ring-emerald-400";
    const radioWrapper = "flex items-center space-x-2 bg-white text-blue-100 px-3 py-2 rounded-lg border border-gray-200 cursor-pointer hover:border-green-500 transition";


    return (
        <div className="min-h-screen bg-gray-50">
            {/* Widget Card */}

            <div className={cardClasses}>
                <div className="p-6 border-b border-gray-200">
                    <h2 className={sectionTitle}>Widget Status</h2>
                    <div className="grid md:grid-cols-2 gap-6 items-center">
                        <p className="text-muted-foreground max-w-xl">
                            This setting controls whether the chat widget is active on your storefront.
                            When enabled, customers visiting your store will see the widget and can
                            interact with it in real time. If disabled, the widget will remain hidden
                            from visitors, but all your saved settings will be preserved and can be
                            reactivated at any time by switching this option back on.
                        </p>
                        <div className="flex items-center gap-6 bg-gray-50 p-10">
                            {["true", "false"].map((val) => (
                                <label key={val} className={radioWrapper}>
                                    <input
                                        type="radio"
                                        name="widgetEnabled"
                                        value={val}
                                        checked={widgetEnabled === (val === "true")}
                                        onChange={() =>
                                            onChange({ ...settings, widgetEnabled: val === "true" })
                                        }
                                        className="text-green-600 focus:ring-green-500"
                                    />
                                    <span className="text-gray-800 font-medium">
                                        {val === "true" ? "Enabled" : "Disabled"}
                                    </span>
                                </label>
                            ))}
                        </div>

                    </div>
                    {!widgetEnabled && (
                        <p className="mt-4 text-sm text-gray-500">Widget is disabled. Enable it to view settings.</p>
                    )}
                </div>

                {widgetEnabled && (
                    <>
                        {/* Chat Settings */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="grid md:grid-cols-2 gap-10 items-start">
                                {/* Left: Title & Description */}
                                <div>
                                    <h2 className={sectionTitle}>Button Style</h2>
                                    <p className="text-muted-foreground max-w-md">
                                        Customize the appearance of your chat widget button. You can adjust the background
                                        color, update the call-to-action text, and choose its position on the screen.
                                        These settings help ensure the widget matches your brand’s look and provides a
                                        seamless experience for your customers.
                                    </p>
                                </div>

                                {/* Right: Settings */}
                                <div className="space-y-15 bg-gray-50 p-10">
                                    {/* Background Color */}
                                    <div className="flex items-center justify-between bg-white p-4 ">
                                        <label className="text-lg font-medium">Background Color</label>
                                        <input
                                            type="color"
                                            value={chat.backgroundColor || "#10b981"}
                                            onChange={(e) =>
                                                onChange({
                                                    ...settings,
                                                    chatSettings: { ...chat, backgroundColor: e.target.value },
                                                })
                                            }
                                            className="h-10 w-20 rounded-md border shadow-inner"
                                        />
                                    </div>

                                    {/* CTA Text */}
                                    <div className="flex items-center justify-between bg-white p-4">
                                        <label className="text-lg font-medium">CTA Text</label>
                                        <input
                                            type="text"
                                            placeholder="Chat Now"
                                            maxLength={24}
                                            value={chat.ctaText || ""}
                                            onChange={(e) =>
                                                onChange({
                                                    ...settings,
                                                    chatSettings: { ...chat, ctaText: e.target.value },
                                                })
                                            }
                                            className={`${inputBase} w-48 text-right`}
                                        />
                                    </div>

                                    {/* Position */}
                                    <div className="flex items-center justify-between bg-white p-4">
                                        <label className="text-lg font-medium">Position</label>
                                        <div className="flex gap-6">
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
                                                    />
                                                    Bottom-{pos.charAt(0).toUpperCase() + pos.slice(1)}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Brand Settings */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="grid md:grid-cols-2 gap-10 items-start">
                                {/* Left: Title & Description */}
                                <div>
                                    <h2 className={sectionTitle}>Brand Settings</h2>
                                    <p className="text-muted-foreground max-w-md">
                                        Define the key details of your brand that will appear in the chat widget.
                                        You can set your brand name, phone number, and a default message that will
                                        be shown to customers. These settings personalize the widget, making it
                                        clear who customers are engaging with and ensuring smooth communication
                                        between your business and your visitors.
                                    </p>
                                </div>

                                {/* Right: Settings */}
                                <div className="space-y-6 bg-gray-50 p-10">
                                    {/* Brand Name */}
                                    <div className="flex items-center justify-between bg-white p-4">
                                        <label className="text-lg font-medium">Brand Name</label>
                                        <input
                                            type="text"
                                            placeholder="Your Brand"
                                            value={brand.brandName || ""}
                                            onChange={(e) =>
                                                onChange({
                                                    ...settings,
                                                    brandSettings: { ...brand, brandName: e.target.value },
                                                })
                                            }
                                            className={`${inputBase} w-48 text-right`}
                                        />
                                    </div>

                                    {/* Phone Number */}
                                    <div className="flex items-center justify-between bg-white p-4">
                                        <label className="text-lg font-medium">Phone Number</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 919000012345"
                                            value={brand.phoneNumber || ""}
                                            onChange={(e) =>
                                                onChange({
                                                    ...settings,
                                                    brandSettings: { ...brand, phoneNumber: e.target.value },
                                                })
                                            }
                                            className={`${inputBase} w-48 text-right`}
                                        />
                                    </div>

                                    {/* Message Text */}
                                    <div className="bg-white p-4">
                                        <label className="block text-lg font-medium mb-2">Message Text</label>
                                        <textarea
                                            placeholder="Type your message here..."
                                            value={brand.messageText || ""}
                                            onChange={(e) =>
                                                onChange({
                                                    ...settings,
                                                    brandSettings: { ...brand, messageText: e.target.value },
                                                })
                                            }
                                            className={`${inputBase} w-full`}
                                        />
                                    </div>

                                    {/* Auto Show */}
                                    <div className="flex items-center justify-between bg-white p-4">
                                        <label htmlFor="autoShow" className="text-lg font-medium">
                                            Auto Show
                                        </label>
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
                                            className="h-5 w-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-400"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </>
                )}
            </div>
        </div>
    );
}
