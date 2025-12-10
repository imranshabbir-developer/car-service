'use client';

import { useState, useEffect } from "react";
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
  const [carsData, setCarsData] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch brands and cars data from API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoadingBrands(true);
        const response = await fetch(`${API_BASE_URL}/cars`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Check if response is ok before parsing JSON
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

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
      alert('An error occurred while searching for cars');
      setIsSearching(false);
    }
  };


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
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Rent a Car in Lahore - Available With or Without a Driver
        </h1>
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

