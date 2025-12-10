'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_BASE_URL, API_IMAGE_BASE_URL } from '@/config/api';
import { FaSpinner, FaSearch } from 'react-icons/fa';
import Seo from '@/components/Seo';

export default function MainBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/main-blogs?isPublished=true`);
        const data = await response.json();
        
        if (data.success && data.data && data.data.blogs) {
          setBlogs(data.data.blogs);
          setFilteredBlogs(data.data.blogs);
        }
      } catch (error) {
        // Error handling
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
  }, [searchTerm, blogs]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            {filteredBlogs.map((blog) => {
              let imageUrl = "";
              if (blog.image) {
                const imagePath = blog.image.startsWith('/') ? blog.image : `/${blog.image}`;
                const baseUrl = API_IMAGE_BASE_URL.endsWith('/') ? API_IMAGE_BASE_URL.slice(0, -1) : API_IMAGE_BASE_URL;
                imageUrl = `${baseUrl}${imagePath}`;
              }
              
              return (
                <Link
                  key={blog._id}
                  href={`/main-blog/${blog.slug || blog._id}`}
                  className="bg-white text-left border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group"
                >
                  {imageUrl && (
                    <div className="relative overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={blog.blogTitle}
                        className="w-full h-48 sm:h-56 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-4 sm:p-6">
                    <h3 className="text-[#1a2b5c] font-semibold text-base sm:text-lg mb-2 line-clamp-2 group-hover:text-[#132045] transition-colors">
                      {blog.blogTitle}
                    </h3>
                    <p className="text-gray-500 text-xs sm:text-sm mb-2">
                      {formatDate(blog.createdAt)}
                    </p>
                    <p className="text-gray-600 text-xs sm:text-sm mb-4 leading-relaxed line-clamp-3">
                      {blog.description}
                    </p>
                    <span className="inline-block btn-gradient-primary text-white text-xs sm:text-sm px-4 py-2 rounded relative z-10">
                      Read More
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

