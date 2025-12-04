'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_BASE_URL, API_IMAGE_BASE_URL } from '@/config/api';
import { FaSpinner, FaSearch, FaArrowRight } from 'react-icons/fa';
import Seo from '@/components/Seo';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 20; // 5 rows × 4 cards = 20 blogs per page

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/main-blogs?isPublished=true`);
        const data = await response.json();
        
        if (data.success && data.data && data.data.blogs) {
          // Sort by date (most recent first)
          const sortedBlogs = [...data.data.blogs].sort((a, b) => {
            const dateA = new Date(a.createdAt || a.updatedAt || 0);
            const dateB = new Date(b.createdAt || b.updatedAt || 0);
            return dateB - dateA;
          });
          setBlogs(sortedBlogs);
          setFilteredBlogs(sortedBlogs);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    let filtered = [...blogs];
    if (searchTerm !== '') {
      filtered = filtered.filter((blog) =>
        blog.blogTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredBlogs(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, blogs]);

  // Strip HTML tags and get plain text for description preview
  const stripHtmlTags = (html) => {
    if (!html || typeof html !== 'string') return '';
    if (typeof document === 'undefined') {
      // Fallback for SSR: simple regex to remove HTML tags
      return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    }
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Get excerpt from description
  const getExcerpt = (text, maxLength = 120) => {
    const plainText = stripHtmlTags(text);
    if (!plainText) return '';
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength).trim() + '...';
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const startIndex = (currentPage - 1) * blogsPerPage;
  const endIndex = startIndex + blogsPerPage;
  const currentBlogs = filteredBlogs.slice(startIndex, endIndex);

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Seo 
        title="Blogs - Latest Articles | Convoy Travels"
        description="Read our latest blog posts about car rental services, travel tips, and more in Lahore, Pakistan."
        canonical="https://convoytravels.pk/blogs"
      />
      <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 md:px-12 lg:px-20" style={{ fontFamily: 'Roboto, sans-serif' }}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a2b5c] mb-8 text-center">
            Our Blog Posts
          </h1>

          {/* Search Bar */}
          <div className="mb-8 max-w-md mx-auto">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <FaSpinner className="animate-spin text-[#1a2b5c] text-4xl" />
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              {searchTerm ? 'No blogs found matching your search.' : 'No blog posts available at the moment.'}
            </div>
          ) : (
            <>
              {/* Blog Cards Grid - 4 cards per row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12">
                {currentBlogs.map((blog) => {
                  // Normalize image URL - handle paths that may or may not start with /
                  let imageUrl = '/placeholder-blog.jpg';
                  if (blog.image) {
                    const imagePath = blog.image.startsWith('/') ? blog.image : `/${blog.image}`;
                    const baseUrl = API_IMAGE_BASE_URL.endsWith('/') 
                      ? API_IMAGE_BASE_URL.slice(0, -1) 
                      : API_IMAGE_BASE_URL;
                    imageUrl = `${baseUrl}${imagePath}`;
                  }
                  
                  const excerpt = getExcerpt(blog.description);
                  const blogSlug = blog.slug || blog._id;
                  
                  return (
                    <div
                      key={blog._id}
                      className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group flex flex-col"
                    >
                      {/* Image */}
                      <div className="relative w-full h-48 md:h-56 overflow-hidden bg-gray-100">
                        <img
                          src={imageUrl}
                          alt={blog.blogTitle || 'Blog image'}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                          onError={(e) => {
                            if (e.target.src !== '/placeholder-blog.jpg') {
                              e.target.src = '/placeholder-blog.jpg';
                            }
                          }}
                        />
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        {/* Title */}
                        <h3 className="text-[#1a2b5c] font-bold text-lg md:text-xl mb-3 line-clamp-2 min-h-[3.5rem]">
                          {blog.blogTitle}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 text-sm md:text-base mb-4 flex-1 line-clamp-3 leading-relaxed">
                          {excerpt}
                        </p>

                        {/* Read More Button */}
                        <Link
                          href={`/main-blog/${blogSlug}`}
                          className="inline-flex items-center gap-2 text-[#1a2b5c] font-semibold hover:text-[#132045] transition-colors group/btn"
                        >
                          <span>Read More</span>
                          <FaArrowRight className="transform group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8 mb-12">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentPage === 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-[#1a2b5c] text-white hover:bg-[#132045]'
                    }`}
                  >
                    Previous
                  </button>
                  
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
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
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              currentPage === page
                                ? 'bg-[#1a2b5c] text-white'
                                : 'bg-white text-[#1a2b5c] border border-gray-300 hover:bg-gray-50'
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
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentPage === totalPages
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-[#1a2b5c] text-white hover:bg-[#132045]'
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}

