'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '@/config/api';
import { FaSpinner } from 'react-icons/fa';

// Brand image mapping - fallback images for known brands
const brandImageMap = {
  'suzuki': '/r1.webp',
  'toyota': '/r2.webp',
  'honda': '/r3.webp',
  'hyundai': '/r4.webp',
  'mercedes': '/mercedes-logo.jpg',
  'bmw': '/bmw-logo.jpg',
  'audi': '/audi-logo.jpg',
  // 'ford': '/limousine-logo.jpg',
    'kia': '/kia-logo.jpg',
  
};

export default function PopularBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/cars`);
        const data = await response.json();

        if (data.success && data.data && data.data.cars) {
          // Extract unique brands from cars
          const uniqueBrands = new Set();
          
          data.data.cars.forEach((car) => {
            if (car.brand && car.brand.trim()) {
              uniqueBrands.add(car.brand.trim());
            }
          });

          // Convert to array and sort alphabetically
          const brandsArray = Array.from(uniqueBrands)
            .map((brandName) => {
              const brandKey = brandName.toLowerCase();
              return {
                name: brandName, // Keep original brand name from API
                img: brandImageMap[brandKey] || '/limousine-logo.jpg', // Use mapped image or default
              };
            })
            .sort((a, b) => a.name.localeCompare(b.name));

          setBrands(brandsArray);
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return (
    <section className="py-16 px-6 md:px-20 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-[#1a2b5c] text-sm font-medium mb-2">
          <span className="inline-block w-8 h-0.5 bg-[#1a2b5c] mr-2"></span>
          Meet the Right Services
        </p>
        <h2 className="text-[#1a2b5c] text-4xl md:text-5xl font-bold mb-12">
          Popular Brands
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="animate-spin text-[#1a2b5c] text-4xl" />
          </div>
        ) : brands.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No brands available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
            {brands.map((brand, index) => (
              <Link
                key={`${brand.name}-${index}`}
                href={`/brands/${encodeURIComponent(brand.name.toLowerCase())}`}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center justify-center p-6 cursor-pointer"
              >
                <img
                  src={brand.img}
                  alt={brand.name}
                  className="h-16 md:h-20 object-contain"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
