'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getCarById } from '@/data/cars';
import { API_BASE_URL, API_IMAGE_BASE_URL } from '@/config/api';
import { FaMapMarkerAlt, FaCalendarAlt, FaEnvelope, FaPhone, FaHome, FaArrowLeft, FaTimes, FaUser } from 'react-icons/fa';
import Link from 'next/link';
import SimilarListings from '@/components/SimilarListings';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { generateSlug, isObjectId } from '@/utils/slug';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/800x600?text=Vehicle+Image';

const buildImageUrl = (path) => {
  if (!path) {
    return PLACEHOLDER_IMAGE;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${API_IMAGE_BASE_URL}${path}`;
};

const transformApiCar = (apiCar) => {
  const primaryImage = buildImageUrl(apiCar?.carPhoto);
  const gallerySource = Array.isArray(apiCar?.gallery) && apiCar.gallery.length > 0 
    ? apiCar.gallery 
    : (apiCar?.carPhoto ? [apiCar.carPhoto] : []);
  const gallery = gallerySource
    .map((img) => buildImageUrl(img))
    .filter(Boolean);

  // Use first gallery image as primary if no carPhoto, otherwise use carPhoto
  const mainImage = primaryImage || (gallery.length > 0 ? gallery[0] : PLACEHOLDER_IMAGE);

  const city = apiCar?.location?.city;
  const address = apiCar?.location?.address;
  const location = [city, address].filter(Boolean).join(', ') || 'Location not specified';

  return {
    id: apiCar?._id,
    name: apiCar?.name ?? 'Vehicle',
    priceNumber: Number(apiCar?.rentPerDay) || 0,
    price: Number(apiCar?.rentPerDay)
      ? `Rs ${Number(apiCar.rentPerDay).toLocaleString()}`
      : 'Price on request',
    image: mainImage,
    images: gallery.length > 0 ? gallery : [mainImage],
    location,
    availability: apiCar?.isAvailable ? 'Available' : 'Currently Unavailable',
    selfDriverPrice: apiCar?.depositAmount ?? 500,
    outOfStationPrice: apiCar?.rentPerDay ?? 1000,
    seats: apiCar?.seats,
    transmission: apiCar?.transmission,
    fuelType: apiCar?.fuelType,
    brand: apiCar?.brand,
    model: apiCar?.model,
    year: apiCar?.year,
    status: apiCar?.status,
  };
};

const mapFallbackCar = (fallbackCar) => {
  if (!fallbackCar) return null;

  const images =
    fallbackCar.images && fallbackCar.images.length
      ? fallbackCar.images
      : [fallbackCar.image, fallbackCar.image].filter(Boolean);

  return {
    ...fallbackCar,
    price:
      fallbackCar.price ||
      fallbackCar.priceFull ||
      (fallbackCar.priceNumber
        ? `Rs ${fallbackCar.priceNumber.toLocaleString()}`
        : 'Price on request'),
    images: images.length ? images : [PLACEHOLDER_IMAGE],
    image: images.length ? images[0] : PLACEHOLDER_IMAGE,
    availability: fallbackCar.availability || 'Weekdays',
    selfDriverPrice: fallbackCar.selfDriverPrice ?? 500,
    outOfStationPrice: fallbackCar.outOfStationPrice ?? 1000,
  };
};

export default function CarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const paramValue = params.id;
  
  // Determine if param is an ID or slug
  const isId = isObjectId(paramValue);
  const actualCarId = useMemo(() => {
    if (isId) {
      return paramValue;
    }
    // If it's a slug, we'll find the car ID in the fetch effect
    return null;
  }, [paramValue, isId]);
  
  const fallbackCar = isId ? mapFallbackCar(getCarById(actualCarId)) : null;
  
  // All hooks must be called before any conditional returns
  const [activeTab, setActiveTab] = useState('booking');
  const [selectedImage, setSelectedImage] = useState(0);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    pickupDate: null,
    dropoffDate: null,
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
  const [car, setCar] = useState(fallbackCar);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingFeedback, setBookingFeedback] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCarDetails = async () => {
      setLoading(true);
      setFetchError(null);

      try {
        let carIdToFetch = actualCarId;

        // If param is a slug, find the car by slug first
        if (!isId && paramValue) {
          const allCarsResponse = await fetch(`${API_BASE_URL}/cars`);
          const allCarsData = await allCarsResponse.json();
          
          if (allCarsData.success && allCarsData.data && allCarsData.data.cars) {
            const matchingCar = allCarsData.data.cars.find(car => {
              const carSlug = generateSlug(car.name);
              return carSlug === paramValue;
            });
            
            if (matchingCar) {
              carIdToFetch = matchingCar._id;
            } else {
              throw new Error('Car not found');
            }
          } else {
            throw new Error('Car not found');
          }
        }

        if (!carIdToFetch) {
          throw new Error('Car not found');
        }

        const response = await fetch(`${API_BASE_URL}/cars/${carIdToFetch}`);

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? 'Car not found'
              : `Request failed with status ${response.status}`
          );
        }

        const data = await response.json();
        const apiCar = data?.data?.car;

        if (!apiCar) {
          throw new Error('Car not found');
        }

        if (isMounted) {
          const transformedCar = transformApiCar(apiCar);
          setCar(transformedCar);
          
          // Update URL to use slug if it's currently using ID (for SEO and clean URLs)
          if (isId && typeof window !== 'undefined') {
            const carSlug = generateSlug(transformedCar.name);
            const newUrl = `/cars/${carSlug}`;
            if (window.location.pathname !== newUrl) {
              window.history.replaceState({}, '', newUrl);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching car details:', error);
        if (isMounted) {
          setFetchError(error.message);
          if (isId) {
            const fallbackCar = mapFallbackCar(getCarById(actualCarId));
            setCar(fallbackCar);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCarDetails();

    return () => {
      isMounted = false;
    };
  }, [paramValue, isId, actualCarId]);

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

  useEffect(() => {
    setSelectedImage(0);
  }, [car?.id]);

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
    
    // Calculate number of days
    let totalDays = 1;
    if (formData.pickupDate && formData.dropoffDate) {
      const pickup = new Date(formData.pickupDate);
      const dropoff = new Date(formData.dropoffDate);
      const diffTime = Math.abs(dropoff - pickup);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      totalDays = diffDays > 0 ? diffDays : 1;
    }
    
    // Base rate per day
    const baseRatePerDay = car.priceNumber || 0;
    
    // Extra charge per day based on selection
    let extraChargePerDay = 0;
    if (formData.selfDriver) {
      extraChargePerDay = car.selfDriverPrice || 500;
    } else if (formData.outOfStation) {
      // Always add 1000 rupees when out of station is selected
      extraChargePerDay = 1000;
    }
    
    // Calculate total: (base rate + extra charge) * number of days
    const total = (baseRatePerDay + extraChargePerDay) * totalDays;
    return total;
  }, [formData.selfDriver, formData.outOfStation, formData.pickupDate, formData.dropoffDate, car]);
  
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ fontFamily: 'Roboto, sans-serif' }}>
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Loading vehicle details...</h1>
          <p className="text-gray-600">Please wait a moment.</p>
        </div>
      </main>
    );
  }

  if (!car) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ fontFamily: 'Roboto, sans-serif' }}>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Car Not Found</h1>
          {fetchError && (
            <p className="text-red-500 mb-2">{fetchError}</p>
          )}
          <p className="text-gray-600 mb-6">The car you&apos;re looking for doesn&apos;t exist.</p>
          <Link 
            href="/vehicle-types"
            className="inline-flex items-center gap-2 btn-gradient-primary text-white px-6 py-3 rounded-lg font-semibold relative z-10"
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!car) {
      setBookingFeedback({
        type: 'error',
        message: 'Vehicle details are not available. Please try again later.',
      });
      return;
    }

    if (!formData.pickupDate || !formData.dropoffDate) {
      setBookingFeedback({
        type: 'error',
        message: 'Please select both pick-up and drop-off dates and times.',
      });
      setActiveTab('booking');
      return;
    }
    
    // Validate that drop-off is after pick-up
    if (new Date(formData.dropoffDate) < new Date(formData.pickupDate)) {
      setBookingFeedback({
        type: 'error',
        message: 'Drop-off date and time must be after pick-up date and time.',
      });
      setActiveTab('booking');
      return;
    }

    if (!formData.selfDriver && !formData.outOfStation) {
      setBookingFeedback({
        type: 'error',
        message: 'Please choose either Self Without Driver or Out of Station option.',
      });
      setActiveTab('booking');
      return;
    }

    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      setBookingFeedback({
        type: 'error',
        message: 'Kindly provide your contact details before submitting the booking.',
      });
      setActiveTab('request');
      return;
    }

    const bookingOption = formData.outOfStation ? 'out_of_station' : 'self_without_driver';

    // Format dates with time for backend (ISO string format)
    const pickupDateISO = formData.pickupDate instanceof Date 
      ? formData.pickupDate.toISOString() 
      : formData.pickupDate;
    const dropoffDateISO = formData.dropoffDate instanceof Date 
      ? formData.dropoffDate.toISOString() 
      : formData.dropoffDate;

    const payload = {
      carId: car.id,
      customerName: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      pickupDate: pickupDateISO,
      dropoffDate: dropoffDateISO,
      bookingOption,
      notes: formData.extraInfo || undefined,
    };

    setIsSubmitting(true);
    setBookingFeedback(null);

    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to submit booking. Please try again.');
      }

      setBookingFeedback({
        type: 'success',
        message: 'Thank you! Your booking request has been received. Our team will contact you shortly.',
      });

      setFormData((prev) => ({
        ...prev,
        pickupDate: null,
        dropoffDate: null,
        extraInfo: '',
        selfDriver: false,
        outOfStation: false,
      }));
      setActiveTab('booking');
    } catch (error) {
      setBookingFeedback({
        type: 'error',
        message: error.message || 'Something went wrong while submitting your booking.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    
    if (!questionFormData.name || !questionFormData.email || !questionFormData.phone || !questionFormData.subject || !questionFormData.message) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const payload = {
        carId: car?.id || undefined,
        customerName: questionFormData.name,
        email: questionFormData.email,
        phone: questionFormData.phone,
        subject: questionFormData.subject,
        message: questionFormData.message,
      };

      const response = await fetch(`${API_BASE_URL}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to submit question. Please try again.');
      }

      alert('Your question has been submitted! We will get back to you soon.');
      setQuestionFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setQuestionModalOpen(false);
    } catch (error) {
      console.error('Error submitting question:', error);
      alert(error.message || 'Something went wrong while submitting your question.');
    }
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
              className="btn-gradient-primary text-white px-6 py-3 rounded-lg font-semibold relative z-10"
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
            {car.images && car.images.length > 1 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {car.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-full h-32 sm:h-40 bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow ${
                      selectedImage === index ? 'ring-2 ring-[#1a2b5c]' : ''
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${car.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
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
                    Pick-up Date & Time
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={formData.pickupDate}
                      onChange={(date) => {
                        setFormData(prev => ({
                          ...prev,
                          pickupDate: date
                        }));
                      }}
                      selectsStart
                      startDate={formData.pickupDate}
                      endDate={formData.dropoffDate}
                      showTimeSelect
                      timeIntervals={15}
                      dateFormat="MMM dd, yyyy hh:mm aa"
                      minDate={new Date()}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent outline-none"
                      placeholderText="Select pick-up date and time"
                      required
                      wrapperClassName="w-full"
                    />
                    <FaCalendarAlt className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Drop-off Date & Time
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={formData.dropoffDate}
                      onChange={(date) => {
                        setFormData(prev => ({
                          ...prev,
                          dropoffDate: date
                        }));
                      }}
                      selectsEnd
                      startDate={formData.pickupDate}
                      endDate={formData.dropoffDate}
                      minDate={formData.pickupDate || new Date()}
                      showTimeSelect
                      timeIntervals={15}
                      dateFormat="MMM dd, yyyy hh:mm aa"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent outline-none"
                      placeholderText="Select drop-off date and time"
                      required
                      wrapperClassName="w-full"
                    />
                    <FaCalendarAlt className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
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
                  disabled={isSubmitting}
                  className={`w-full btn-gradient-primary text-white py-4 rounded-lg font-semibold text-lg mt-6 relative z-10 ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Book Now'}
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
                    Pick-up Date & Time
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={formData.pickupDate}
                      onChange={(date) => {
                        setFormData(prev => ({
                          ...prev,
                          pickupDate: date
                        }));
                      }}
                      selectsStart
                      startDate={formData.pickupDate}
                      endDate={formData.dropoffDate}
                      showTimeSelect
                      timeIntervals={15}
                      dateFormat="MMM dd, yyyy hh:mm aa"
                      minDate={new Date()}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent outline-none"
                      placeholderText="Select pick-up date and time"
                      required
                      wrapperClassName="w-full"
                    />
                    <FaCalendarAlt className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Drop-off Date & Time
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={formData.dropoffDate}
                      onChange={(date) => {
                        setFormData(prev => ({
                          ...prev,
                          dropoffDate: date
                        }));
                      }}
                      selectsEnd
                      startDate={formData.pickupDate}
                      endDate={formData.dropoffDate}
                      minDate={formData.pickupDate || new Date()}
                      showTimeSelect
                      timeIntervals={15}
                      dateFormat="MMM dd, yyyy hh:mm aa"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent outline-none"
                      placeholderText="Select drop-off date and time"
                      required
                      wrapperClassName="w-full"
                    />
                    <FaCalendarAlt className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
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
                  disabled={isSubmitting}
                  className={`w-full btn-gradient-primary text-white py-4 rounded-lg font-semibold text-lg mt-6 relative z-10 ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Send'}
                </button>
              </form>
            )}
            {bookingFeedback && (
              <div
                className={`mt-6 rounded-lg border px-4 py-3 text-sm ${
                  bookingFeedback.type === 'success'
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}
              >
                {bookingFeedback.message}
              </div>
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
                  className="flex-1 btn-gradient-outline text-gray-700 py-3 px-6 rounded-lg font-semibold relative z-10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-gradient-primary text-white py-3 px-6 rounded-lg font-semibold relative z-10"
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

