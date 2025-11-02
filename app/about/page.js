export const metadata = {
  title: "About Us - Convoy Travels",
  description: "Learn about Convoy Travels - Your trusted car rental service in Lahore",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-20 px-6 md:px-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-[#1a2b5c] mb-6">
            About Convoy Travels
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
            Your trusted partner for reliable and affordable car rental services in Lahore
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a2b5c] mb-6">
              Our Story
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Convoy Travels was established with a vision to provide hassle-free car rental services in Lahore. 
              We understand the importance of reliable transportation, whether you're exploring the city or 
              traveling to outstation destinations.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Over the years, we have built a reputation for offering quality vehicles, transparent pricing, 
              and exceptional customer service. Our diverse fleet caters to all your travel needs, from 
              economy cars to luxury vehicles.
            </p>
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a2b5c] mb-6">
              Why Choose Us
            </h2>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start">
                <span className="text-[#1a2b5c] font-bold mr-3">✓</span>
                <span>1000+ satisfied customers trust our services</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#1a2b5c] font-bold mr-3">✓</span>
                <span>Flexible rental options with or without driver</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#1a2b5c] font-bold mr-3">✓</span>
                <span>Transparent pricing with no hidden charges</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#1a2b5c] font-bold mr-3">✓</span>
                <span>Well-maintained fleet of quality vehicles</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#1a2b5c] font-bold mr-3">✓</span>
                <span>24/7 customer support</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-[#e7ecf5] rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a2b5c] mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 text-lg max-w-4xl mx-auto leading-relaxed">
            To provide seamless, affordable, and reliable car rental services that meet the diverse needs 
            of our customers. We strive to make every journey comfortable and memorable, whether it's a 
            short city trip or a long-distance travel adventure.
          </p>
        </div>
      </div>
    </main>
  );
}

