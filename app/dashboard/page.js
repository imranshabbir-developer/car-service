'use client';

import { useState } from 'react';
import {
  FaDollarSign,
  FaCheckSquare,
  FaCar,
  FaCarSide,
  FaChevronUp,
  FaChevronDown,
  FaExclamationCircle,
  FaPlus,
  FaSearch,
  FaFilter,
  FaSort,
} from 'react-icons/fa';

export default function DashboardPage() {
  const [earningsPeriod, setEarningsPeriod] = useState('Last 8 Month');
  const [rentPeriod, setRentPeriod] = useState('This Week');
  const [bookingsPeriod, setBookingsPeriod] = useState('This Year');

  const metrics = [
    {
      icon: FaDollarSign,
      label: 'Total Revenue',
      value: '$8,450',
      change: '+2.86%',
      isPositive: true,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: FaCheckSquare,
      label: 'New Bookings',
      value: '386',
      change: '+1.73%',
      isPositive: true,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      icon: FaCar,
      label: 'Rented Cars',
      value: '214 Unit',
      change: '-2.86%',
      isPositive: false,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
    {
      icon: FaCarSide,
      label: 'Available Cars',
      value: '89 Unit',
      change: '+3.45%',
      isPositive: true,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
  ];

  const reminders = [
    { text: 'Inspect and service the fleet vehicles.', date: '2028-08-10' },
    { text: 'Update the car rental pricing plans for the upcoming season.', date: '2028-08-12' },
    { text: 'Review customer feedback and implement improvements.', date: '2028-08-15' },
  ];

  const carTypes = [
    { name: 'Sedan', percentage: 30, color: 'bg-blue-500' },
    { name: 'SUV', percentage: 25, color: 'bg-red-500', isActive: true },
    { name: 'Hatchback', percentage: 20, color: 'bg-blue-500' },
    { name: 'Convertible', percentage: 10, color: 'bg-blue-500' },
    { name: 'Truck', percentage: 10, color: 'bg-blue-500' },
    { name: 'Minivan', percentage: 5, color: 'bg-blue-500' },
  ];

  const bookings = [
    {
      id: 'BK-WZ1001',
      date: 'Aug 1, 2028',
      client: 'Alice Johnson',
      car: 'Toyota Corolla (TX1234)',
      plan: '2 Days',
      startDate: 'Aug 1, 2028',
      endDate: 'Aug 2, 2028',
      payment: '$50 Paid',
      status: 'Returned',
      statusColor: 'bg-green-100 text-green-800',
    },
    {
      id: 'BK-WZ1002',
      date: 'Aug 1, 2028',
      client: 'Bob Smith',
      car: 'Honda Civic (HX5678)',
      plan: '7 Days',
      startDate: 'Aug 1, 2028',
      endDate: 'Aug 8, 2028',
      payment: '$350',
      status: 'Ongoing',
      statusColor: 'bg-blue-100 text-blue-800',
    },
  ];

  const recentActivities = [
    { text: 'Alice Johnson completed a booking for Toyota Corolla (TX1234)', time: '10:15 AM' },
    { text: "Bob Smith's booking for Honda Civic (HX5678) is pending payment.", time: '09:30 AM' },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`${metric.bgColor} p-3 rounded-lg`}>
                <metric.icon className={`w-5 h-5 ${metric.iconColor}`} />
              </div>
              <div className={`flex items-center text-xs font-semibold ${
                metric.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.isPositive ? <FaChevronUp className="w-3 h-3 mr-1" /> : <FaChevronDown className="w-3 h-3 mr-1" />}
                {metric.change}
              </div>
            </div>
            <h3 className="text-xs sm:text-sm text-gray-600 mb-1">{metric.label}</h3>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{metric.value}</p>
            <p className="text-xs text-gray-500 mt-1">vs last week</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Earnings Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Earnings Summary</h2>
            <select
              value={earningsPeriod}
              onChange={(e) => setEarningsPeriod(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
            >
              <option>Last 8 Month</option>
              <option>Last 6 Month</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-sm">Chart placeholder - Earnings over time</p>
          </div>
        </div>

        {/* Rent Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Rent Status</h2>
            <select
              value={rentPeriod}
              onChange={(e) => setRentPeriod(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
            >
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span className="text-sm text-gray-700">Hired</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-900">58%</span>
                <FaChevronUp className="w-3 h-3 text-green-600" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Pending</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-900">24%</span>
                <FaChevronDown className="w-3 h-3 text-red-600" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-700">Cancelled</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-900">18%</span>
                <FaChevronUp className="w-3 h-3 text-green-600" />
              </div>
            </div>
            <div className="h-32 flex items-center justify-center bg-gray-50 rounded-lg mt-4">
              <p className="text-gray-500 text-sm">Donut chart placeholder</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Overview & Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Bookings Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Bookings Overview</h2>
            <select
              value={bookingsPeriod}
              onChange={(e) => setBookingsPeriod(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
            >
              <option>This Year</option>
              <option>Last Year</option>
              <option>Last 2 Years</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-sm">Bar chart placeholder - Bookings per month</p>
          </div>
        </div>

        {/* Reminders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Reminders</h2>
            <button className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
              <FaPlus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {reminders.map((reminder, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FaExclamationCircle className="w-3 h-3" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{reminder.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{reminder.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Car Availability & Car Types */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Car Availability */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Car Availability</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs sm:text-sm text-gray-700 mb-1.5">Car Type</label>
              <select className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]">
                <option>Select Car Type</option>
                <option>Sedan</option>
                <option>SUV</option>
                <option>Hatchback</option>
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm text-gray-700 mb-1.5">Date</label>
              <input
                type="date"
                defaultValue="2028-08-17"
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm text-gray-700 mb-1.5">Time</label>
              <input
                type="time"
                defaultValue="10:00"
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a2b5c]"
              />
            </div>
            <button className="w-full bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm">
              Check
            </button>
          </div>
        </div>

        {/* Car Types */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Car Types</h2>
          <div className="space-y-4">
            {carTypes.map((car, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${car.isActive ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <FaCar className="w-6 h-6 text-gray-500" />
                    </div>
                    <span className="font-medium text-gray-900">{car.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{car.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${car.color} h-2 rounded-full transition-all`}
                    style={{ width: `${car.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Car Bookings Table & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Car Bookings */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 space-y-3 sm:space-y-0">
            <h2 className="text-lg font-bold text-gray-900">Car Bookings</h2>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search client name, car, etc"
                  className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c] w-full sm:w-64"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                <FaFilter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Booking ID</span>
                      <FaSort className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Booking Date</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Client Name</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Car Model</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Plan</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Payment</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 text-gray-900 font-medium">{booking.id}</td>
                    <td className="py-3 px-2 text-gray-600">{booking.date}</td>
                    <td className="py-3 px-2 text-gray-900">{booking.client}</td>
                    <td className="py-3 px-2 text-gray-600">{booking.car}</td>
                    <td className="py-3 px-2 text-gray-600">{booking.plan}</td>
                    <td className="py-3 px-2 text-gray-600">
                      <div className="text-xs">
                        <div>Start: {booking.startDate}</div>
                        <div>End: {booking.endDate}</div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-gray-600">{booking.payment}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${booking.statusColor}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="bg-green-100 text-green-600 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FaCheckSquare className="w-3 h-3" />
                </div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-gray-700">{activity.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

