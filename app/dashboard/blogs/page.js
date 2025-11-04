'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimes,
} from 'react-icons/fa';
import { API_BASE_URL } from '@/config/api';

export default function BlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Simple toast notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Fetch all blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      console.log('Fetching blogs from:', `${API_BASE_URL}/blogs`);
      
      // Create AbortController for timeout (30 seconds)
      const controller = new AbortController();
      let timeoutId = null;
      
      // Set timeout only if we're in browser environment
      if (typeof window !== 'undefined') {
        timeoutId = setTimeout(() => {
          controller.abort();
        }, 30000); // 30 second timeout
      }
      
      try {
        const response = await fetch(`${API_BASE_URL}/blogs`, {
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
        console.log('Blogs API response:', data);
        
        if (data.success && data.data && data.data.blogs) {
          console.log('Setting blogs:', data.data.blogs);
          setBlogs(data.data.blogs);
          setFilteredBlogs(data.data.blogs);
        } else {
          console.warn('API response structure unexpected:', data);
          setBlogs([]);
          setFilteredBlogs([]);
          showNotification('Failed to fetch blogs: Invalid response format', 'error');
        }
      } catch (fetchError) {
        // Clear timeout on error
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        throw fetchError;
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
      setFilteredBlogs([]);
      
      if (error.name === 'AbortError') {
        showNotification('Connection timeout. Please check if the server is running.', 'error');
      } else if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION')) {
        showNotification('Cannot connect to server. Please check your internet connection and ensure the backend is running.', 'error');
      } else {
        showNotification('Error fetching blogs. Please check your connection.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Live search filter
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter((blog) =>
        blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBlogs(filtered);
    }
  }, [searchTerm, blogs]);

  // Handle create - navigate to new page
  const handleCreate = () => {
    router.push('/dashboard/blogs/new');
  };

  // Handle edit - navigate to edit page
  const handleEdit = (blogId) => {
    router.push(`/dashboard/blogs/new?edit=${blogId}`);
  };

  // Handle delete
  const handleDelete = async (blogId) => {
    if (!confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      setDeletingId(blogId);
      const response = await fetch(`${API_BASE_URL}/blogs/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        showNotification('Blog deleted successfully!', 'success');
        fetchBlogs();
      } else {
        showNotification(data.message || 'Failed to delete blog', 'error');
      }
    } catch (error) {
      showNotification('Error deleting blog', 'error');
      console.error('Error:', error);
    } finally {
      setDeletingId(null);
    }
  };

  // Truncate description for table display
  const truncateDescription = (text, maxLength = 80) => {
    if (!text) return '-';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

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
            <FaTimes className="text-lg" />
          </button>
        </div>
      )}

      {/* Blogs Table */}
      <div className="bg-white rounded-lg mt-8 shadow-sm border border-gray-200 p-6">
        {/* Header with Search and Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">All Blogs</h2>
          </div>
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search blogs..."
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
              <span className="hidden sm:inline">Add Blog</span>
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
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Title</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Category</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Description</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Published</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBlogs.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-gray-500">
                        {searchTerm ? 'No blogs found matching your search.' : 'No blogs available.'}
                      </td>
                    </tr>
                  ) : (
                    filteredBlogs.map((blog) => (
                      <tr key={blog._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-2 text-gray-900 font-medium">
                          <div className="max-w-xs truncate" title={blog.title}>
                            {blog.title || '-'}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          {blog.category ? (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                              {blog.category.name || blog.category}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-gray-600">
                          <div className="max-w-md" title={blog.description}>
                            {truncateDescription(blog.description)}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          {blog.published ? (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                              Published
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full">
                              Draft
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex justify-center items-center space-x-3">
                            <button
                              onClick={() => handleEdit(blog._id)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title="Edit"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(blog._id)}
                              disabled={deletingId === blog._id}
                              className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              {deletingId === blog._id ? (
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
              Showing {filteredBlogs.length} of {blogs.length} blogs
            </div>
          </>
        )}
      </div>
    </div>
  );
}
