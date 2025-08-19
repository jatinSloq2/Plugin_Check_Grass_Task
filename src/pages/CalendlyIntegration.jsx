import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const UNITS = ["minutes", "hours", "days"];

const CalendlyIntegration = () => {
    const { user } = useAuth();
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [templates, setTemplates] = useState([]);
    const api_token = user.api_token
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
                const connectionRes = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/calendly/check-connection?userId=${user.id}`
                );
                if (connectionRes.data.connected) {
                    setConnected(true);

                    const optionsRes = await axios.get(
                        `${import.meta.env.VITE_SERVER_URL}/calendly/options?userId=${user.id}`
                    );
                    setOptions(optionsRes.data || {
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
            await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/calendly/options?userId=${user.id}`,
                updatedOptions
            );
        } catch (err) {
            console.error("Failed to update options", err);
        }
    };

    const handleDisconnect = async () => {
        try {
            await axios.get(
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
            <div className="max-w-2xl mx-auto p-6 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2">Checking Calendly connection...</span>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Calendly Integration</h1>

            {!connected ? (
                <div className="bg-gray-50 p-6 rounded-lg border">
                    <h2 className="text-lg font-semibold mb-2">Connect Your Calendly Account</h2>
                    <p className="text-gray-600 mb-4">
                        Connect your Calendly account to manage your scheduled events and receive notifications.
                    </p>
                    <button
                        onClick={handleConnect}
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
                    >
                        Connect Calendly
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200 flex items-center justify-between">
                        <p className="text-green-700 font-semibold flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Calendly Connected Successfully!
                        </p>
                        <button
                            onClick={handleDisconnect}
                            className="ml-4 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                        >
                            Disconnect
                        </button>
                    </div>

                    {/* Reminder Settings */}
                    <div className="bg-white p-6 rounded-lg border">
                        <h2 className="text-xl font-semibold mb-4">Reminder Settings</h2>

                        <label className="flex items-center gap-2 mb-2">
                            <input
                                type="checkbox"
                                checked={options.reminders.enabled}
                                onChange={(e) => handleOptionChange("reminders", "enabled", e.target.checked)}
                            />
                            Enable Reminders
                        </label>

                        {options.reminders.enabled && (
                            <div className="ml-5 space-y-3">
                                <label className="block">
                                    <span className="text-sm text-gray-600">Select Template:</span>
                                    <select
                                        value={options.reminders.templateId}
                                        onChange={(e) => handleOptionChange("reminders", "templateId", e.target.value)}
                                        className="border rounded px-2 py-1 w-full"
                                    >
                                        <option value="">-- Select Template --</option>
                                        {templates.map((tpl) => (
                                            <option key={tpl.id} value={tpl.id}>
                                                {tpl.name}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <div className="flex flex-col gap-2">
                                    {["24h", "1h", "10m"].map((field) => (
                                        <label key={field} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={options.reminders[field]}
                                                onChange={(e) => handleOptionChange("reminders", field, e.target.checked)}
                                            />
                                            {field} before
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Event Notifications */}
                    <div className="bg-white p-6 rounded-lg border">
                        <h2 className="text-xl font-semibold mb-4">Event Notifications</h2>

                        <label className="flex items-center gap-2 mb-2">
                            <input
                                type="checkbox"
                                checked={options.events.enabled}
                                onChange={(e) => handleOptionChange("events", "enabled", e.target.checked)}
                            />
                            Enable Event Notifications
                        </label>

                        {options.events.enabled && (
                            <div className="ml-5 space-y-3">
                                <label className="block">
                                    <span className="text-sm text-gray-600">Select Template:</span>
                                    <select
                                        value={options.events.templateId}
                                        onChange={(e) => handleOptionChange("events", "templateId", e.target.value)}
                                        className="border rounded px-2 py-1 w-full"
                                    >
                                        <option value="">-- Select Template --</option>
                                        {templates.map((tpl) => (
                                            <option key={tpl.id} value={tpl.id}>
                                                {tpl.name}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                {["booked", "rescheduled", "cancelled"].map((field) => (
                                    <label key={field} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={options.events[field]}
                                            onChange={(e) => handleOptionChange("events", field, e.target.checked)}
                                        />
                                        On {field}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendlyIntegration;