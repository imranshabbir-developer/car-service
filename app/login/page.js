'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaCheckCircle, FaExclamationCircle, FaTimes, FaSpinner } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:5000/api/v1';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Store token in localStorage
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        showNotification('Login successful!', 'success');
        
        // Redirect to dashboard after short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      } else {
        showNotification(data.message || 'Login failed', 'error');
      }
    } catch (error) {
      showNotification('Error connecting to server', 'error');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6" style={{ fontFamily: 'Roboto, sans-serif' }}>
      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center space-x-3 px-6 py-4 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white animate-slide-in`}
        >
          {notification.type === 'success' ? (
            <FaCheckCircle className="text-xl" />
          ) : (
            <FaExclamationCircle className="text-xl" />
          )}
          <span className="font-medium">{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-2 hover:opacity-70"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>
      )}

      <div className="w-full max-w-md">
        {/* Back to Home Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#1a2b5c] hover:text-[#0d1b2a] transition-colors duration-300 mb-4 sm:mb-6 font-medium"
        >
          <FaArrowLeft className="w-4 h-4" />
          <span className="text-sm sm:text-base">Back to Home</span>
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[#1a2b5c] to-[#0d1b2a] px-6 sm:px-7 py-6 sm:py-7 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
              Welcome Back
            </h1>
            <p className="text-gray-200 text-xs sm:text-sm">
              Sign in to your account to continue
            </p>
          </div>

          {/* Form Section */}
          <div className="p-5 sm:p-6 md:p-7">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent outline-none transition-all"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent outline-none transition-all"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#1a2b5c] focus:ring-[#1a2b5c] border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-xs sm:text-sm text-gray-700 cursor-pointer">
                    Remember me
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-xs sm:text-sm text-[#1a2b5c] hover:text-[#0d1b2a] font-medium transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a2b5c] text-white py-2.5 sm:py-3 rounded-lg hover:bg-[#0d1b2a] transition-colors duration-300 font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all mt-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Signing In...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

