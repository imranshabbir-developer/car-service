'use client';

import { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";

export default function HeroSection() {
  const [pickupDate, setPickupDate] = useState(null);
  const [dropoffDate, setDropoffDate] = useState(null);
  
  const [displayedText1, setDisplayedText1] = useState('');
  const [displayedText2, setDisplayedText2] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const fullText1 = "Rent a Car in Lahore -";
  const fullText2 = "Available With or Without a Driver";
  const typingSpeed = 100;
  const erasingSpeed = 50;
  const pauseTime = 2000; // 2 seconds pause after typing complete

  const timeoutRef = useRef(null);
  const currentIndexRef = useRef(0);
  const isErasingRef = useRef(false);
  const displayedText1Ref = useRef('');
  const displayedText2Ref = useRef('');

  useEffect(() => {
    const typeText1 = () => {
      if (currentIndexRef.current < fullText1.length) {
        displayedText1Ref.current = fullText1.slice(0, currentIndexRef.current + 1);
        setDisplayedText1(displayedText1Ref.current);
        currentIndexRef.current++;
        timeoutRef.current = setTimeout(typeText1, typingSpeed);
      } else {
        // Start typing second text after first is complete
        currentIndexRef.current = 0;
        timeoutRef.current = setTimeout(() => {
          typeText2();
        }, 300);
      }
    };

    const typeText2 = () => {
      if (currentIndexRef.current < fullText2.length) {
        displayedText2Ref.current = fullText2.slice(0, currentIndexRef.current + 1);
        setDisplayedText2(displayedText2Ref.current);
        currentIndexRef.current++;
        timeoutRef.current = setTimeout(typeText2, typingSpeed);
      } else {
        // Both texts are complete, wait 2 seconds then start erasing
        setIsTyping(false);
        timeoutRef.current = setTimeout(() => {
          isErasingRef.current = true;
          eraseText();
        }, pauseTime);
      }
    };

    const eraseText = () => {
      // Erase second text first
      if (displayedText2Ref.current.length > 0) {
        displayedText2Ref.current = displayedText2Ref.current.slice(0, -1);
        setDisplayedText2(displayedText2Ref.current);
        timeoutRef.current = setTimeout(eraseText, erasingSpeed);
      } else if (displayedText1Ref.current.length > 0) {
        // Erase first text
        displayedText1Ref.current = displayedText1Ref.current.slice(0, -1);
        setDisplayedText1(displayedText1Ref.current);
        timeoutRef.current = setTimeout(eraseText, erasingSpeed);
      } else {
        // Both texts erased, restart typing
        isErasingRef.current = false;
        setIsTyping(true);
        currentIndexRef.current = 0;
        timeoutRef.current = setTimeout(() => {
          typeText1();
        }, 300);
      }
    };

    typeText1();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      className="relative bg-cover bg-gray-100 bg-opacity-10 bg-center min-h-screen"
      style={{
        backgroundImage:
          "url('https://convoytravels.pk/wp-content/uploads/2025/09/Convoy-Travel.png')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/65 to-black/70 z-10"></div>

      <div className="relative z-10 text-center text-white py-20 px-6 md:px-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 min-h-[3rem] md:min-h-[4rem]">
          {displayedText1}
          {isTyping && <span className="animate-pulse">|</span>}
        </h1>
        <h2 className="text-4xl sm:text-2xl md:text-6xl font-bold mb-6 min-h-[3rem] md:min-h-[4rem]">
          {displayedText2}
          {isTyping && displayedText1 === fullText1 && (
            <span className="animate-pulse">|</span>
          )}
        </h2>
        <p className="text-md md:text-lg font-semibold mb-0">
          &quot;Without Driver Services available for bookings of 7 days or more&quot;
        </p>
        <p className="text-md md:text-lg font-normal mb-0">
          Pay at pickup, enjoy free cancellation, and rent without a deposit!
        </p>

        <div className="max-w-3xl mx-auto mt-8 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <DatePicker
                selected={pickupDate}
                onChange={(date) => setPickupDate(date)}
                placeholderText="Pick-up Date"
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-6 pr-12 text-gray-700 text-base shadow-sm focus:outline-none cursor-pointer"
                dateFormat="MMM dd, yyyy"
                minDate={new Date()}
              />
              <FaCalendarAlt className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>

            <div className="relative">
              <DatePicker
                selected={dropoffDate}
                onChange={(date) => setDropoffDate(date)}
                placeholderText="Drop-off Date"
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-6 pr-12 text-gray-700 text-base shadow-sm focus:outline-none cursor-pointer"
                dateFormat="MMM dd, yyyy"
                minDate={pickupDate || new Date()}
              />
              <FaCalendarAlt className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-3 pl-6 pr-12 text-gray-700 text-base shadow-sm focus:outline-none"
                defaultValue=""
              >
                <option value="" disabled>
                  Select Car Make / Brand
                </option>
                <option>Toyota</option>
                <option>Honda</option>
                <option>Suzuki</option>
                <option>Kia</option>
                <option>Hyundai</option>
              </select>
              <svg
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="#52606D"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="relative">
              <button
                type="button"
                className="w-full py-3 rounded-lg bg-[#18274f] hover:bg-[#0f2140] text-white text-lg font-semibold shadow-lg transition-colors"
              >
                Find Your Car
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

