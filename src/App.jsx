import { useState } from "react";
import "./App.css";

const App = () => {
  const [chatSettings, setChatSettings] = useState({
    backgroundColor: "#00e785",
    ctaText: "Chat with us",
    ctaIconWATI: false,
    position: "right",
  });

  const [brandSettings, setBrandSettings] = useState({
    brandName: "Ai Green Tick",
    brandImg: "https://www.wati.io/wp-content/uploads/2023/04/Wati-logo.svg",
    welcomeText: "Hi there!\nHow can I help you?",
    messageText: "Hello, I have a question about {{page_link}}",
    backgroundColor: "#fff",
    ctaText: "Chat with us",
    autoShow: false,
    phoneNumber: "919000012345",
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
var url = 'https://aigreentick.com/script.js';
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
    "ctaIconWATI": ${chatSettings.ctaIconWATI},
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
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden border border-emerald-300">
        {/* Header */}
        <div className="p-4 border-b border-emerald-300 flex justify-between items-center bg-emerald-100">
          <h1 className="text-xl font-semibold text-emerald-900">
            Chat Widget Generator
          </h1>
          <button className="text-gray-700 hover:text-red-500 font-bold text-xl">
            ×
          </button>
        </div>

        {/* Chat Settings */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-semibold mb-4 text-gray-700">
            Button Style:{" "}
            <span className="font-normal text-sm">
              All possible & attractive button designs.
            </span>
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 font-medium">
                Brand Color
              </label>
              <input
                type="color"
                name="backgroundColor"
                value={chatSettings.backgroundColor}
                onChange={(e) => handleChange(e, "chat")}
                className="w-full h-12 rounded-md border"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium">
                Chat Bubble Text (max 24 chars)
              </label>
              <input
                type="text"
                name="ctaText"
                maxLength="24"
                value={chatSettings.ctaText}
                onChange={(e) => handleChange(e, "chat")}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm mb-1 font-medium">Position</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="position"
                    value="left"
                    checked={chatSettings.position === "left"}
                    onChange={(e) => handleChange(e, "chat")}
                  />
                  Bottom-Left
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="position"
                    value="right"
                    checked={chatSettings.position === "right"}
                    onChange={(e) => handleChange(e, "chat")}
                  />
                  Bottom-Right
                </label>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm mb-1 font-medium">
                Select CTA Icon
              </label>
              <div className="flex gap-4 mt-2">
                <label
                  className={`cursor-pointer border rounded p-2 flex items-center gap-2 ${
                    !chatSettings.ctaIconWATI
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="ctaIconWATI"
                    value={true}
                    checked={!chatSettings.ctaIconWATI}
                    onChange={() =>
                      setChatSettings({ ...chatSettings, ctaIconWATI: true })
                    }
                    className="hidden"
                  />
                  <img
                    src="http://localhost:5000/logo1.png"
                    alt="AIGreenTick Logo"
                    className="w-6 h-6"
                  />
                  <span className="text-sm">AIGreenTick</span>
                </label>

                <label
                  className={`cursor-pointer border rounded p-2 flex items-center gap-2 ${
                    chatSettings.ctaIconWATI
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="ctaIconWATI"
                    value={false}
                    checked={chatSettings.ctaIconWATI}
                    onChange={() =>
                      setChatSettings({ ...chatSettings, ctaIconWATI: false })
                    }
                    className="hidden"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                    alt="WhatsApp Icon"
                    className="w-6 h-6"
                  />
                  <span className="text-sm">WhatsApp</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Settings */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-semibold mb-4 text-gray-700">
            Chat Widget Settings
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 font-medium">
                Share your Email ID
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={brandSettings.email}
                onChange={(e) => handleChange(e, "brand")}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium">
                Phone Number with Country Code
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={brandSettings.phoneNumber}
                onChange={(e) => handleChange(e, "brand")}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium">
                Brand Name
              </label>
              <input
                type="text"
                name="brandName"
                value={brandSettings.brandName}
                onChange={(e) => handleChange(e, "brand")}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium">
                Pre-filled message (Optional)
              </label>
              <textarea
                name="messageText"
                value={brandSettings.messageText}
                onChange={(e) => handleChange(e, "brand")}
                className="w-full p-2 border rounded"
              />
              <div className="flex mt-2 gap-2">
                <button className="bg-emerald-500 text-white px-2 py-1 rounded text-sm">
                  Page Link
                </button>
                <button className="bg-emerald-500 text-white px-2 py-1 rounded text-sm">
                  Page Title
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium">
                Welcome Text (max 40 chars)
              </label>
              <textarea
                name="welcomeText"
                maxLength="40"
                value={brandSettings.welcomeText}
                onChange={(e) => handleChange(e, "brand")}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium">
                Brand Image URL
              </label>
              <input
                type="text"
                name="brandImg"
                value={brandSettings.brandImg}
                onChange={(e) => handleChange(e, "brand")}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="col-span-2 flex gap-6 items-center mt-2">
              <label className="block text-sm font-medium">
                Open widget by default
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="autoShow"
                  value={true}
                  checked={brandSettings.autoShow === true}
                  onChange={(e) =>
                    handleChange(
                      {
                        target: {
                          name: "autoShow",
                          value: true,
                          type: "radio",
                        },
                      },
                      "brand"
                    )
                  }
                />
                True
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="autoShow"
                  value={false}
                  checked={brandSettings.autoShow === false}
                  onChange={(e) =>
                    handleChange(
                      {
                        target: {
                          name: "autoShow",
                          value: false,
                          type: "radio",
                        },
                      },
                      "brand"
                    )
                  }
                />
                False
              </label>
            </div>
          </div>
        </div>

        {/* Generate Script */}
        <div className="p-6 text-center">
          <button
            onClick={() => setScriptVisible(!scriptVisible)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded shadow"
          >
            Generate Widget Code
          </button>
        </div>
      </div>

      {/* Script Output */}
      {scriptVisible && (
        <div className="max-w-4xl mx-auto mt-6 bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <label className="block font-semibold text-lg mb-2">
            Copy & Paste the Script:
          </label>
          <textarea
            readOnly
            rows="20"
            value={generatedScript}
            className="w-full font-mono bg-gray-50 border rounded p-3 text-sm"
          />
        </div>
      )}
    </div>
  );
};

export default App;
