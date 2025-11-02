'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getCarById } from '@/data/cars';
import { FaMapMarkerAlt, FaCalendarAlt, FaEnvelope, FaPhone, FaHome, FaArrowLeft, FaTimes, FaUser } from 'react-icons/fa';
import Link from 'next/link';
import SimilarListings from '@/components/SimilarListings';

export default function CarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const carId = params.id;
  
  // All hooks must be called before any conditional returns
  const [activeTab, setActiveTab] = useState('booking');
  const [selectedImage, setSelectedImage] = useState(0);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    pickupDate: '',
    dropoffDate: '',
    extraInfo: '',
    selfDriver: false,
    outOfStation: false,
  });
  const [questionFormData, setQuestionFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const car = getCarById(carId);

  // Handle body scroll lock when modal is open
  useEffect(() => {
    if (questionModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [questionModalOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && questionModalOpen) {
        setQuestionModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [questionModalOpen]);

  const calculateTotal = useMemo(() => {
    if (!car) return 0;
    let total = car.priceNumber || 0;
    if (formData.selfDriver) total += car.selfDriverPrice || 0;
    if (formData.outOfStation) total += car.outOfStationPrice || 0;
    return total;
  }, [formData.selfDriver, formData.outOfStation, car]);
  
  if (!car) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ fontFamily: 'Roboto, sans-serif' }}>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Car Not Found</h1>
          <p className="text-gray-600 mb-6">The car you&apos;re looking for doesn&apos;t exist.</p>
          <Link 
            href="/vehicle-types"
            className="inline-flex items-center gap-2 bg-[#1a2b5c] text-white px-6 py-3 rounded-lg hover:bg-[#0d1b2a] transition-colors"
          >
            <FaArrowLeft />
            Back to Vehicles
          </Link>
        </div>
      </main>
    );
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleQuestionInputChange = (e) => {
    const { name, value } = e.target;
    setQuestionFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Booking request submitted! We will contact you soon.');
  };

  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    // Handle question submission here
    console.log('Question submitted:', questionFormData);
    alert('Your question has been submitted! We will get back to you soon.');
    setQuestionFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
    setQuestionModalOpen(false);
  };

  return (
    <main className="min-h-screen bg-gray-50" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 md:py-12">
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8 gap-6">
          {/* Left: Car Name & Location */}
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              {car.name}
            </h1>
            <div className="flex items-center gap-2 text-gray-600">
              <FaMapMarkerAlt className="w-4 h-4 text-[#1a2b5c]" />
              <span className="text-sm md:text-base">{car.location}</span>
              <Link href="#" className="text-[#1a2b5c] hover:underline ml-2 text-sm md:text-base">
                See map
              </Link>
            </div>
          </div>

          {/* Right: Price & Ask Question Button */}
          <div className="flex flex-col items-start md:items-end gap-4">
            <div className="text-right">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                  {car.price}
                </span>
                <span className="text-base md:text-lg text-gray-600">/perday</span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-gray-600">
                <FaCalendarAlt className="w-4 h-4" />
                <span className="text-sm md:text-base">{car.availability || 'Weekdays'}</span>
              </div>
            </div>
            <button 
              onClick={() => setQuestionModalOpen(true)}
              className="bg-[#1a2b5c] text-white px-6 py-3 rounded-lg hover:bg-[#0d1b2a] transition-colors duration-300 font-semibold"
            >
              Ask a Question
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column: Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative w-full h-[400px] sm:h-[500px] bg-white rounded-xl overflow-hidden shadow-lg">
              <img
                src={car.images?.[selectedImage] || car.image}
                alt={car.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-2 gap-4">
              {car.images?.slice(0, 2).map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-full h-48 bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow ${
                    selectedImage === index ? 'ring-2 ring-[#1a2b5c]' : ''
                  }`}
                >
                  <img
                    src={img}
                    alt={`${car.name} ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Booking Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              {car.name}
            </h2>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('booking')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'booking'
                    ? 'text-[#1a2b5c] border-b-2 border-[#1a2b5c]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Booking
              </button>
              <button
                onClick={() => setActiveTab('request')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'request'
                    ? 'text-[#1a2b5c] border-b-2 border-[#1a2b5c]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Request Booking
              </button>
            </div>

            {/* Booking Tab */}
            {activeTab === 'booking' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pick-up Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="pickupDate"
                      value={formData.pickupDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent outline-none"
                      required
                    />
                    <FaCalendarAlt className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Drop-off Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="dropoffDate"
                      value={formData.dropoffDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent outline-none"
                      required
                    />
                    <FaCalendarAlt className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Additional Options */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="driverOption"
                        value="selfDriver"
                        checked={formData.selfDriver && !formData.outOfStation}
                        onChange={() => {
                          setFormData(prev => ({
                            ...prev,
                            selfDriver: true,
                            outOfStation: false
                          }));
                        }}
                        className="w-4 h-4 text-[#1a2b5c] focus:ring-[#1a2b5c]"
                      />
                      <span className="text-gray-700 font-medium">Self Without Driver</span>
                    </div>
                    <span className="text-gray-600">Rs{car.selfDriverPrice || 500} / perday</span>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="driverOption"
                        value="outOfStation"
                        checked={formData.outOfStation && !formData.selfDriver}
                        onChange={() => {
                          setFormData(prev => ({
                            ...prev,
                            outOfStation: true,
                            selfDriver: false
                          }));
                        }}
                        className="w-4 h-4 text-[#1a2b5c] focus:ring-[#1a2b5c]"
                      />
                      <span className="text-gray-700 font-medium">Out of Station</span>
                    </div>
                    <span className="text-gray-600">Rs{car.outOfStationPrice || 1000} / perday</span>
                  </label>
                </div>

                {/* Total */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-[#1a2b5c]">
                      Rs{calculateTotal.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Available: {car.availability || 'Weekdays'}</p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1a2b5c] text-white py-4 rounded-lg hover:bg-[#0d1b2a] transition-colors duration-300 font-semibold text-lg mt-6"
                >
                  Book Now
                </button>
              </form>
            )}

            {/* Request Booking Tab */}
            {activeTab === 'request' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent outline-none"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent outline-none"
                      placeholder="your.email@example.com"
                      required
                    />
                    <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent outline-none"
                      placeholder="+92 300 1234567"
                      required
                    />
                    <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent outline-none"
                      placeholder="Your address"
                      required
                    />
                    <FaHome className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pick-up Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="pickupDate"
                      value={formData.pickupDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent outline-none"
                      required
                    />
                    <FaCalendarAlt className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Drop-off Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="dropoffDate"
                      value={formData.dropoffDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent outline-none"
                      required
                    />
                    <FaCalendarAlt className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Extra Information
                  </label>
                  <textarea
                    name="extraInfo"
                    value={formData.extraInfo}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent outline-none resize-none"
                    placeholder="Any additional information..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1a2b5c] text-white py-4 rounded-lg hover:bg-[#0d1b2a] transition-colors duration-300 font-semibold text-lg mt-6"
                >
                  Send
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Similar Listings Section */}
      <SimilarListings currentCar={car} limit={3} />

      {/* Ask Question Modal Overlay */}
      {questionModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setQuestionModalOpen(false);
            }
          }}
        >
          {/* Dark Overlay Background */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
          
          {/* Close Button */}
          <button
            onClick={() => setQuestionModalOpen(false)}
            className="absolute top-6 right-6 sm:top-8 sm:right-8 z-[60] text-white hover:text-gray-300 transition-colors"
            aria-label="Close question modal"
          >
            <FaTimes className="w-8 h-8 sm:w-10 sm:h-10" />
          </button>

          {/* Question Form Modal */}
          <div 
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1a2b5c] mb-2">
                Ask a Question
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Have a question about <span className="font-semibold text-[#1a2b5c]">{car.name}</span>? We&apos;re here to help!
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleQuestionSubmit}>
              {/* Name */}
              <div>
                <label htmlFor="questionName" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="questionName"
                    name="name"
                    value={questionFormData.name}
                    onChange={handleQuestionInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent outline-none transition-all"
                    required
                  />
                  <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="questionEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="questionEmail"
                    name="email"
                    value={questionFormData.email}
                    onChange={handleQuestionInputChange}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent outline-none transition-all"
                    required
                  />
                  <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="questionPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id="questionPhone"
                    name="phone"
                    value={questionFormData.phone}
                    onChange={handleQuestionInputChange}
                    placeholder="+92 300 1234567"
                    className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent outline-none transition-all"
                    required
                  />
                  <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="questionSubject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="questionSubject"
                  name="subject"
                  value={questionFormData.subject}
                  onChange={handleQuestionInputChange}
                  placeholder="What is your question about?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="questionMessage" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Question <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="questionMessage"
                  name="message"
                  value={questionFormData.message}
                  onChange={handleQuestionInputChange}
                  rows="5"
                  placeholder="Please provide details about your question..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent outline-none transition-all resize-none"
                  required
                />
              </div>

              {/* Car Info Display */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-600 mb-2">Question about:</p>
                <p className="font-semibold text-[#1a2b5c]">{car.name}</p>
                <p className="text-sm text-gray-600 mt-1">{car.price} /perday</p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setQuestionModalOpen(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#1a2b5c] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#0d1b2a] transition-colors duration-300"
                >
                  Send Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

