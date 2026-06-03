import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import eventImage from "../../../assets/images/circket-banner.png";
import scannerImage from "../../../assets/images/scanner-img.jpeg";

export default function PopupFlow() {
  const [showEvent, setShowEvent] = useState(false);
  const [showDonation, setShowDonation] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // ✅ Check karo kya popup already is session mein dikhaya ja chuka hai
    const alreadyShown = sessionStorage.getItem("donationPopupShown");

    if (alreadyShown) return; // agar pehle dikh chuka hai toh mat dikhao

    const donationTimer = setTimeout(() => {
      setShowDonation(true);
      setAnimate(false);
      setTimeout(() => setAnimate(true), 50);

      // ✅ Mark kar do ki popup show ho gaya is session mein
      sessionStorage.setItem("donationPopupShown", "true");
    }, 5000);

    return () => clearTimeout(donationTimer);
  }, []);

  const handleCloseEvent = () => {
    setShowEvent(false);
    setAnimate(false);
    setTimeout(() => {
      setShowDonation(true);
      setTimeout(() => setAnimate(true), 50);
    }, 8000);
  };

  const popupStyle = {
    transform: animate ? "scale(1)" : "scale(0.7)",
    opacity: animate ? 1 : 0,
    transition: "all 0.4s ease",
  };

  return (
    <>
      {/* EVENT POPUP - Currently Disabled */}
      {showEvent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-1000">
          <div style={popupStyle} className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-3">
            <button onClick={handleCloseEvent} className="top-3 right-3 text-gray-600 hover:text-red-500">
              <FaTimes size={18} />
            </button>
            <img src={eventImage} alt="Event" className="rounded-xl w-full object-cover" />
          </div>
        </div>
      )}

      {/* DONATION POPUP */}
      {showDonation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-500 px-3 sm:px-4">
          <div style={popupStyle} className="relative bg-[#e6f0ee] rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden min-h-[380px] md:min-h-[420px]">
            
            {/* LEFT CONTENT */}
            <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col justify-center">
              <p className="text-[10px] sm:text-xs tracking-widest text-gray-500 mb-2 sm:mb-3">
                SUPPORT OUR CAUSE
              </p>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                Help Players Achieve Their Dreams 💚
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">
                Your contribution helps us provide better training, equipment, and opportunities for talented players.
              </p>
              <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6">
                Every donation makes a real impact in shaping the future of athletes.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <a
                  href="/donate-now"
                  className="bg-black text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg text-xs sm:text-sm font-semibold hover:bg-gray-800 transition text-center"
                >
                  Donate Now
                </a>
                <button
                  onClick={() => setShowDonation(false)}
                  className="border border-gray-400 text-gray-700 py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg text-xs sm:text-sm hover:bg-gray-100 transition"
                >
                  Maybe Later
                </button>
              </div>
            </div>

            {/* RIGHT SIDE (QR CODE) */}
            <div className="w-full md:w-1/2 bg-[#cfe3df] flex flex-col items-center justify-center relative p-4 sm:p-6 md:p-8">
              <img
                src={scannerImage}
                alt="QR Code"
                className="w-36 h-36 sm:w-44 sm:h-44 md:w-56 md:h-56 mb-3 sm:mb-4 border rounded-xl p-2 sm:p-3 bg-white shadow-lg select-none pointer-events-none"
              />
              <p className="text-xs sm:text-sm text-gray-700 font-medium mb-1">Scan to Donate Instantly</p>
              <p className="text-[10px] sm:text-xs text-gray-500 text-center">Fast • Secure • Easy</p>
              <button
                onClick={() => setShowDonation(false)}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white rounded-full p-1.5 sm:p-2 shadow hover:bg-gray-100"
              >
                <FaTimes size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}