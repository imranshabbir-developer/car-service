'use client';

import { useState, useEffect } from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

export default function TravelPage() {
  const [mounted, setMounted] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const galleryImages = [
    '/travel-page/travel-pic-1.jfif',
    '/travel-page/travel-pic-2.jpeg',
    '/travel-page/travel-pic-3.jpg',
    '/travel-page/travel-pic-4.jfif',
    '/travel-page/travel-pic-5.jfif',
    '/travel-page/travel-pic-6.jpg'
  ];

  // Set mounted to true after component mounts (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle body scroll lock when lightbox opens/closes
  useEffect(() => {
    if (!mounted) return;
    
    if (lightboxOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow || 'unset';
      };
    }
  }, [lightboxOpen, mounted]);

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // Handle keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
      }
      if (e.key === 'ArrowLeft') {
        setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
      }
      if (e.key === 'Escape') {
        closeLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, galleryImages.length]);

  return (
    <main className="min-h-screen bg-white" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <div 
        className="w-full min-h-[23rem] flex items-center justify-center relative"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/8828584/pexels-photo-8828584.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/70"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6">
          <h1 className="text-white font-semibold leading-tight mb-2 sm:mb-3" style={{ fontSize: '32px', fontWeight: 600 }}>
            <span className="sm:text-[40px] md:text-[50px]">Plan Your Own Trip</span>
          </h1>
          <h2 className="text-white font-semibold leading-tight" style={{ fontSize: '32px', fontWeight: 600 }}>
            <span className="sm:text-[40px] md:text-[50px]">Make a Trip That&apos;s Just Right for You</span>
          </h2>
        </div>
      </div>

      {/* Description Section */}
      <div className="w-full bg-white py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
              Description
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
              Embark on an unforgettable journey through Northern Pakistan, where majestic mountains, lush valleys, and warm hospitality await. Begin in Islamabad, the capital city, and wind your way through scenic routes to Gilgit, where the convergence of three mighty mountain ranges awaits. Discover the enchanting Hunza Valley, famed for its verdant landscapes and iconic peaks like Rakaposhi. Continue to Skardu, nestled amidst the Karakoram Range, where ancient forts and breathtaking vistas await. Prepare for a thrilling jeep safari to Khunjerab Pass, the world&apos;s highest paved international border. Fairy Meadows beckons with its ethereal beauty, offering a chance to trek amidst the towering Nanga Parbat. Conclude your adventure in the picturesque Swat Valley, exploring its pristine landscapes and rich history. Prepare for an immersive experience filled with natural wonders and cultural delights in Northern Pakistan.
            </p>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="w-full bg-gray-50 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
          {/* Gallery Header */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 sm:mb-12">
            Our Gallery
          </h2>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="relative group cursor-pointer overflow-hidden rounded-lg aspect-[4/3]"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
              </div>
            ))}
          </div>

          {/* Separator Line */}
          <div className="border-t border-gray-300 mb-8 sm:mb-10"></div>

          {/* Social Media Icons */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.facebook.com/sharer.php?u=https://convoytravels.pk/travel/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 sm:w-14 sm:h-14 bg-[#1877f2] text-white rounded-lg flex items-center justify-center hover:bg-[#166fe5] transition-colors duration-300"
              aria-label="Facebook"
            >
              <FaFacebookF className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
            <a
              href="https://x.com/intent/post?text=%20https%3A%2F%2Fconvoytravels.pk%2Ftravel%2F"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 sm:w-14 sm:h-14 bg-[#1da1f2] text-white rounded-lg flex items-center justify-center hover:bg-[#1a91da] transition-colors duration-300"
              aria-label="Twitter"
            >
              <FaTwitter className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
            <a
              href="https://www.linkedin.com/feed/?linkOrigin=LI_BADGE&shareActive=true&shareUrl=https%3A%2F%2Fconvoytravels.pk%2Ftravel%2F"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 sm:w-14 sm:h-14 bg-[#0077b5] text-white rounded-lg flex items-center justify-center hover:bg-[#006399] transition-colors duration-300"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {mounted && lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Close"
          >
            <FaTimes className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-4 sm:left-8 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 hover:bg-black/70 p-3 sm:p-4 rounded-full"
            aria-label="Previous Image"
          >
            <FaChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 sm:right-8 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 hover:bg-black/70 p-3 sm:p-4 rounded-full"
            aria-label="Next Image"
          >
            <FaChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Image */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
          >
            <img
              src={galleryImages[currentImageIndex]}
              alt={`Gallery image ${currentImageIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 text-white text-sm sm:text-base">
            {currentImageIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}
    </main>
  );
}
