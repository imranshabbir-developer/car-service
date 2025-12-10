'use client';

import { useState } from 'react';

export default function DynamicSpecialSection({ section }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // NOTE: Removed SEO meta tag injection from special sections
  // Special sections are content blocks on the home page, not standalone pages
  // The home page has its own metadata defined in app/page.js which should not be overridden
  // If section-specific SEO is needed, create dedicated routes for each section instead

  if (!section || !section.isActive || !section.title) {
    return null;
  }

  const content = section.content || '';
  const shortText = content.length > 550 
    ? content.slice(0, 550) + '...' 
    : content;

  const needsReadMore = content.length > 550;
  const displayText = isExpanded ? content : shortText;

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
              {section.image && (
                <img
                  src={section.image}
                  alt={section.title || 'Section image'}
                  className="relative rounded-lg w-full max-h-48 md:max-h-56 lg:max-h-64 object-cover shadow-lg"
                />
              )}
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
              {section.image && (
                <img
                  src={section.image}
                  alt={section.title || 'Section image'}
                  className="relative rounded-lg w-full max-h-48 md:max-h-56 lg:max-h-64 object-cover shadow-lg"
                />
              )}
            </div>
          )}
        </div>
      </section>
  );
}

