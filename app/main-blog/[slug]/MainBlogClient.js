'use client';

import Link from 'next/link';
import { FaArrowLeft, FaCalendarAlt, FaFacebookF, FaInstagram } from 'react-icons/fa';
import { API_IMAGE_BASE_URL } from '@/config/api';

export default function MainBlogClient({ blog }) {
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

  let imageUrl = "";
  if (blog.image) {
    const imagePath = blog.image.startsWith('/') ? blog.image : `/${blog.image}`;
    const baseUrl = API_IMAGE_BASE_URL.endsWith('/') 
      ? API_IMAGE_BASE_URL.slice(0, -1) 
      : API_IMAGE_BASE_URL;
    imageUrl = `${baseUrl}${imagePath}`;
  }

  return (
    <main className="min-h-screen bg-gray-50" style={{ fontFamily: 'Roboto, sans-serif' }}>
      {/* Back Button */}
      <div className="w-full bg-white border-b border-gray-200">
        <div className="max-w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#1a2b5c] hover:text-[#132045] transition-colors"
          >
            <FaArrowLeft />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Blog Content - Full Width */}
      <article className="w-full">
        {/* Title First */}
        <div className="w-full bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-8 sm:pt-10 md:pt-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#1a2b5c] mb-4">
              {blog.blogTitle}
            </h1>
            <div className="flex items-center gap-4 text-gray-600 text-sm sm:text-base mb-6">
              <div className="flex items-center gap-2">
                <FaCalendarAlt />
                <span>{formatDate(blog.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Image Second - Constrained to Content Width */}
        {imageUrl && (
          <div className="w-full bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8">
              <img
                src={imageUrl}
                alt={blog.blogTitle || 'Blog image'}
                className="w-full h-auto object-cover rounded-lg"
                loading="eager"
              />
            </div>
          </div>
        )}

        {/* Description/Content Third - Full Width with Readable Content Width */}
        <div className="w-full bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-10 md:py-12">
            {blog.description && blog.description.trim() ? (
              <div className="prose max-w-none prose-headings:text-[#1a2b5c] prose-p:text-gray-700 prose-a:text-[#1a2b5c] prose-strong:text-[#1a2b5c]">
                <div 
                  className="text-gray-700 text-base sm:text-lg leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: blog.description }}
                />
              </div>
            ) : (
              <div className="text-gray-700 text-base sm:text-lg leading-relaxed">
                <p>Content coming soon. Please check back later.</p>
              </div>
            )}
            
            <style jsx global>{`
              .prose img {
                max-width: 100%;
                height: auto;
                border-radius: 0.5rem;
                margin: 1.5rem 0;
              }
              .prose p {
                margin-bottom: 1rem;
              }
              .prose ul, .prose ol {
                margin: 1rem 0;
                padding-left: 2rem;
              }
              .prose li {
                margin: 0.5rem 0;
              }
              .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
                margin-top: 1.5rem;
                margin-bottom: 1rem;
                font-weight: 700;
              }
              .prose a {
                text-decoration: underline;
              }
              .prose a:hover {
                color: #132045;
              }
              .prose blockquote {
                border-left: 4px solid #1a2b5c;
                padding-left: 1rem;
                margin: 1.5rem 0;
                font-style: italic;
              }
            `}</style>

            {/* Social Share */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-[#1a2b5c] mb-4">Share this post</h3>
              <div className="flex items-center gap-4">
                <a
                  href={`https://www.facebook.com/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-[#1877f2] text-white rounded-lg flex items-center justify-center hover:bg-[#166fe5] transition-colors duration-300"
                  aria-label="Share on Facebook"
                >
                  <FaFacebookF className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
                <a
                  href="https://www.instagram.com/convoytravels4343/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#dc2743] text-white rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity duration-300"
                  aria-label="Follow us on Instagram"
                >
                  <FaInstagram className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}

