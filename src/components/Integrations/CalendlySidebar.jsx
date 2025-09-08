import { Bell, Calendar, CheckCircle, ExternalLink, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const UNITS = ["minutes", "hours", "days"];

const CalendlySidebar = ({ onClose }) => {
    const { user } = useAuth();
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [templates, setTemplates] = useState([]);
    const [searchParams] = useSearchParams();
    const status = searchParams.get("status");
    const errorMsg = searchParams.get("error");
    const api_token = user?.api_token;
    const [options, setOptions] = useState({
        reminders: {
            enabled: false,
            templateId: "",
            campaignName: "reminders",
            "24h": false,
            "1h": false,
            "10m": false,
        },
        events: {
            enabled: false,
            templateId: "",
            campaignName: "events",
            booked: false,
            rescheduled: false,
            cancelled: false,
        },
    });

    useEffect(() => {
        if (!api_token) return;
        const fetchTemplates = async () => {
            try {
                const res = await fetch(`https://aigreentick.com/api/v1/wa-templates?type=get&page=1`, {
                    headers: { Authorization: `Bearer ${api_token}` },
                });
                const json = await res.json();
                const templatesArray = json?.data?.data || [];
                setTemplates(templatesArray.map((t) => ({ id: t.id, name: t.name })));
            } catch (err) {
                console.error("Failed to fetch templates:", err);
            }
        };
        fetchTemplates();
    }, [api_token]);

    useEffect(() => {
        if (!user?.id) return;
        const checkConnection = async () => {
            setLoading(true);
            try {
                const connectionRes = await fetch(
                    `${import.meta.env.VITE_SERVER_URL}/calendly/check-connection?userId=${user.id}`
                ).then((res) => res.json());
                if (connectionRes.connected) {
                    setConnected(true);
                    const optionsRes = await fetch(
                        `${import.meta.env.VITE_SERVER_URL}/calendly/options?userId=${user.id}`
                    ).then((res) => res.json());
                    setOptions(optionsRes || options);
                } else {
                    setConnected(false);
                }
            } catch (err) {
                console.error("Error checking connection:", err);
                setConnected(false);
            } finally {
                setLoading(false);
            }
        };
        checkConnection();
    }, [user?.id]);

    const handleConnect = () => {
        window.location.href = `${import.meta.env.VITE_SERVER_URL}/calendly/connect?userId=${user.id}`;
    };

    const handleOptionChange = async (section, field, value) => {
        const updatedOptions = {
            ...options,
            [section]: {
                ...options[section],
                [field]: value,
            },
        };
        setOptions(updatedOptions);
        try {
            await fetch(`${import.meta.env.VITE_SERVER_URL}/calendly/options?userId=${user.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedOptions),
            });
        } catch (err) {
            console.error("Failed to update options", err);
        }
    };

    const handleDisconnect = async () => {
        try {
            await fetch(`${import.meta.env.VITE_SERVER_URL}/calendly/disconnect?userId=${user.id}`);
            setConnected(false);
            setOptions({
                reminders: { enabled: false, templateId: "", campaignName: "reminders", "24h": false, "1h": false, "10m": false },
                events: { enabled: false, templateId: "", campaignName: "events", booked: false, rescheduled: false, cancelled: false },
            });
            setErrorMsg("Calendly disconnected successfully.");
        } catch (err) {
            console.error("Failed to disconnect Calendly:", err);
        }
    };

    return (
        <div className="fixed inset-0 flex justify-end z-50">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            {/* Sidebar */}
            <div className="relative w-full sm:w-[800px] bg-white shadow-xl h-full p-6 animate-slide-in overflow-y-auto">
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    ✕
                </button>
                {status === "disconnected" && (
                    <div className="mb-4 p-3 rounded-lg bg-yellow-100 text-yellow-700 font-medium flex items-center">
                        ⚠️ Calendly disconnected successfully.
                    </div>
                )}
                {status === "success" && (
                    <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700 font-medium flex items-center">
                        ✅ Calendly connected successfully!
                    </div>
                )}

                {status === "error" && (
                    <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 font-medium flex items-center">
                        ❌ {decodeURIComponent(errorMsg || "Failed to connect Calendly")}
                    </div>
                )}

                {/* Main Calendly Logic */}
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                ) : (
                    <div>
                        <div className="flex items-center justify-center mb-6">
                            <Calendar className="h-8 w-8 text-blue-600 mr-2" />
                            <h2 className="text-2xl font-bold">Calendly Integration</h2>
                        </div>

                        {!connected ? (
                            <div className="text-center">
                                <p className="text-gray-600 mb-6">
                                    Connect your Calendly account to unlock notifications and reminders.
                                </p>
                                <button
                                    onClick={handleConnect}
                                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl"
                                >
                                    <ExternalLink className="h-5 w-5 inline mr-2" />
                                    Connect with Calendly
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Connection status */}
                                <div className="flex items-center justify-between bg-green-100 p-4 rounded-xl">
                                    <div className="flex items-center">
                                        <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                                        <span className="font-medium">Connected</span>
                                    </div>
                                    <button
                                        onClick={handleDisconnect}
                                        className="text-red-500 text-sm font-medium"
                                    >
                                        Disconnect
                                    </button>
                                </div>

                                {/* Reminder + Event Settings (same logic as your code) */}
                                {/* 👉 you can paste your full grid of Reminder Settings + Event Notifications here exactly as is */}
                                <div className="grid lg:grid-cols-2 gap-6">
                                    {/* Reminder Settings */}
                                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4">
                                            <div className="flex items-center">
                                                <Bell className="h-6 w-6 text-white mr-3" />
                                                <h2 className="text-xl font-bold text-white">Reminder Settings</h2>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <div className="mb-6">
                                                <label className="flex items-center group cursor-pointer">
                                                    <div className="relative">
                                                        <input
                                                            type="checkbox"
                                                            checked={options.reminders.enabled}
                                                            onChange={(e) => handleOptionChange("reminders", "enabled", e.target.checked)}
                                                            className="sr-only"
                                                        />
                                                        <div className={`w-12 h-6 rounded-full transition-colors duration-200 ${options.reminders.enabled ? 'bg-orange-500' : 'bg-gray-300'}`}>
                                                            <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-200 ${options.reminders.enabled ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`}></div>
                                                        </div>
                                                    </div>
                                                    <span className="ml-3 font-semibold text-gray-800">Enable Reminders</span>
                                                </label>
                                            </div>

                                            {options.reminders.enabled && (
                                                <div className="space-y-6 animate-in slide-in-from-top duration-300">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Message Template
                                                        </label>
                                                        <select
                                                            value={options.reminders.templateId}
                                                            onChange={(e) => handleOptionChange("reminders", "templateId", e.target.value)}
                                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                                                        >
                                                            <option value="">Choose a template...</option>
                                                            {templates.map((tpl) => (
                                                                <option key={tpl.id} value={tpl.id}>
                                                                    {tpl.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700 mb-3">Send reminders:</p>
                                                        <div className="space-y-3">
                                                            {[
                                                                { key: "24h", label: "24 hours before", icon: "🗓️" },
                                                                { key: "1h", label: "1 hour before", icon: "⏰" },
                                                                { key: "10m", label: "10 minutes before", icon: "⚡" }
                                                            ].map((item) => (
                                                                <label key={item.key} className="flex items-center group cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={options.reminders[item.key]}
                                                                        onChange={(e) => handleOptionChange("reminders", item.key, e.target.checked)}
                                                                        className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500 focus:ring-2"
                                                                    />
                                                                    <span className="ml-3 text-sm font-medium text-gray-700">
                                                                        {item.icon} {item.label}
                                                                    </span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Event Notifications */}
                                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4">
                                            <div className="flex items-center">
                                                <Settings className="h-6 w-6 text-white mr-3" />
                                                <h2 className="text-xl font-bold text-white">Event Notifications</h2>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <div className="mb-6">
                                                <label className="flex items-center group cursor-pointer">
                                                    <div className="relative">
                                                        <input
                                                            type="checkbox"
                                                            checked={options.events.enabled}
                                                            onChange={(e) => handleOptionChange("events", "enabled", e.target.checked)}
                                                            className="sr-only"
                                                        />
                                                        <div className={`w-12 h-6 rounded-full transition-colors duration-200 ${options.events.enabled ? 'bg-purple-500' : 'bg-gray-300'}`}>
                                                            <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-200 ${options.events.enabled ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`}></div>
                                                        </div>
                                                    </div>
                                                    <span className="ml-3 font-semibold text-gray-800">Enable Event Notifications</span>
                                                </label>
                                            </div>

                                            {options.events.enabled && (
                                                <div className="space-y-6 animate-in slide-in-from-top duration-300">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Message Template
                                                        </label>
                                                        <select
                                                            value={options.events.templateId}
                                                            onChange={(e) => handleOptionChange("events", "templateId", e.target.value)}
                                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                                        >
                                                            <option value="">Choose a template...</option>
                                                            {templates.map((tpl) => (
                                                                <option key={tpl.id} value={tpl.id}>
                                                                    {tpl.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700 mb-3">Notify when:</p>
                                                        <div className="space-y-3">
                                                            {[
                                                                { key: "booked", label: "Event is booked", icon: "✅", color: "text-green-600" },
                                                                { key: "rescheduled", label: "Event is rescheduled", icon: "🔄", color: "text-blue-600" },
                                                                { key: "cancelled", label: "Event is cancelled", icon: "❌", color: "text-red-600" }
                                                            ].map((item) => (
                                                                <label key={item.key} className="flex items-center group cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={options.events[item.key]}
                                                                        onChange={(e) => handleOptionChange("events", item.key, e.target.checked)}
                                                                        className="w-4 h-4 text-purple-500 rounded focus:ring-purple-500 focus:ring-2"
                                                                    />
                                                                    <span className={`ml-3 text-sm font-medium ${item.color}`}>
                                                                        {item.icon} {item.label}
                                                                    </span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalendlySidebar;
