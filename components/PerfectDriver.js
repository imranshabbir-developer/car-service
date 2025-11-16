"use client";

import { useRouter } from "next/navigation";
import "./perfect-driver.css";

export default function PerfectDriver() {
  const router = useRouter();

  const vehicles = [
    {
      title: "Cars",
      img: "/Corrola.webp",
    },
    {
      title: "4x4",
      img: "/c2.webp",
    },
    {
      title: "Vans & Buses",
      img: "/c3.webp",
    },
  ];

  // Map titles to the category param you want in the URL
  const categoryParamMap = {
    Cars: "Cars",
    "4x4": "4X4",
    "Vans & Buses": "Vans & Buses",
  };

  const handleCardClick = (vehicle) => {
    const categoryParam = categoryParamMap[vehicle.title];
    if (!categoryParam) return;

    router.push(
      `/vehicle-types?category=${encodeURIComponent(categoryParam)}`
    );
  };

  return (
    <>
      <section
        className="bg-white py-16 px-6 md:px-16 text-center"
        style={{ fontFamily: "Roboto, sans-serif" }}
      >
        <h2 className="text-3xl md:text-5xl font-bold text-[#0d1b2a] mb-12">
          Your Perfect Drive
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {vehicles.map((vehicle, index) => (
            <div
              key={index}
              className="vehicle-card bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-2xl overflow-hidden group cursor-pointer"
              onClick={() => handleCardClick(vehicle)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCardClick(vehicle);
              }}
              role="button"
              tabIndex={0}
            >
              <div className="vehicle-card-image-container p-8 sm:p-10 flex justify-center items-center min-h-[280px] sm:min-h-[320px]">
                <img
                  src={vehicle.img}
                  alt={vehicle.title}
                  className="h-48 md:h-64 object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
                />
              </div>
              <div className="vehicle-card-bottom bg-[#0d1b2a] text-white text-lg sm:text-xl font-semibold py-4 sm:py-5 px-6">
                <span className="vehicle-card-bottom-text relative z-10 inline-block">
                  {vehicle.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
