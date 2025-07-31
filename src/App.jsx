import React, { useEffect, useRef, useState } from "react";
import "./App.css";

const App = () => {
  const [chatSettings, setChatSettings] = useState({
    backgroundColor: "#00E785",
    ctaText: "Chat with us",
    borderRadius: "25",
    marginLeft: "20",
    marginRight: "20",
    marginBottom: "20",
    position: "right",
    ctaIconWATI: false,
    normalIconUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
    hoverIconUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
    mainText: "Got any questions?",
    subText: "We're here to help.",
  });

  const [brandSettings, setBrandSettings] = useState({
    brandName: "AI Green Tick",
    brandSubTitle: "Chat Support",
    brandImg: "https://aigreentick.com/assets/logo.png",
    welcomeText: "Hi there!\nHow can I help you?",
    messageText: "Hello, %0A I have a question about {{page_link}}",
    backgroundColor: "#00E785",
    ctaText: "Chat with us",
    borderRadius: "25",
    autoShow: false,
    phoneNumber: "919000012345",
    altText: "AI Green Tick Logo",
  });

  const [scriptVisible, setScriptVisible] = useState(false);
  const previewRef = useRef(null);

  const handleChange = (e, section) => {
    const { name, value } = e.target;
    section === "chat"
      ? setChatSettings({ ...chatSettings, [name]: value })
      : setBrandSettings({ ...brandSettings, [name]: value });
  };

  const generatedScript = `<script>
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.async = true;
  s.src = 'https://aigreentick.com/assets/whatsapp-chat-widget.js';

  var options = {
    enabled: true,
    chatButtonSetting: {
      backgroundColor: "${chatSettings.backgroundColor}",
      ctaText: "${chatSettings.ctaText}",
      borderRadius: "${chatSettings.borderRadius}",
      marginLeft: "${chatSettings.marginLeft}",
      marginRight: "${chatSettings.marginRight}",
      marginBottom: "${chatSettings.marginBottom}",
      position: "${chatSettings.position}",
      ctaIconWATI: ${chatSettings.ctaIconWATI},
      normalIconUrl: "${chatSettings.normalIconUrl}",
      hoverIconUrl: "${chatSettings.hoverIconUrl}",
      mainText: "${chatSettings.mainText}",
      subText: "${chatSettings.subText}"
    },
    brandSetting: {
      brandName: "${brandSettings.brandName}",
      brandSubTitle: "${brandSettings.brandSubTitle}",
      brandImg: "${brandSettings.brandImg}",
      welcomeText: \`${brandSettings.welcomeText}\`,
      messageText: \`${brandSettings.messageText}\`,
      backgroundColor: "${brandSettings.backgroundColor}",
      ctaText: "${brandSettings.ctaText}",
      borderRadius: "${brandSettings.borderRadius}",
      autoShow: ${brandSettings.autoShow},
      phoneNumber: "${brandSettings.phoneNumber}",
      altText: "${brandSettings.altText}"
    }
  };

  s.onload = function () {
    CreateWhatsappChatWidget(options);
  };

  var x = document.getElementsByTagName('script')[0];
  x.parentNode.insertBefore(s, x);
</script>`;

  useEffect(() => {
    if (scriptVisible && previewRef.current) {
      // Clear previous widget
      previewRef.current.innerHTML = "";
      const existingWidget = document.querySelector('#whatsapp-chat-widget');
      if (existingWidget) {
        existingWidget.remove();
      }

      try {
        CreateWhatsappChatWidget({
          enabled: true,
          chatButtonSetting: { ...chatSettings },
          brandSetting: { ...brandSettings },
        });
      } catch (error) {
        console.error("Error rendering widget preview:", error);
      }
    }
  }, [scriptVisible, chatSettings, brandSettings]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedScript);
    alert("✅ Script copied to clipboard!");
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
          <textarea readOnly value={generatedScript} rows={20} />
          <button className="copy-btn" onClick={copyToClipboard}>
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
};


var isWidgetCreated = false;

function existsElement(selector) {
    return new Promise((resolve) => {
        if (document.querySelector(selector)) {
            resolve(true);
            return;
        }

        const observer = new MutationObserver((mutations) => {
            const target = document.querySelector(selector);
            if (target) {
                observer.disconnect();
                resolve(true);
            } else {
                resolve(false);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
        });

        resolve(false);
    });
}

async function CreateWhatsappChatWidget(
    option = {
        brandSetting: {
            autoShow: true,
            backgroundColor: '#28a745',
            borderRadius: '25',
            brandImg: 'https://aigreentick.com/assets/logo.png',
            brandName: 'AI Green Tick',
            brandSubTitle: 'Empowering AI Messaging',
            ctaText: 'Start AI-Powered Chat',
            welcomeText: 'Hello 👋\nWelcome to AI Green Tick! How can we assist you today?',
            messageText: 'Hi! I’m interested in learning more about AI Green Tick’s solutions.',
            phoneNumber: '918123456789',
            altText: 'AI Green Tick Logo',
        },
        chatButtonSetting: {
            backgroundColor: '#28a745',
            borderRadius: '25',
            ctaText: 'Chat with AI Green Tick',
            ctaIconWATI: true,
            marginLeft: '20',
            marginRight: '20',
            marginBottom: '20',
            position: 'right',
            normalIconUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
            hoverIconUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
            mainText: 'Got any questions?',
            subText: 'We\'re here to help.',
        },
        enabled: true
    }
) {
    if (option.enabled === false) {
        return;
    }
    if (!option.chatButtonSetting.position) {
        option.chatButtonSetting.position = 'right';
        option.chatButtonSetting.marginBottom = '20';
        option.chatButtonSetting.marginLeft = '20';
        option.chatButtonSetting.marginRight = '20';
    }

    const defaultSvg = option.chatButtonSetting.ctaIconWATI
        ? `<svg id="wa-widget-svg" width="28" height="26" viewBox="0 0 28 26" fill="none" style="pointer-events: none; width: auto; height: auto; stroke: none; fill: none;"
          xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_152_73)">
              <path d="M8.12905 20.1329H16.3847L21.3186 25.0623V20.1329H23.4264C25.9412 20.1329 27.9979 18.0762 27.9979 15.5615V9.06899C27.9979 6.55426 25.9412 4.49756 23.4264 4.49756H8.12905C5.61432 4.49756 3.55762 6.55426 3.55762 9.06899V15.5615C3.55762 18.0762 5.61432 20.1329 8.12905 20.1329Z" fill="white"/>
              <path d="M18.6548 23.6548L13.3496 18.3541H5.46081C2.45025 18.3541 0 15.9038 0 12.8933V6.39856C0 3.38799 2.45025 0.937744 5.46081 0.937744H20.7582C23.7688 0.937744 26.219 3.38799 26.219 6.39856V12.8911C26.219 15.9016 23.7688 18.3519 20.7582 18.3519H18.6504V16.5731H20.7582C22.7882 16.5731 24.4402 14.9211 24.4402 12.8911V6.39856C24.4402 4.36854 22.7882 2.71651 20.7582 2.71651H5.46081C3.43079 2.71651 1.77877 4.36854 1.77877 6.39856V12.8911C1.77877 14.9211 3.43079 16.5731 5.46081 16.5731H14.0856L18.6704 21.1534L18.6548 23.6526V23.6548Z" fill="#1D1D1B"/>
          </g>
          <defs>
              <clipPath id="clip0_152_73">
                  <rect width="28" height="24.1245" fill="white" transform="translate(0 0.937744)"/>
              </clipPath>
          </defs>
      </svg>`
        : `<img id="wa-widget-svg" src="${option.chatButtonSetting.normalIconUrl}" alt="WhatsApp Icon" style="width: 28px; height: 28px; pointer-events: none;" />`;

    const hoverSvg = option.chatButtonSetting.ctaIconWATI
        ? `<svg id="wa-widget-opened-svg" width="23" height="13" viewBox="0 0 23 13" fill="none" style="pointer-events: none"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M2.20001 1.7334L11.6154 11.1488L21.0308 1.7334" stroke="#363636" stroke-width="2" stroke-linecap="square"/>
      </svg>`
        : `<img id="wa-widget-opened-svg" src="${option.chatButtonSetting.hoverIconUrl}" alt="WhatsApp Hover Icon" style="width: 23px; height: 13px; pointer-events: none;" />`;

    const widgetExists = await existsElement('#whatsapp-chat-widget');
    if (!widgetExists && !isWidgetCreated) {
        isWidgetCreated = true;
        initWidget();
    }

    function initWidget() {
        if (option.brandSetting.messageText) {
            option.brandSetting.messageText = option.brandSetting.messageText.replaceAll(
                '{{page_link}}',
                encodeURIComponent(window.location.href)
            );
            option.brandSetting.messageText = option.brandSetting.messageText.replaceAll(
                '__page_link__',
                encodeURIComponent(window.location.href)
            );
            option.brandSetting.messageText = option.brandSetting.messageText.replaceAll(
                '{{page_title}}',
                window.document.title
            );
            option.brandSetting.messageText = option.brandSetting.messageText.replaceAll(
                '__page_title__',
                window.document.title
            );
            option.brandSetting.messageText = option.brandSetting.messageText.replaceAll('\n', '%0A');
        }

        document.body.insertAdjacentHTML(
            'beforeend',
            `<div id="whatsapp-chat-widget">
                <div class="wa-widget-send-button">
                    ${defaultSvg}
                    ${hoverSvg}
                </div>
            </div>`
        );
        document.querySelector('#whatsapp-chat-widget')?.insertAdjacentHTML(
            'beforeend',
            `<div class='wa-chat-bubble'>
                <div class="wa-chat-bubble-close-button">
                    <svg width="12" height="13" viewBox="0 0 12 13" fill="none" style="pointer-events: none; display: block;"
                     xmlns="http://www.w3.org/2000/svg">
                     <path d="M3.6001 4.1001L8.4001 8.9001M3.6001 8.9001L8.4001 4.1001" stroke="white" stroke-width="1.33333"/>
                    </svg>
                </div>
                 <div class="wa-chat-bubble-text">
                     ${option.chatButtonSetting.mainText}<br/><span class="wa-chat-bubble-subtext">${option.chatButtonSetting.subText}</span>
                </div>
            </div>`
        );
        document.querySelector('#whatsapp-chat-widget')?.insertAdjacentHTML(
            'beforeend',
            `<div class='wa-chat-box'>
                 <img class='wa-chat-box-brand'
                    onError='this.src="https://aigreentick.com/assets/fallback-logo.png";' 
                    src='${option.brandSetting.brandImg}'
                    alt='${option.brandSetting.altText}'/> 
                 <div class='wa-chat-box-content-header'>
                     <h3>${option.brandSetting.brandName}</h3>
                     <p>${option.brandSetting.brandSubTitle}</p>
                 </div>
                 <div class='wa-chat-box-content-chat-welcome'>
                      ${option.brandSetting.welcomeText.replace(/\n/g, '<br/>')}
                 </div>
                 <a
                    rel="noopener noreferrer"
                    role="button"
                    target="_blank"
                    href="https://api.whatsapp.com/send?phone=${option.brandSetting.phoneNumber.replace(/\+/g, '')}&text=${option.brandSetting.messageText || ''}"
                    title="WhatsApp" class="wa-chat-box-content-send-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block">
                            <path
                                d="M20.4115 3.48832C18.3715 1.44747 15.6592 0.217606 12.7798 0.0277473C9.90046 -0.162111 7.0502 0.700979 4.75984 2.4563C2.46948 4.21162 0.895133 6.73951 0.329958 9.56926C-0.235217 12.399 0.247308 15.3377 1.68768 17.8382L0 24.0006L6.30648 22.347C8.05076 23.2969 10.0052 23.7946 11.9914 23.7947H11.9964C14.3489 23.7945 16.6486 23.0969 18.6047 21.7899C20.5609 20.483 22.0856 18.6255 22.9862 16.4522C23.8869 14.2788 24.123 11.8873 23.6647 9.57981C23.2064 7.27233 22.0743 5.15252 20.4115 3.48832ZM11.9964 21.7862H11.9926C10.2218 21.7863 8.48364 21.3103 6.96 20.4081L6.5988 20.194L2.856 21.1751L3.85512 17.5271L3.61968 17.1532C2.45438 15.2963 1.93921 13.1048 2.15515 10.9232C2.37109 8.74163 3.3059 6.69365 4.81262 5.10125C6.31934 3.50884 8.31253 2.4623 10.4789 2.12614C12.6452 1.78999 14.8618 2.18328 16.7802 3.2442C18.6987 4.30511 20.2102 5.97349 21.0771 7.98705C21.944 10.0006 22.1172 12.2452 21.5694 14.3679C21.0216 16.4906 19.784 18.3711 18.051 19.7138C16.318 21.0564 14.1879 21.7851 11.9957 21.7852L11.9964 21.7862Z"
                                fill="#E0E0E0" />
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M9.05653 6.84318C8.83645 6.35382 8.60461 6.34398 8.39533 6.33558C8.22397 6.32814 8.02789 6.32862 7.83229 6.32862C7.68338 6.33255 7.5369 6.36725 7.40205 6.43052C7.26719 6.4938 7.14689 6.58429 7.04869 6.6963C6.71644 7.01089 6.45337 7.39126 6.27627 7.81315C6.09917 8.23505 6.01191 8.68921 6.02005 9.1467C6.02005 10.5925 7.07317 11.9895 7.22005 12.1856C7.36693 12.3817 9.25285 15.4431 12.2394 16.6208C14.7215 17.5995 15.2267 17.4049 15.7655 17.3559C16.3043 17.3069 17.5038 16.6453 17.7489 15.9591C17.9939 15.2729 17.9937 14.6849 17.9202 14.5621C17.8468 14.4392 17.6509 14.3662 17.3569 14.2191C17.0629 14.072 15.6186 13.3611 15.3491 13.2632C15.0796 13.1653 14.8837 13.1163 14.6879 13.4105C14.4921 13.7048 13.9293 14.366 13.7577 14.5625C13.5861 14.7591 13.4147 14.7833 13.1209 14.6365C12.2547 14.2911 11.4552 13.7977 10.7581 13.1782C10.1157 12.5845 9.56482 11.8988 9.12349 11.1435C8.95213 10.8497 9.10501 10.6904 9.25261 10.5435C9.38461 10.412 9.54637 10.2005 9.69349 10.0289C9.81408 9.88041 9.91291 9.71548 9.98701 9.5391C10.0261 9.45807 10.0444 9.36855 10.0403 9.27866C10.0361 9.18877 10.0095 9.10134 9.96301 9.0243C9.88885 8.87718 9.31765 7.42422 9.05653 6.84318Z"
                                fill="white" />
                            <path
                                d="M20.314 3.44995C18.2979 1.43114 15.6165 0.214135 12.7696 0.0256927C9.92272 -0.16275 7.10439 0.690221 4.83975 2.42568C2.57511 4.16114 1.01862 6.66071 0.46029 9.45869C-0.0980434 12.2567 0.37986 15.1622 1.80496 17.6339L0.136719 23.7268L6.37072 22.0922C8.09496 23.0312 10.027 23.5232 11.9903 23.5233H11.9954C14.3211 23.5235 16.5946 22.834 18.5285 21.5422C20.4624 20.2503 21.9699 18.414 22.8603 16.2655C23.7506 14.117 23.984 11.7527 23.5307 9.47156C23.0775 7.19043 21.9581 5.09491 20.314 3.44995ZM11.9954 21.5378H11.9927C10.2423 21.5379 8.52396 21.0674 7.01776 20.1755L6.66064 19.9639L2.96032 20.9337L3.94792 17.327L3.71536 16.9574C2.56347 15.1217 2.05427 12.9553 2.2678 10.7987C2.48133 8.64215 3.40549 6.61767 4.89499 5.04356C6.3845 3.46944 8.35488 2.43495 10.4964 2.1027C12.6379 1.77046 14.8291 2.15931 16.7255 3.20812C18.622 4.25693 20.1161 5.90623 20.973 7.89674C21.83 9.88725 22.0011 12.1061 21.4596 14.2045C20.918 16.3029 19.6945 18.1618 17.9813 19.489C16.2682 20.8162 14.1625 21.5365 11.9954 21.5366V21.5378Z"
                                fill="white" />
                        </svg>
                        <span class="wa-chat-box-content-send-btn-text">${option.brandSetting.ctaText}</span>
                        <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-left: auto; display: block;">
                          <path d="M1 1L7 7L1 13" stroke="white" stroke-width="2" stroke-linecap="round" />
                        </svg>
                  </a>
                <div class='wa-chat-box-poweredby'>
                    <svg width="8" height="15" viewBox="0 0 8 15" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block">
                      <path d="M3 15V9H0L5 0V6H8L3 15Z" fill="#999999" />
                    </svg>
                    Powered by <a rel="noopener noreferrer" href="https://aigreentick.com" target="_blank" class="wa-chat-box-poweredby-link">AI Green Tick</a>
                </div>
            </div>
            `
        );

        if (option.brandSetting.autoShow) {
            document.querySelector('.wa-chat-box').classList.add('wa-chat-box-visible');
            document.querySelector('#wa-widget-svg').style.display = 'none';
            document.querySelector('#wa-widget-opened-svg').style.display = 'block';
            document.querySelector('.wa-chat-bubble').style.display = 'none';
            document
                .querySelector('.wa-widget-send-button')
                .classList.add('wa-widget-send-button-clicked');
        } else {
            document.querySelector('.wa-chat-box').classList.remove('wa-chat-box-visible');
            document.querySelector('#wa-widget-svg').style.display = 'block';
            document.querySelector('#wa-widget-opened-svg').style.display = 'none';
            document.querySelector('.wa-chat-bubble').style.cssText = '';
        }

        document.querySelector('#whatsapp-chat-widget').addEventListener('click', function (event) {
            if (
                event.target.classList.contains('wa-widget-send-button') &&
                event.target.classList.contains('wa-widget-send-button-clicked')
            ) {
                document.querySelector('.wa-chat-box').classList.remove('wa-chat-box-visible');
                document.querySelector('#wa-widget-svg').style.display = 'block';
                document.querySelector('#wa-widget-opened-svg').style.display = 'none';
                document.querySelector('.wa-chat-bubble').style.cssText = '';
                document.querySelector('.wa-widget-send-button').className = 'wa-widget-send-button';
            } else if (
                (event.target.classList.contains('wa-widget-send-button') &&
                    !event.target.classList.contains('wa-widget-send-button-clicked')) ||
                event.target.classList.contains('wa-chat-bubble-text')
            ) {
                document.querySelector('.wa-chat-box').classList.add('wa-chat-box-visible');
                document.querySelector('#wa-widget-svg').style.display = 'none';
                document.querySelector('#wa-widget-opened-svg').style.display = 'block';
                document.querySelector('.wa-chat-bubble').style.display = 'none';
                document
                    .querySelector('.wa-widget-send-button')
                    .classList.add('wa-widget-send-button-clicked');
            }
            if (event.target.classList.contains('wa-chat-bubble-close-button')) {
                document.querySelector('.wa-chat-bubble').classList.add('wa-chat-bubble-closed');
            }
        });

        window.onload = function () {
            setTimeout(function () {
                document.querySelector('.wa-chat-box').classList.add('wa-chat-box-transition');
            }, 100);
        };
    }

    var styles = `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400&display=swap');

        #whatsapp-chat-widget {
            display: ${option.enabled ? 'block' : 'none'};
        }
        .wa-chat-box-content-send-btn-text {
            font-family: 'Outfit', sans-serif !important;
            font-weight: 500;
            font-size: 16px;
            line-height: 20px;
            color: #FFFFFF !important;
        }
        .wa-chat-box-content-send-btn {
            background-color: ${option.brandSetting.backgroundColor} !important;
            box-shadow: 4px 4px 0px ${darkenColor(option.brandSetting.backgroundColor, 20)} !important;
            border-radius: 8px;
            text-decoration: none;
            cursor: pointer;
            position: relative;
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 16px 20px;
            border: none;
            overflow: hidden;
            opacity: 1 !important;
        }
        .wa-chat-box-content-header h3 {
            font-family: 'Outfit', sans-serif !important;
            font-size: 18px;
            font-weight: 600;
            margin: 0;
            color: #000000;
        }
        .wa-chat-box-content-header p {
            font-family: 'Outfit', sans-serif !important;
            font-size: 14px;
            margin: 4px 0 0;
            color: #666666;
        }
        .wa-chat-box-content-chat-welcome {        
            font-family: 'Outfit', sans-serif !important;
            font-size: 16px;
            line-height: 150%;
            color: #000000;
        }
        .wa-chat-box-brand {
            width: 52px;
            height: 52px;
            border: 1px solid #363636;
            box-shadow: 0px 2px 240px rgba(0, 0, 0, 0.04);
            border-radius: 100px;
            background-color: ${option.brandSetting.backgroundColor};
            object-fit: contain;
        }
        .wa-chat-box {
            background-color: white;
            z-index: 16000160 !important;
            margin-bottom: 92px;
            min-width: 320px;
            max-width: 360px;
            position: fixed !important;
            bottom: ${option.chatButtonSetting.marginBottom}px !important;
            ${option.chatButtonSetting.position === 'left'
            ? `left: ${option.chatButtonSetting.marginLeft}px`
            : `right: ${option.chatButtonSetting.marginRight}px`
        };
            border-radius: 32px;
            border: 2px solid #363636;
            box-shadow: 4px 6px 0px ${darkenColor(option.brandSetting.backgroundColor, 20)};
            padding: 32px 32px 16px;
            min-height: 279px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            gap: 12px;
            pointer-events: none;
            opacity: 0;
            scale: 0;
            transform-origin: ${option.chatButtonSetting.position === 'left' ? 'left' : 'right'} bottom;
        }
        .wa-chat-box-visible {
            pointer-events: auto;
            opacity: 1;
            scale: 1;
        }
        .wa-chat-box-transition {
            transition: scale 150ms ease-in, opacity 250ms ease-in;
        }
        .wa-widget-send-button {
            margin: 0 0 ${option.chatButtonSetting.marginBottom}px 0 !important;
            position: fixed !important;
            z-index: 16000160 !important;
            bottom: 0 !important;
            text-align: center !important;
            width: 52px;
            height: 52px;
            min-width: 52px;
            border: ${option.chatButtonSetting.ctaIconWATI ? '1px' : '0'} solid #363636;
            border-radius: 100px;
            visibility: visible;
            transition: none !important;
            background-color: ${option.chatButtonSetting.backgroundColor};
            box-shadow: 4px 5px 10px rgba(0, 0, 0, 0.4);
            ${option.chatButtonSetting.position === 'left'
            ? `left: ${option.chatButtonSetting.marginLeft}px`
            : `right: ${option.chatButtonSetting.marginRight}px`
        };
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
        .wa-widget-send-button:hover #wa-widget-svg {
            display: none;
        }
        .wa-widget-send-button:hover #wa-widget-opened-svg {
            display: block;
        }
        .wa-widget-send-button-clicked {
            border: 1px solid #363636;
        }
        .wa-chat-box-poweredby {
            margin-left: auto;
            margin-right: auto;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 3px;
            font-family: 'Outfit', sans-serif !important;
            font-size: 12px;
            line-height: 18px;
            color: #999999;
        }
        .wa-chat-box-poweredby-link {
            font-weight: 600;
            color: ${option.brandSetting.backgroundColor} !important;
            text-decoration: none !important;
        }
        .wa-chat-box-poweredby-link:hover {
            color: ${darkenColor(option.brandSetting.backgroundColor, 20)} !important;
            text-decoration: none !important;
        }
        .wa-chat-bubble {
            display: ${option.chatButtonSetting.ctaText ? 'flex' : 'none'};
            align-items: center;
            gap: 8px;
            z-index: 16000160 !important;
            position: fixed !important;
            margin-bottom: 63px;
            bottom: ${option.chatButtonSetting.marginBottom}px !important;
            ${option.chatButtonSetting.position === 'left'
            ? `left: ${option.chatButtonSetting.marginLeft}px`
            : `right: ${option.chatButtonSetting.marginRight}px`
        };
        }
        .wa-chat-bubble-closed {
            display: none;
        }
        .wa-chat-bubble-close-button {
            height: 20px;
            min-width: 20px;
            background: ${option.chatButtonSetting.backgroundColor};
            border-radius: 24px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            order: ${option.chatButtonSetting.position === 'left' ? '0' : '1'};
        }
        .wa-chat-bubble-text {
            font-family: 'Outfit', sans-serif !important;
            background: #FFFFFF;
            border: 1px solid #363636;
            box-shadow: 2px 3px 0px ${darkenColor(option.brandSetting.backgroundColor, 20)};
            border-radius: 24px;
            padding: 8px 16px;
            font-weight: 500;
            font-size: 14px;
            line-height: 150%;
            color: #202020;
            cursor: pointer;
        }
        .wa-chat-bubble-subtext {
            font-size: 12px;
            color: #666666;
        }
        .wa-chat-box::before {
            content: '';
            position: absolute;
            top: 100%;
            ${option.chatButtonSetting.position === 'left' ? 'left' : 'right'}: 29px;
            width: 0;
            height: 0;
            border-width: 0 0px 30px 30px;
            border-color: transparent transparent white transparent;
            border-style: solid;
            transform: rotate(${option.chatButtonSetting.position === 'left' ? '180' : '270'}deg);
            z-index: 1;
        }
        .wa-chat-box::after {
            content: '';
            position: absolute;
            top: 100%;
            ${option.chatButtonSetting.position === 'left' ? 'left' : 'right'}: 27px;
            width: 0;
            height: 0;
            border-width: 0px 0px 34px 34px;
            border-color: transparent transparent black transparent;
            border-style: solid;
            border-radius: 2px;
            filter: drop-shadow(${option.chatButtonSetting.position === 'left' ? '-5px -2px 0px' : '-2px 5px 0px'} ${darkenColor(option.brandSetting.backgroundColor, 20)});
            transform: rotate(${option.chatButtonSetting.position === 'left' ? '180' : '270'}deg);
        }
        @media only screen and (max-width: 600px) {
            .wa-chat-box {
                box-sizing: border-box;
                min-width: 0;
                max-width: 90%;
                width: 320px;
                position: fixed !important;
                ${option.chatButtonSetting.position === 'left'
            ? `left: ${option.chatButtonSetting.marginLeft}px !important`
            : `right: ${option.chatButtonSetting.marginRight}px !important`
        };
            }
            .wa-widget-send-button {
                width: 52px !important;
                height: 52px !important;
                min-width: 52px !important;
                ${option.chatButtonSetting.position === 'left'
            ? `left: ${option.chatButtonSetting.marginLeft}px !important`
            : `right: ${option.chatButtonSetting.marginRight}px !important`
        };
            }
        }
    `;

    // Helper function to darken color for shadows
    function darkenColor(hex, percent) {
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);
        r = Math.max(0, Math.floor(r * (1 - percent / 100)));
        g = Math.max(0, Math.floor(g * (1 - percent / 100)));
        b = Math.max(0, Math.floor(b * (1 - percent / 100)));
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    }

    var styleSheet = document.createElement('style');
    styleSheet.innerText = styles;
    document.getElementsByTagName('head')[0].appendChild(styleSheet);
}

export default App;