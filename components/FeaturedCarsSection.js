/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaUser, FaSnowflake, FaCogs, FaMapMarkerAlt } from "react-icons/fa";
import { API_BASE_URL, API_IMAGE_BASE_URL } from "@/config/api";
import { generateSlug } from "@/utils/slug";
import "./featured-cars.css";

const transformCar = (car) => {
  const priceNumber = Number(car.rentPerDay) || 0;
  const formattedPrice = priceNumber
    ? `Rs ${priceNumber.toLocaleString()}`
    : "Price on request";

  let imageUrl = "";
  if (car.carPhoto) {
    const photoPath = car.carPhoto.startsWith('/') ? car.carPhoto : `/${car.carPhoto}`;
    const baseUrl = API_IMAGE_BASE_URL.endsWith('/') 
      ? API_IMAGE_BASE_URL.slice(0, -1) 
      : API_IMAGE_BASE_URL;
    imageUrl = `${baseUrl}${photoPath}`;
  }

  return {
    id: car._id,
    name: car.name || "Vehicle",
    price: formattedPrice,
    priceFull: `${formattedPrice} /perday`,
    image: imageUrl,
    location: car.location?.city
      ? `${car.location.city}${car.location.province ? `, ${car.location.province}` : ""}${car.location.country ? `, ${car.location.country}` : ""}`
      : "Location not specified",
    seats: car.seats || 4,
    transmission: car.transmission || "Automatic",
    fuelType: car.fuelType || "Petrol",
    featured: car.isFeatured === true,
    category: car.category?.name || "",
    serialNo: car.serialNo || 1,
  };
};

export default function FeaturedCarsSection() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchFeaturedCars = async () => {
      try {
        // Fetch only featured and available cars from the API
        const response = await fetch(`${API_BASE_URL}/cars?isFeatured=true&status=available`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to load cars: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const apiCars = data?.data?.cars || [];

        if (isMounted) {
          let featuredCars = apiCars.map(transformCar);
          
          const groupedByCategory = featuredCars.reduce((acc, car) => {
            const catKey = car.category?.toLowerCase() || 'uncategorized';
            if (!acc[catKey]) {
              acc[catKey] = [];
            }
            acc[catKey].push(car);
            return acc;
          }, {});

          featuredCars = Object.values(groupedByCategory)
            .map((categoryCars) => {
              return categoryCars.sort((a, b) => {
                const serialNoA = a.serialNo || 1;
                const serialNoB = b.serialNo || 1;
                return serialNoA - serialNoB;
              });
            })
            .flat();
          
          setCars(featuredCars);
        }
      } catch (error) {
        if (isMounted) {
          setCars([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFeaturedCars();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="w-full">
      <div className="bg-[#1a2b5c] text-white text-center py-10 px-6">
        <p className="text-lg md:text-xl mb-4">
          Drive with Us Today! - Convoy Travels: Trusted by Over 1000 Customers
        </p>
        {/* <button className="border border-white text-white px-6 py-2 rounded-md hover:bg-white hover:text-[#1a2b5c] transition">
          Reserve a Car
        </button> */}
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

        <Link href="/cars" className="btn-gradient-primary text-white text-sm md:text-base font-semibold px-6 py-3 mt-6 md:mt-0 rounded-sm inline-block relative z-10">
          View All Cars
        </Link>
      </div>

      <div className="bg-white py-12 px-6 md:px-20 max-w-7xl mx-auto" style={{ fontFamily: 'Roboto, sans-serif' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {cars.map((car, index) => {
            const cardContent = (
              <div className="featured-car-card border border-gray-200 shadow-lg rounded-xl overflow-hidden bg-white group h-full">
                <div className="featured-car-image-container w-full h-[280px] sm:h-[260px] lg:h-[280px] flex items-center justify-center bg-gray-50">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="max-h-[220px] object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="p-6 sm:p-7">
                  <div className="flex items-center justify-between mb-3">
                    {car.featured && (
                      <span className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-md">
                        Featured
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-[#0d1b2a] mb-2 leading-tight">
                    {car.name}
                  </h3>
                  <p className="text-[#1a2b5c] font-semibold text-lg mb-4">{car.priceFull || car.price}</p>
                  <div className="text-gray-600 text-sm flex items-center gap-2 mb-4">
                    <FaMapMarkerAlt className="text-[#1a2b5c]" />
                    <span>{car.location || 'Location not specified'}</span>
                  </div>
                   <div className="text-gray-600 text-sm flex items-center gap-2 mb-4">
                      <FaUser className="text-[#1a2b5c]" /> {car.seats || 4} Seats 
                      <FaCogs className="text-[#1a2b5c]" /> {car.transmission || 'Automatic'}
                      <FaSnowflake className="text-[#1a2b5c]" /> {car.fuelType || 'Petrol'}
                  </div>
                  {/* <ul className="text-gray-600 text-sm space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <FaUser className="text-[#1a2b5c]" /> {car.seats || 4} Seats
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCogs className="text-[#1a2b5c]" /> {car.transmission || 'Automatic'}
                    </li>
                    <li className="flex items-center gap-2">
                      <FaSnowflake className="text-[#1a2b5c]" /> {car.fuelType || 'Petrol'}
                    </li>
                  </ul> */}
                  <div className="book-now-button w-full btn-gradient-primary text-white py-3 rounded-lg font-semibold text-center relative z-10 cursor-pointer">
                    Book Now
                  </div>
                </div>
              </div>
            );

            const carSlug = car.slug || generateSlug(car.name) || car.id;
            return (
              <Link key={car.id || index} href={`/cars/${carSlug}`} className="block h-full">
                {cardContent}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

