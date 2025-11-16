import LocationMap from "@/components/LocationMap";
import { FaMapMarkerAlt, FaClock, FaEnvelope, FaPhoneAlt } from "react-icons/fa";

export const metadata = {
  title: "Contact Us - Convoy Travels",
  description: "Get in touch with Convoy Travels for car rental services in Lahore",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <div className="max-w-7xl mx-auto py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a2b5c] mb-4 sm:mb-6">
            Contact Us
          </h1>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-3xl mx-auto px-4">
            We&apos;re here to help! Reach out to us for any questions or bookings
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">

          {/* Address */}
          <a
            href="https://www.google.com/maps/place/Convoy+Travels+%26+Rent+A+Car+.+Rent+a+car+in+lahore/@31.4396234,74.2654729,15z"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#e7ecf5] rounded-lg p-5 sm:p-6 text-center hover:shadow-xl transition-all duration-300 block hover:bg-[#dce3f0]"
          >
            <div className="flex justify-center mb-3 sm:mb-4">
              <FaMapMarkerAlt className="text-2xl sm:text-3xl text-[#1a2b5c]" />
            </div>
            <h3 className="font-bold text-[#1a2b5c] mb-2 text-base sm:text-lg">Address</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              872 Block R1 Johar Town Lahore
            </p>
          </a>

          {/* Hours (static, not clickable) */}
          <div className="bg-[#e7ecf5] rounded-lg p-5 sm:p-6 text-center hover:shadow-xl transition-all duration-300">
            <div className="flex justify-center mb-3 sm:mb-4">
              <FaClock className="text-2xl sm:text-3xl text-[#1a2b5c]" />
            </div>
            <h3 className="font-bold text-[#1a2b5c] mb-2 text-base sm:text-lg">Business Hours</h3>
            <p className="text-gray-600 text-sm sm:text-base">24/7 Open</p>
          </div>

          {/* Email */}
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=convoytravels786@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#e7ecf5] rounded-lg p-5 sm:p-6 text-center hover:shadow-xl transition-all duration-300 block hover:bg-[#dce3f0]"
          >
            <div className="flex justify-center mb-3 sm:mb-4">
              <FaEnvelope className="text-2xl sm:text-3xl text-[#1a2b5c]" />
            </div>
            <h3 className="font-bold text-[#1a2b5c] mb-2 text-base sm:text-lg">Email</h3>
            <p className="text-gray-600 text-sm sm:text-base break-words">
              convoytravels786@gmail.com
            </p>
          </a>

          {/* Phone (WhatsApp) */}
          <a
            href="https://wa.me/923281456456"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#e7ecf5] rounded-lg p-5 sm:p-6 text-center hover:shadow-xl transition-all duration-300 block hover:bg-[#dce3f0]"
          >
            <div className="flex justify-center mb-3 sm:mb-4">
              <FaPhoneAlt className="text-2xl sm:text-3xl text-[#1a2b5c]" />
            </div>
            <h3 className="font-bold text-[#1a2b5c] mb-2 text-base sm:text-lg">Phone</h3>
            <p className="text-gray-600 text-sm sm:text-base">+92 328 1456456</p>
          </a>
        </div>

        {/* Form */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 sm:p-8 md:p-10 lg:p-12 mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a2b5c] mb-6 sm:mb-8 text-center">
            Send Us a Message
          </h2>
          <form className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a2b5c]"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a2b5c]"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Phone</label>
              <input
                type="tel"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a2b5c]"
                placeholder="+92 300 1234567"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Message</label>
              <textarea
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a2b5c]"
                placeholder="Your message here..."
              ></textarea>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-[#1a2b5c] text-white font-semibold px-8 py-3 rounded-lg hover:bg-[#0d1b2a] transition-colors"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>

        <LocationMap />
      </div>
    </main>
  );
}
