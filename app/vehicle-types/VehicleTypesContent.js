'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getCarsByCategory } from '@/data/cars';
import VehicleCard from '@/components/VehicleCard';
import VehicleCardList from '@/components/VehicleCardList';
import { FaSearch, FaTh, FaList, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function VehicleTypesContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || null;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewType, setViewType] = useState('grid'); // 'grid' or 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Get filtered cars based on category
  const categoryCars = category ? getCarsByCategory(category) : [];
  
  // Filter cars based on search query
  const filteredCars = useMemo(() => {
    if (!searchQuery.trim()) return categoryCars;
    
    const query = searchQuery.toLowerCase().trim();
    return categoryCars.filter(car => 
      car.name.toLowerCase().includes(query) ||
      car.price.toLowerCase().includes(query) ||
      car.location.toLowerCase().includes(query)
    );
  }, [categoryCars, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCars = filteredCars.slice(startIndex, endIndex);

  // Reset to page 1 when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, category]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {category ? (
        <>
          {/* Category Header with Search and View Toggle */}
          <div className="mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
                {category}
              </h1>
              
              {/* Search Bar and View Toggle */}
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Search Bar */}
                <div className="relative flex-1 sm:flex-initial sm:w-64 lg:w-80">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search vehicles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent text-gray-900 placeholder-gray-400"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
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
            </div>
          </div>

          {/* Cars Display */}
          {filteredCars.length > 0 ? (
            <>
              {/* Grid View */}
              {viewType === 'grid' ? (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7 md:gap-6 lg:gap-7 mb-12">
                  {paginatedCars.map((car, index) => (
                    <VehicleCard key={index} car={car} />
                  ))}
                </div>
              ) : (
                /* List View */
                <div className="w-full space-y-6 mb-12">
                  {paginatedCars.map((car, index) => (
                    <VehicleCardList key={index} car={car} />
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
                    // Show first page, last page, current page, and pages around current
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
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
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
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">
                {searchQuery ? `No vehicles found matching "${searchQuery}"` : 'No vehicles found in this category.'}
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Default View - Show all categories */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-[#1a2b5c] mb-6">
              Vehicle Types
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
              Explore our diverse fleet of vehicles to find the perfect match for your travel needs
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-8 mb-16">
            <p className="text-center text-gray-600 text-lg">
              Please select a vehicle category from the navigation menu to view available vehicles.
            </p>
          </div>
        </>
      )}
    </>
  );
}
