'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { API_BASE_URL } from "@/config/api";

export default function HeroSection() {
  const router = useRouter();
  const [pickupDate, setPickupDate] = useState(null);
  const [dropoffDate, setDropoffDate] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [carsData, setCarsData] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const [displayedText1, setDisplayedText1] = useState('');
  const [displayedText2, setDisplayedText2] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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

  // Set mounted to true after component mounts (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch brands and cars data from API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoadingBrands(true);
        const response = await fetch(`${API_BASE_URL}/cars`);
        const data = await response.json();

        if (data.success && data.data && data.data.cars) {
          // Store cars data for later use
          setCarsData(data.data.cars);
          // Allowed brands for dropdown - only these will be shown
          const allowedBrands = ['Honda', 'Hyundai', 'Kia', 'Suzuki', 'Toyota'];
          // Extract unique brands from cars and filter to only allowed brands
          const uniqueBrands = [...new Set(data.data.cars.map(car => car.brand).filter(brand => brand))];
          // Filter to only include allowed brands (case-insensitive comparison)
          const filteredBrands = uniqueBrands.filter(brand => {
            const brandLower = brand.trim().toLowerCase();
            return allowedBrands.some(allowed => allowed.toLowerCase() === brandLower);
          });
          // Sort brands alphabetically
          filteredBrands.sort();
          setBrands(filteredBrands);
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
        // Fallback to default brands if API fails
        setBrands(['Honda', 'Hyundai', 'Kia', 'Suzuki', 'Toyota']);
      } finally {
        setLoadingBrands(false);
      }
    };

    fetchBrands();
  }, []);

  // Handle search button click
  const handleFindCar = async () => {
    // Validate inputs
    if (!pickupDate || !dropoffDate) {
      alert('Please select both pick-up and drop-off dates');
      return;
    }

    if (!selectedBrand) {
      alert('Please select a car brand');
      return;
    }

    if (dropoffDate <= pickupDate) {
      alert('Drop-off date must be after pick-up date');
      return;
    }

    try {
      setIsSearching(true);

      // Find cars with the selected brand
      const brandCars = carsData.filter(car => car.brand === selectedBrand);
      
      if (brandCars.length === 0) {
        alert('No cars found for the selected brand');
        setIsSearching(false);
        return;
      }

      // Get the category from the first car (assuming all cars of same brand have same category)
      // If different categories exist, we'll use the most common one
      const categoryCounts = {};
      brandCars.forEach(car => {
        const categoryName = car.category?.name;
        if (categoryName) {
          categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
        }
      });

      const mostCommonCategory = Object.keys(categoryCounts).reduce((a, b) => 
        categoryCounts[a] > categoryCounts[b] ? a : b
      );

      if (!mostCommonCategory) {
        alert('No category found for the selected brand');
        setIsSearching(false);
        return;
      }

      // Format dates for URL
      const formatDate = (date) => {
        if (!date) return '';
        return date.toISOString().split('T')[0]; // YYYY-MM-DD format
      };

      // Store dates in localStorage for later use
      if (typeof window !== 'undefined') {
        localStorage.setItem('pickupDate', pickupDate.toISOString());
        localStorage.setItem('dropoffDate', dropoffDate.toISOString());
      }

      // Navigate to vehicle-types page with category, brand, and dates
      const params = new URLSearchParams({
        category: mostCommonCategory,
        brand: selectedBrand,
        pickupDate: formatDate(pickupDate),
        dropoffDate: formatDate(dropoffDate),
      });

      router.push(`/vehicle-types?${params.toString()}`);
    } catch (error) {
      console.error('Error finding car:', error);
      alert('An error occurred while searching for cars');
      setIsSearching(false);
    }
  };

  // Typing animation effect - only runs on client after mount
  useEffect(() => {
    if (!mounted) return;

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

    setIsTyping(true);
    typeText1();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [mounted]);

  return (
    <div
      className="relative bg-cover bg-no-repeat bg-center bg-gray-100 w-full min-h-[600px] md:min-h-[700px]"
      style={{
        backgroundImage: "url('/bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/35 z-10"></div>

      <div className="relative z-10 text-center text-white py-12 md:py-20 px-6 md:px-20 pb-12 md:pb-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 min-h-[3rem] md:min-h-[4rem]">
          {mounted ? displayedText1 : fullText1}
          {mounted && isTyping && <span className="animate-pulse">|</span>}
        </h1>
        <h2 className="text-4xl sm:text-2xl md:text-6xl font-bold mb-6 min-h-[3rem] md:min-h-[4rem]">
          {mounted ? displayedText2 : fullText2}
          {mounted && isTyping && displayedText1 === fullText1 && (
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
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                disabled={loadingBrands}
              >
                <option value="" disabled>
                  {loadingBrands ? 'Loading brands...' : 'Select Car Make / Brand'}
                </option>
                {brands.map((brand, index) => (
                  <option key={index} value={brand}>
                    {brand}
                  </option>
                ))}
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
                onClick={handleFindCar}
                disabled={isSearching}
                className="w-full py-3 rounded-lg btn-gradient-primary disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-lg font-semibold shadow-lg relative z-10"
              >
                {isSearching ? 'Searching...' : 'Find Your Car'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

