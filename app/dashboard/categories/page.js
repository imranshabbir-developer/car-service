'use client';

import { useState, useEffect, useRef } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaSpinner, FaTimes, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { API_BASE_URL, API_IMAGE_BASE_URL } from '@/config/api';
import { logger } from '@/utils/logger';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Active',
    photo: null,
  });
  const [deletingId, setDeletingId] = useState(null);
  const [notification, setNotification] = useState(null);
  const fileInputRef = useRef(null);

  // Simple toast notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      
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
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.data && data.data.categories) {
          setCategories(data.data.categories);
          setFilteredCategories(data.data.categories);
        } else {
          logger.warn('Categories response structure unexpected:', data);
          setCategories([]);
          setFilteredCategories([]);
          showNotification('Failed to fetch categories: Invalid response format', 'error');
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
        showNotification('Connection timeout. Please check if the server is running.', 'error');
      } else if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION')) {
        showNotification('Cannot connect to server. Please check your internet connection and ensure the backend is running.', 'error');
      } else {
        showNotification('Error fetching categories', 'error');
      }
      logger.error('Error:', error);
      setCategories([]);
      setFilteredCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch on client side
    if (typeof window !== 'undefined') {
      fetchCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Live search filter
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchTerm, categories]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      photo: file,
    }));
  };

  // Open modal for editing
  const handleEdit = async (categoryId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`);
      const data = await response.json();
      
      if (data.success) {
        setEditingCategory(data.data.category);
        setFormData({
          name: data.data.category.name,
          description: data.data.category.description,
          status: data.data.category.status,
          photo: null,
        });
        setShowModal(true);
      } else {
        showNotification('Failed to fetch category details', 'error');
      }
    } catch (error) {
      showNotification('Error fetching category details', 'error');
      logger.error('Error:', error);
    }
  };

  // Open modal for creating
  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      status: 'Active',
      photo: null,
    });
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      status: 'Active',
      photo: null,
    });
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle form submit (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('status', formData.status);
      
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }

      let response;
      if (editingCategory) {
        // Update existing category
        response = await fetch(`${API_BASE_URL}/categories/${editingCategory._id}`, {
          method: 'PUT',
          body: formDataToSend,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });
      } else {
        // Create new category
        response = await fetch(`${API_BASE_URL}/categories`, {
          method: 'POST',
          body: formDataToSend,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });
      }

      const data = await response.json();
      
      if (data.success) {
        showNotification(editingCategory ? 'Category updated successfully!' : 'Category created successfully!', 'success');
        handleCloseModal();
        fetchCategories();
      } else {
        showNotification(data.message || 'Operation failed', 'error');
      }
    } catch (error) {
      showNotification('Error saving category', 'error');
      logger.error('Error:', error);
    }
  };

  // Handle delete
  const handleDelete = async (categoryId) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      setDeletingId(categoryId);
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        showNotification('Category deleted successfully!', 'success');
        fetchCategories();
      } else {
        showNotification(data.message || 'Failed to delete category', 'error');
      }
    } catch (error) {
      showNotification('Error deleting category', 'error');
      logger.error('Error:', error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white rounded-lg mt-8 shadow-sm border border-gray-200 p-6">
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
            <FaTimes />
          </button>
        </div>
      )}
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2b5c] mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
            Categories Management
          </h1>
          <p className="text-gray-600">Manage your vehicle categories</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center space-x-2 btn-gradient-primary text-white px-4 py-2 rounded-lg font-semibold relative z-10"
        >
          <FaPlus />
          <span>Add Category</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <FaSpinner className="animate-spin text-[#1a2b5c] text-3xl" />
        </div>
      ) : (
        <>
          {/* Categories Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">
                    Photo
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                      {searchTerm ? 'No categories found matching your search.' : 'No categories available.'}
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((category) => (
                    <tr key={category._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        {category.photo ? (
                          <img
                            src={`${API_IMAGE_BASE_URL}${category.photo}`}
                            alt={category.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Photo</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-gray-900">{category.name}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-gray-600 text-sm max-w-md truncate">{category.description}</div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            category.status === 'Active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {category.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center items-center space-x-3">
                          <button
                            onClick={() => handleEdit(category._id)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Edit"
                          >
                            <FaEdit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(category._id)}
                            disabled={deletingId === category._id}
                            className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            {deletingId === category._id ? (
                              <FaSpinner className="w-5 h-5 animate-spin" />
                            ) : (
                              <FaTrash className="w-5 h-5" />
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
            Showing {filteredCategories.length} of {categories.length} categories
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-5">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-[#1a2b5c]">
                  {editingCategory ? 'Edit Category' : 'Add Category'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Current Photo Preview */}
                {editingCategory && editingCategory.photo && !formData.photo && (
                  <div className="flex justify-center mb-3">
                    <div className="w-20 h-20 border border-gray-300 rounded-lg overflow-hidden">
                      <img
                        src={`${API_IMAGE_BASE_URL}${editingCategory.photo}`}
                        alt={editingCategory.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

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
                    placeholder="Enter category name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="2"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
                    placeholder="Enter category description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Status *
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Photo {editingCategory && '(Opt)'}
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-2 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c] cursor-pointer"
                    />
                  </div>
                </div>

                {editingCategory && !formData.photo && (
                  <p className="text-xs text-gray-500 text-center">
                    Leave empty to keep current photo
                  </p>
                )}
                {formData.photo && (
                  <p className="text-xs text-green-600 font-medium text-center">
                    ✓ New photo: {formData.photo.name.length > 25 ? formData.photo.name.substring(0, 25) + '...' : formData.photo.name}
                  </p>
                )}

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-sm btn-gradient-outline text-gray-700 rounded-lg font-semibold relative z-10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm btn-gradient-primary text-white rounded-lg font-semibold relative z-10"
                  >
                    {editingCategory ? 'Update' : 'Create'}
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

