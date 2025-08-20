import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Calendar, CheckCircle, Clock, Bell, Settings, AlertCircle, ExternalLink } from "lucide-react";

const UNITS = ["minutes", "hours", "days"];

const CalendlyIntegration = () => {
    const { user } = useAuth();
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [templates, setTemplates] = useState([]);
    const api_token = user.api_token;
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
                const formattedTemplates = templatesArray.map((t) => ({
                    id: t.id,
                    name: t.name,
                }));
                setTemplates(formattedTemplates);
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
                ).then(res => res.json());
                if (connectionRes.connected) {
                    setConnected(true);

                    const optionsRes = await fetch(
                        `${import.meta.env.VITE_SERVER_URL}/calendly/options?userId=${user.id}`
                    ).then(res => res.json());
                    setOptions(optionsRes || {
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
            await fetch(
                `${import.meta.env.VITE_SERVER_URL}/calendly/options?userId=${user.id}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedOptions)
                }
            );
        } catch (err) {
            console.error("Failed to update options", err);
        }
    };

    const handleDisconnect = async () => {
        try {
            await fetch(
                `${import.meta.env.VITE_SERVER_URL}/calendly/disconnect?userId=${user.id}`
            );
            setConnected(false);
            setOptions({
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
        } catch (err) {
            console.error("Failed to disconnect Calendly:", err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center space-y-4 border border-gray-100">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                    <div className="text-center">
                        <p className="text-lg font-medium text-gray-700">Checking Calendly connection</p>
                        <p className="text-sm text-gray-500 mt-1">Please wait a moment...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <Calendar className="h-10 w-10 text-blue-600 mr-3" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Calendly Integration
                        </h1>
                    </div>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Seamlessly connect your Calendly account to automate notifications and reminders
                    </p>
                </div>

                {!connected ? (
                    /* Connection Card */
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
                            <div className="flex items-center justify-center mb-4">
                                <ExternalLink className="h-8 w-8 text-white mr-3" />
                                <h2 className="text-2xl font-bold text-white">Connect Your Account</h2>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="text-center mb-8">
                                <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                                    <Calendar className="h-10 w-10 text-blue-600" />
                                </div>
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    Connect your Calendly account to unlock powerful automation features including
                                    event notifications and smart reminders for your scheduled meetings.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                <div className="flex items-start space-x-3">
                                    <div className="bg-green-100 rounded-lg p-2 mt-1">
                                        <Bell className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1">Smart Notifications</h3>
                                        <p className="text-sm text-gray-600">Get instant alerts when events are booked, rescheduled, or cancelled</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="bg-blue-100 rounded-lg p-2 mt-1">
                                        <Clock className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1">Automated Reminders</h3>
                                        <p className="text-sm text-gray-600">Send customized reminders 24h, 1h, or 10min before meetings</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleConnect}
                                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-blue-600 hover:to-indigo-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <div className="flex items-center justify-center">
                                    <ExternalLink className="h-5 w-5 mr-2" />
                                    Connect with Calendly
                                </div>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Connection Status */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <CheckCircle className="h-6 w-6 text-white mr-3" />
                                        <span className="text-white font-semibold text-lg">Successfully Connected!</span>
                                    </div>
                                    <button
                                        onClick={handleDisconnect}
                                        className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
                                    >
                                        Disconnect
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Settings Grid */}
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
        </div>
    );
};

export default CalendlyIntegration;