export const metadata = {
  title: "Travel Services - Convoy Travels",
  description: "Explore our travel packages and services for your journey",
};

export default function TravelPage() {
  const travelServices = [
    {
      title: "City Travel",
      description: "Explore Lahore with our convenient city travel packages. Perfect for shopping, sightseeing, and business meetings.",
      features: ["Hourly packages available", "Flexible pickup/drop-off", "Professional drivers"],
    },
    {
      title: "Outstation Travel",
      description: "Travel to other cities comfortably with our outstation packages. Ideal for family trips and business travel.",
      features: ["Daily/weekly rates", "Luggage space", "Comfortable long-distance vehicles"],
    },
    {
      title: "Airport Transfers",
      description: "Reliable airport pickup and drop-off services. Never miss a flight with our punctual service.",
      features: ["On-time service", "Flight tracking", "24/7 availability"],
    },
    {
      title: "Event Transportation",
      description: "Special packages for weddings, corporate events, and gatherings. We provide multiple vehicles for your guests.",
      features: ["Bulk booking discounts", "Decorated vehicles", "Coordinated service"],
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-20 px-6 md:px-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-[#1a2b5c] mb-6">
            Travel Services
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
            Discover our comprehensive travel solutions designed for every type of journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {travelServices.map((service, index) => (
            <div
              key={index}
              className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-[#1a2b5c] mb-4">
                {service.title}
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-gray-700">
                    <span className="text-[#1a2b5c] font-bold mr-3">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-[#1a2b5c] text-white rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Plan Your Journey?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Contact us today to discuss your travel needs and get a customized quote
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-[#1a2b5c] font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </main>
  );
}

