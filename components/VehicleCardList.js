import { FaHeart, FaMapMarkerAlt } from "react-icons/fa";

export default function VehicleCardList({ car }) {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group w-full">
      <div className="flex flex-col sm:flex-row">
        {/* Image Section - Left Side */}
        <div className="relative w-full sm:w-80 lg:w-96 h-64 sm:h-auto overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0">
          <img
            src={car.image}
            alt={car.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
          {car.featured && (
            <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1.5 text-xs font-bold rounded-md shadow-lg">
              Featured
            </div>
          )}
          <button className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-md transition-all duration-300 hover:scale-110">
            <FaHeart className="w-4 h-4 text-gray-700" />
          </button>
        </div>

        {/* Details Section - Right Side */}
        <div className="p-6 sm:p-8 bg-white flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 leading-tight">
              {car.name}
            </h3>
            <div className="flex items-baseline mb-4">
              <p className="text-3xl sm:text-4xl font-bold text-[#1a2b5c]">
                {car.price}
              </p>
              <span className="text-base sm:text-lg font-medium text-gray-500 ml-2">/perday</span>
            </div>
          </div>
          <div className="flex items-center text-gray-600 text-base sm:text-lg pt-4 border-t border-gray-100">
            <FaMapMarkerAlt className="w-5 h-5 mr-3 text-[#1a2b5c]" />
            <span className="font-medium">{car.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

