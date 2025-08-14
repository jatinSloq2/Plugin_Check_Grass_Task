import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const UNITS = ["minutes", "hours", "days"];

const CalendlyIntegration = () => {
    const { user } = useAuth();
    const [connected, setConnected] = useState(false);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [options, setOptions] = useState({ enabled: false, times: [] });
    const [newTime, setNewTime] = useState({ value: "", unit: "minutes" });

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

                    const eventsRes = await axios.get(
                        `${import.meta.env.VITE_SERVER_URL}/calendly/events?userId=${user.id}`
                    );
                    setEvents(eventsRes.data || []);

                    const optionsRes = await axios.get(
                        `${import.meta.env.VITE_SERVER_URL}/calendly/options?userId=${user.id}`
                    );
                    setOptions(optionsRes.data || { enabled: false, times: [] });
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

    const handleOptionChange = async (e) => {
        const { name, checked } = e.target;
        const updatedOptions = { ...options, [name]: checked };
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

    const handleAddTime = async () => {
        if (!newTime.value || isNaN(newTime.value) || newTime.value <= 0) return;

        const updatedTimes = [
            ...options.times,
            { value: Number(newTime.value), unit: newTime.unit }
        ];
        const updatedOptions = { ...options, times: updatedTimes };
        setOptions(updatedOptions);
        setNewTime({ value: "", unit: "minutes" });

        try {
            await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/calendly/options?userId=${user.id}`,
                updatedOptions
            );
        } catch (err) {
            console.error("Failed to add new reminder time", err);
        }
    };

    const handleRemoveTime = async (timeToRemove) => {
        const updatedTimes = options.times.filter(
            t => !(t.value === timeToRemove.value && t.unit === timeToRemove.unit)
        );
        const updatedOptions = { ...options, times: updatedTimes };
        setOptions(updatedOptions);

        try {
            await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/calendly/options?userId=${user.id}`,
                updatedOptions
            );
        } catch (err) {
            console.error("Failed to remove reminder time", err);
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
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="text-green-700 font-semibold flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Calendly Connected Successfully!
                        </p>
                    </div>

                    {/* Upcoming Events */}
                    <div className="bg-white p-6 rounded-lg border">
                        <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
                        {events.length > 0 ? (
                            <ul className="space-y-2">
                                {events.map((event, index) => (
                                    <li key={event.uri || index} className="p-3 bg-gray-50 rounded border">
                                        <div className="font-medium">{event.name || "Untitled Event"}</div>
                                        <div className="text-sm text-gray-600">
                                            {event.start_time ? new Date(event.start_time).toLocaleString() : "No date available"}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No upcoming events found.</p>
                        )}
                    </div>

                    {/* Reminder Settings */}
                    <div className="bg-white p-6 rounded-lg border">
                        <h2 className="text-xl font-semibold mb-4">Reminder Settings</h2>

                        <div className="space-y-4">
                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    name="enabled"
                                    checked={options.enabled}
                                    onChange={handleOptionChange}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium">Enable Email Reminders</span>
                            </label>

                            {options.enabled && (
                                <div className="ml-7 space-y-3">
                                    <p className="text-sm text-gray-600 mb-2">Send reminders:</p>

                                    {options.times.map((time, index) => (
                                        <div key={`${time.value}-${time.unit}`} className="flex items-center gap-2">
                                            <span className="text-sm">{`${time.value} ${time.unit} before`}</span>
                                            <button
                                                onClick={() => handleRemoveTime(time)}
                                                className="text-red-500 hover:text-red-700 text-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}

                                    <div className="flex items-center gap-2 mt-2">
                                        <input
                                            type="number"
                                            min="1"
                                            placeholder="Value"
                                            value={newTime.value}
                                            onChange={(e) => setNewTime({ ...newTime, value: e.target.value })}
                                            className="w-20 border rounded px-2 py-1"
                                        />
                                        <select
                                            value={newTime.unit}
                                            onChange={(e) => setNewTime({ ...newTime, unit: e.target.value })}
                                            className="border rounded px-2 py-1"
                                        >
                                            {UNITS.map((unit) => (
                                                <option key={unit} value={unit}>
                                                    {unit}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={handleAddTime}
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendlyIntegration;
