import React, { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import { getShortLink } from '../api/shortener';

const countryCodes = [
  { name: 'India', code: '+91' },
  { name: 'United States', code: '+1' },
  { name: 'United Kingdom', code: '+44' },
  { name: 'Australia', code: '+61' },
  // Add more countries as needed
];

function WhatsAppLinkGenerator() {
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [loading, setLoading] = useState(false);

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
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  // Convert SVG to PNG and trigger download
  const downloadQRCode = () => {
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return alert('No QR code to download.');

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);

    // Create a canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = img.width * 2; // double size for better resolution
      canvas.height = img.height * 2;
      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      // Trigger download
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'whatsapp-qr-code.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.onerror = () => {
      alert('Failed to load SVG for download.');
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  return (
    <div className="max-w-5xl mx-auto my-10 font-sans flex flex-col md:flex-row gap-10 px-4">
      {/* Left Section */}
      <div className="flex-1">
        <h3 className="text-xl font-semibold mb-1">WhatsApp Phone Number</h3>
        <small className="text-gray-600">Select your country code &amp; type your WhatsApp phone number</small>

        <div className="flex gap-3 mt-2 mb-5">
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="p-2 text-sm border border-gray-300 rounded-md"
          >
            {countryCodes.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>

          <input
            type="tel"
            placeholder="Your phone number goes in here"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="flex-1 p-2 text-sm border border-gray-300 rounded-md"
          />
        </div>

        <h3 className="text-xl font-semibold mb-1">
          Custom Message <span role="img" aria-label="smile">😊</span>
        </h3>
        <small className="text-gray-600">Type your custom message with emojis &amp; WhatsApp text formatting</small>

        <textarea
          placeholder="Add your custom message that user will send to you"
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          rows={4}
          className="w-full p-2 text-sm border border-gray-300 rounded-md mt-2"
        />

        <button
          onClick={generateWhatsAppLink}
          disabled={loading}
          className={`mt-5 px-6 py-3 text-white rounded-md font-semibold transition-colors duration-300
            ${loading ? 'bg-green-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
        >
          {loading ? 'Generating...' : 'Generate Link'}
        </button>

        {generatedLink && (
          <div className="mt-8">
            <h4 className="text-lg font-semibold mb-2">Your WhatsApp Link:</h4>
            <a
              href={generatedLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 break-all hover:underline"
            >
              {generatedLink}
            </a>

            <div className="mt-6" ref={qrRef}>
              <QRCode value={generatedLink} size={180} />
            </div>
            <button
              onClick={downloadQRCode}
              className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Download QR Code
            </button>
            <p className="text-xs text-gray-500 mt-2">Scan the QR code to open WhatsApp chat</p>
          </div>
        )}
      </div>

      {/* Right Section - Message Preview */}
      <div className="w-full max-w-xs border border-gray-300 rounded-md overflow-hidden shadow-sm">
        <div className="bg-gray-100 px-4 py-3 flex items-center gap-3">
          <div className="bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-xl text-gray-700">👤</div>
          <span className="font-semibold">{countryCode} {phoneNumber || 'Your Number'}</span>
        </div>

        <div className="bg-yellow-100 px-4 py-4 min-h-[220px] whitespace-pre-wrap text-gray-800 text-base">
          {customMessage || 'Your message preview will appear here...'}
        </div>

        <div className="px-3 py-2 border-t border-gray-300 flex justify-end items-center gap-2">
          <input
            type="text"
            placeholder="Type a message"
            disabled
            className="flex-1 rounded-full border border-gray-300 px-3 py-1 text-sm text-gray-500 cursor-not-allowed"
          />
          <button disabled className="text-gray-600 text-xl cursor-default">
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

export default WhatsAppLinkGenerator;
