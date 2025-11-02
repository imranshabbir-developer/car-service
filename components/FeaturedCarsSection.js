import { FaUser, FaSnowflake, FaCogs } from "react-icons/fa";
import "./featured-cars.css";

export default function FeaturedCarsSection() {
  const cars = [
    {
      name: "Suzuki Cultus",
      price: "Rs 4,000 /perday",
      image:
        "https://convoytravels.pk/wp-content/uploads/2025/05/Suzuki-Cultus.jpg",
    },
    {
      name: "Suzuki Alto",
      price: "Rs 3,500 /perday",
      image:
        "https://convoytravels.pk/wp-content/uploads/2025/05/Suzuki-Alto.jpg",
    },
    {
      name: "Suzuki Wagon R",
      price: "Rs 4,000 /perday",
      image:
        "https://convoytravels.pk/wp-content/uploads/2025/05/Suzuki-Wagonr.jpg",
    },
    {
      name: "Toyota Corolla (GLI 1.3)",
      price: "₨ 6,000 /perday",
      image:
        "https://convoytravels.pk/wp-content/uploads/2025/05/Toyota-Corolla.jpg",
    },
    {
      name: "Toyota Yaris",
      price: "₨ 6,000 /perday",
      image:
        "https://convoytravels.pk/wp-content/uploads/2025/05/Toyota-Yaris.jpg",
    },
    {
      name: "Toyota Altis ( 1.6 Auto)",
      price: "₨ 8,000 /perday",
      image:
        "https://convoytravels.pk/wp-content/uploads/2025/05/Toyota-Corolla-Gli-1.3.jpg",
    },
    {
      name: "Toyota Grande",
      price: "₨ 9,000 /perday",
      image:
        "https://convoytravels.pk/wp-content/uploads/2025/05/Toyota-Grande.jpg",
    },
    {
      name: "Honda Civic (1.8)",
      price: "₨ 8,000 /perday",
      image: "https://convoytravels.pk/wp-content/uploads/2025/05/Civic.jpg",
    },
    {
      name: "Honda City",
      price: "₨ 6,000 /perday",
      image: "https://convoytravels.pk/wp-content/uploads/2025/05/City.jpg",
    },
    {
      name: "Honda Civic",
      price: "₨ 15,000 /perday",
      image:
        "https://convoytravels.pk/wp-content/uploads/2025/05/Honda-Civic.jpg",
    },
    {
      name: "KIA Sportage",
      price: "₨ 12,000 /perday",
      image:
        "https://convoytravels.pk/wp-content/uploads/2025/05/Kia-Sportage.jpg",
    },
    {
      name: "Honda HRV",
      price: "₨ 10,000 /perday",
      image: "https://convoytravels.pk/wp-content/uploads/2025/05/HR-V.jpg",
    },
    {
      name: "MG HS",
      price: "₨ 12,000 /perday",
      image: "https://convoytravels.pk/wp-content/uploads/2025/05/MG-HS.jpg",
    },
    {
      name: "Honda BRV",
      price: "₨ 8,000 /perday",
      image: "https://convoytravels.pk/wp-content/uploads/2025/05/MG-HS-1.jpg",
    },
    {
      name: "Hyundai Tuscon",
      price: "₨ 10,000 /perday",
      image: "https://convoytravels.pk/wp-content/uploads/2025/05/Tuscon.jpg",
    },
    {
      name: "Toyota Land Cruiser V8",
      price: "₨ 35,000 /perday",
      image:
        "https://convoytravels.pk/wp-content/uploads/2025/05/Toyota-Land-Cruiser-V8.jpg",
    },
    {
      name: "Toyota Fortuner",
      price: "₨ 15,000 /perday",
      image:
        "https://convoytravels.pk/wp-content/uploads/2025/05/Toyota-Fortuner.jpg",
    },
    {
      name: "Toyota Prado TX",
      price: "₨ 17,000 /perday",
      image: "https://convoytravels.pk/wp-content/uploads/2025/05/prado.jpg",
    },
    {
      name: "Toyota Revo",
      price: "₨ 14,000 /perday",
      image: "https://convoytravels.pk/wp-content/uploads/2025/05/Revo.jpg",
    },
    {
      name: "Suzuki APV",
      price: "₨ 7,000 /perday",
      image:
        "https://convoytravels.pk/wp-content/uploads/2025/05/Suzuki-APV.jpg",
    },
    {
      name: "Toyota High Roof",
      price: "₨ 13,000 /perday",
      image:
        "https://convoytravels.pk/wp-content/uploads/2025/05/Toyota-High-Roof.jpg",
    },
    {
      name: "BH 120",
      price: "₨ 50,000/perday",
      image: "https://convoytravels.pk/wp-content/uploads/2025/05/BH1201.jpg",
    },
    {
      name: "Coaster",
      price: "₨ 15,000 /perday",
      image: "https://convoytravels.pk/wp-content/uploads/2025/05/Coaster.jpg",
    },
  ];

  return (
    <section className="w-full">
      <div className="bg-[#1a2b5c] text-white text-center py-10 px-6">
        <p className="text-lg md:text-xl mb-4">
          Drive with Us Today! - Convoy Travels: Trusted by Over 1000 Customers
        </p>
        <button className="border border-white text-white px-6 py-2 rounded-md hover:bg-white hover:text-[#1a2b5c] transition">
          Reserve a Car
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-16 px-6 md:px-20 max-w-7xl mx-auto">
        <div>
          <p className="text-gray-500 text-sm md:text-base flex items-center gap-2 mb-1">
            <span className="w-6 h-0.5 bg-[#1a2b5c] inline-block"></span>
            People Love the Most
          </p>
          <h2 className="text-4xl md:text-6xl font-bold text-[#1a2b5c] leading-tight">
            Featured Rent Cars in <br className="hidden md:block" /> Lahore
          </h2>
        </div>

        <button className="bg-[#1a2b5c] text-white text-sm md:text-base font-semibold px-6 py-3 mt-6 md:mt-0 rounded-sm hover:bg-[#0d1b2a] transition">
          View All Cars
        </button>
      </div>

      <div className="bg-white py-12 px-6 md:px-20 max-w-7xl mx-auto" style={{ fontFamily: 'Roboto, sans-serif' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {cars.map((car, index) => (
            <div
              key={index}
              className="featured-car-card border border-gray-200 shadow-lg rounded-xl overflow-hidden bg-white group"
            >
              <div className="featured-car-image-container w-full h-[280px] sm:h-[260px] lg:h-[280px] flex items-center justify-center">
                <img
                  src={car.image}
                  alt={car.name}
                  className="max-h-[220px] object-contain transition-transform duration-500 ease-out"
                />
              </div>
              <div className="p-6 sm:p-7">
                <h3 className="text-xl font-bold text-[#0d1b2a] mb-2 leading-tight">
                  {car.name}
                </h3>
                <p className="text-[#1a2b5c] font-semibold text-lg mb-4">{car.price}</p>
                <ul className="text-gray-600 text-sm space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <FaUser className="text-[#1a2b5c]" /> 4 Seats
                  </li>
                  <li className="flex items-center gap-2">
                    <FaSnowflake className="text-[#1a2b5c]" /> Air Conditioning
                  </li>
                  <li className="flex items-center gap-2">
                    <FaCogs className="text-[#1a2b5c]" /> Automatic gearbox
                  </li>
                </ul>
                <button className="book-now-button w-full bg-[#1a2b5c] text-white py-3 rounded-lg hover:bg-[#0d1b2a] transition-colors duration-300 font-semibold relative">
                  <span className="book-now-button-text inline-block">
                    Book Now
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

