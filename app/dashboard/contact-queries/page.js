'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
  FaEnvelope,
  FaPhoneAlt,
  FaUser,
  FaComment,
} from 'react-icons/fa';
import { API_BASE_URL } from '@/config/api';
import { logger } from '@/utils/logger';

const STATUS_META = {
  new: {
    label: 'New',
    chip: 'bg-blue-100 text-blue-700 border border-blue-200',
  },
  read: {
    label: 'Read',
    chip: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  },
  replied: {
    label: 'Replied',
    chip: 'bg-green-100 text-green-700 border border-green-200',
  },
  archived: {
    label: 'Archived',
    chip: 'bg-gray-100 text-gray-700 border border-gray-200',
  },
};

export default function ContactQueriesPage() {
  const router = useRouter();
  const [queries, setQueries] = useState([]);
  const [filteredQueries, setFilteredQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [notification, setNotification] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editingQuery, setEditingQuery] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    status: 'new',
    notes: '',
  });

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      
      const response = await fetch(`${API_BASE_URL}/contact-queries`, {
        headers: {
          Authorization: `Bearer ${token || ''}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setQueries(data.data.contactQueries);
        setFilteredQueries(data.data.contactQueries);
      } else {
        showNotification('Failed to fetch contact queries', 'error');
      }
    } catch (error) {
      showNotification('Error fetching contact queries', 'error');
      logger.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchQueries();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let filtered = [...queries];
    
    // Filter by search term
    if (searchTerm !== '') {
      filtered = filtered.filter((query) =>
        query.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.message?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((query) => query.status === statusFilter);
    }
    
    setFilteredQueries(filtered);
  }, [searchTerm, statusFilter, queries]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this contact query?')) {
      return;
    }

    try {
      setDeletingId(id);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      
      const response = await fetch(`${API_BASE_URL}/contact-queries/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token || ''}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        showNotification('Contact query deleted successfully');
        fetchQueries();
      } else {
        showNotification(data.message || 'Failed to delete contact query', 'error');
      }
    } catch (error) {
      showNotification('Error deleting contact query', 'error');
      logger.error('Error:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (query) => {
    setEditingQuery(query);
    setEditFormData({
      name: query.name || '',
      email: query.email || '',
      phone: query.phone || '',
      message: query.message || '',
      status: query.status || 'new',
      notes: query.notes || '',
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      
      const response = await fetch(`${API_BASE_URL}/contact-queries/${editingQuery._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || ''}`,
        },
        body: JSON.stringify(editFormData),
      });

      const data = await response.json();

      if (data.success) {
        showNotification('Contact query updated successfully');
        setEditingQuery(null);
        fetchQueries();
      } else {
        showNotification(data.message || 'Failed to update contact query', 'error');
      }
    } catch (error) {
      showNotification('Error updating contact query', 'error');
      logger.error('Error:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-6" style={{ fontFamily: 'Roboto, sans-serif' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1a2b5c]">Contact Queries</h1>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>
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

      {/* Edit Modal */}
      {editingQuery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-[#1a2b5c] mb-4">Edit Contact Query</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <textarea
                  value={editFormData.message}
                  onChange={(e) => setEditFormData({ ...editFormData, message: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
                <textarea
                  value={editFormData.notes}
                  onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
                  placeholder="Internal notes..."
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setEditingQuery(null)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1a2b5c] text-white rounded-lg hover:bg-[#132045]"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <FaSpinner className="animate-spin text-[#1a2b5c] text-4xl" />
        </div>
      ) : filteredQueries.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          {searchTerm || statusFilter !== 'all'
            ? 'No contact queries found matching your filters.'
            : 'No contact queries available.'}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                {filteredQueries.map((query) => (
                  <tr key={query._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <FaUser className="text-gray-400" />
                        {query.name}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <FaEnvelope className="text-gray-400" />
                        {query.email}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <FaPhoneAlt className="text-gray-400" />
                        {query.phone}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-500 max-w-md truncate flex items-center gap-2">
                        <FaComment className="text-gray-400 flex-shrink-0" />
                        {query.message}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_META[query.status]?.chip || STATUS_META.new.chip}`}>
                        {STATUS_META[query.status]?.label || 'New'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(query.createdAt)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(query)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(query._id)}
                          disabled={deletingId === query._id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingId === query._id ? (
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
    </div>
  );
}

