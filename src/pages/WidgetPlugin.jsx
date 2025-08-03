import { useState } from "react";

const Home = () => {
  const [chatSettings, setChatSettings] = useState({
    backgroundColor: "#00e785",
    ctaText: "Chat with us",
    ctaIconAIGreenTick: false,
    position: "right",
  });

  const [brandSettings, setBrandSettings] = useState({
    brandName: "Ai Green Tick",
    brandImg: "http://localhost:5000/logo1.png",
    welcomeText: "Hi there!\nHow can I help you?",
    messageText: "Hello, I have a question about {{page_link}}",
    backgroundColor: "#fff",
    ctaText: "Chat with us",
    autoShow: false,
    phoneNumber: "",
    email: "",
  });

  const [scriptVisible, setScriptVisible] = useState(false);

  const handleChange = (e, section) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    section === "chat"
      ? setChatSettings({ ...chatSettings, [name]: newValue })
      : setBrandSettings({ ...brandSettings, [name]: newValue });
  };

  const generatedScript = `<script>
var url = 'http://localhost:3000/api/integration/public-widget.js';
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
    "phoneNumber": "${brandSettings.phoneNumber}"
  }
};
s.onload = function() {
  CreateWhatsappChatWidget(options);
};
var x = document.getElementsByTagName('script')[0];
x.parentNode.insertBefore(s, x);
</script>`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl border border-emerald-300 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-emerald-100 border-b border-emerald-300 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-emerald-900 tracking-tight">
            Chat Widget Generator
          </h1>
          <button className="text-gray-600 hover:text-red-600 text-2xl leading-none">
            ×
          </button>
        </div>

        {/* Chat Settings */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-emerald-700 mb-4 border-l-4 border-emerald-400 pl-3">
            Button Style
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1">
                Brand Color
              </label>
              <input
                type="color"
                name="backgroundColor"
                value={chatSettings.backgroundColor}
                onChange={(e) => handleChange(e, "chat")}
                className="w-full h-12 rounded-md border shadow-inner"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Chat Bubble Text
              </label>
              <input
                type="text"
                name="ctaText"
                maxLength="24"
                value={chatSettings.ctaText}
                onChange={(e) => handleChange(e, "chat")}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Position</label>
              <div className="flex items-center gap-8 mt-1">
                {["left", "right"].map((pos) => (
                  <label key={pos} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="position"
                      value={pos}
                      checked={chatSettings.position === pos}
                      onChange={(e) => handleChange(e, "chat")}
                    />
                    Bottom-{pos.charAt(0).toUpperCase() + pos.slice(1)}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Brand Settings */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-emerald-700 mb-4 border-l-4 border-emerald-400 pl-3">
            Chat Widget Settings
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                label: "Email ID",
                name: "email",
                type: "email",
                placeholder: "Email",
              },
              {
                label: "Phone Number with Country Code",
                name: "phoneNumber",
                placeholder: "e.g. 919000012345",
              },
              { label: "Brand Name", name: "brandName" },
              { label: "Brand Image URL", name: "brandImg" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium mb-1">
                  {field.label}
                </label>
                <input
                  type={field.type || "text"}
                  name={field.name}
                  placeholder={field.placeholder || ""}
                  value={brandSettings[field.name]}
                  onChange={(e) => handleChange(e, "brand")}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-400"
                  required={true}
                />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Pre-filled Message
              </label>

              <textarea
                name="messageText"
                value={brandSettings.messageText}
                onChange={(e) => handleChange(e, "brand")}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-400"
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
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded text-sm"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Welcome Text
              </label>
              <textarea
                name="welcomeText"
                maxLength="40"
                value={brandSettings.welcomeText}
                onChange={(e) => handleChange(e, "brand")}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <div className="md:col-span-2 flex items-center gap-6 mt-2">
              <span className="text-sm font-medium">
                Open widget by default:
              </span>
              {["true", "false"].map((val) => (
                <label key={val} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="autoShow"
                    value={val}
                    checked={brandSettings.autoShow === (val === "true")}
                    onChange={() =>
                      handleChange(
                        {
                          target: {
                            name: "autoShow",
                            value: val === "true",
                            type: "radio",
                          },
                        },
                        "brand"
                      )
                    }
                  />
                  {val.charAt(0).toUpperCase() + val.slice(1)}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Script Button */}
        <div className="p-6 text-center">
          <button
            onClick={() => setScriptVisible(!scriptVisible)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg shadow-md font-semibold"
          >
            {scriptVisible ? "Hide" : "Generate"} Widget Code
          </button>
        </div>
      </div>

      {/* Output */}
      {scriptVisible && (
        <div className="max-w-6xl mx-auto mt-8 bg-white p-6 rounded-xl shadow-lg border border-emerald-200">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Script Section */}
            <div className="w-full md:w-1/2">
              <label className="block font-semibold text-lg mb-2">
                Copy & Paste the Script:
              </label>
              <textarea
                readOnly
                rows="20"
                value={generatedScript}
                className="w-full font-mono bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm focus:outline-none resize-none"
              />
            </div>

            {/* Preview Section */}
            <div className="w-full md:w-1/2">
              <label className="block font-semibold text-lg mb-2">
                Live Preview:
              </label>
              <div className="bg-gray-50 border border-emerald-200 rounded-lg shadow-inner p-4 h-[400px]">
                <iframe
                  title="Widget Preview"
                  srcDoc={`<!DOCTYPE html><html><body style="margin:0;padding:0;">${generatedScript}</body></html>`}
                  className="w-full h-full rounded-md border-none"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
