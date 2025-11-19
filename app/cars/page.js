"use client";

import { useState, useEffect, useMemo } from "react";
import VehicleCard from "@/components/VehicleCard";
import { FaSearch, FaSpinner } from "react-icons/fa";
import { API_BASE_URL, API_IMAGE_BASE_URL } from "@/config/api";

export default function AllCarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  
  // Get unique brands and categories from cars
  const brands = useMemo(() => {
    const uniqueBrands = [...new Set(cars.map(car => car.brand).filter(Boolean))];
    return uniqueBrands.sort();
  }, [cars]);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(cars.map(car => car.category).filter(Boolean))];
    return uniqueCategories.sort();
  }, [cars]);

  // Fetch all cars from API
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/cars`);
        const data = await response.json();

        if (data.success && data.data && data.data.cars) {
          // Transform API data to match card format
          const transformedCars = data.data.cars.map((car) => ({
            id: car._id,
            name: car.name,
            price: `Rs ${car.rentPerDay?.toLocaleString()}`,
            priceFull: `Rs ${car.rentPerDay?.toLocaleString()} /perday`,
            priceNumber: car.rentPerDay,
            image: car.carPhoto ? `${API_IMAGE_BASE_URL}${car.carPhoto}` : "",
            location: car.location?.city || "Location not specified",
            category: car.category?.name || "",
            featured: car.status === "available" && car.isAvailable,
            brand: car.brand,
            model: car.model,
            year: car.year,
            transmission: car.transmission,
            fuelType: car.fuelType,
            seats: car.seats,
            serialNo: car.serialNo || 1, // Include serialNo for sorting
          }));
          setCars(transformedCars);
        }
      } catch (error) {
        console.error("Error fetching cars:", error);
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Filter cars based on search query, brand, and category
  const filteredCars = useMemo(() => {
    let filtered = cars;

    // Filter by brand
    if (selectedBrand) {
      filtered = filtered.filter(
        (car) => car.brand?.toLowerCase() === selectedBrand.toLowerCase()
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(
        (car) => car.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (car) =>
          car.name?.toLowerCase().includes(query) ||
          car.brand?.toLowerCase().includes(query) ||
          car.model?.toLowerCase().includes(query) ||
          car.category?.toLowerCase().includes(query) ||
          car.location?.toLowerCase().includes(query) ||
          car.transmission?.toLowerCase().includes(query) ||
          car.fuelType?.toLowerCase().includes(query)
      );
    }

    // Sort by serialNo within each category
    // Group by category first, then sort each group by serialNo
    const groupedByCategory = filtered.reduce((acc, car) => {
      const catKey = car.category?.toLowerCase() || 'uncategorized';
      if (!acc[catKey]) {
        acc[catKey] = [];
      }
      acc[catKey].push(car);
      return acc;
    }, {});

    // Sort each category group by serialNo, then flatten
    const sorted = Object.values(groupedByCategory)
      .map((categoryCars) => {
        return categoryCars.sort((a, b) => {
          const serialNoA = a.serialNo || 1;
          const serialNoB = b.serialNo || 1;
          return serialNoA - serialNoB;
        });
      })
      .flat();

    return sorted;
  }, [cars, selectedBrand, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Roboto, sans-serif' }}>
      {/* Header Section */}
      <div className="bg-[#1a2b5c] text-white py-12 md:py-16 px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            All Available Cars
          </h1>
          <p className="text-lg md:text-xl text-gray-200">
            Browse through our complete collection of rental cars
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-20 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* Search Bar */}
            <div className="flex-1 w-full md:w-auto relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, brand, model, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Brand Filter */}
            <div className="w-full md:w-48">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent outline-none transition-all appearance-none bg-white cursor-pointer"
              >
                <option value="">All Brands</option>
                {brands.map((brand, index) => (
                  <option key={index} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="w-full md:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent outline-none transition-all appearance-none bg-white cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories
                  .filter((category) => category?.toUpperCase() !== "4X4")
                  .map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            {(selectedBrand || selectedCategory || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedBrand("");
                  setSelectedCategory("");
                  setSearchQuery("");
                }}
                className="px-4 py-3 text-[#1a2b5c] border border-[#1a2b5c] rounded-lg hover:bg-[#1a2b5c] hover:text-white transition-colors duration-300 whitespace-nowrap"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredCars.length} of {cars.length} cars
            {(selectedBrand || selectedCategory || searchQuery) && (
              <span className="ml-2">
                (filtered)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Cars Grid Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="w-8 h-8 text-[#1a2b5c] animate-spin" />
            <span className="ml-3 text-gray-600">Loading cars...</span>
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 mb-4">
              {searchQuery || selectedBrand || selectedCategory
                ? "No cars found matching your filters"
                : "No cars available at the moment"}
            </p>
            {(searchQuery || selectedBrand || selectedCategory) && (
              <button
                onClick={() => {
                  setSelectedBrand("");
                  setSelectedCategory("");
                  setSearchQuery("");
                }}
                className="px-6 py-3 bg-[#1a2b5c] text-white rounded-lg hover:bg-[#0d1b2a] transition-colors duration-300"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredCars.map((car) => (
              <VehicleCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

