import Link from "next/link";
import { FaMapMarkerAlt } from "react-icons/fa";
import { generateSlug } from "@/utils/slug";

export default function VehicleCard({ car }) {
  const carSlug = car.slug || generateSlug(car.name) || car.id;
  return (
    <Link href={`/cars/${carSlug}`} className="block">
      <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group w-full cursor-pointer">
        {/* Image Section */}
        <div className="relative w-full h-72 sm:h-80 lg:h-72 overflow-hidden bg-gray-100">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // Simple fallback - no logging
            e.target.style.display = 'none';
            const placeholder = e.target.parentElement.querySelector('.image-placeholder');
            if (placeholder) placeholder.style.display = 'flex';
          }}
          />
          <div className="image-placeholder absolute inset-0 flex items-center justify-center bg-gray-200" style={{ display: 'none' }}>
            <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          {car.featured && (
            <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1.5 text-xs font-bold rounded-md shadow-lg">
              Featured
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="p-5 sm:p-6 bg-white">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 leading-tight">
            {car.name}
          </h3>
          <div className="flex items-baseline mb-3">
            <p className="text-2xl sm:text-3xl font-bold text-[#1a2b5c]">
              {car.price}
            </p>
            <span className="text-sm sm:text-base font-medium text-gray-500 ml-2">/perday</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm sm:text-base pt-3 border-t border-gray-100">
            <FaMapMarkerAlt className="w-4 h-4 mr-2 text-[#1a2b5c]" />
            <span className="font-medium">{car.location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

