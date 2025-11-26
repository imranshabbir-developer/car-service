'use client';

import { useState, useEffect, useRef } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaSpinner, FaTimes, FaCheckCircle, FaExclamationCircle, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { API_BASE_URL, API_IMAGE_BASE_URL } from '@/config/api';
import { logger } from '@/utils/logger';

export default function SpecialSectionsPage() {
  const [sections, setSections] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    imagePosition: 'right',
    backgroundColor: 'white',
    order: 0,
    isActive: true,
    seoTitle: '',
    seoDescription: '',
    slug: '',
    canonicalUrl: '',
  });
  const [deletingId, setDeletingId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Simple toast notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Fetch all sections
  const fetchSections = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/special-sections`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data && data.data.sections) {
        setSections(data.data.sections);
        setFilteredSections(data.data.sections);
      } else {
        logger.warn('Sections response structure unexpected:', data);
        setSections([]);
        setFilteredSections([]);
      }
    } catch (error) {
      logger.error('Error fetching sections:', error);
      showNotification('Error fetching sections', 'error');
      setSections([]);
      setFilteredSections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchSections();
    }
  }, []);

  // Filter sections based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSections(sections);
    } else {
      const filtered = sections.filter((section) =>
        section.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSections(filtered);
    }
  }, [searchTerm, sections]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle image URL change
  const handleImageChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      image: value,
    }));
    setImagePreview(value);
  };

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !editingSection) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData((prev) => ({
        ...prev,
        slug,
      }));
    }
  }, [formData.title, editingSection]);

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      image: '',
      imagePosition: 'right',
      backgroundColor: 'white',
      order: 0,
      isActive: true,
      seoTitle: '',
      seoDescription: '',
      slug: '',
      canonicalUrl: '',
    });
    setEditingSection(null);
    setImagePreview(null);
  };

  // Open modal for adding new section
  const handleAddClick = () => {
    resetForm();
    setShowModal(true);
  };

  // Open modal for editing section
  const handleEditClick = (section) => {
    setEditingSection(section);
    setFormData({
      title: section.title || '',
      content: section.content || '',
      image: section.image || '',
      imagePosition: section.imagePosition || 'right',
      backgroundColor: section.backgroundColor || 'white',
      order: section.order || 0,
      isActive: section.isActive !== undefined ? section.isActive : true,
      seoTitle: section.seoTitle || '',
      seoDescription: section.seoDescription || '',
      slug: section.slug || '',
      canonicalUrl: section.canonicalUrl || '',
    });
    setImagePreview(section.image || null);
    setShowModal(true);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const url = editingSection
        ? `${API_BASE_URL}/special-sections/${editingSection._id}`
        : `${API_BASE_URL}/special-sections`;

      const method = editingSection ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showNotification(
          editingSection ? 'Section updated successfully' : 'Section created successfully',
          'success'
        );
        setShowModal(false);
        resetForm();
        fetchSections();
      } else {
        showNotification(data.message || 'Failed to save section', 'error');
      }
    } catch (error) {
      logger.error('Error saving section:', error);
      showNotification('Error saving section', 'error');
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this section?')) {
      return;
    }

    try {
      setDeletingId(id);
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/special-sections/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showNotification('Section deleted successfully', 'success');
        fetchSections();
      } else {
        showNotification(data.message || 'Failed to delete section', 'error');
      }
    } catch (error) {
      logger.error('Error deleting section:', error);
      showNotification('Error deleting section', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  // Handle toggle active status
  const handleToggleActive = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/special-sections/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showNotification(
          currentStatus ? 'Section deactivated' : 'Section activated',
          'success'
        );
        fetchSections();
      } else {
        showNotification(data.message || 'Failed to update section', 'error');
      }
    } catch (error) {
      logger.error('Error toggling section:', error);
      showNotification('Error updating section', 'error');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Special Sections</h1>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-[#1a2b5c] text-white px-4 py-2 rounded-lg hover:bg-[#0d1b2a] transition-colors"
        >
          <FaPlus /> Add Section
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search sections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
          />
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
            notification.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {notification.type === 'success' ? (
            <FaCheckCircle />
          ) : (
            <FaExclamationCircle />
          )}
          {notification.message}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <FaSpinner className="animate-spin text-4xl text-[#1a2b5c]" />
        </div>
      ) : (
        /* Sections Table */
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSections.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No sections found
                  </td>
                </tr>
              ) : (
                filteredSections.map((section) => (
                  <tr key={section._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {section.order}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="font-medium">{section.title}</div>
                      {section.slug && (
                        <div className="text-xs text-gray-500">/{section.slug}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {section.imagePosition || 'right'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(section._id, section.isActive)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                          section.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {section.isActive ? <FaToggleOn /> : <FaToggleOff />}
                        {section.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditClick(section)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(section._id)}
                          disabled={deletingId === section._id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          {deletingId === section._id ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaTrash />
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
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingSection ? 'Edit Section' : 'Add New Section'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL *
                  </label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleImageChange}
                    required
                    placeholder="https://convoytravels.pk/girl.webp"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-w-xs h-32 object-cover rounded-lg border border-gray-300"
                        onError={() => setImagePreview(null)}
                      />
                    </div>
                  )}
                </div>

                {/* Image Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image Position
                  </label>
                  <select
                    name="imagePosition"
                    value={formData.imagePosition}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
                  >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>

                {/* Background Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Background Color
                  </label>
                  <select
                    name="backgroundColor"
                    value={formData.backgroundColor}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
                  >
                    <option value="white">White</option>
                    <option value="#f4f7fc">Light Blue (#f4f7fc)</option>
                    <option value="#e7ecf5">Light Gray (#e7ecf5)</option>
                  </select>
                </div>

                {/* Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
                  />
                </div>

                {/* SEO Section */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">SEO Settings</h3>
                  
                  {/* SEO Title */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      name="seoTitle"
                      value={formData.seoTitle}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
                    />
                  </div>

                  {/* SEO Description */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SEO Description
                    </label>
                    <textarea
                      name="seoDescription"
                      value={formData.seoDescription}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
                    />
                  </div>

                  {/* Slug */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
                    />
                  </div>

                  {/* Canonical URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Canonical URL
                    </label>
                    <input
                      type="text"
                      name="canonicalUrl"
                      value={formData.canonicalUrl}
                      onChange={handleInputChange}
                      placeholder="https://convoytravels.pk/..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
                    />
                  </div>
                </div>

                {/* Active Status */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#1a2b5c] border-gray-300 rounded focus:ring-[#1a2b5c]"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Active
                  </label>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1a2b5c] text-white rounded-lg hover:bg-[#0d1b2a]"
                  >
                    {editingSection ? 'Update' : 'Create'} Section
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

