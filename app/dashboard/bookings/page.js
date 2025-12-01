'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  FaSpinner,
  FaSearch,
  FaCalendarAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaThumbsUp,
  FaTrash,
} from 'react-icons/fa';
import { API_BASE_URL, API_IMAGE_BASE_URL } from '@/config/api';
import { logger } from '@/utils/logger';

const PLACEHOLDER_IMAGE =
  'https://via.placeholder.com/200x140?text=Vehicle+Image';

const STATUS_META = {
  pending: {
    label: 'Pending',
    chip: 'bg-amber-100 text-amber-700 border border-amber-200',
  },
  confirmed: {
    label: 'Confirmed',
    chip: 'bg-blue-100 text-blue-700 border border-blue-200',
  },
  approved: {
    label: 'Approved',
    chip: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  },
  rejected: {
    label: 'Rejected',
    chip: 'bg-rose-100 text-rose-700 border border-rose-200',
  },
};

const OPTION_LABELS = {
  self_without_driver: 'Self Without Driver',
  out_of_station: 'Out of Station',
};

const ACTIONS = [
  {
    key: 'confirmed',
    label: 'Confirm',
    styles:
      'btn-gradient-secondary text-white relative z-10',
    icon: FaCheckCircle,
  },
  {
    key: 'approved',
    label: 'Approve',
    styles:
      'btn-gradient-success text-white relative z-10',
    icon: FaThumbsUp,
  },
  {
    key: 'rejected',
    label: 'Reject',
    styles:
      'btn-gradient-danger text-white relative z-10',
    icon: FaTimesCircle,
  },
];

const formatCurrency = (value) =>
  `Rs${(value || 0).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  })}`;

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [notification, setNotification] = useState(null);
  const [updatingStatusKey, setUpdatingStatusKey] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : '';

      const response = await fetch(`${API_BASE_URL}/bookings`, {
        headers: {
          Authorization: `Bearer ${token || ''}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to load bookings.');
      }

      const normalised = data.data.bookings.map((booking) => ({
        ...booking,
        car: booking.car || {},
        pricing: booking.pricing || {},
        carImage: booking.car?.carPhoto
          ? `${API_IMAGE_BASE_URL}${booking.car.carPhoto}`
          : PLACEHOLDER_IMAGE,
      }));

      setBookings(normalised);
      setFilteredBookings(normalised);
    } catch (error) {
      logger.error('Error fetching bookings:', error);
      showNotification(
        error.message || 'Unable to load bookings. Please try again later.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let results = [...bookings];

    if (statusFilter !== 'all') {
      results = results.filter((booking) => booking.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const query = searchTerm.trim().toLowerCase();
      results = results.filter((booking) => {
        const carName = booking.car?.name?.toLowerCase() || '';
        const customer = booking.customerName?.toLowerCase() || '';
        const email = booking.email?.toLowerCase() || '';
        const phone = booking.phone?.toLowerCase() || '';

        return (
          carName.includes(query) ||
          customer.includes(query) ||
          email.includes(query) ||
          phone.includes(query)
        );
      });
    }

    setFilteredBookings(results);
  }, [bookings, statusFilter, searchTerm]);

  const summary = useMemo(() => {
    const totals = bookings.reduce(
      (acc, booking) => {
        const amount = booking.pricing?.calculatedTotal || 0;
        acc.totalRevenue += amount;
        acc.statusCounts[booking.status] =
          (acc.statusCounts[booking.status] || 0) + 1;
        return acc;
      },
      { totalRevenue: 0, statusCounts: {} }
    );

    return totals;
  }, [bookings]);

  const handleStatusUpdate = async (bookingId, status) => {
    if (!bookingId || !status) return;
    const key = `${bookingId}-${status}`;
    setUpdatingStatusKey(key);

    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : '';

      const response = await fetch(
        `${API_BASE_URL}/bookings/${bookingId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token || ''}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to update booking status.');
      }

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId ? { ...booking, status } : booking
        )
      );

      showNotification('Booking status updated successfully.');
    } catch (error) {
      logger.error('Error updating booking status:', error);
      showNotification(
        error.message || 'Failed to update booking status.',
        'error'
      );
    } finally {
      setUpdatingStatusKey(null);
    }
  };

  const handleDelete = async (bookingId) => {
    if (!bookingId) return;

    if (
      !confirm(
        'Are you sure you want to delete this booking? This action cannot be undone.'
      )
    ) {
      return;
    }

    setDeletingId(bookingId);

    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : '';

      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token || ''}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete booking.');
      }

      setBookings((prev) => prev.filter((booking) => booking._id !== bookingId));
      showNotification('Booking deleted successfully.');
    } catch (error) {
      logger.error('Error deleting booking:', error);
      showNotification(
        error.message || 'Unable to delete booking. Please try again.',
        'error'
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1a2b5c] mb-2">
          Bookings
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Review, manage, and action customer booking requests in real-time.
          Confirm, approve, or reject bookings with a single click.
        </p>
      </div>

      {notification && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-sm text-gray-500 mb-1">Total Bookings</p>
          <p className="text-3xl font-semibold text-[#1a2b5c]">
            {bookings.length}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Includes all booking requests received.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-sm text-gray-500 mb-1">Pending Review</p>
          <p className="text-3xl font-semibold text-amber-600">
            {summary.statusCounts?.pending || 0}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Bookings awaiting your confirmation.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-sm text-gray-500 mb-1">Projected Revenue</p>
          <p className="text-3xl font-semibold text-emerald-600">
            {formatCurrency(summary.totalRevenue)}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Based on current booking totals.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="relative max-w-md w-full">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer, email, phone, or vehicle..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent text-sm bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <button
              onClick={fetchBookings}
              className="px-4 py-2.5 rounded-xl btn-gradient-outline text-[#1a2b5c] text-sm font-semibold relative z-10"
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 text-[#1a2b5c]">
            <FaSpinner className="animate-spin text-3xl" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg text-gray-600 font-medium">
              No bookings found for the selected filters.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Try adjusting your filters or check back later.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Schedule
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Option
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredBookings.map((booking) => {
                  const duration = booking.pricing?.totalDays || 1;
                  const statusInfo =
                    STATUS_META[booking.status] || STATUS_META.pending;

                  return (
                    <tr key={booking._id} className="hover:bg-gray-50/60">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-16 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                            <img
                              src={booking.carImage}
                              alt={booking.car?.name || 'Vehicle image'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {booking.car?.name || 'Vehicle'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {booking.car?.brand
                                ? `${booking.car.brand} ${
                                    booking.car.model || ''
                                  }`
                                : '—'}
                            </p>
                            <div className="flex items-center text-xs text-gray-400 gap-1 mt-1">
                              <FaMapMarkerAlt />
                              <span>
                                {booking.car?.location?.city ||
                                  booking.car?.location ||
                                  'Location not set'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-900">
                            {booking.customerName}
                          </p>
                          <div className="flex items-center text-sm text-gray-500 gap-2">
                            <FaEnvelope className="text-gray-400" />
                            <span>{booking.email}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 gap-2">
                            <FaPhoneAlt className="text-gray-400" />
                            <span>{booking.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-1 text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-gray-400" />
                            <span>{formatDate(booking.pickupDate)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-gray-400" />
                            <span>{formatDate(booking.dropoffDate)}</span>
                          </div>
                          <p className="text-xs text-gray-500">
                            Duration: {duration} day{duration > 1 ? 's' : ''}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
                          {OPTION_LABELS[booking.bookingOption] ||
                            booking.bookingOption}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(
                            booking.pricing?.calculatedTotal ||
                              booking.pricing?.baseRatePerDay ||
                              0
                          )}
                        </p>
                        <p className="text-xs text-gray-400">
                          Base: {formatCurrency(booking.pricing?.baseRatePerDay)}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.chip}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-2">
                          {ACTIONS.map((action) => {
                            const isCurrent = booking.status === action.key;
                            const buttonKey = `${booking._id}-${action.key}`;
                            const Icon = action.icon;

                            return (
                              <button
                                key={action.key}
                                disabled={isCurrent || updatingStatusKey === buttonKey}
                                onClick={() =>
                                  handleStatusUpdate(booking._id, action.key)
                                }
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                                  isCurrent
                                    ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                                    : action.styles
                                }`}
                              >
                                {updatingStatusKey === buttonKey ? (
                                  <FaSpinner className="animate-spin" />
                                ) : (
                                  <Icon className="text-sm" />
                                )}
                                {action.label}
                              </button>
                            );
                          })}
                          <button
                            disabled={deletingId === booking._id}
                            onClick={() => handleDelete(booking._id)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deletingId === booking._id ? (
                              <FaSpinner className="animate-spin text-sm" />
                            ) : (
                              <FaTrash className="text-sm" />
                            )}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


