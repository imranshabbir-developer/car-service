'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import VehicleCard from '@/components/VehicleCard';
import VehicleCardList from '@/components/VehicleCardList';
import { FaSearch, FaTh, FaList, FaChevronLeft, FaChevronRight, FaSpinner, FaCalendarAlt, FaUser, FaArrowRight } from 'react-icons/fa';
import { API_BASE_URL, API_IMAGE_BASE_URL } from '@/config/api';

export default function VehicleTypesContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || null;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewType, setViewType] = useState('grid'); // 'grid' or 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const itemsPerPage = 12;

  // Fetch cars from API
  useEffect(() => {
    const fetchCars = async () => {
      if (!category) return; // Only fetch if category is selected
      
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/cars`);
        const data = await response.json();
        
        if (data.success && data.data.cars) {
          // Transform API data to match card format
          const transformedCars = data.data.cars.map(car => ({
            id: car._id,
            name: car.name,
            price: `Rs ${car.rentPerDay?.toLocaleString()}`,
            priceFull: `Rs ${car.rentPerDay?.toLocaleString()} /perday`,
            priceNumber: car.rentPerDay,
            image: car.carPhoto ? `${API_IMAGE_BASE_URL}${car.carPhoto}` : '',
            location: car.location?.city || 'Location not specified',
            category: car.category?.name || '',
            featured: car.status === 'available' && car.isAvailable, // Optional featured logic
            brand: car.brand,
            model: car.model,
            year: car.year,
            transmission: car.transmission,
            fuelType: car.fuelType,
            seats: car.seats,
          }));
          setCars(transformedCars);
        }
      } catch (error) {
        console.error('Error fetching cars:', error);
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [category]);

  // Fetch blogs for the category
  useEffect(() => {
    const fetchBlogs = async () => {
      if (!category) {
        setBlogs([]);
        return;
      }
      
      try {
        setBlogsLoading(true);
        const response = await fetch(`${API_BASE_URL}/blogs`);
        const data = await response.json();
        
        if (data.success && data.data && data.data.blogs) {
          // Filter blogs by category name (case-insensitive) and only published blogs
          const categoryBlogs = data.data.blogs.filter(blog => 
            blog.published && 
            blog.category && 
            blog.category.name?.toLowerCase() === category.toLowerCase()
          );
          setBlogs(categoryBlogs);
        } else {
          setBlogs([]);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setBlogs([]);
      } finally {
        setBlogsLoading(false);
      }
    };

    if (typeof window !== 'undefined') {
      fetchBlogs();
    }
  }, [category]);

  // Filter cars based on search query and category
  const filteredCars = useMemo(() => {
    // Filter by category name (case-insensitive)
    let categoryCars = cars;
    if (category) {
      categoryCars = cars.filter(car => 
        car.category?.toLowerCase() === category.toLowerCase()
      );
    }
    
    if (!searchQuery.trim()) return categoryCars;
    
    const query = searchQuery.toLowerCase().trim();
    return categoryCars.filter(car => 
      car.name?.toLowerCase().includes(query) ||
      car.price?.toLowerCase().includes(query) ||
      car.location?.toLowerCase().includes(query) ||
      car.brand?.toLowerCase().includes(query) ||
      car.model?.toLowerCase().includes(query)
    );
  }, [category, searchQuery, cars]);

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
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <FaSpinner className="animate-spin text-[#1a2b5c] text-4xl" />
            </div>
          ) : filteredCars.length > 0 ? (
            <>
              {/* Grid View */}
              {viewType === 'grid' ? (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7 md:gap-6 lg:gap-7 mb-12">
                  {paginatedCars.map((car) => (
                    <VehicleCard key={car.id} car={car} />
                  ))}
                </div>
              ) : (
                /* List View */
                <div className="w-full space-y-6 mb-12">
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

          {/* Related Blogs Section */}
          {blogs.length > 0 && (
            <div className="mt-20 pt-16 border-t border-gray-200">
              <div className="mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Related Blog Posts
                </h2>
                <p className="text-gray-600 text-lg">
                  Explore our latest insights and tips about {category} vehicles
                </p>
              </div>

              {blogsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <FaSpinner className="animate-spin text-[#1a2b5c] text-3xl" />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {blogs.map((blog) => (
                    <Link
                      key={blog._id}
                      href={`/blog/${blog.slug || blog._id}`}
                      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200"
                    >
                      {/* Blog Image */}
                      <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                        {blog.featuredImage ? (
                          <img
                            src={`${API_IMAGE_BASE_URL}${blog.featuredImage}`}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-4xl font-bold text-gray-300">
                              {blog.title?.charAt(0).toUpperCase() || 'B'}
                            </div>
                          </div>
                        )}
                        {blog.published && (
                          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 text-xs font-semibold rounded-full">
                            Published
                          </div>
                        )}
                      </div>

                      {/* Blog Content */}
                      <div className="p-6">
                        {/* Category Badge */}
                        {blog.category && (
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full mb-3">
                            {blog.category.name}
                          </span>
                        )}

                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#1a2b5c] transition-colors line-clamp-2">
                          {blog.title}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                          {blog.description || blog.content?.replace(/<[^>]*>/g, '').substring(0, 120) + '...' || 'No description available'}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="w-3 h-3" />
                            <span>
                              {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              }) : 'Recent'}
                            </span>
                          </div>
                          {blog.createdBy && (
                            <div className="flex items-center gap-2">
                              <FaUser className="w-3 h-3" />
                              <span>{blog.createdBy.name || 'Admin'}</span>
                            </div>
                          )}
                        </div>

                        {/* Read More Link */}
                        <div className="flex items-center gap-2 text-[#1a2b5c] font-semibold text-sm group-hover:gap-3 transition-all">
                          <span>Read More</span>
                          <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
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
