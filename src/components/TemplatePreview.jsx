import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const TemplatePreview = ({ templateId }) => {
    const [templateDetails, setTemplateDetails] = useState({});
    const [loadingId, setLoadingId] = useState(null);
    const { user } = useAuth();
    const api_token = user?.api_token;

    const fetchTemplateById = async (id) => {
        if (!id || templateDetails[id] || !api_token) return;

        setLoadingId(id);
        try {
            const res = await fetch(`https://aigreentick.com/api/v1/wa-templates/${id}`, {
                headers: { Authorization: `Bearer ${api_token}` },
            });
            const json = await res.json();
            const components = json?.components || [];
            const body = components.find((c) => c.type === "BODY")?.text || "No preview available";
            const header = components.find((c) => c.type === "HEADER") || null;

            setTemplateDetails((prev) => ({
                ...prev,
                [id]: { components, body, header },
            }));
        } catch (err) {
            console.error(`Failed to fetch template ${id}:`, err);
            setTemplateDetails((prev) => ({
                ...prev,
                [id]: { components: [], body: "Error loading template preview", header: null },
            }));
        } finally {
            setLoadingId(null);
        }
    };

    useEffect(() => {
        if (templateId) fetchTemplateById(templateId);
    }, [templateId]);

    const detail = templateDetails[templateId];

    if (!templateId) return <div className="text-gray-500 text-sm">Select a template to preview.</div>;
    if (loadingId === templateId) return <div className="text-gray-500 text-sm">Loading preview...</div>;
    if (!detail) return <div className="text-gray-500 text-sm">No preview available</div>;

    const { components = [] } = detail;

    const PhonePreview = ({ children }) => (
        <div className="relative w-[320px] h-[640px] mx-auto">
            <img
                src="https://mockuphone.com/images/devices_picture/apple-iphone13-blue-portrait.png"
                alt="phone"
                className="w-full h-full object-contain z-50"
            />
            <div
                className="absolute top-[10%] left-[11.5%] w-[76%] h-[80%] rounded-[1.5rem] overflow-hidden z-0
        bg-[url('https://i.pinimg.com/564x/d2/a7/76/d2a77609f5d97b9081b117c8f699bd37.jpg')] 
        bg-cover bg-center flex flex-col shadow-inner"
            >
                <div className="bg-green-600 text-white p-2 flex items-center gap-2">
                    <img src="https://i.pravatar.cc/40" alt="contact" className="w-8 h-8 rounded-full" />
                    <div>
                        <p className="font-semibold text-sm">John Doe</p>
                        <p className="text-xs text-green-100">online</p>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">{children}</div>
            </div>
        </div>
    );

    return (
        <PhonePreview>
            {components.length > 0 && (
                <div
                    className={`max-w-[75%] p-3 rounded-xl flex flex-col gap-1 ${components[0].type === "BODY" ? "self-end bg-green-100" : "self-start bg-gray-200"
                        }`}
                >
                    {components.map((component, i) => {
                        if ((component.type === "HEADER" || component.type === "BODY" || component.type === "FOOTER") && component.text) {
                            return (
                                <p key={i} className={`text-sm ${component.type === "FOOTER" ? "text-gray-500 text-xs" : "text-gray-900"}`}>
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

export default TemplatePreview;
