import { Bell, Calendar, CheckCircle, ExternalLink, Settings, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const UNITS = ["minutes", "hours", "days"];

const CalendlySidebar = ({ onClose }) => {
    const { user } = useAuth();
    const [connected, setConnected] = useState(false);
    const [disconnectMsg, setDisconnectMsg] = useState(null);
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

    // const handleOptionChange = async (section, field, value) => {
    //     const updatedOptions = {
    //         ...options,
    //         [section]: {
    //             ...options[section],
    //             [field]: value,
    //         },
    //     };
    //     setOptions(updatedOptions);
    //     try {
    //         await fetch(`${import.meta.env.VITE_SERVER_URL}/calendly/options?userId=${user.id}`, {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify(updatedOptions),
    //         });
    //     } catch (err) {
    //         console.error("Failed to update options", err);
    //     }
    // };

    const handleOptionChange = (section, field, value) => {
        const updatedOptions = {
            ...options,
            [section]: {
                ...options[section],
                [field]: value,
            },
        };
        setOptions(updatedOptions);
    };

    const handleSaveSettings = async () => {
        try {
            await fetch(`${import.meta.env.VITE_SERVER_URL}/calendly/options?userId=${user.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(options),
            });
            alert("✅ Settings saved successfully!");
        } catch (err) {
            console.error("Failed to save options", err);
            alert("❌ Failed to save settings. Please try again.");
        }
    };

    const handleDisconnect = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/calendly/disconnect?userId=${user.id}`);
            const data = await res.json();

            if (data.status === "disconnected") {
                setConnected(false);
                setOptions({
                    reminders: { enabled: false, templateId: "", campaignName: "reminders", "24h": false, "1h": false, "10m": false },
                    events: { enabled: false, templateId: "", campaignName: "events", booked: false, rescheduled: false, cancelled: false },
                });
                setDisconnectMsg(data.message);
            } else {
                setDisconnectMsg(data.message || "Something went wrong");
            }
        } catch (err) {
            console.error("Failed to disconnect Calendly:", err);
            setDisconnectMsg("Error disconnecting Calendly");
        }
    };

    return (
        <div className="fixed inset-0 flex justify-end z-50">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative w-full sm:w-[800px] bg-gray-50 shadow-xl h-full p-6 animate-slide-in overflow-y-auto">
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    <X />
                </button>
                {disconnectMsg && (
                    <div className="mb-4 p-3 rounded-lg bg-yellow-100 text-yellow-700 font-medium flex items-center">
                        ⚠️ {disconnectMsg}
                    </div>
                )}
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
                        <div className="flex items-center mb-2">
                            <Calendar className="h-8 w-8 text-green-600 mr-2" />
                            <h2 className="text-2xl font-bold">Calendly Integration</h2>
                        </div>

                        {!connected ? (
                            <>
                                <p className="text-muted-foreground text-lg mb-8">
                                    Connect your Calendly account to enable notifications and reminders.
                                </p>
                                <button
                                    onClick={handleConnect}
                                    className="w-fit bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center"
                                >
                                    Connect with Calendly
                                </button>
                            </>
                        ) : (
                            <div className="space-y-6">
                                {/* Connection status */}
                                <div className="flex items-center justify-between bg-white p-4 mt-8 rounded">
                                    <div className="flex items-center">
                                        <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                                        <span className="font-medium">Connected</span>
                                    </div>
                                    <button
                                        onClick={handleDisconnect}
                                        className="text-red-500 bg-gray-50 p-4 rounded text-sm font-medium shadow"
                                    >
                                        Disconnect
                                    </button>
                                </div>
                                {/* Reminder + Event Settings (vertical stacked layout) */}
                                <div className="flex flex-col gap-6 bg-white rounded shadow">
                                    {/* Reminder Settings */}
                                    <div className="overflow-hidden">
                                        <div className="flex items-center px-4 py-3">
                                            <Bell className="h-5 w-5 text-green-600 mr-2" />
                                            <h2 className="text-lg font-semibold text-gray-900">Reminder Settings</h2>
                                        </div>

                                        <div className="p-5">
                                            {/* Enable toggle */}
                                            <label className="flex items-center cursor-pointer mb-4">
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        checked={options.reminders.enabled}
                                                        onChange={(e) =>
                                                            handleOptionChange("reminders", "enabled", e.target.checked)
                                                        }
                                                        className="sr-only"
                                                    />
                                                    <div
                                                        className={`w-10 h-5 rounded-full transition-colors ${options.reminders.enabled ? "bg-green-600" : "bg-gray-300"
                                                            }`}
                                                    >
                                                        <div
                                                            className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform ${options.reminders.enabled ? "translate-x-5" : "translate-x-0.5"
                                                                } mt-0.5`}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <span className="ml-3 font-medium text-gray-800">Enable Reminders</span>
                                            </label>

                                            {/* Extra fields only if enabled */}
                                            {options.reminders.enabled && (
                                                <div className="space-y-5">
                                                    {/* Template Select */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Message Template
                                                        </label>
                                                        <select
                                                            value={options.reminders.templateId}
                                                            onChange={(e) =>
                                                                handleOptionChange("reminders", "templateId", e.target.value)
                                                            }
                                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                                        >
                                                            <option value="">Choose a template...</option>
                                                            {templates.map((tpl) => (
                                                                <option key={tpl.id} value={tpl.id}>
                                                                    {tpl.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    {/* Reminder checkboxes */}
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700 mb-2">
                                                            Send reminders:
                                                        </p>
                                                        <div className="space-y-2">
                                                            {[
                                                                { key: "24h", label: "24 hours before" },
                                                                { key: "1h", label: "1 hour before" },
                                                                { key: "10m", label: "10 minutes before" },
                                                            ].map((item) => (
                                                                <label
                                                                    key={item.key}
                                                                    className="flex items-center cursor-pointer p-2 rounded hover:bg-gray-50"
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={options.reminders[item.key]}
                                                                        onChange={(e) =>
                                                                            handleOptionChange(
                                                                                "reminders",
                                                                                item.key,
                                                                                e.target.checked
                                                                            )
                                                                        }
                                                                        className="w-4 h-4 text-green-600 rounded focus:ring-green-600"
                                                                    />
                                                                    <span className="ml-3 text-sm text-gray-700">
                                                                        {item.label}
                                                                    </span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <hr className="border-t border-gray-200" />

                                    {/* Event Notifications */}
                                    <div className="overflow-hidden ">
                                        <div className="flex items-center px-4 py-3">
                                            <Settings className="h-5 w-5 text-green-600 mr-2" />
                                            <h2 className="text-lg font-semibold text-gray-900">
                                                Event Notifications
                                            </h2>
                                        </div>

                                        <div className="p-5">
                                            {/* Enable toggle */}
                                            <label className="flex items-center cursor-pointer mb-4">
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        checked={options.events.enabled}
                                                        onChange={(e) =>
                                                            handleOptionChange("events", "enabled", e.target.checked)
                                                        }
                                                        className="sr-only"
                                                    />
                                                    <div
                                                        className={`w-10 h-5 rounded-full transition-colors ${options.events.enabled ? "bg-green-600" : "bg-gray-300"
                                                            }`}
                                                    >
                                                        <div
                                                            className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform ${options.events.enabled ? "translate-x-5" : "translate-x-0.5"
                                                                } mt-0.5`}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <span className="ml-3 font-medium text-gray-800">
                                                    Enable Event Notifications
                                                </span>
                                            </label>

                                            {/* Extra fields only if enabled */}
                                            {options.events.enabled && (
                                                <div className="space-y-5">
                                                    {/* Template Select */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Message Template
                                                        </label>
                                                        <select
                                                            value={options.events.templateId}
                                                            onChange={(e) =>
                                                                handleOptionChange("events", "templateId", e.target.value)
                                                            }
                                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                                        >
                                                            <option value="">Choose a template...</option>
                                                            {templates.map((tpl) => (
                                                                <option key={tpl.id} value={tpl.id}>
                                                                    {tpl.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    {/* Event checkboxes */}
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700 mb-2">
                                                            Notify when:
                                                        </p>
                                                        <div className="space-y-2">
                                                            {[
                                                                { key: "booked", label: "Event is booked" },
                                                                { key: "rescheduled", label: "Event is rescheduled" },
                                                                { key: "cancelled", label: "Event is cancelled" },
                                                            ].map((item) => (
                                                                <label
                                                                    key={item.key}
                                                                    className="flex items-center cursor-pointer p-2 rounded hover:bg-gray-50"
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={options.events[item.key]}
                                                                        onChange={(e) =>
                                                                            handleOptionChange("events", item.key, e.target.checked)
                                                                        }
                                                                        className="w-4 h-4 text-green-600 rounded focus:ring-green-600"
                                                                    />
                                                                    <span className="ml-3 text-sm text-gray-700">
                                                                        {item.label}
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
                                <div className="flex mt-6">
                                    <button
                                        onClick={handleSaveSettings}
                                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg shadow"
                                    >
                                        Save Settings
                                    </button>
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
