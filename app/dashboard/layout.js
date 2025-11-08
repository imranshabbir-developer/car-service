'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FaTh,
  FaBars,
  FaTimes,
  FaSearch,
  FaCog,
  FaBell,
  FaFolder,
  FaCar,
  FaBlog,
  FaClipboardList,
  FaSignOutAlt,
  FaSpinner,
  FaQuestionCircle,
} from 'react-icons/fa';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
          try {
            const userData = JSON.parse(userStr);
            setUser(userData);
            setIsAuthenticated(true);
            setIsChecking(false);
          } catch (error) {
            // Invalid user data, clear and redirect
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setIsAuthenticated(false);
            setIsChecking(false);
            router.push('/login');
          }
        } else {
          // No token or user data, redirect to login
          setIsAuthenticated(false);
          setIsChecking(false);
          router.push('/login');
        }
      }
    };

    checkAuth();
  }, [router]);

  // Handle logout
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    // Redirect to login
    router.push('/login');
  };

  const menuItems = [
    { icon: FaTh, label: 'Dashboard', path: '/dashboard', badge: null },
    { icon: FaFolder, label: 'Categories', path: '/dashboard/categories', badge: null },
    { icon: FaCar, label: 'Cars', path: '/dashboard/cars', badge: null },
    { icon: FaBlog, label: 'Blogs', path: '/dashboard/blogs', badge: null },
    { icon: FaClipboardList, label: 'Bookings', path: '/dashboard/bookings', badge: null },
    { icon: FaQuestionCircle, label: 'Questions', path: '/dashboard/questions', badge: null },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return pathname === path;
    }
    return pathname?.startsWith(path);
  };

  // Show loading spinner while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ fontFamily: 'Roboto, sans-serif' }}>
        <div className="flex flex-col items-center space-y-4">
          <FaSpinner className="w-8 h-8 text-[#1a2b5c] animate-spin" />
          <p className="text-[#1a2b5c] font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Roboto, sans-serif' }}>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-64 bg-[#1a2b5c] border-r border-[#0d1b2a] shadow-lg`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#0d1b2a]/30">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#1a2b5c] font-bold text-lg">C</span>
              </div>
              <div>
                <span className="text-lg font-bold text-white block leading-tight">CONVOY</span>
                <span className="text-sm font-semibold text-white/90">TRAVELS</span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:text-gray-300 transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-white/20 text-white shadow-md'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-[#0d1b2a]/30">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-all duration-200"
            >
              <FaSignOutAlt className="w-5 h-5" />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="fixed top-0 left-0 right-0 lg:left-64 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            {/* Left: Menu Button & Title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-[#1a2b5c] hover:text-[#0d1b2a] transition-colors"
              >
                <FaBars className="w-5 h-5" />
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-[#1a2b5c]" style={{ fontFamily: 'Roboto, sans-serif' }}>
                {pathname === '/dashboard' && 'Dashboard'}
                {pathname?.includes('/categories') && 'Categories'}
                {pathname?.includes('/cars') && 'Cars'}
                {pathname?.includes('/blogs') && 'Blogs'}
                {pathname?.includes('/bookings') && 'Bookings'}
              </h1>
            </div>

            {/* Right: Icons & User Profile */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button className="text-[#1a2b5c] hover:text-[#0d1b2a] p-2 transition-colors">
                <FaSearch className="w-5 h-5" />
              </button>
              <button className="text-[#1a2b5c] hover:text-[#0d1b2a] p-2 relative transition-colors">
                <FaCog className="w-5 h-5" />
              </button>
              <button className="text-[#1a2b5c] hover:text-[#0d1b2a] p-2 relative transition-colors">
                <FaBell className="w-5 h-5" />
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </button>
              <div className="flex items-center space-x-2 sm:space-x-3 pl-3 border-l border-gray-200">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#1a2b5c] rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm sm:text-base">
                    {user?.name ? user.name.charAt(0).toUpperCase() : user?.email ? user.email.charAt(0).toUpperCase() : 'A'}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-[#1a2b5c]" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    {user?.name || user?.email || 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-500">{user?.role || 'Admin'}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-4 sm:p-6 lg:p-8 mt-20 sm:mt-24 lg:mt-6">{children}</main>
      </div>
    </div>
  );
}
