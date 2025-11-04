'use client';

import Link from "next/link";
import { FaArrowLeft, FaCalendarAlt, FaUser, FaTag, FaArrowRight } from "react-icons/fa";
import { API_BASE_URL, API_IMAGE_BASE_URL } from "@/config/api";
import { useState, useEffect } from "react";
import 'react-quill-new/dist/quill.snow.css';
import "./blog-content.css";

export default function BlogDetailClient({ blog: initialBlog }) {
  const [blog, setBlog] = useState(initialBlog);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch related blogs
  useEffect(() => {
    const fetchRelatedBlogs = async () => {
      if (typeof window === 'undefined') return;
      
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/blogs`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data && data.data.blogs) {
            // Filter related blogs (same category, excluding current blog)
            const related = data.data.blogs
              .filter(b => 
                b.published && 
                b._id !== blog._id && 
                b.category?._id === blog.category?._id
              )
              .slice(0, 3);
            
            setRelatedBlogs(related);
          }
        }
      } catch (error) {
        console.error('Error fetching related blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedBlogs();
  }, [blog._id, blog.category?._id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/blog/${blog.slug}`
    : `https://convoytravels.pk/blog/${blog.slug}`;

  const imageUrl = blog.featuredImage 
    ? `${API_IMAGE_BASE_URL}${blog.featuredImage}`
    : null;

  return (
    <main className="min-h-screen bg-white" style={{ fontFamily: 'Roboto, sans-serif' }}>
      {/* Hero Section */}
      <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 z-10"></div>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={blog.title}
            className="w-full h-full object-cover"
            loading="eager"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-6xl font-bold text-gray-300">
              {blog.title?.charAt(0).toUpperCase() || 'B'}
            </div>
          </div>
        )}
        <div className="absolute inset-0 z-20 flex flex-col justify-end">
          <div className="max-w-4xl mx-auto px-6 md:px-12 pb-12 text-white">
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <span className="flex items-center gap-2 text-sm sm:text-base">
                <FaCalendarAlt className="w-4 h-4" />
                {formatDate(blog.createdAt)}
              </span>
              {blog.createdBy && (
                <span className="flex items-center gap-2 text-sm sm:text-base">
                  <FaUser className="w-4 h-4" />
                  {blog.createdBy.name || 'Admin'}
                </span>
              )}
              {blog.category && (
                <span className="flex items-center gap-2 text-sm sm:text-base bg-white/20 px-3 py-1 rounded-full">
                  <FaTag className="w-4 h-4" />
                  {blog.category.name}
                </span>
              )}
              {blog.published && (
                <span className="flex items-center gap-2 text-sm sm:text-base bg-green-500/80 px-3 py-1 rounded-full">
                  Published
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              {blog.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 md:px-20 lg:px-32 -mt-8 relative z-30">
        <Link
          href="/vehicle-types"
          className="inline-flex items-center gap-2 bg-white text-[#1a2b5c] px-6 py-3 rounded-lg shadow-lg hover:bg-gray-50 transition-colors duration-300 font-semibold"
        >
          <FaArrowLeft className="w-4 h-4" />
          Back to Vehicle Types
        </Link>
      </div>

      {/* Content Section */}
      <article className="max-w-7xl mx-auto px-6 md:px-20 lg:px-32 py-12 md:py-16">
        {/* Excerpt */}
        {blog.description && (
          <div className="bg-gradient-to-r from-[#1a2b5c] to-[#0d1b2a] text-white p-8 md:p-10 lg:p-12 rounded-xl mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-relaxed">
              {blog.description}
            </h2>
          </div>
        )}

        {/* Main Content */}
        <div
          className="blog-content w-full"
          dangerouslySetInnerHTML={{ __html: blog.content }}
          style={{
            fontFamily: 'Roboto, sans-serif'
          }}
        />

        {/* Divider */}
        <div className="border-t border-gray-200 my-12"></div>

        {/* Related Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-8">
          <Link
            href="/vehicle-types"
            className="inline-flex items-center gap-2 text-[#1a2b5c] hover:text-[#0d1b2a] font-semibold transition-colors"
          >
            <FaArrowLeft className="w-4 h-4" />
            View All Blogs
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Share:</span>
            <a
              href={`https://www.facebook.com/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-[#1877f2] text-white rounded-lg flex items-center justify-center hover:bg-[#166fe5] transition-colors"
              aria-label="Share on Facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href={`https://x.com/intent/post?text=${encodeURIComponent(blog.title)} ${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-[#1da1f2] text-white rounded-lg flex items-center justify-center hover:bg-[#1a91da] transition-colors"
              aria-label="Share on Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-[#0077b5] text-white rounded-lg flex items-center justify-center hover:bg-[#006399] transition-colors"
              aria-label="Share on LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </article>

      {/* Related Posts Section */}
      {relatedBlogs.length > 0 && (
        <section className="bg-gray-50 py-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a2b5c] mb-8 text-center">
              Related Posts
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedBlogs.map((relatedBlog) => {
                const relatedImageUrl = relatedBlog.featuredImage 
                  ? `${API_IMAGE_BASE_URL}${relatedBlog.featuredImage}`
                  : null;

                return (
                  <Link
                    key={relatedBlog._id}
                    href={`/blog/${relatedBlog.slug || relatedBlog._id}`}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      {relatedImageUrl ? (
                        <img
                          src={relatedImageUrl}
                          alt={relatedBlog.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <div className="text-4xl font-bold text-gray-300">
                            {relatedBlog.title?.charAt(0).toUpperCase() || 'B'}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <p className="text-gray-500 text-sm mb-2">
                        {formatDate(relatedBlog.createdAt)}
                      </p>
                      <h3 className="text-lg font-semibold text-[#1a2b5c] mb-2 line-clamp-2 group-hover:text-[#0d1b2a] transition-colors">
                        {relatedBlog.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {relatedBlog.description || relatedBlog.content?.replace(/<[^>]*>/g, '').substring(0, 100) + '...' || 'No description available'}
                      </p>
                      <div className="flex items-center gap-2 mt-4 text-[#1a2b5c] font-semibold text-sm">
                        <span>Read More</span>
                        <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

