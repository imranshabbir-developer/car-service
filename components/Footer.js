import {
  FaMapMarkerAlt,
  FaClock,
  FaEnvelope,
  FaPhoneAlt,
  FaArrowRight,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#081c2f] mt-20 text-white py-12 px-6 sm:px-10 md:px-14 lg:px-20 xl:px-32">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10 border-b border-gray-700 pb-10">
        {/* Logo and Description */}
        <div className="col-span-2 sm:col-span-1">
          <div className="flex justify-center sm:justify-start mb-4">
            <img
              src="https://convoytravels.pk/wp-content/uploads/2021/07/CONVAY-TRAVELS-White-latest-1.png"
              alt="Convoy Travels Logo"
              className="w-44 sm:w-52 object-contain"
            />
          </div>
          <p className="text-gray-300 leading-relaxed font-semibold text-sm sm:text-base text-center sm:text-left">
            Convoy Travels: Your seamless solution for hassle-free car rentals,
            offering a diverse fleet for all your travel needs.
          </p>
        </div>

        {/* Vehicle Types Section */}
        <div className="text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-semibold mb-3">
            Vehicle Types
          </h3>
          <ul className="space-y-3 sm:space-y-4 text-gray-300 font-semibold">
            {[
              "Comfort",
              "Business",
              "Standard",
              "Economy",
              "Luxury Vehicle",
              "Vans & Buses",
            ].map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-center sm:justify-start space-x-2 cursor-pointer group hover:text-white transition-all"
              >
                <span className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <FaArrowRight size={12} />
                </span>
                <span className="group-hover:translate-x-2 transition-transform duration-300">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Popular Makes Section */}
        <div className="text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-semibold mb-3">
            Popular Makes
          </h3>
          <ul className="space-y-3 sm:space-y-4 text-gray-300 font-semibold">
            {["Suzuki", "Toyota", "Honda", "Vans & Buses"].map(
              (item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-center sm:justify-start space-x-2 cursor-pointer group hover:text-white transition-all"
                >
                  <span className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <FaArrowRight size={12} />
                  </span>
                  <span className="group-hover:translate-x-2 transition-transform duration-300">
                    {item}
                  </span>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Contact Section */}
        <div className="text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-semibold mb-3">Contact</h3>
          <ul className="text-gray-300 space-y-4 font-semibold">
            <li className="flex flex-col sm:flex-row sm:items-start sm:space-x-2 pb-2 border-b border-gray-600">
              <div className="flex justify-center sm:justify-start">
                <FaMapMarkerAlt className="mt-1" />
              </div>
              <span className="mt-1 sm:mt-0">
                872 Block R1 Johar Town Lahore
              </span>
            </li>
            <li className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 pb-2 border-b border-gray-600">
              <div className="flex justify-center sm:justify-start">
                <FaClock />
              </div>
              <span className="mt-1 sm:mt-0">24/7 Open</span>
            </li>
            <li className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 pb-2 border-b border-gray-600">
              <div className="flex justify-center sm:justify-start">
                <FaEnvelope />
              </div>
              <span className="mt-1 sm:mt-0">convoytravels786@gmail.com</span>
            </li>
            <li className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 pb-2 border-b border-gray-600">
              <div className="flex justify-center sm:justify-start">
                <FaPhoneAlt />
              </div>
              <span className="mt-1 sm:mt-0">+923281456456</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Copyright Section */}
      <div className="flex justify-center items-center text-gray-300 mt-6 text-sm sm:text-base text-center font-semibold">
        <p>© Copyright 2025 by Convoy Travels</p>
      </div>
    </footer>
  );
}

