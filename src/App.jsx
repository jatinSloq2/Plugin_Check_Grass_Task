import React, { useEffect, useRef, useState } from "react";
import "./App.css";

const App = () => {
  const [chatSettings, setChatSettings] = useState({
    backgroundColor: "#00E785",
    ctaText: "Chat with us",
    borderRadius: "25",
    marginLeft: "0",
    marginRight: "20",
    marginBottom: "20",
    position: "right",
    ctaIconWATI: false,
    normalIconUrl:
      "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
    hoverIconUrl:
      "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
    mainText: "Got any questions?",
    subText: "We're here to help.",
  });

  const [brandSettings, setBrandSettings] = useState({
    brandName: "AI Green Tick",
    brandSubTitle: "Chat Support",
    brandImg: "https://your-aigreen-url.com/logo.svg",
    welcomeText: "Hi there!\nHow can I help you?",
    messageText: "Hello, %0A I have a question about {{page_link}}",
    backgroundColor: "#00E785",
    ctaText: "Chat with us",
    borderRadius: "25",
    autoShow: false,
    phoneNumber: "919000012345",
  });

  const [scriptVisible, setScriptVisible] = useState(false);

  const handleChange = (e, section) => {
    const { name, value } = e.target;
    section === "chat"
      ? setChatSettings({ ...chatSettings, [name]: value })
      : setBrandSettings({ ...brandSettings, [name]: value });
  };
  const generatedScript = `
<div id="whatsapp-widget" style="position: fixed; bottom: ${
    chatSettings.marginBottom
  }px; ${
    chatSettings.position === "right"
      ? `right: ${chatSettings.marginRight}px;`
      : `left: ${chatSettings.marginLeft}px;`
  } z-index: 9999;">
  <div id="widget-container" style="position: relative;">
    <div id="widget-icon" style="width: 70px; height: 70px; background: linear-gradient(135deg, ${
      chatSettings.backgroundColor
    }, #00b761); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.3s ease, box-shadow 0.3s ease; z-index: 10001; box-shadow: 0 8px 25px rgba(0, 231, 133, 0.5);">
      <img src="${
        chatSettings.normalIconUrl
      }" alt="Chat Icon" style="width: 40px; height: 40px;" />
    </div>
    <div id="widget-content" style="display: none; background: #ffffff; padding: 20px; border: 4px solid ${
      chatSettings.backgroundColor
    }; border-radius: 15px; box-shadow: 0 12px 35px rgba(0, 0, 0, 0.25); position: absolute; bottom: 90px; right: 0; flex-direction: column; align-items: flex-start; gap: 15px; transition: opacity 0.4s ease, transform 0.4s ease; opacity: 0; transform: translateY(20px); z-index: 10000; width: 300px; min-height: 180px; background: linear-gradient(135deg, #ffffff, #f9f9f9);">
      <div style="background: linear-gradient(135deg, ${
        chatSettings.backgroundColor
      }, #00b761); width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0, 231, 133, 0.3); margin-bottom: 10px;">
        <img src="${brandSettings.brandImg}" alt="${
    brandSettings.brandName
  }" style="width: 30px; height: 30px; border-radius: 50%;" />
      </div>
      <div style="display: flex; flex-direction: column; gap: 5px; padding: 0 10px;">
        <strong style="font-size: 18px; color: #1a1a1a; font-weight: 700; line-height: 1.2;">${
          chatSettings.mainText
        }</strong>
        <span style="font-size: 16px; color: #555; line-height: 1.4;">${
          chatSettings.subText
        }</span>
      </div>
      <button id="chat-button" style="
        background: linear-gradient(135deg, ${
          chatSettings.backgroundColor
        }, #00b761);
        border: none;
        border-radius: 8px;
        padding: 12px 24px;
        color: white;
        font-size: 16px;
        font-weight: 600;
        width: 100%;
        text-align: center;
        cursor: pointer;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        margin-top: auto;
      ">
        <img src="${
          chatSettings.normalIconUrl
        }" alt="Chat" style="width: 18px; height: 18px; margin-right: 8px; vertical-align: middle;" />
        ${chatSettings.ctaText}
        <span style="margin-left: 8px; vertical-align: middle;">▶</span>
      </button>
      <div style="position: absolute; bottom: -15px; right: 30px; width: 0; height: 0; border-left: 15px solid transparent; border-right: 15px solid transparent; border-top: 15px solid ${
        chatSettings.backgroundColor
      }; box-shadow: 0 -2px 10px rgba(0, 231, 133, 0.2);"></div>
    </div>
  </div>

  <script>
    (function () {
      const widgetIcon = document.getElementById('widget-icon');
      const widgetContent = document.getElementById('widget-content');
      const chatButton = document.getElementById('chat-button');
      const widgetContainer = document.getElementById('widget-container');
      const chatWidgetOptions = {
        brandName: "${brandSettings.brandName}",
        welcomeText: "${brandSettings.welcomeText
          .replace(/`/g, "\\`")
          .replace(/\n/g, "\\n")}",
        phoneNumber: "${brandSettings.phoneNumber}",
        messageText: "${brandSettings.messageText
          .replace(/`/g, "\\`")
          .replace(/{{page_link}}/g, '"+window.location.href+"')
          .replace(/\n/g, "\\n")}"
      };

      let timeoutId;

      widgetIcon.addEventListener('mouseover', function () {
        clearTimeout(timeoutId); // Clear any existing timeout
        widgetContent.style.display = 'flex';
        setTimeout(() => {
          widgetContent.style.opacity = '1';
          widgetContent.style.transform = 'translateY(0)';
        }, 10);
        widgetIcon.style.transform = 'scale(1.15)';
        widgetIcon.style.boxShadow = '0 10px 30px rgba(0, 231, 133, 0.7)';
      });

      widgetContent.addEventListener('mouseover', function () {
        clearTimeout(timeoutId); // Keep widget open while hovering over content
        widgetContent.style.opacity = '1';
        widgetContent.style.transform = 'translateY(0)';
      });

      // Close widget with a delay when leaving the container
      widgetContainer.addEventListener('mouseleave', function () {
        timeoutId = setTimeout(() => {
          widgetContent.style.opacity = '0';
          widgetContent.style.transform = 'translateY(20px)';
          setTimeout(() => {
            widgetContent.style.display = 'none';
          }, 400);
          widgetIcon.style.transform = 'scale(1)';
          widgetIcon.style.boxShadow = '0 8px 25px rgba(0, 231, 133, 0.5)';
        }, 100); // Small delay to allow smooth transition to content
      });

      chatButton.addEventListener('click', function () {
        var msg = encodeURIComponent(chatWidgetOptions.messageText);
        var phone = chatWidgetOptions.phoneNumber.replace(/\\D/g, "");
        var waURL = "https://wa.me/" + phone + "?text=" + msg;
        window.open(waURL, "_blank");
      });

      chatButton.addEventListener('mouseover', function () {
        chatButton.style.transform = 'translateY(-3px)';
        chatButton.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.4)';
      });

      chatButton.addEventListener('mouseout', function () {
        chatButton.style.transform = 'translateY(0)';
        chatButton.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.35)';
      });
    })();
  </script>
</div>
`;

  const previewRef = useRef(null);

  useEffect(() => {
    if (scriptVisible && previewRef.current) {
      const htmlOnly = generatedScript.replace(
        /<script[\s\S]*?<\/script>/g,
        ""
      );
      previewRef.current.innerHTML = htmlOnly;

      const scriptMatch = generatedScript.match(/<script>([\s\S]*?)<\/script>/);
      if (scriptMatch && scriptMatch[1]) {
        const scriptContent = scriptMatch[1];
        const script = document.createElement("script");
        script.innerHTML = scriptContent;
        previewRef.current.appendChild(script);
      }
    }
  }, [scriptVisible, generatedScript]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedScript);
    alert("Script copied to clipboard!");
  };

  return (
    <div className="container">
      <h1 className="main-title">AI Green Tick Chat Widget Generator</h1>

      <div className="box">
        <h2>Button Style</h2>
        <div className="form-group">
          <label>Brand Color:</label>
          <input
            type="color"
            name="backgroundColor"
            value={chatSettings.backgroundColor}
            onChange={(e) => handleChange(e, "chat")}
          />
        </div>
        <div className="form-group">
          <label>Chat Bubble Text:</label>
          <input
            type="text"
            name="ctaText"
            maxLength="24"
            value={chatSettings.ctaText}
            onChange={(e) => handleChange(e, "chat")}
          />
        </div>
        <div className="form-group">
          <label>Position:</label>
          <select
            name="position"
            value={chatSettings.position}
            onChange={(e) => handleChange(e, "chat")}
          >
            <option value="left">Bottom-Left</option>
            <option value="right">Bottom-Right</option>
          </select>
        </div>
        <div className="form-group">
          <label>Main Text:</label>
          <input
            type="text"
            name="mainText"
            value={chatSettings.mainText}
            onChange={(e) => handleChange(e, "chat")}
          />
        </div>
        <div className="form-group">
          <label>Sub Text:</label>
          <input
            type="text"
            name="subText"
            value={chatSettings.subText}
            onChange={(e) => handleChange(e, "chat")}
          />
        </div>
        <div className="form-group">
          <label>Normal Icon URL:</label>
          <input
            type="text"
            name="normalIconUrl"
            value={chatSettings.normalIconUrl}
            onChange={(e) => handleChange(e, "chat")}
          />
        </div>
        <div className="form-group">
          <label>Hover Icon URL:</label>
          <input
            type="text"
            name="hoverIconUrl"
            value={chatSettings.hoverIconUrl}
            onChange={(e) => handleChange(e, "chat")}
          />
        </div>
      </div>

      <div className="box">
        <h2>Chat Widget Settings</h2>
        <div className="form-group">
          <label>Brand Name:</label>
          <input
            type="text"
            name="brandName"
            value={brandSettings.brandName}
            onChange={(e) => handleChange(e, "brand")}
          />
        </div>
        <div className="form-group">
          <label>Brand Subtitle:</label>
          <input
            type="text"
            name="brandSubTitle"
            value={brandSettings.brandSubTitle}
            onChange={(e) => handleChange(e, "brand")}
          />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="text"
            name="phoneNumber"
            value={brandSettings.phoneNumber}
            onChange={(e) => handleChange(e, "brand")}
          />
        </div>
        <div className="form-group">
          <label>Welcome Text:</label>
          <textarea
            name="welcomeText"
            value={brandSettings.welcomeText}
            onChange={(e) => handleChange(e, "brand")}
          />
        </div>
        <div className="form-group">
          <label>Message Text:</label>
          <textarea
            name="messageText"
            value={brandSettings.messageText}
            onChange={(e) => handleChange(e, "brand")}
          />
        </div>
        <div className="form-group">
          <label>Brand Image URL:</label>
          <input
            type="text"
            name="brandImg"
            value={brandSettings.brandImg}
            onChange={(e) => handleChange(e, "brand")}
          />
        </div>
      </div>

      <button className="generate-btn" onClick={() => setScriptVisible(true)}>
        Generate Widget Code
      </button>

      <h2>Live Preview</h2>
      <div ref={previewRef}></div>

      {scriptVisible && (
        <div className="script-box">
          <h2>Generated Widget Code</h2>
          <textarea readOnly value={generatedScript} />
          <button className="copy-btn" onClick={copyToClipboard}>
            Copy
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
