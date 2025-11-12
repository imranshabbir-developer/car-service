import { FaClock, FaFacebookF, FaInstagram } from "react-icons/fa";

export const metadata = {
  title: "About Us - Convoy Travels",
  description: "Learn about Convoy Travels - Your trusted car rental service in Lahore",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <div className="max-w-[87.5rem] mx-auto py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-8 sm:gap-12 md:gap-16 lg:gap-20">
          {/* Left Column - Image */}
          <div className="w-full lg:w-[48%] xl:w-[50%] flex-shrink-0 overflow-hidden rounded-tl-[16px] rounded-bl-[16px] sm:rounded-tl-[20px] sm:rounded-bl-[20px] lg:rounded-tr-none lg:rounded-br-none">
            <img
              src="/girl.webp"
              alt="Convoy Travels"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Column - Text Content */}
          <div className="w-full lg:w-[52%] xl:w-[50%] flex flex-col justify-center py-6 sm:py-8 md:py-10 lg:py-0">
            {/* Sub-heading */}
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-2 sm:mb-3 md:mb-4">
              — About Convoy Travels
            </p>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6 leading-tight">
              Discover Adventure with Convoy
            </h1>

            {/* Paragraph */}
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-5 md:mb-6">
              Convoy Travels offers convenient and reliable car rental services to enhance your travel experience. 
              With a wide range of vehicles to choose from, our seamless booking process ensures you&apos;re ready to 
              hit the road and explore your destination with ease. Whether it&apos;s a solo adventure or a family road 
              trip, trust Convoy Travels for your rent-a-car needs
            </p>

            {/* Bullet Points */}
            <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-7 md:mb-8">
              <li className="flex items-start">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0 mr-2 sm:mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base md:text-lg text-gray-700">
                  Convoy Travels: Your Passport to Adventure!
                </span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0 mr-2 sm:mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base md:text-lg text-gray-700">
                  Explore Beyond Boundaries with Convoy Travels
                </span>
              </li>
            </ul>

            {/* Discover More Button */}
            <button className="bg-[#1e2d60] text-white px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base md:text-lg font-medium hover:bg-[#1a2650] transition-colors duration-300 w-full sm:w-auto self-start">
              Discover More
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-white py-8 sm:py-10 md:py-12">
        <div className="w-[85%] sm:w-[82%] md:w-[80%] mx-auto bg-[#333333] py-8 sm:py-10 md:py-12 px-6 sm:px-8 md:px-10 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            {/* Column 1 - Total Cars */}
            <div className="flex flex-col items-center text-center">
              <img
                src="/1.png"
                alt="Total Cars"
                className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mb-3 sm:mb-4 object-contain"
              />
              <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-2 sm:mb-3">
                50+
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-300">
                Total Cars
              </p>
            </div>

            {/* Column 2 - Happy Customers */}
            <div className="flex flex-col items-center text-center">
              <img
                src="/2.png"
                alt="Happy Customers"
                className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mb-3 sm:mb-4 object-contain"
              />
              <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-2 sm:mb-3">
                1,000+
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-300">
                Happy Customers
              </p>
            </div>

            {/* Column 3 - Years of Experience */}
            <div className="flex flex-col items-center text-center">
              <FaClock className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white mb-3 sm:mb-4" />
              <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-2 sm:mb-3">
                7+
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-300">
                Years of Experience
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Meet Our Team Section */}
      <div className="bg-white py-12 sm:py-16 md:py-20">
        <div className="max-w-[87.5rem] mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            {/* Sub-heading */}
            <div className="flex items-center justify-center mb-3 sm:mb-4 md:mb-5">
              <div className="w-8 sm:w-10 md:w-12 h-0.5 bg-gray-500 mr-3"></div>
              <p className="text-sm sm:text-base md:text-lg text-gray-500">
                Professional People
              </p>
            </div>
            
            {/* Main Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
              Meet Our Team
            </h2>
          </div>

          {/* Team Member Card */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center text-center">
              {/* Name */}
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                Daud bin Imran Baloch
              </h3>
              
              {/* Role */}
              <p className="text-sm sm:text-base md:text-lg text-gray-500 mb-4 sm:mb-5 md:mb-6">
                Team member
              </p>
              
              {/* Social Media Icons */}
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Facebook Icon */}
                <a
                  href="#"
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-300"
                  aria-label="Facebook"
                >
                  <FaFacebookF className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                </a>
                
                {/* Instagram Icon */}
                <a
                  href="#"
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-300"
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Section */}
      <div className="w-full bg-[#c9c9c9] py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-[87.5rem] mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8">
            {/* Left Content Block */}
            <div className="flex items-center gap-4 sm:gap-6">
              {/* RENT Icon */}
              <div className="flex-shrink-0">
                <img
                  src="/rent.webp"
                  alt="RENT"
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain"
                />
              </div>
              
              {/* Text Content */}
              <div className="flex flex-col">
                <p className="text-sm sm:text-base md:text-lg text-[#1e2d60] mb-1 sm:mb-2">
                  1000 People Use Convoy Travels
                </p>
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#1e2d60]">
                  Top-Quality Rentals Cars in Lahore
                </h3>
              </div>
            </div>

            {/* Right Button */}
            <button className="px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 border-2 border-[#1e2d60] rounded-lg sm:rounded-xl text-sm sm:text-base md:text-lg font-medium text-[#1e2d60] bg-transparent hover:bg-white transition-colors duration-300 whitespace-nowrap">
              Find Anything
            </button>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white py-12 sm:py-16 md:py-20">
        <div className="max-w-[87.5rem] mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            {/* Sub-heading */}
            <p className="text-sm sm:text-base md:text-lg text-gray-500 mb-3 sm:mb-4 md:mb-5">
              — Our Testimonials
            </p>
            
            {/* Main Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
              What They Say
            </h2>
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
            {/* Testimonial 1 */}
            <div className="text-left">
              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed mb-4 sm:mb-5 md:mb-6">
                Convoy Travels made my dream vacation a reality! From seamless booking to personalized itineraries, their attention to detail exceeded my expectations. Highly recommend for stress-free travel experiences!
              </p>
              <h4 className="text-base sm:text-lg md:text-xl font-bold text-[#1e2d60] mb-1 sm:mb-2">
                Faizan Iqbal
              </h4>
              <p className="text-sm sm:text-base text-gray-500">
                Customer
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="text-left">
              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed mb-4 sm:mb-5 md:mb-6">
                Convoy Travels provided exceptional service from start to finish! Their team went above and beyond to ensure our trip was smooth and memorable. Highly recommended for anyone seeking hassle-free travel planning!
              </p>
              <h4 className="text-base sm:text-lg md:text-xl font-bold text-[#1e2d60] mb-1 sm:mb-2">
                Isha Tariq
              </h4>
              <p className="text-sm sm:text-base text-gray-500">
                Customer
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="text-left">
              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed mb-4 sm:mb-5 md:mb-6">
                Convoy Travels exceeded all expectations! Their attention to detail, personalized service, and seamless planning made our trip unforgettable. Highly recommend for anyone seeking a stress-free travel experience!
              </p>
              <h4 className="text-base sm:text-lg md:text-xl font-bold text-[#1e2d60] mb-1 sm:mb-2">
                Moiz Khan
              </h4>
              <p className="text-sm sm:text-base text-gray-500">
                Customer
              </p>
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}
