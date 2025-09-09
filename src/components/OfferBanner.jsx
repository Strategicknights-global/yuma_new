import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link for internal navigation

const offers = [
  { text: "⚡ 20% OFF Your First Order! Use Code FIRST20", link: "/products?offer=FIRST20", color: "bg-red-600" },
  { text: "🚚 Free Shipping on Orders Over ₹500! 🎉", link: "/products?offer=FREESHIP", color: "bg-green-600" },
  { text: "⏰ Limited Time Offer! Shop Now! ⭐", link: "/products?offer=LIMITEDTIME", color: "bg-blue-600" },
];

const OfferBanner = () => {
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

  // Auto-scroll through offers
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOfferIndex((prevIndex) => (prevIndex + 1) % offers.length);
    }, 5000); // Change offer every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const currentOffer = offers[currentOfferIndex];

  return (
    // Make the banner fixed at the top, just below the Navbar
    <div className="w-full bg-transparent overflow-hidden relative z-40">
      <div
        className={`relative ${currentOffer.color} text-white py-2 text-sm animate-marquee-text`}
        // Ensure consistent height, add min-w-full to allow content to extend for marquee
        style={{ height: '40px', minWidth: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {/* Remove navigation buttons as it's now a continuous scroll */}
        <Link
          to={currentOffer.link}
          className="block text-center font-medium px-4 py-1"
        >
          {currentOffer.text}
        </Link>
      </div>
    </div>
  );
};

export default OfferBanner;