'use client';

import { useState, useEffect, useRef } from 'react';
import {
  FaDollarSign,
  FaCar,
  FaCarSide,
  FaCheckSquare,
  FaChevronUp,
  FaChevronDown,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimes,
} from 'react-icons/fa';
import { API_BASE_URL, API_IMAGE_BASE_URL } from '@/config/api';

export default function DashboardPage() {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [categories, setCategories] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    year: '',
    category: '',
    rentPerDay: '',
    city: '',
    transmission: '',
    fuelType: '',
    seats: '',
    registrationNumber: '',
    carPhoto: null,
  });

  // Metrics state
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCars, setTotalCars] = useState(0);
  const [rentedCars, setRentedCars] = useState(0);
  const [availableCars, setAvailableCars] = useState(0);

  // Chart data - Monthly (Last 12 months)
  const [monthlyData, setMonthlyData] = useState([
    { month: 'Jan', bookings: 0, revenue: 0 },
    { month: 'Feb', bookings: 0, revenue: 0 },
    { month: 'Mar', bookings: 0, revenue: 0 },
    { month: 'Apr', bookings: 0, revenue: 0 },
    { month: 'May', bookings: 0, revenue: 0 },
    { month: 'Jun', bookings: 0, revenue: 0 },
    { month: 'Jul', bookings: 0, revenue: 0 },
    { month: 'Aug', bookings: 0, revenue: 0 },
    { month: 'Sep', bookings: 0, revenue: 0 },
    { month: 'Oct', bookings: 0, revenue: 0 },
    { month: 'Nov', bookings: 0, revenue: 0 },
    { month: 'Dec', bookings: 0, revenue: 0 },
  ]);

  // Simple toast notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Fetch all cars
  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/cars`);
      const data = await response.json();
      
      if (data.success) {
        setCars(data.data.cars);
        setFilteredCars(data.data.cars);
        
        // Calculate metrics
        const total = data.data.cars.length;
        const rented = data.data.cars.filter(car => car.status === 'booked').length;
        const available = data.data.cars.filter(car => car.status === 'available').length;
        const revenue = data.data.cars.reduce((sum, car) => sum + (car.rentPerDay || 0), 0);
        
        setTotalCars(total);
        setRentedCars(rented);
        setAvailableCars(available);
        setTotalRevenue(revenue);
        
        // Generate dummy monthly data for chart
        const dummyMonthlyData = monthlyData.map(month => ({
          ...month,
          bookings: Math.floor(Math.random() * 50),
          revenue: Math.floor(Math.random() * 500000),
        }));
        setMonthlyData(dummyMonthlyData);
      } else {
        showNotification('Failed to fetch cars', 'error');
      }
    } catch (error) {
      showNotification('Error fetching cars', 'error');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      // Create AbortController for timeout (30 seconds)
      const controller = new AbortController();
      let timeoutId = null;
      
      if (typeof window !== 'undefined') {
        timeoutId = setTimeout(() => {
          controller.abort();
        }, 30000); // 30 second timeout
      }
      
      try {
        const response = await fetch(`${API_BASE_URL}/categories`, {
          signal: controller.signal,
        });
        
        // Clear timeout if request succeeds
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        
        if (!response.ok) {
          console.error('Categories API error:', response.status);
          return;
        }
        
        const data = await response.json();
        
        if (data.success && data.data && data.data.categories) {
          setCategories(data.data.categories);
        } else {
          console.warn('Categories response structure unexpected:', data);
        }
      } catch (fetchError) {
        // Clear timeout on error
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
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

  useEffect(() => {
    // Only fetch on client side
    if (typeof window !== 'undefined') {
      fetchCars();
      fetchCategories();
    }
  }, []);

  // Live search filter
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredCars(cars);
    } else {
      const filtered = cars.filter((car) =>
        car.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCars(filtered);
    }
  }, [searchTerm, cars]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      carPhoto: file,
    }));
  };

  // Open modal for creating
  const handleCreate = () => {
    setEditingCar(null);
    setFormData({
      name: '',
      brand: '',
      model: '',
      year: '',
      category: '',
      rentPerDay: '',
      city: '',
      transmission: '',
      fuelType: '',
      seats: '',
      registrationNumber: '',
      isFeatured: false,
      carPhoto: null,
    });
    setShowModal(true);
  };

  // Open modal for editing
  const handleEdit = async (carId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cars/${carId}`);
      const data = await response.json();

      if (data.success) {
        const car = data.data.car;
        setEditingCar(car);
        setFormData({
          name: car.name || '',
          brand: car.brand || '',
          model: car.model || '',
          year: car.year || '',
          category: car.category?._id || '',
          rentPerDay: car.rentPerDay || '',
          city: car.location?.city || '',
          transmission: car.transmission || '',
          fuelType: car.fuelType || '',
          seats: car.seats || '',
          registrationNumber: car.registrationNumber || '',
          isFeatured: car.isFeatured || false,
          carPhoto: null,
        });
        setShowModal(true);
      } else {
        showNotification('Failed to fetch car details', 'error');
      }
    } catch (error) {
      showNotification('Error fetching car details', 'error');
      console.error('Error:', error);
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCar(null);
    setFormData({
      name: '',
      brand: '',
      model: '',
      year: '',
      category: '',
      rentPerDay: '',
      city: '',
      transmission: '',
      fuelType: '',
      seats: '',
      registrationNumber: '',
      isFeatured: false,
      carPhoto: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle form submit (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('brand', formData.brand);
    formDataToSend.append('model', formData.model);
    formDataToSend.append('year', formData.year);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('rentPerDay', formData.rentPerDay);
    formDataToSend.append('city', formData.city);
    formDataToSend.append('transmission', formData.transmission);
    formDataToSend.append('fuelType', formData.fuelType);
    formDataToSend.append('seats', formData.seats);
    formDataToSend.append('registrationNumber', formData.registrationNumber);
    formDataToSend.append('isFeatured', formData.isFeatured);
    if (formData.carPhoto) {
      formDataToSend.append('carPhoto', formData.carPhoto);
    }

    let response;
    try {
      if (editingCar) {
        // Update existing car
        response = await fetch(`${API_BASE_URL}/cars/${editingCar._id}`, {
          method: 'PUT',
          body: formDataToSend,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });
      } else {
        // Create new car
        response = await fetch(`${API_BASE_URL}/cars`, {
          method: 'POST',
          body: formDataToSend,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });
      }

      const data = await response.json();

      if (data.success) {
        showNotification(editingCar ? 'Car updated successfully!' : 'Car created successfully!', 'success');
        handleCloseModal();
        fetchCars();
      } else {
        showNotification(data.message || 'Operation failed', 'error');
      }
    } catch (error) {
      showNotification('Error saving car', 'error');
      console.error('Error:', error);
    }
  };

  // Handle delete
  const handleDelete = async (carId) => {
    if (!confirm('Are you sure you want to delete this car?')) {
      return;
    }

    try {
      setDeletingId(carId);
      const response = await fetch(`${API_BASE_URL}/cars/${carId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        showNotification('Car deleted successfully!', 'success');
        fetchCars();
      } else {
        showNotification(data.message || 'Failed to delete car', 'error');
      }
    } catch (error) {
      showNotification('Error deleting car', 'error');
      console.error('Error:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const metrics = [
    {
      icon: FaDollarSign,
      label: 'Total Revenue',
      value: `PKR ${totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      isPositive: true,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: FaCar,
      label: 'Total Cars',
      value: totalCars,
      change: '+5.2%',
      isPositive: true,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      icon: FaCheckSquare,
      label: 'Rented Cars',
      value: rentedCars,
      change: '+2.8%',
      isPositive: true,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
    {
      icon: FaCarSide,
      label: 'Available Cars',
      value: availableCars,
      change: '-1.2%',
      isPositive: false,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
  ];

  // Find max value for chart scaling
  const maxChartValue = Math.max(
    ...monthlyData.map(d => Math.max(d.bookings * 1000, d.revenue))
  );

  return (
    <div className="space-y-6">
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
            ×
          </button>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 mt-8 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            {/* Waving background effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 animate-pulse"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className={`${metric.bgColor} p-2 rounded-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <metric.icon className={`w-4 h-4 ${metric.iconColor} group-hover:animate-pulse`} />
                </div>
                <div className={`flex items-center text-xs font-semibold ${
                  metric.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.isPositive ? <FaChevronUp className="w-3 h-3 mr-1 animate-bounce" /> : <FaChevronDown className="w-3 h-3 mr-1 animate-bounce" />}
                  {metric.change}
                </div>
              </div>
              <h3 className="text-xs sm:text-sm text-gray-600 mb-1 group-hover:text-gray-800 transition-colors duration-300">{metric.label}</h3>
              <p className="text-lg sm:text-xl font-bold text-gray-900 group-hover:scale-105 group-hover:text-blue-600 transition-all duration-300 inline-block">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Monthly Overview</h2>
        <div className="h-64 flex items-end justify-between space-x-1">
          {monthlyData.map((monthData, index) => (
            <div key={index} className="flex-1 flex flex-col items-center space-y-2">
              <div className="w-full flex flex-row items-end justify-center space-x-1 h-48">
                {/* Bookings Bar */}
                <div
                  className="flex-1 bg-green-500 rounded-t transition-all hover:bg-green-600 cursor-pointer"
                  style={{
                    height: `${(monthData.bookings * 1000 / maxChartValue) * 100}%`,
                    minHeight: '4px',
                  }}
                  title={`Bookings: ${monthData.bookings}`}
                ></div>
                {/* Revenue Bar */}
                <div
                  className="flex-1 bg-blue-500 rounded-t transition-all hover:bg-blue-600 cursor-pointer"
                  style={{
                    height: `${(monthData.revenue / maxChartValue) * 100}%`,
                    minHeight: '4px',
                  }}
                  title={`Revenue: PKR ${monthData.revenue.toLocaleString()}`}
                ></div>
              </div>
              <span className="text-xs font-medium text-gray-600">{monthData.month}</span>
            </div>
          ))}
        </div>
        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-xs text-gray-600">Bookings</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-xs text-gray-600">Revenue</span>
          </div>
        </div>
      </div>

      {/* Cars Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Header with Search and Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">All Cars</h2>
          </div>
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search cars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c] w-full sm:w-64"
              />
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center space-x-2 bg-[#1a2b5c] text-white px-4 py-2 rounded-lg hover:bg-[#0d1b2a] transition-colors"
            >
              <FaPlus />
              <span className="hidden sm:inline">Add Car</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-[#1a2b5c] text-3xl" />
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Photo</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Model</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Year</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Category</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Rent/Day</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Transmission</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Fuel Type</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-700">Featured</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCars.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="py-8 text-center text-gray-500">
                        {searchTerm ? 'No cars found matching your search.' : 'No cars available.'}
                      </td>
                    </tr>
                  ) : (
                    filteredCars.map((car) => (
                      <tr key={car._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-2">
                          {car.carPhoto ? (
                            <img
                              src={`${API_IMAGE_BASE_URL}${car.carPhoto}`}
                              alt={car.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <FaCar className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-2 text-gray-900 font-medium">{car.name}</td>
                        <td className="py-3 px-2 text-gray-600">{car.model}</td>
                        <td className="py-3 px-2 text-gray-600">{car.year}</td>
                        <td className="py-3 px-2">
                          {car.category ? (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                              {car.category.name}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-gray-900 font-semibold">
                          PKR {car.rentPerDay?.toLocaleString()}
                        </td>
                        <td className="py-3 px-2 text-gray-600">{car.transmission}</td>
                        <td className="py-3 px-2 text-gray-600">{car.fuelType}</td>
                        <td className="py-3 px-2">
                          <div className="flex justify-center">
                            {car.isFeatured ? (
                              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                                Featured
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                                No
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex justify-center items-center space-x-3">
                            <button
                              onClick={() => handleEdit(car._id)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title="Edit"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(car._id)}
                              disabled={deletingId === car._id}
                              className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              {deletingId === car._id ? (
                                <FaSpinner className="w-4 h-4 animate-spin" />
                              ) : (
                                <FaTrash className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="mt-6 text-sm text-gray-600">
              Showing {filteredCars.length} of {cars.length} cars
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full">
            <div className="p-4">
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-bold text-[#1a2b5c]">
                  {editingCar ? 'Edit Car' : 'Add Car'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-2">
                {/* Current Photo Preview */}
                {editingCar && editingCar.carPhoto && !formData.carPhoto && (
                  <div className="flex justify-center mb-2">
                    <div className="w-20 h-20 border border-gray-300 rounded-lg overflow-hidden">
                      <img
                        src={`${API_IMAGE_BASE_URL}${editingCar.carPhoto}`}
                        alt={editingCar.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {/* Column 1 */}
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
                        placeholder="Enter car name"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Brand *
                      </label>
                      <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
                        placeholder="Enter brand"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Model *
                      </label>
                      <input
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
                        placeholder="Enter model"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Year *
                      </label>
                      <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
                        placeholder="2024"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Rent Per Day (PKR) *
                      </label>
                      <input
                        type="number"
                        name="rentPerDay"
                        value={formData.rentPerDay}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
                        placeholder="5000"
                      />
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
                        placeholder="Enter city"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Transmission *
                      </label>
                      <select
                        name="transmission"
                        value={formData.transmission}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
                      >
                        <option value="">Select Transmission</option>
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Fuel Type *
                      </label>
                      <select
                        name="fuelType"
                        value={formData.fuelType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
                      >
                        <option value="">Select Fuel Type</option>
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Electric">Electric</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Seats *
                      </label>
                      <input
                        type="number"
                        name="seats"
                        value={formData.seats}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
                        placeholder="5"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Registration Number *
                      </label>
                      <input
                        type="text"
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
                        placeholder="ABC-123"
                      />
                    </div>

                    <div>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="isFeatured"
                          checked={formData.isFeatured}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-[#1a2b5c] border-gray-300 rounded focus:ring-2 focus:ring-[#1a2b5c]"
                        />
                        <span className="text-xs font-semibold text-gray-700">
                          Mark as Featured
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Car Photo {editingCar && '(Optional)'}
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c] cursor-pointer"
                  />
                  {editingCar && !formData.carPhoto && (
                    <p className="mt-1 text-xs text-gray-500">
                      Leave empty to keep current photo
                    </p>
                  )}
                  {formData.carPhoto && (
                    <p className="mt-1 text-xs text-green-600 font-medium">
                      ✓ New photo selected: {formData.carPhoto.name.length > 30 ? formData.carPhoto.name.substring(0, 30) + '...' : formData.carPhoto.name}
                    </p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm bg-[#1a2b5c] text-white rounded-lg hover:bg-[#0d1b2a] transition-colors"
                  >
                    {editingCar ? 'Update Car' : 'Create Car'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
