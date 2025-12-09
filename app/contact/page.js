'use client';

import { useState } from 'react';
import LocationMap from "@/components/LocationMap";
import { FaMapMarkerAlt, FaClock, FaEnvelope, FaPhoneAlt, FaSpinner, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { API_BASE_URL } from "@/config/api";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      showNotification('Please fill in all fields', 'error');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      setNotification(null);

      const response = await fetch(`${API_BASE_URL}/contact-queries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        showNotification(data.message || 'Your message has been sent successfully! We will get back to you soon.', 'success');
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
        });
      } else {
        showNotification(data.message || 'Failed to send message. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      showNotification('Something went wrong. Please try again later.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <div className="max-w-7xl mx-auto py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a2b5c] mb-4 sm:mb-6">
            Contact Us
          </h1>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-3xl mx-auto px-4">
            We&apos;re here to help! Reach out to us for any questions or bookings
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">

          {/* Address */}
          <a
            href="https://www.google.com/maps/place/Convoy+Travels+%26+Rent+A+Car+.+Rent+a+car+in+lahore/@31.4396234,74.2654729,15z"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#e7ecf5] rounded-lg p-5 sm:p-6 text-center hover:shadow-xl transition-all duration-300 block hover:bg-[#dce3f0]"
          >
            <div className="flex justify-center mb-3 sm:mb-4">
              <FaMapMarkerAlt className="text-2xl sm:text-3xl text-[#1a2b5c]" />
            </div>
            <h3 className="font-bold text-[#1a2b5c] mb-2 text-base sm:text-lg">Address</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              872 Block R1 Johar Town Lahore
            </p>
          </a>

          {/* Hours (static, not clickable) */}
          <div className="bg-[#e7ecf5] rounded-lg p-5 sm:p-6 text-center hover:shadow-xl transition-all duration-300">
            <div className="flex justify-center mb-3 sm:mb-4">
              <FaClock className="text-2xl sm:text-3xl text-[#1a2b5c]" />
            </div>
            <h3 className="font-bold text-[#1a2b5c] mb-2 text-base sm:text-lg">Business Hours</h3>
            <p className="text-gray-600 text-sm sm:text-base">24/7 Open</p>
          </div>

          {/* Email */}
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=convoytravels786@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#e7ecf5] rounded-lg p-5 sm:p-6 text-center hover:shadow-xl transition-all duration-300 block hover:bg-[#dce3f0]"
          >
            <div className="flex justify-center mb-3 sm:mb-4">
              <FaEnvelope className="text-2xl sm:text-3xl text-[#1a2b5c]" />
            </div>
            <h3 className="font-bold text-[#1a2b5c] mb-2 text-base sm:text-lg">Email</h3>
            <p className="text-gray-600 text-sm sm:text-base break-words">
              convoytravels786@gmail.com
            </p>
          </a>

          {/* Phone (WhatsApp) */}
          <a
            href="https://wa.me/923281456456"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#e7ecf5] rounded-lg p-5 sm:p-6 text-center hover:shadow-xl transition-all duration-300 block hover:bg-[#dce3f0]"
          >
            <div className="flex justify-center mb-3 sm:mb-4">
              <FaPhoneAlt className="text-2xl sm:text-3xl text-[#1a2b5c]" />
            </div>
            <h3 className="font-bold text-[#1a2b5c] mb-2 text-base sm:text-lg">Phone</h3>
            <p className="text-gray-600 text-sm sm:text-base">+92 328 1456456</p>
          </a>
        </div>

        {/* Form */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 sm:p-8 md:p-10 lg:p-12 mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a2b5c] mb-6 sm:mb-8 text-center">
            Send Us a Message
          </h2>
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
            {/* Notification */}
            {notification && (
              <div
                className={`p-4 rounded-lg flex items-center gap-2 ${
                  notification.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {notification.type === 'success' ? (
                  <FaCheckCircle className="text-lg" />
                ) : (
                  <FaExclamationCircle className="text-lg" />
                )}
                <span>{notification.message}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a2b5c]"
                  placeholder="Your Name"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a2b5c]"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a2b5c]"
                placeholder="+92 300 1234567"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a2b5c]"
                placeholder="Your message here..."
                required
              ></textarea>
            </div>
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn-gradient-primary text-white font-semibold px-8 py-3 rounded-lg relative z-10 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <FaSpinner className="animate-spin" />
                    Sending...
                  </span>
                ) : (
                  'Send Message'
                )}
              </button>
            </div>
          </form>
        </div>

        <LocationMap />
      </div>
    </main>
  );
}
