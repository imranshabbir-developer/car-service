import Link from 'next/link';
import { FaHeart, FaMapMarkerAlt } from 'react-icons/fa';

export default function SimilarListings({ cars = [] }) {
  if (!cars || cars.length === 0) return null;

  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-0.5 bg-[#1a2b5c]"></div>
            <p className="text-sm md:text-base text-gray-500 font-medium">Browse Hot Offers</p>
            <div className="w-12 h-0.5 bg-[#1a2b5c]"></div>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a2b5c]">
            Similar Listings
          </h2>
        </div>

        {/* Car Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {cars.map((car) => (
            <Link key={car.id} href={`/cars/${car.id}`} className="block group">
              <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer h-full flex flex-col">
                {/* Image Section */}
                <div className="relative w-full h-64 sm:h-72 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  {car.featured && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1.5 text-xs font-bold rounded-md shadow-lg">
                      Featured
                    </div>
                  )}
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-md transition-all duration-300 hover:scale-110 z-10"
                  >
                    <FaHeart className="w-4 h-4 text-gray-700" />
                  </button>
                </div>

                {/* Details Section */}
                <div className="p-5 md:p-6 bg-white flex-grow flex flex-col">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-tight">
                    {car.name}
                  </h3>
                  <div className="flex items-baseline mb-4">
                    <p className="text-3xl md:text-4xl font-bold text-[#1a2b5c]">
                      {car.price}
                    </p>
                    <span className="text-sm md:text-base font-medium text-gray-500 ml-2">/perday</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm md:text-base pt-3 border-t border-gray-100 mt-auto">
                    <FaMapMarkerAlt className="w-4 h-4 mr-2 text-[#1a2b5c]" />
                    <span className="font-medium">{car.location}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

