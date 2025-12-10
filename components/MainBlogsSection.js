'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '@/config/api';
import { FaSpinner, FaArrowRight } from 'react-icons/fa';
import { buildImageUrl } from '@/utils/imageUrl';

export default function MainBlogsSection() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/main-blogs`);
        const data = await response.json();
        
        if (data.success && data.data && data.data.blogs) {
          // Get only published blogs, sort by date (most recent first), and limit to 3 for home page
          const publishedBlogs = data.data.blogs
            .filter(blog => blog.isPublished)
            .sort((a, b) => {
              const dateA = new Date(a.createdAt || a.updatedAt || 0);
              const dateB = new Date(b.createdAt || b.updatedAt || 0);
              return dateB - dateA; // Most recent first
            })
            .slice(0, 3);
          setBlogs(publishedBlogs);
        }
      } catch (error) {
        console.error('Error fetching main blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

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
  const getExcerpt = (text, maxLength = 150) => {
    const plainText = stripHtmlTags(text);
    if (!plainText) return '';
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength).trim() + '...';
  };

  if (loading) {
    return (
      <section className="py-12 md:py-16 px-6 md:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="animate-spin text-[#1a2b5c] text-4xl" />
          </div>
        </div>
      </section>
    );
  }

  if (blogs.length === 0) {
    return null; // Don't show section if no blogs
  }

  return (
    <section className="py-12 md:py-16 px-6 md:px-20 bg-white" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-[#1a2b5c] text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
          Latest Blogs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {blogs.map((blog) => {
            // Use centralized image URL utility
            const imageUrl = buildImageUrl(blog.image, '/placeholder-blog.jpg');
            
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
      </div>
    </section>
  );
}
