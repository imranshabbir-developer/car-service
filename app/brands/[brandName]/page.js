'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import VehicleCard from '@/components/VehicleCard';
import VehicleCardList from '@/components/VehicleCardList';
import { API_BASE_URL, API_IMAGE_BASE_URL } from '@/config/api';
import { FaArrowLeft, FaSpinner, FaSearch, FaTh, FaList, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function BrandDetailPage() {
  const params = useParams();
  const brandNameParam = params.brandName;
  
  // Decode brand name from URL - keep original format for matching
  const brandNameFromUrl = useMemo(() => {
    if (!brandNameParam) return '';
    return decodeURIComponent(brandNameParam);
  }, [brandNameParam]);

  // Store the actual brand name from API for display
  const [actualBrandName, setActualBrandName] = useState('');

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewType, setViewType] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

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
            slug: car.slug,
            serialNo: car.serialNo || 1, // Include serialNo for sorting
          }));
          setCars(transformedCars);

          // Find the actual brand name from API (for display)
          const matchingCar = transformedCars.find(
            (car) => car.brand?.toLowerCase() === brandNameFromUrl.toLowerCase()
          );
          if (matchingCar && matchingCar.brand) {
            setActualBrandName(matchingCar.brand);
          } else {
            // Fallback: capitalize the URL brand name
            setActualBrandName(
              brandNameFromUrl
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ')
            );
          }
        }
      } catch (error) {
        console.error('Error fetching cars:', error);
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [brandNameFromUrl]);

  // Filter cars by brand name (case-insensitive) and search query
  const filteredCars = useMemo(() => {
    let filtered = cars;

    // Filter by brand name - match exactly with API brand field (case-insensitive)
    if (brandNameFromUrl) {
      filtered = filtered.filter(
        (car) => car.brand?.toLowerCase().trim() === brandNameFromUrl.toLowerCase().trim()
      );
    }

    // Apply search query filter if provided
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (car) =>
          car.name?.toLowerCase().includes(query) ||
          car.model?.toLowerCase().includes(query) ||
          car.category?.toLowerCase().includes(query) ||
          car.location?.toLowerCase().includes(query)
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
  }, [cars, brandNameFromUrl, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCars = filteredCars.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50" style={{ fontFamily: 'Roboto, sans-serif' }}>
      {/* Header Section */}
      <div className="bg-[#1a2b5c] text-white py-12 md:py-16 px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <FaArrowLeft />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {actualBrandName || brandNameFromUrl} Cars
          </h1>
          <p className="text-lg md:text-xl text-gray-200">
            Explore our collection of {actualBrandName || brandNameFromUrl} vehicles
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
                placeholder="Search by name, model, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* View Toggle Icons */}
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewType('grid')}
                className={`p-2 rounded transition-colors ${
                  viewType === 'grid'
                    ? 'bg-[#1a2b5c] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label="Grid View"
              >
                <FaTh className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewType('list')}
                className={`p-2 rounded transition-colors ${
                  viewType === 'list'
                    ? 'bg-[#1a2b5c] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label="List View"
              >
                <FaList className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'} for {actualBrandName || brandNameFromUrl}
            {searchQuery && (
              <span className="ml-2">
                (filtered by &quot;{searchQuery}&quot;)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Cars Display Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="animate-spin text-[#1a2b5c] text-4xl" />
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 mb-4">
              {searchQuery
                ? `No ${actualBrandName || brandNameFromUrl} cars found matching "${searchQuery}"`
                : `No ${actualBrandName || brandNameFromUrl} cars available at the moment`}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-6 py-3 bg-[#1a2b5c] text-white rounded-lg hover:bg-[#0d1b2a] transition-colors duration-300"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewType === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mb-12">
                {paginatedCars.map((car) => (
                  <VehicleCard key={car.id} car={car} />
                ))}
              </div>
            ) : (
              /* List View */
              <div className="space-y-6 mb-12">
                {paginatedCars.map((car) => (
                  <VehicleCardList key={car.id} car={car} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-end items-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-all ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-[#1a2b5c] hover:text-white hover:border-[#1a2b5c]'
                  }`}
                  aria-label="Previous Page"
                >
                  <FaChevronLeft className="w-4 h-4" />
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`min-w-[40px] h-10 px-3 rounded-lg transition-all font-medium ${
                          currentPage === page
                            ? 'bg-[#1a2b5c] text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <span key={page} className="px-2 text-gray-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition-all ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-[#1a2b5c] hover:text-white hover:border-[#1a2b5c]'
                  }`}
                  aria-label="Next Page"
                >
                  <FaChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

