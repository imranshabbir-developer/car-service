'use client';

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FaPhoneAlt, FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
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

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        <Link href="/" className="flex items-center space-x-3">
          <img
            src="https://convoytravels.pk/wp-content/uploads/2021/07/CONVAY-TRAVELS.png"
            alt="Logo"
            className="w-36"
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
                className="absolute top-full left-0 w-48 z-50 pt-2 mt-1"
              >
                <div className="bg-white rounded-lg shadow-lg py-2">
                  <RippleLink 
                    href="/vehicle-types?category=Economy" 
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-50 transition-colors"
                  >
                    Economy
                  </RippleLink>
                  <RippleLink 
                    href="/vehicle-types?category=Standard" 
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-50 transition-colors"
                  >
                    Standard
                  </RippleLink>
                  <RippleLink 
                    href="/vehicle-types?category=Comfort" 
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-50 transition-colors"
                  >
                    Comfort
                  </RippleLink>
                  <RippleLink 
                    href="/vehicle-types?category=Business" 
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-50 transition-colors"
                  >
                    Business
                  </RippleLink>
                  <RippleLink 
                    href="/vehicle-types?category=Luxury Vehicle" 
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-50 transition-colors"
                  >
                    Luxury Vehicle
                  </RippleLink>
                  <RippleLink 
                    href="/vehicle-types?category=Vans & Buses" 
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-50 transition-colors"
                  >
                    Vans & Buses
                  </RippleLink>
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

        <div className="hidden md:flex">
          <button className="bg-[#0d1b2a] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-[#112d4e]">
            <FaPhoneAlt />
            <span>+92 328 1456456</span>
          </button>
        </div>

        <button
          className="md:hidden text-2xl text-[#0d1b2a] focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </header>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#0d1b2a] text-white z-30 transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            <img
              src="https://convoytravels.pk/wp-content/uploads/2021/07/CONVAY-TRAVELS.png"
              alt="Logo"
              className="w-32"
            />
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            className="text-white text-2xl"
          >
            <FaTimes />
          </button>
        </div>
        <nav className="flex flex-col mt-6 space-y-4 px-6">
          <Link href="/" className="hover:text-blue-400" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link href="/about" className="hover:text-blue-400" onClick={() => setMenuOpen(false)}>
            About
          </Link>
          <div>
            <button 
              className="flex items-center justify-between w-full hover:text-blue-400"
              onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
            >
              <span>Vehicle Types</span>
              <FaChevronDown className={`text-xs transition-transform duration-200 ${mobileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileDropdownOpen && (
              <div className="ml-4 mt-2 space-y-2">
                <Link 
                  href="/vehicle-types?category=Economy" 
                  className="block hover:text-blue-400" 
                  onClick={() => {
                    setMenuOpen(false);
                    setMobileDropdownOpen(false);
                  }}
                >
                  Economy
                </Link>
                <Link 
                  href="/vehicle-types?category=Standard" 
                  className="block hover:text-blue-400" 
                  onClick={() => {
                    setMenuOpen(false);
                    setMobileDropdownOpen(false);
                  }}
                >
                  Standard
                </Link>
                <Link 
                  href="/vehicle-types?category=Comfort" 
                  className="block hover:text-blue-400" 
                  onClick={() => {
                    setMenuOpen(false);
                    setMobileDropdownOpen(false);
                  }}
                >
                  Comfort
                </Link>
                <Link 
                  href="/vehicle-types?category=Business" 
                  className="block hover:text-blue-400" 
                  onClick={() => {
                    setMenuOpen(false);
                    setMobileDropdownOpen(false);
                  }}
                >
                  Business
                </Link>
                <Link 
                  href="/vehicle-types?category=Luxury Vehicle" 
                  className="block hover:text-blue-400" 
                  onClick={() => {
                    setMenuOpen(false);
                    setMobileDropdownOpen(false);
                  }}
                >
                  Luxury Vehicle
                </Link>
                <Link 
                  href="/vehicle-types?category=Vans & Buses" 
                  className="block hover:text-blue-400" 
                  onClick={() => {
                    setMenuOpen(false);
                    setMobileDropdownOpen(false);
                  }}
                >
                  Vans & Buses
                </Link>
              </div>
            )}
          </div>
          <Link href="/travel" className="hover:text-blue-400" onClick={() => setMenuOpen(false)}>
            Travel
          </Link>
          <Link href="/contact" className="hover:text-blue-400" onClick={() => setMenuOpen(false)}>
            Contact Us
          </Link>
        </nav>

        <div className="absolute bottom-8 w-full px-6">
          <button className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg flex items-center justify-center space-x-2">
            <FaPhoneAlt />
            <span>+92 328 1456456</span>
          </button>
        </div>
      </div>
    </>
  );
}

