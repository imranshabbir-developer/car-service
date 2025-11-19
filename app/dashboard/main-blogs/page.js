'use client';

import { useState, useEffect, useRef } from 'react';
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimes,
  FaImage,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';
import { API_BASE_URL, API_IMAGE_BASE_URL } from '@/config/api';
import { logger } from '@/utils/logger';

export default function MainBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    blogTitle: '',
    description: '',
    isPublished: false,
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      
      const response = await fetch(`${API_BASE_URL}/main-blogs`, {
        headers: {
          Authorization: `Bearer ${token || ''}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setBlogs(data.data.blogs);
        setFilteredBlogs(data.data.blogs);
      } else {
        showNotification('Failed to fetch blogs', 'error');
      }
    } catch (error) {
      showNotification('Error fetching blogs', 'error');
      logger.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchBlogs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let filtered = [...blogs];
    if (searchTerm !== '') {
      filtered = filtered.filter((blog) =>
        blog.blogTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredBlogs(filtered);
  }, [searchTerm, blogs]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      blogTitle: '',
      description: '',
      isPublished: false,
      image: null,
    });
    setImagePreview(null);
    setEditingBlog(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleOpenModal = (blog = null) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        blogTitle: blog.blogTitle || '',
        description: blog.description || '',
        isPublished: blog.isPublished || false,
        image: null,
      });
      setImagePreview(blog.image ? `${API_IMAGE_BASE_URL}${blog.image}` : null);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.blogTitle.trim() || !formData.description.trim()) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      const formDataToSend = new FormData();
      
      formDataToSend.append('blogTitle', formData.blogTitle);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('isPublished', formData.isPublished);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const url = editingBlog
        ? `${API_BASE_URL}/main-blogs/${editingBlog._id}`
        : `${API_BASE_URL}/main-blogs`;
      
      const method = editingBlog ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token || ''}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        showNotification(
          editingBlog ? 'Blog updated successfully' : 'Blog created successfully'
        );
        handleCloseModal();
        fetchBlogs();
      } else {
        showNotification(data.message || 'Operation failed', 'error');
      }
    } catch (error) {
      showNotification('Error saving blog', 'error');
      logger.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      setDeletingId(id);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      
      const response = await fetch(`${API_BASE_URL}/main-blogs/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token || ''}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        showNotification('Blog deleted successfully');
        fetchBlogs();
      } else {
        showNotification(data.message || 'Failed to delete blog', 'error');
      }
    } catch (error) {
      showNotification('Error deleting blog', 'error');
      logger.error('Error:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      
      const response = await fetch(`${API_BASE_URL}/main-blogs/${id}/publish`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token || ''}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        showNotification(
          currentStatus ? 'Blog unpublished successfully' : 'Blog published successfully'
        );
        fetchBlogs();
      } else {
        showNotification(data.message || 'Operation failed', 'error');
      }
    } catch (error) {
      showNotification('Error updating blog status', 'error');
      logger.error('Error:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="p-6" style={{ fontFamily: 'Roboto, sans-serif' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1a2b5c]">Main Blogs</h1>
        <button
          onClick={() => handleOpenModal()}
          className="btn-gradient-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 relative z-10"
        >
          <FaPlus /> Add Blog
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search blogs..."
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
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
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

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <FaSpinner className="animate-spin text-[#1a2b5c] text-4xl" />
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No blogs found. Click &quot;Add Blog&quot; to create one.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Published
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBlogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {blog.image ? (
                        <img
                          src={`${API_IMAGE_BASE_URL}${blog.image}`}
                          alt={blog.blogTitle}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                          <FaImage className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">
                        {blog.blogTitle}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-500 max-w-md truncate">
                        {blog.description}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => handleTogglePublish(blog._id, blog.isPublished)}
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                          blog.isPublished
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {blog.isPublished ? <FaEye /> : <FaEyeSlash />}
                        {blog.isPublished ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(blog.createdAt)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenModal(blog)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          disabled={deletingId === blog._id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          {deletingId === blog._id ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#1a2b5c]">
                  {editingBlog ? 'Edit Blog' : 'Add New Blog'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Blog Title *
                  </label>
                  <input
                    type="text"
                    name="blogTitle"
                    value={formData.blogTitle}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Publish
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 btn-gradient-outline text-gray-700 rounded-lg font-semibold relative z-10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 btn-gradient-primary text-white rounded-lg font-semibold relative z-10"
                  >
                    {editingBlog ? 'Update' : 'Create'}
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

