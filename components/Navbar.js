'use client';

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FaPhoneAlt, FaBars, FaTimes, FaChevronDown, FaSearch } from "react-icons/fa";
import { API_BASE_URL } from '@/config/api';
import "./navbar-hover.css";

const NavLinkHover = ({ href, children, className = "" }) => {
  const [hoverState, setHoverState] = useState('');

  const handleMouseEnter = () => {
    setHoverState('hover-in');
  };

  const handleMouseLeave = () => {
    setHoverState('hover-out');
    setTimeout(() => {
      setHoverState('');
    }, 300);
  };

  return (
    <Link
      href={href}
      className={`nav-link-hover ${className} ${hoverState}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="nav-link-filler"></span>
      <span className="nav-link-text">{children}</span>
    </Link>
  );
};

const RippleLink = ({ href, children, className }) => {
  const [ripples, setRipples] = useState([]);
  const linkRef = useRef(null);

  const createRipple = (e) => {
    const rect = linkRef.current.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const newRipple = {
      id: Date.now(),
      x,
      y,
      size,
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 600);
  };

  return (
    <Link
      href={href}
      ref={linkRef}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={createRipple}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: 'rgba(30, 45, 96, 0.4)',
            transform: 'scale(0)',
            animation: 'ripple 0.6s ease-out',
          }}
        />
      ))}
    </Link>
  );
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      if (typeof window === 'undefined') return;
      
      try {
        const url = `${API_BASE_URL}/categories`;
        console.log('Fetching categories from:', url);
        
        // Create AbortController for timeout (30 seconds)
        const controller = new AbortController();
        let timeoutId = setTimeout(() => {
          controller.abort();
        }, 30000); // 30 second timeout
        
        try {
          const response = await fetch(url, {
            signal: controller.signal,
          });
          
          // Clear timeout if request succeeds
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            console.error('Categories API error:', response.status, response.statusText);
            return;
          }
          
          const data = await response.json();
          console.log('Categories API response:', data);
          
          if (data.success && data.data && data.data.categories) {
            console.log('Setting categories:', data.data.categories.length);
            setCategories(data.data.categories);
          } else {
            console.warn('Categories response structure unexpected:', data);
          }
        } catch (fetchError) {
          // Clear timeout on error
          clearTimeout(timeoutId);
          throw fetchError;
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.error('Categories fetch timeout. Server may be down.');
        } else {
          console.error('Error fetching categories:', error);
        }
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchOverlayOpen || menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [searchOverlayOpen, menuOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (searchOverlayOpen) {
          setSearchOverlayOpen(false);
        }
        if (menuOpen) {
          setMenuOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [searchOverlayOpen, menuOpen]);

  return (
    <>
      <header 
        className={`sticky top-0 z-20 flex items-center justify-between px-6 md:px-16 py-5 border-b-2 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white shadow-sm' 
            : 'bg-white/70 backdrop-blur-sm'
        }`}
        style={{ fontFamily: 'Roboto, sans-serif' }}
      >
        <Link href="/" className="flex items-center space-x-3 flex-shrink-0">
          <img
            src="https://convoytravels.pk/wp-content/uploads/2021/07/CONVAY-TRAVELS.png"
            alt="Logo"
            className="w-28 sm:w-32 md:w-36 h-auto"
          />
        </Link>

        <nav className="hidden md:flex space-x-4 lg:space-x-5 text-gray-800 font-medium">
          <NavLinkHover href="/" className="nav-home">
            Home
          </NavLinkHover>
          <NavLinkHover href="/about" className="nav-about">
            About
          </NavLinkHover>
          <div 
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <Link 
              href="/vehicle-types" 
              className="nav-link-hover nav-vehicle-types inline-flex items-center justify-center gap-1"
              onMouseEnter={(e) => {
                e.currentTarget.classList.remove('hover-out');
                e.currentTarget.classList.add('hover-in');
              }}
              onMouseLeave={(e) => {
                e.currentTarget.classList.remove('hover-in');
                e.currentTarget.classList.add('hover-out');
                setTimeout(() => {
                  e.currentTarget.classList.remove('hover-out');
                }, 300);
              }}
            >
              <span className="nav-link-filler"></span>
              <span className="nav-link-text">Vehicle Types</span>
              <FaChevronDown className={`text-xs transition-transform duration-200 relative z-10 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </Link>
            {dropdownOpen && (
              <div 
                className="absolute top-full left-0 w-48 z-50 pt-3 -mt-1"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <div className="bg-white rounded-lg shadow-lg py-2 border border-gray-100">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <RippleLink 
                        key={category._id}
                        href={`/vehicle-types?category=${encodeURIComponent(category.name)}`}
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-50 transition-colors"
                      >
                        {category.name}
                      </RippleLink>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500 text-sm">
                      {categories.length === 0 ? 'No categories available' : 'Loading categories...'}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <NavLinkHover href="/travel" className="nav-travel">
            Travel
          </NavLinkHover>
          <NavLinkHover href="/contact" className="nav-contact">
            Contact Us
          </NavLinkHover>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button className="phone-ring-button bg-[#0d1b2a] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-[#112d4e] relative">
            <FaPhoneAlt className="phone-icon" />
            <span>+92 328 1456456</span>
          </button>
          <button 
            onClick={() => setSearchOverlayOpen(true)}
            className="text-gray-800 hover:text-[#1a2b5c] transition-colors p-2"
          >
            <FaSearch className="w-5 h-5" />
          </button>
        </div>

        <button
          className="md:hidden text-2xl text-[#0d1b2a] focus:outline-none z-50 relative"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </header>

      {/* Mobile Menu Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[29] md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 sm:w-80 bg-gradient-to-b from-[#0d1b2a] to-[#1a2650] text-white z-30 transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-out shadow-2xl md:hidden`}
      >
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-700/50">
          <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center">
            <img
              src="https://convoytravels.pk/wp-content/uploads/2021/07/CONVAY-TRAVELS.png"
              alt="Logo"
              className="w-28 sm:w-32 h-auto"
            />
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            className="text-white text-2xl hover:text-gray-300 transition-colors p-2"
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>
        <nav className="flex flex-col mt-8 space-y-1 px-6 overflow-y-auto flex-1 pb-24">
          <Link 
            href="/" 
            className="px-4 py-3 rounded-lg hover:bg-white/10 hover:text-white transition-all duration-200 text-gray-300 hover:translate-x-1" 
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/about" 
            className="px-4 py-3 rounded-lg hover:bg-white/10 hover:text-white transition-all duration-200 text-gray-300 hover:translate-x-1" 
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
          <div>
            <button 
              className="flex items-center justify-between w-full px-4 py-3 rounded-lg hover:bg-white/10 hover:text-white transition-all duration-200 text-gray-300 hover:translate-x-1"
              onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
            >
              <span>Vehicle Types</span>
              <FaChevronDown className={`text-xs transition-transform duration-300 ${mobileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${mobileDropdownOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="ml-4 mt-2 space-y-1 pb-2">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <Link 
                      key={category._id}
                      href={`/vehicle-types?category=${encodeURIComponent(category.name)}`}
                      className="block px-4 py-2 rounded-lg hover:bg-white/10 hover:text-white transition-all duration-200 text-gray-400 hover:translate-x-1" 
                      onClick={() => {
                        setMenuOpen(false);
                        setMobileDropdownOpen(false);
                      }}
                    >
                      {category.name}
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-400 text-sm">No categories available</div>
                )}
              </div>
            </div>
          </div>
          <Link 
            href="/travel" 
            className="px-4 py-3 rounded-lg hover:bg-white/10 hover:text-white transition-all duration-200 text-gray-300 hover:translate-x-1" 
            onClick={() => setMenuOpen(false)}
          >
            Travel
          </Link>
          <Link 
            href="/contact" 
            className="px-4 py-3 rounded-lg hover:bg-white/10 hover:text-white transition-all duration-200 text-gray-300 hover:translate-x-1" 
            onClick={() => setMenuOpen(false)}
          >
            Contact Us
          </Link>
        </nav>

        <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 px-6">
          <button className="phone-ring-button phone-ring-center w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-3 rounded-lg flex items-center justify-center space-x-2 relative shadow-lg">
            <FaPhoneAlt className="phone-icon" />
            <span className="font-semibold">+92 328 1456456</span>
          </button>
        </div>
      </div>

      {/* Search Overlay */}
      {searchOverlayOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSearchOverlayOpen(false);
            }
          }}
        >
          {/* Dark Overlay Background */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
          
          {/* Close Button */}
          <button
            onClick={() => setSearchOverlayOpen(false)}
            className="absolute top-6 right-6 sm:top-8 sm:right-8 z-[60] text-white hover:text-gray-300 transition-colors"
            aria-label="Close search"
          >
            <FaTimes className="w-8 h-8 sm:w-10 sm:h-10" />
          </button>

          {/* Search Form */}
          <div 
            className="relative bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <form className="space-y-4 sm:space-y-5" onSubmit={(e) => {
              e.preventDefault();
              // Handle form submission here
              setSearchOverlayOpen(false);
            }}>
              {/* Product Name */}
              <div>
                <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  placeholder="Enter product name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Select Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Category
                </label>
                <select
                  id="category"
                  name="category"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent outline-none transition-all appearance-none bg-white cursor-pointer"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pick-up Date */}
              <div>
                <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Pick-up Date
                </label>
                <input
                  type="date"
                  id="pickupDate"
                  name="pickupDate"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Drop-off Date */}
              <div>
                <label htmlFor="dropoffDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Drop-off Date
                </label>
                <input
                  type="date"
                  id="dropoffDate"
                  name="dropoffDate"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="w-full bg-[#1a2b5c] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#0d1b2a] transition-colors duration-300 mt-2"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

