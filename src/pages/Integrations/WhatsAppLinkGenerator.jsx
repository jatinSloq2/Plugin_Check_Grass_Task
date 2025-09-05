import React, { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import { getShortLink } from '../../api/shortener';

const countryCodes = [
  { name: 'India', code: '+91' },
  { name: 'United States', code: '+1' },
  { name: 'United Kingdom', code: '+44' },
  { name: 'Australia', code: '+61' },
];

function WhatsAppLinkGenerator() {
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const qrRef = useRef(null);

  const encodeMessage = (msg) => encodeURIComponent(msg);

  const generateWhatsAppLink = async () => {
    if (!phoneNumber.trim()) {
      alert('Please enter a valid phone number.');
      return;
    }

    const fullNumber = countryCode + phoneNumber.replace(/\D/g, '');
    const message = encodeMessage(customMessage);
    const fullLink = `https://wa.me/${fullNumber}${message ? `?text=${message}` : ''}`;

    setLoading(true);
    try {
      const shortLink = await getShortLink(fullLink);
      setGeneratedLink(shortLink);
      setShowModal(true);
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  const downloadQRCode = () => {
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return alert('No QR code to download.');

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'whatsapp-qr-code.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.src = url;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="text-center py-16 bg-white">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Free WhatsApp link generator by AiGreenTick
        </h1>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto px-4">
          Drive users to WhatsApp in a click! Create FREE WhatsApp Links & WhatsApp QR Codes for your business in 3 simple steps, share it & boost your business growth.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Section - Form */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">WhatsApp Phone Number</h2>
              <p className="text-gray-600 text-sm mb-6">Select your country code & Type your WhatsApp phone number</p>
              
              <div className="flex gap-3">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                >
                  {countryCodes.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <div className="flex-1 flex">
                  <div className="px-3 py-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-sm text-gray-600 flex items-center">
                    {countryCode}
                  </div>
                  <input
                    type="tel"
                    placeholder="Your phone number goes in here"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
                Custom Message 😊
              </h2>
              <p className="text-gray-600 text-sm mb-6">Type your custom message with emojis & WhatsApp text formatting</p>
              
              <textarea
                placeholder="Add your customer message that user will send to you"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
              />
            </div>

            <button
              onClick={generateWhatsAppLink}
              disabled={loading}
              className={`w-full sm:w-auto px-8 py-3 text-white rounded-lg font-semibold shadow-lg transition-all duration-200 
                ${loading 
                  ? 'bg-green-300 cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-600 hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
            >
              {loading ? 'Generating...' : 'Generate Link'}
            </button>
          </div>

          {/* Right Section - Preview */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Message Preview</h2>
            
            <div className="bg-gray-100 rounded-2xl p-6 max-w-sm mx-auto">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* WhatsApp Header */}
                <div className="bg-green-600 text-white px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium text-sm">
                    {countryCode} {phoneNumber || 'Number'}
                  </span>
                </div>

                {/* Message Area */}
                <div className="h-64 bg-gray-50 p-4 overflow-y-auto">
                  {customMessage ? (
                    <div className="max-w-xs ml-auto">
                      <div className="bg-green-100 text-gray-800 p-3 rounded-lg text-sm">
                        {customMessage}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      Your message preview will appear here...
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="border-t border-gray-200 p-3 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type a message"
                    disabled
                    className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-400 bg-gray-50"
                  />
                  <button disabled className="text-green-600 p-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
            
            <h3 className="text-xl font-bold mb-4 text-center">Your WhatsApp Link</h3>
            
            <div className="mb-6">
              <a
                href={generatedLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 break-all hover:underline text-sm"
              >
                {generatedLink}
              </a>
            </div>

            <div className="flex flex-col items-center space-y-4" ref={qrRef}>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <QRCode value={generatedLink} size={200} />
              </div>
              
              <button
                onClick={downloadQRCode}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg font-semibold transition-colors"
              >
                Download QR Code
              </button>
              
              <p className="text-xs text-gray-500 text-center">
                Scan the QR code to open WhatsApp chat
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WhatsAppLinkGenerator;