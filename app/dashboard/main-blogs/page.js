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
  FaImage,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';
import { API_BASE_URL, API_IMAGE_BASE_URL } from '@/config/api';
import { logger } from '@/utils/logger';

export default function MainBlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

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

  const handleCreate = () => {
    router.push('/dashboard/main-blogs/new');
  };

  const handleEdit = (blog) => {
    router.push(`/dashboard/main-blogs/new?edit=${blog._id}`);
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
          onClick={handleCreate}
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
                {filteredBlogs.map((blog) => {
                  // Normalize image URL - handle paths that may or may not start with /
                  let imageUrl = null;
                  if (blog.image) {
                    const imagePath = blog.image.startsWith('/') ? blog.image : `/${blog.image}`;
                    const baseUrl = API_IMAGE_BASE_URL.endsWith('/') 
                      ? API_IMAGE_BASE_URL.slice(0, -1) 
                      : API_IMAGE_BASE_URL;
                    imageUrl = `${baseUrl}${imagePath}`;
                  }
                  
                  return (
                  <tr key={blog._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={blog.blogTitle || 'Blog image'}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
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
                          onClick={() => handleEdit(blog)}
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

