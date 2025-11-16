'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { API_BASE_URL, API_IMAGE_BASE_URL } from "@/config/api";
import { FaSpinner } from "react-icons/fa";
import "./blog-section.css";

export default function BlogSection() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/main-blogs?isPublished=true`);
        const data = await response.json();
        
        if (data.success && data.data && data.data.blogs) {
          // Get only published blogs and limit to 3 for home page
          setBlogs(data.data.blogs.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 lg:px-20 bg-white" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-[#1a2b5c] text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12">
          Blog Post
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="animate-spin text-[#1a2b5c] text-4xl" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No blog posts available at the moment.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 mb-8 sm:mb-12">
              {blogs.map((blog) => {
                const imageUrl = blog.image 
                  ? `${API_IMAGE_BASE_URL}${blog.image}`
                  : '/placeholder-blog.jpg';
                
                return (
                  <div
                    key={blog._id}
                    className="bg-white text-left border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
                  >
                    <img
                      src={imageUrl}
                      alt={blog.blogTitle}
                      className="w-full h-48 sm:h-56 object-cover rounded-t-lg"
                      loading="lazy"
                    />
                    <div className="p-4 sm:p-6">
                      <h3 className="text-[#1a2b5c] font-semibold text-base sm:text-lg mb-2 line-clamp-2">
                        {blog.blogTitle}
                      </h3>
                      <p className="text-gray-500 text-xs sm:text-sm mb-2">
                        {formatDate(blog.createdAt)}
                      </p>
                      <p className="text-gray-600 text-xs sm:text-sm mb-4 leading-relaxed line-clamp-3">
                        {blog.description}
                      </p>
                      <Link
                        href={`/main-blog/${blog.slug || blog._id}`}
                        className="read-more-button inline-block bg-[#1a2b5c] text-white text-xs sm:text-sm px-4 py-2 rounded hover:bg-[#132045] transition-colors duration-300 relative"
                      >
                        <span className="read-more-button-text">Read More</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {blogs.length > 0 && (
              <Link
                href="/main-blogs"
                className="inline-block bg-[#1a2b5c] text-white font-medium px-6 py-3 rounded hover:bg-[#132045] transition-colors duration-300"
              >
                View All Blogs
              </Link>
            )}
          </>
        )}
      </div>
    </section>
  );
}

