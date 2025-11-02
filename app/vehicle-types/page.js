import PerfectDriver from "@/components/PerfectDriver";
import PopularBrands from "@/components/PopularBrands";

export const metadata = {
  title: "Vehicle Types - Convoy Travels",
  description: "Explore our diverse fleet of vehicles available for rent in Lahore",
};

export default function VehicleTypesPage() {
  const vehicleCategories = [
    {
      category: "Economy Cars",
      description: "Perfect for city driving and budget-conscious travelers. Fuel-efficient and easy to maneuver.",
      vehicles: ["Suzuki Alto", "Suzuki Cultus", "Suzuki Wagon R"],
    },
    {
      category: "Sedan Cars",
      description: "Comfortable and spacious, ideal for families and business travelers.",
      vehicles: ["Toyota Corolla", "Toyota Yaris", "Honda City", "Honda Civic"],
    },
    {
      category: "SUVs & 4x4",
      description: "Powerful vehicles perfect for adventure and off-road journeys.",
      vehicles: ["Toyota Fortuner", "Toyota Prado", "Toyota Land Cruiser V8", "KIA Sportage"],
    },
    {
      category: "Luxury Vehicles",
      description: "Premium vehicles for special occasions and executive travel.",
      vehicles: ["Honda Civic", "Toyota Grande", "MG HS", "Hyundai Tuscon"],
    },
    {
      category: "Vans & Buses",
      description: "Spacious vehicles perfect for group travel and events.",
      vehicles: ["Suzuki APV", "Toyota High Roof", "BH 120", "Coaster"],
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-20 px-6 md:px-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-[#1a2b5c] mb-6">
            Vehicle Types
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
            Explore our diverse fleet of vehicles to find the perfect match for your travel needs
          </p>
        </div>

        <div className="space-y-12 mb-16">
          {vehicleCategories.map((category, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-8 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-[#1a2b5c] mb-4">
                {category.category}
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {category.description}
              </p>
              <div className="flex flex-wrap gap-3">
                {category.vehicles.map((vehicle, idx) => (
                  <span
                    key={idx}
                    className="bg-[#e7ecf5] text-[#1a2b5c] px-4 py-2 rounded-md font-medium"
                  >
                    {vehicle}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <PerfectDriver />
        <PopularBrands />
      </div>
    </main>
  );
}

