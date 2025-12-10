/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaUser, FaSnowflake, FaCogs, FaMapMarkerAlt } from "react-icons/fa";
import { API_BASE_URL, API_IMAGE_BASE_URL } from "@/config/api";
import { generateSlug } from "@/utils/slug";
import "./featured-cars.css";

const FALLBACK_CAR_IMAGE =
  "https://api.convoytravels.pk/uploads/cars/untitled-design-2024-02-02t202138-109-1763004865456-581939279.webp";

export default function FeaturedCarsSection() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchFeaturedCars = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/cars?isFeatured=true&status=available`
        );
        const json = await res.json();
        const apiCars = json?.data?.cars || [];

        if (isMounted) setCars(apiCars);
      } catch (err) {
        console.error("Fetch error:", err);
        if (isMounted) setCars([]);
      }
    };

    fetchFeaturedCars();
    return () => (isMounted = false);
  }, []);



  return (
    <section className="w-full">

      {/* Header */}
      <div className="bg-[#1a2b5c] text-white text-center py-10 px-6">
        <p className="text-lg md:text-xl mb-4">
          Drive with Us Today! - Convoy Travels: Trusted by Over 1000 Customers
        </p>
      </div>

      {/* Section Title */}
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

        <Link
          href="/cars"
          className="btn-gradient-primary text-white text-sm md:text-base font-semibold px-6 py-3 mt-6 md:mt-0 rounded-sm inline-block"
        >
          View All Cars
        </Link>
      </div>

      {/* Cars Grid */}
      <div className="bg-white py-12 px-6 md:px-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">

          {cars.map((car) => {
            const img = car?.carPhoto
              ? `${API_IMAGE_BASE_URL.replace(/\/$/, "")}${
                  car.carPhoto.startsWith("/") ? car.carPhoto : `/${car.carPhoto}`
                }`
              : FALLBACK_CAR_IMAGE;
            const slug = car.slug || generateSlug(car.name) || car._id;

            return (
              <Link key={car._id} href={`/cars/${slug}`} className="block h-full">
                <div className="featured-car-card border border-gray-200 shadow-lg rounded-xl overflow-hidden bg-white group h-full">

                  {/* Car Image */}
                  <div className="featured-car-image-container w-full h-[280px] bg-gray-50 flex items-center justify-center">
                    
                      <img
                        src={img}
                        alt={car.name}
                        className="max-h-[220px] object-contain transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_CAR_IMAGE;      
                        }}
                      />
                  </div>

                  {/* Car Details */}
                  <div className="p-6">

                    {car.isFeatured && (
                      <span className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-md mb-3">
                        Featured
                      </span>
                    )}

                    <h3 className="text-xl font-bold text-[#0d1b2a] mb-2">
                      {car.name}
                    </h3>

                    <p className="text-[#1a2b5c] font-semibold text-lg mb-4">
                      Rs {Number(car.rentPerDay).toLocaleString()} /perday
                    </p>

                    <div className="text-gray-600 text-sm flex items-center gap-2 mb-4">
                      <FaMapMarkerAlt className="text-[#1a2b5c]" />
                      {car.location?.city || "Location not specified"}
                    </div>

                    <div className="text-gray-600 text-sm flex items-center gap-3 mb-4">
                      <FaUser className="text-[#1a2b5c]" /> {car.seats}
                      <FaCogs className="text-[#1a2b5c]" /> {car.transmission}
                      <FaSnowflake className="text-[#1a2b5c]" /> {car.fuelType}
                    </div>

                    <div className="btn-gradient-primary text-white py-3 rounded-lg font-semibold text-center cursor-pointer">
                      Book Now
                    </div>

                  </div>
                </div>
              </Link>
            );
          })}

        </div>
      </div>
    </section>
  );
}
