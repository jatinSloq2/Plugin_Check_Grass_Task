const PhonePreview = ({ children }) => (
    <div className="relative w-[320px] h-[640px] mx-auto">
        {/* Phone Mockup */}
        <img
            src="https://mockuphone.com/images/devices_picture/apple-iphone13-blue-portrait.png"
            alt="phone"
            className="w-full h-full object-contain z-50"
        />

        {/* WhatsApp Screen Area */}
        <div className="absolute top-[10%] left-[11.5%] w-[76%] h-[80%] rounded-[1.5rem] overflow-hidden z-0
                    bg-[url('https://i.pinimg.com/564x/d2/a7/76/d2a77609f5d97b9081b117c8f699bd37.jpg')] 
                    bg-cover bg-center flex flex-col shadow-inner">
            {/* WhatsApp Header */}
            <div className="bg-green-600 text-white p-2 flex items-center gap-2">
                <img
                    src="https://i.pravatar.cc/40"
                    alt="contact"
                    className="w-8 h-8 rounded-full"
                />
                <div>
                    <p className="font-semibold text-sm">John Doe</p>
                    <p className="text-xs text-green-100">online</p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 ">
                {children}
            </div>
        </div>
    </div>
);

export default PhonePreview