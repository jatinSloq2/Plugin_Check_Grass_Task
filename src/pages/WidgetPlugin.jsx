import { useState, useRef } from "react";

const WidgetPlugin = () => {
  const initialChatSettings = {
    backgroundColor: "#00e785",
    ctaText: "Chat with us",
    ctaIconAIGreenTick: false,
    position: "right",
  };

  const initialBrandSettings = {
    brandName: "",
    brandImg: "",
    welcomeText: "Hi there!\nHow can I help you?",
    messageText: "Hello, I have a question about {{page_link}}",
    backgroundColor: "#fff",
    ctaText: "Chat with us",
    autoShow: false,
    phoneNumber: "",
    email: "",
  };

  const [chatSettings, setChatSettings] = useState(initialChatSettings);
  const [brandSettings, setBrandSettings] = useState(initialBrandSettings);
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);

  const handleChange = (e, section) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    section === "chat"
      ? setChatSettings({ ...chatSettings, [name]: newValue })
      : setBrandSettings({ ...brandSettings, [name]: newValue });
  };

  const handleGenerate = () => {
    // Validate required fields
    if (!brandSettings.brandName || !brandSettings.phoneNumber || !brandSettings.email) {
      alert("Please fill in all required fields");
      return;
    }
    setGenerated(true);
  };

  const handleReset = () => {
    setChatSettings(initialChatSettings);
    setBrandSettings(initialBrandSettings);
    setGenerated(false);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (textareaRef.current) {
      textareaRef.current.select();
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const generatedScript = `<script>
      var url = '${import.meta.env.VITE_SERVER_URL}/api/integration/public-widget.js';
      var s = document.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      s.src = url;
      var options = {
        "enabled": true,
        "chatButtonSetting": {
          "backgroundColor": "${chatSettings.backgroundColor}",
          "ctaText": "${chatSettings.ctaText}",
          "borderRadius": "25",
          "marginLeft": "0",
          "marginRight": "20",
          "marginBottom": "20",
          "ctaIconAIGreenTick": ${chatSettings.ctaIconAIGreenTick},
          "position": "${chatSettings.position}"
        },
        "brandSetting": {
          "brandName": "${brandSettings.brandName}",
          "brandSubTitle": "undefined",
          "brandImg": "${brandSettings.brandImg}",
          "welcomeText": \`${brandSettings.welcomeText}\`,
          "messageText": "${brandSettings.messageText}",
          "backgroundColor": "${brandSettings.backgroundColor}",
          "ctaText": "${brandSettings.ctaText}",
          "borderRadius": "25",
          "autoShow": ${brandSettings.autoShow},
          "phoneNumber": "${brandSettings.phoneNumber}",
          "email": "${brandSettings.email}"
        }
      };
      s.onload = function() {
        CreateWhatsappChatWidget(options);
      };
      var x = document.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(s, x);
    </script>`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl border border-emerald-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500">
          <h1 className="text-xl md:text-2xl font-bold text-white text-center">
            Chat Widget Generator
          </h1>
          <p className="text-emerald-100 text-sm mt-1 text-center">
            Fill out the form to generate your custom chat widget code
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row">
          {/* Left Column - Form */}
          <div className="lg:w-1/2 p-6 border-r border-gray-200">
            <div className="space-y-8">
              {/* Button Style Section */}
              <div>
                <h2 className="text-lg font-semibold text-emerald-700 mb-4 border-b pb-2">
                  Button Style
                </h2>
                <div className="grid gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Brand Color <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        name="backgroundColor"
                        value={chatSettings.backgroundColor}
                        onChange={(e) => handleChange(e, "chat")}
                        className="w-10 h-10 rounded-md border shadow-inner cursor-pointer"
                        required
                      />
                      <span className="ml-2 text-sm text-gray-600">{chatSettings.backgroundColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Chat Bubble Text <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="ctaText"
                      maxLength="24"
                      value={chatSettings.ctaText}
                      onChange={(e) => handleChange(e, "chat")}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                      placeholder="Enter button text"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Position <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-6 mt-1">
                      {["left", "right"].map((pos) => (
                        <label key={pos} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="position"
                            value={pos}
                            checked={chatSettings.position === pos}
                            onChange={(e) => handleChange(e, "chat")}
                            className="text-emerald-500 focus:ring-emerald-400"
                            required
                          />
                          <span className="text-sm">Bottom-{pos.charAt(0).toUpperCase() + pos.slice(1)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Widget Settings Section */}
              <div>
                <h2 className="text-lg font-semibold text-emerald-700 mb-4 border-b pb-2">
                  Chat Widget Settings
                </h2>
                <div className="grid gap-5">
                  {[
                    { label: "Email ID", name: "email", type: "email", placeholder: "your@email.com", required: true },
                    { label: "Phone Number with Country Code", name: "phoneNumber", placeholder: "e.g. 919000012345", required: true },
                    { label: "Brand Name", name: "brandName", placeholder: "Your Brand Name", required: true },
                    { label: "Brand Image URL", name: "brandImg", placeholder: "https://example.com/logo.png", required: true },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium mb-1 text-gray-700">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type={field.type || "text"}
                        name={field.name}
                        placeholder={field.placeholder || ""}
                        value={brandSettings[field.name]}
                        onChange={(e) => handleChange(e, "brand")}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                        required={field.required}
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Pre-filled Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="messageText"
                      value={brandSettings.messageText}
                      onChange={(e) => handleChange(e, "brand")}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 h-20"
                      placeholder="Enter the message users will send"
                      required
                    />
                    <div className="flex mt-2 gap-2">
                      {[
                        { label: "Page Link", value: "{{page_link}}" },
                        { label: "Page Title", value: "{{page_title}}" },
                      ].map((btn) => (
                        <button
                          key={btn.label}
                          type="button"
                          onClick={() =>
                            handleChange(
                              {
                                target: {
                                  name: "messageText",
                                  value: brandSettings.messageText + " " + btn.value,
                                },
                              },
                              "brand"
                            )
                          }
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                          </svg>
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Welcome Text <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="welcomeText"
                      maxLength="40"
                      value={brandSettings.welcomeText}
                      onChange={(e) => handleChange(e, "brand")}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 h-20"
                      placeholder="Enter welcome message"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {brandSettings.welcomeText.length}/40 characters
                    </p>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-700">Open widget by default: <span className="text-red-500">*</span></span>
                    <div className="flex items-center gap-6 mt-2">
                      {[true, false].map((val) => (
                        <label key={val.toString()} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="autoShow"
                            value={val}
                            checked={brandSettings.autoShow === val}
                            onChange={() =>
                              handleChange(
                                {
                                  target: {
                                    name: "autoShow",
                                    value: val,
                                    type: "radio",
                                  },
                                },
                                "brand"
                              )
                            }
                            className="text-emerald-500 focus:ring-emerald-400"
                            required
                          />
                          <span className="text-sm">{val ? "Yes" : "No"}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleGenerate}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg shadow-md font-semibold flex-1"
                >
                  Generate Widget
                </button>
                <button
                  onClick={handleReset}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg shadow-md font-semibold"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Code Section - Only shown after generation */}
            {generated && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-emerald-700 mb-4 border-b pb-2">
                  Implementation Code
                </h2>
                <div className="bg-gray-800 rounded-lg p-4 relative">
                  <button
                    onClick={copyToClipboard}
                    className="absolute top-3 right-3 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center"
                  >
                    {copied ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                        Copy Code
                      </>
                    )}
                  </button>
                  <pre className="text-emerald-400 text-sm overflow-auto max-h-60">
                    <code>{generatedScript}</code>
                  </pre>
                  <textarea
                    ref={textareaRef}
                    value={generatedScript}
                    readOnly
                    className="absolute opacity-0 -left-full"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Copy this code and paste it into your website's HTML before the closing body tag.
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Preview */}
          <div className="lg:w-1/2 p-6 bg-gray-50">
            <h2 className="text-lg font-semibold text-emerald-700 mb-4 border-b pb-2">
              Live Preview
            </h2>
            
            {generated ? (
              <div className="bg-white border border-emerald-200 rounded-xl shadow-inner p-4 h-[500px]">
                <iframe
                  title="Widget Preview"
                  srcDoc={`<!DOCTYPE html><html><body style="margin:0;padding:0;height:100%;">${generatedScript}</body></html>`}
                  className="w-full h-full rounded-md border-none"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            ) : (
              <div className="bg-white border border-emerald-200 rounded-xl shadow-inner p-4 h-[500px] flex flex-col items-center justify-center text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Preview Will Appear Here</h3>
                <p className="text-gray-500">Fill out the form and click "Generate Widget" to see a live preview of your chat widget.</p>
              </div>
            )}

            <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-emerald-800">
                    Preview Note
                  </h3>
                  <div className="mt-2 text-sm text-emerald-700">
                    <p>
                      This preview shows how your chat widget will appear on a website. Some interactive features may be limited in this preview mode.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetPlugin;