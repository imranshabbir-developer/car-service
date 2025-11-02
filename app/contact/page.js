import LocationMap from "@/components/LocationMap";
import { FaMapMarkerAlt, FaClock, FaEnvelope, FaPhoneAlt } from "react-icons/fa";

export const metadata = {
  title: "Contact Us - Convoy Travels",
  description: "Get in touch with Convoy Travels for car rental services in Lahore",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-20 px-6 md:px-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-[#1a2b5c] mb-6">
            Contact Us
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
            We're here to help! Reach out to us for any questions or bookings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-[#e7ecf5] rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <FaMapMarkerAlt className="text-3xl text-[#1a2b5c]" />
            </div>
            <h3 className="font-bold text-[#1a2b5c] mb-2">Address</h3>
            <p className="text-gray-600 text-sm">
              872 Block R1 Johar Town Lahore
            </p>
          </div>

          <div className="bg-[#e7ecf5] rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <FaClock className="text-3xl text-[#1a2b5c]" />
            </div>
            <h3 className="font-bold text-[#1a2b5c] mb-2">Business Hours</h3>
            <p className="text-gray-600 text-sm">24/7 Open</p>
          </div>

          <div className="bg-[#e7ecf5] rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <FaEnvelope className="text-3xl text-[#1a2b5c]" />
            </div>
            <h3 className="font-bold text-[#1a2b5c] mb-2">Email</h3>
            <p className="text-gray-600 text-sm break-words">
              convoytravels786@gmail.com
            </p>
          </div>

          <div className="bg-[#e7ecf5] rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <FaPhoneAlt className="text-3xl text-[#1a2b5c]" />
            </div>
            <h3 className="font-bold text-[#1a2b5c] mb-2">Phone</h3>
            <p className="text-gray-600 text-sm">+92 328 1456456</p>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-lg p-8 md:p-12 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a2b5c] mb-6 text-center">
            Send Us a Message
          </h2>
          <form className="max-w-2xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a2b5c]"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a2b5c]"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Phone
              </label>
              <input
                type="tel"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a2b5c]"
                placeholder="+92 300 1234567"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Message
              </label>
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

