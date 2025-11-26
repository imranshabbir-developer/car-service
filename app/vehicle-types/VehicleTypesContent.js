"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import VehicleCard from "@/components/VehicleCard";
import VehicleCardList from "@/components/VehicleCardList";
import {
  FaSearch,
  FaTh,
  FaList,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
  FaCalendarAlt,
  FaUser,
  FaRegNewspaper,
  FaClock,
  FaTag,
} from "react-icons/fa";
import { API_BASE_URL, API_IMAGE_BASE_URL } from "@/config/api";
import RichTextRenderer from "@/components/RichTextRenderer";

const getBlogExcerpt = (htmlContent = "", limit = 170) => {
  if (!htmlContent) return "";
  const stripped = htmlContent
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!stripped) return "";
  return stripped.length > limit
    ? `${stripped.slice(0, limit).trim()}…`
    : stripped;
};

export default function VehicleTypesContent({ searchParams: propSearchParams }) {
  const urlSearchParams = useSearchParams();
  // Use prop searchParams if provided (from dynamic route), otherwise use URL searchParams
  const category = propSearchParams?.category || urlSearchParams.get("category") || null;
  const allCars = propSearchParams?.allCars === "true" || urlSearchParams.get("allCars") === "true";
  const brand = propSearchParams?.brand || urlSearchParams.get("brand") || null;
  const pickupDateParam = propSearchParams?.pickupDate || urlSearchParams.get("pickupDate") || null;
  const dropoffDateParam = propSearchParams?.dropoffDate || urlSearchParams.get("dropoffDate") || null;
  const searchParam = propSearchParams?.search || urlSearchParams.get("search") || null;

  const [searchQuery, setSearchQuery] = useState("");
  const [viewType, setViewType] = useState("grid"); // 'grid' or 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const itemsPerPage = 12;

  // Set search query from URL parameter if provided
  useEffect(() => {
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParam]);

  // Store dates in localStorage if provided via query params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (pickupDateParam) {
        localStorage.setItem('pickupDate', pickupDateParam);
      }
      if (dropoffDateParam) {
        localStorage.setItem('dropoffDate', dropoffDateParam);
      }
    }
  }, [pickupDateParam, dropoffDateParam]);

  // Fetch cars from API
  useEffect(() => {
    const fetchCars = async () => {
      // Fetch cars if category is provided or allCars is true
      if (!category && !allCars) return;

      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/cars`);
        const data = await response.json();

        if (data.success && data.data.cars) {
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
  }, [category, allCars]);

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
          const categoryBlogs = data.data.blogs.filter(
            (blog) =>
              blog.published &&
              blog.category &&
              blog.category.name?.toLowerCase() === category.toLowerCase()
          );
          setBlogs(categoryBlogs);
        } else {
          setBlogs([]);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setBlogs([]);
      } finally {
        setBlogsLoading(false);
      }
    };

    if (typeof window !== "undefined") {
      fetchBlogs();
    }
  }, [category]);

  // Filter cars based on search query, category, and brand
  const filteredCars = useMemo(() => {
    let filtered = cars;

    // If allCars is true, show all vehicles except 4X4 and Vans & Buses
    if (allCars) {
      filtered = filtered.filter(
        (car) => {
          const carCategory = car.category?.toLowerCase();
          // Exclude 4X4 and Vans & Buses, show everything else
          return carCategory !== '4x4' && carCategory !== 'vans & buses';
        }
      );
    }

    // Filter by category if provided (and not allCars)
    if (category && !allCars) {
      filtered = filtered.filter(
        (car) => car.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by brand if provided
    if (brand) {
      filtered = filtered.filter(
        (car) => car.brand?.toLowerCase() === brand.toLowerCase()
      );
    }

    // Apply search query filter if provided
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (car) =>
          car.name?.toLowerCase().includes(query) ||
          car.price?.toLowerCase().includes(query) ||
          car.location?.toLowerCase().includes(query) ||
          car.brand?.toLowerCase().includes(query) ||
          car.model?.toLowerCase().includes(query)
      );
    }

    // Sort by serialNo within each category
    // Group by category first, then sort each group by serialNo
    if (allCars) {
      // For allCars view: group by category, sort each group by serialNo, then flatten
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
    } else {
      // For single category view: just sort by serialNo
      return filtered.sort((a, b) => {
        const serialNoA = a.serialNo || 1;
        const serialNoB = b.serialNo || 1;
        return serialNoA - serialNoB;
      });
    }
  }, [category, allCars, brand, searchQuery, cars]);

  const blogsLastUpdated = useMemo(() => {
    if (!blogs.length) return "Recently updated";

    const latestTimestamp = blogs.reduce((latest, blog) => {
      if (!blog?.createdAt) return latest;
      const timestamp = new Date(blog.createdAt).getTime();
      if (Number.isNaN(timestamp)) return latest;
      if (!latest || timestamp > latest) {
        return timestamp;
      }
      return latest;
    }, null);

    if (!latestTimestamp) return "Recently updated";
    return new Date(latestTimestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [blogs]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCars = filteredCars.slice(startIndex, endIndex);

  // Reset to page 1 when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, category, allCars]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      {(category || allCars) ? (
        <>
          {/* Category Header with Search and View Toggle */}
          <div className="mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
                {allCars ? "Cars" : category}
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
                    style={{ fontFamily: "Roboto, sans-serif" }}
                  />
                </div>

                {/* View Toggle Icons */}
                <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1">
                  <button
                    onClick={() => setViewType("grid")}
                    className={`p-2 rounded transition-colors ${
                      viewType === "grid"
                        ? "btn-gradient-primary text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    aria-label="Grid View"
                  >
                    <FaTh className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewType("list")}
                    className={`p-2 rounded transition-colors ${
                      viewType === "list"
                        ? "btn-gradient-primary text-white"
                        : "text-gray-600 hover:bg-gray-100"
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
              {viewType === "grid" ? (
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
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "btn-gradient-outline text-gray-700"
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
                              ? "btn-gradient-primary text-white"
                              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
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
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "btn-gradient-outline text-gray-700"
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
                {searchQuery
                  ? `No vehicles found matching "${searchQuery}"`
                  : "No vehicles found in this category."}
              </p>
            </div>
          )}

          {/* Related Blogs Section - Only show for specific categories, not for allCars */}
          {!allCars && blogs.length > 0 && (
            <div className="border-t border-gray-200">
              {/* Section header */}
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
               
               
              </div>

              {blogsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <FaSpinner className="animate-spin text-[#1a2b5c] text-3xl" />
                </div>
              ) : (
                <div className="space-y-10">
                  {blogs.map((blog, index) => {
                    const formattedDate = blog.createdAt
                      ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Recent";
                    const authorName = blog.createdBy?.name || "Admin";
                    const articleId = `blog-${blog.slug || blog._id}`;
                    const hasFeaturedImage = Boolean(blog.featuredImage);
                    const blogTags = Array.isArray(blog.tags)
                      ? blog.tags
                          .map((tag) =>
                            typeof tag === "string"
                              ? tag
                              : tag?.name || tag?.label || null
                          )
                          .filter(Boolean)
                      : null;

                    // Prefer full content, fallback to description
                    const blogHtml =
                      blog.content || blog.description || null;

                    return (
                      <article
                        key={blog._id}
                        id={articleId}
                        className="group relative w-full rounded-3xl overflow-hidden transition-all"
                      >
                        <div className="grid md:grid-cols-3 gap-6 lg:gap-10 items-stretch">
                          {hasFeaturedImage && (
                            <div className="relative md:col-span-1 h-56 sm:h-64 md:h-full overflow-hidden">
                              <img
                                src={`${API_IMAGE_BASE_URL}${blog.featuredImage}`}
                                alt={blog.title}
                                className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-80 transition-opacity duration-500" />
                              <div className="absolute bottom-4 left-4 text-xs font-medium text-white/90 backdrop-blur-sm bg-black/45 px-3 py-1 rounded-full flex items-center gap-2">
                                <FaRegNewspaper className="w-3 h-3" />
                                {/* Featured Story */}
                              </div>
                            </div>
                          )}

                          <div
                            className={`p-6 sm:p-8 lg:p-10 flex flex-col gap-6 ${
                              hasFeaturedImage ? "md:col-span-2" : "md:col-span-3"
                            } bg-gradient-to-b from-white/70 via-white/80 to-white`}
                          >
                            

                            <header>
                              <h3 className="text-3xl sm:text-3xl font-bold text-gray-900 leading-tight group-hover:text-[#1a2b5c] transition-colors">
                                {blog.title}
                              </h3>

                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                               
                                {blog.readingTime && (
                                  <span className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-gray-600 rounded-full">
                                    <FaClock className="w-3.5 h-3.5 text-[#1a2b5c]" />
                                    {blog.readingTime}
                                  </span>
                                )}
                                {blogTags && blogTags.length > 0 && (
                                  <span className="flex items-center gap-2 px-3 py-1 text-xs font-mediumtext-gray-600 rounded-full">
                                    <FaTag className="w-3.5 h-3.5 text-[#1a2b5c]" />
                                    {blogTags.slice(0, 3).join(", ")}
                                  </span>
                                )}
                              </div>
                            </header>

                            <div className="prose max-w-none prose-p:text-gray-600 prose-a:text-[#1a2b5c] prose-a:underline-offset-4 prose-a:hover:underline">
                              {blogHtml ? (
                                <RichTextRenderer html={blogHtml} />
                              ) : (
                                <p className="text-gray-500">
                                  Content coming soon. Stay tuned for more insights.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
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
              Explore our diverse fleet of vehicles to find the perfect match
              for your travel needs
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-8 mb-16">
            <p className="text-center text-gray-600 text-lg">
              Please select a vehicle category from the navigation menu to view
              available vehicles.
            </p>
          </div>
        </>
      )}
    </>
  );
}
