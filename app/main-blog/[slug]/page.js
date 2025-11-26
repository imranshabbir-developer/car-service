'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_BASE_URL, API_IMAGE_BASE_URL } from '@/config/api';
import { FaArrowLeft, FaCalendarAlt, FaSpinner, FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import { generateSlug, isObjectId } from '@/utils/slug';
import Seo from '@/components/Seo';
import { extractSeoData } from '@/utils/dynamicSeo';

export default function MainBlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const paramValue = params.slug;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let url;
        if (isObjectId(paramValue)) {
          url = `${API_BASE_URL}/main-blogs/${paramValue}`;
        } else {
          url = `${API_BASE_URL}/main-blogs/slug/${paramValue}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.success && data.data && data.data.blog) {
          const blogData = data.data.blog;
          // Store SEO data
          blogData.seoData = extractSeoData(blogData);
          setBlog(blogData);
        } else {
          setError('Blog not found');
        }
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to load blog');
      } finally {
        setLoading(false);
      }
    };

    if (paramValue) {
      fetchBlog();
    }
  }, [paramValue]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/main-blog/${blog?.slug || blog?._id}`
    : `https://convoytravels.pk/main-blog/${blog?.slug || blog?._id}`;

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ fontFamily: 'Roboto, sans-serif' }}>
        <FaSpinner className="animate-spin text-[#1a2b5c] text-4xl" />
      </main>
    );
  }

  if (error || !blog) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4" style={{ fontFamily: 'Roboto, sans-serif' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1a2b5c] mb-4">Blog Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The blog you are looking for does not exist.'}</p>
          <Link
            href="/main-blogs"
            className="inline-block btn-gradient-primary text-white px-6 py-3 rounded-lg font-semibold relative z-10"
          >
            View All Blogs
          </Link>
        </div>
      </main>
    );
  }

  const imageUrl = blog.image 
    ? `${API_IMAGE_BASE_URL}${blog.image}`
    : '/placeholder-blog.jpg';

  // Extract SEO data
  const seoData = blog?.seoData || {};
  const seoTitle = seoData.seoTitle || `${blog?.blogTitle || 'Blog'} | Convoy Travels`;
  const seoDescription = seoData.seoDescription || blog?.description || 'Read our latest blog posts about car rental in Lahore.';
  const canonicalUrl = seoData.canonicalUrl || (blog?.slug ? `https://convoytravels.pk/main-blog/${blog.slug}` : 'https://convoytravels.pk/main-blogs');

  return (
    <>
      <Seo 
        title={seoTitle}
        description={seoDescription}
        canonical={canonicalUrl}
      />
      <main className="min-h-screen bg-gray-50" style={{ fontFamily: 'Roboto, sans-serif' }}>
      {/* Hero Section */}
      <div className="relative w-full h-64 sm:h-80 md:h-96 bg-gradient-to-r from-[#1a2b5c] to-[#132045]">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={blog.blogTitle}
            className="w-full h-full object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {blog.blogTitle}
            </h1>
            <div className="flex items-center justify-center gap-4 text-white/80 text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <FaCalendarAlt />
                <span>{formatDate(blog.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-12">
        {/* Back Button */}
        <Link
          href="/main-blogs"
          className="inline-flex items-center gap-2 text-[#1a2b5c] hover:text-[#132045] mb-6 transition-colors"
        >
          <FaArrowLeft />
          <span>Back to Blogs</span>
        </Link>

        {/* Blog Content */}
        <article className="bg-white rounded-lg shadow-md p-6 sm:p-8 md:p-12">
          {/* Featured Image */}
          {imageUrl && (
            <div className="mb-8">
              <img
                src={imageUrl}
                alt={blog.blogTitle}
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}

          {/* Description */}
          <div className="prose max-w-none">
            <div className="text-gray-700 text-base sm:text-lg leading-relaxed whitespace-pre-line">
              {blog.description}
            </div>
          </div>

          {/* Social Share */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-[#1a2b5c] mb-4">Share this post</h3>
            <div className="flex items-center gap-4">
              <a
                href={`https://www.facebook.com/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#1877f2] text-white rounded-lg flex items-center justify-center hover:bg-[#166fe5] transition-colors"
                aria-label="Share on Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href={`https://x.com/intent/post?text=${encodeURIComponent(blog.blogTitle)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#1da1f2] text-white rounded-lg flex items-center justify-center hover:bg-[#1a91da] transition-colors"
                aria-label="Share on Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#0077b5] text-white rounded-lg flex items-center justify-center hover:bg-[#006399] transition-colors"
                aria-label="Share on LinkedIn"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </article>
      </div>
    </main>
    </>
  );
}

