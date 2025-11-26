'use client';

import { useState, useEffect } from 'react';

export default function DynamicSpecialSection({ section }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Inject SEO meta tags dynamically
  useEffect(() => {
    if (!section || !section.isActive) return;

    // Store original values
    const originalTitle = document.title;
    let metaDescription = null;
    let canonicalLink = null;

    // Update title if seoTitle exists
    if (section.seoTitle) {
      document.title = section.seoTitle;
    }

    // Update or create meta description
    if (section.seoDescription) {
      metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', section.seoDescription);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = section.seoDescription;
        document.head.appendChild(meta);
      }
    }

    // Update or create canonical link
    if (section.canonicalUrl) {
      canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) {
        canonicalLink.setAttribute('href', section.canonicalUrl);
      } else {
        const link = document.createElement('link');
        link.rel = 'canonical';
        link.href = section.canonicalUrl;
        document.head.appendChild(link);
      }
    }

    // Cleanup function
    return () => {
      // Restore original title (only if this was the last section)
      if (section.seoTitle) {
        document.title = originalTitle;
      }
    };
  }, [section]);

  if (!section || !section.isActive) {
    return null;
  }

  const shortText = section.content.length > 550 
    ? section.content.slice(0, 550) + '...' 
    : section.content;

  const needsReadMore = section.content.length > 550;
  const displayText = isExpanded ? section.content : shortText;

  // Determine background color class
  const getBackgroundClass = () => {
    switch (section.backgroundColor) {
      case '#f4f7fc':
        return 'bg-[#f4f7fc]';
      case '#e7ecf5':
        return 'bg-[#e7ecf5]';
      default:
        return 'bg-white';
    }
  };

  // Image position determines layout
  const isImageLeft = section.imagePosition === 'left';

  return (
    <section className={`${getBackgroundClass()} py-16 px-6 md:px-20 flex justify-center`}>
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          {/* Image */}
          {isImageLeft && (
            <div className="relative flex justify-center">
              <div className="absolute -left-4 top-4 bg-[#1a2b5c] w-full h-full rounded-lg hidden md:block"></div>
              <img
                src={section.image}
                alt={section.title}
                className="relative rounded-lg w-full max-h-48 md:max-h-56 lg:max-h-64 object-cover shadow-lg"
                onError={(e) => {
                  e.target.src = '/placeholder.jpg';
                }}
              />
            </div>
          )}

          {/* Text Content */}
          <div>
            <h2 className="text-[#1a2b5c] text-3xl md:text-4xl font-bold leading-snug mb-6">
              {section.title}
            </h2>

            <p className="text-gray-600 text-base leading-relaxed mb-6 whitespace-pre-line">
              {displayText}
            </p>

            {needsReadMore && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-[#1a2b5c] font-semibold hover:underline text-base"
              >
                {isExpanded ? 'Read Less' : 'Read More'}
              </button>
            )}
          </div>

          {/* Image */}
          {!isImageLeft && (
            <div className="relative flex justify-center">
              <div className="absolute -right-4 top-4 bg-[#1a2b5c] w-full h-full rounded-lg hidden md:block"></div>
              <img
                src={section.image}
                alt={section.title}
                className="relative rounded-lg w-full max-h-48 md:max-h-56 lg:max-h-64 object-cover shadow-lg"
                onError={(e) => {
                  e.target.src = '/placeholder.jpg';
                }}
              />
            </div>
          )}
        </div>
      </section>
  );
}

