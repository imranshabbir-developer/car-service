'use client';

import { useEffect, useState } from 'react';
import {
  FaSpinner,
  FaSearch,
  FaEnvelope,
  FaPhoneAlt,
  FaUser,
  FaCar,
  FaCheckCircle,
  FaTimesCircle,
  FaComment,
  FaReply,
  FaTimes,
} from 'react-icons/fa';
import { API_BASE_URL, API_IMAGE_BASE_URL } from '@/config/api';

const PLACEHOLDER_IMAGE =
  'https://via.placeholder.com/200x140?text=Vehicle+Image';

const STATUS_META = {
  pending: {
    label: 'Pending',
    chip: 'bg-amber-100 text-amber-700 border border-amber-200',
  },
  answered: {
    label: 'Answered',
    chip: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  },
  closed: {
    label: 'Closed',
    chip: 'bg-gray-100 text-gray-700 border border-gray-200',
  },
};

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [notification, setNotification] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : '';

      const response = await fetch(`${API_BASE_URL}/questions`, {
        headers: {
          Authorization: `Bearer ${token || ''}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to load questions.');
      }

      const normalised = data.data.questions.map((question) => ({
        ...question,
        car: question.car || null,
        carImage: question.car?.carPhoto
          ? `${API_IMAGE_BASE_URL}${question.car.carPhoto}`
          : PLACEHOLDER_IMAGE,
      }));

      setQuestions(normalised);
      setFilteredQuestions(normalised);
    } catch (error) {
      console.error('Error fetching questions:', error);
      showNotification(
        error.message || 'Unable to load questions. Please try again later.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    let results = [...questions];

    // Filter by search term
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      results = results.filter(
        (q) =>
          q.customerName?.toLowerCase().includes(search) ||
          q.email?.toLowerCase().includes(search) ||
          q.subject?.toLowerCase().includes(search) ||
          q.message?.toLowerCase().includes(search) ||
          q.car?.name?.toLowerCase().includes(search)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      results = results.filter((q) => q.status === statusFilter);
    }

    setFilteredQuestions(results);
  }, [searchTerm, statusFilter, questions]);

  const handleAnswerSubmit = async (questionId) => {
    if (!answerText.trim()) {
      showNotification('Please enter an answer.', 'error');
      return;
    }

    try {
      setIsSubmittingAnswer(true);
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : '';

      const response = await fetch(`${API_BASE_URL}/questions/${questionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || ''}`,
        },
        body: JSON.stringify({
          status: 'answered',
          answer: answerText.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit answer.');
      }

      showNotification('Answer submitted successfully.', 'success');
      setSelectedQuestion(null);
      setAnswerText('');
      fetchQuestions();
    } catch (error) {
      console.error('Error submitting answer:', error);
      showNotification(
        error.message || 'Unable to submit answer. Please try again.',
        'error'
      );
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const handleStatusUpdate = async (questionId, newStatus) => {
    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : '';

      const response = await fetch(`${API_BASE_URL}/questions/${questionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || ''}`,
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to update status.');
      }

      showNotification('Status updated successfully.', 'success');
      fetchQuestions();
    } catch (error) {
      console.error('Error updating status:', error);
      showNotification(
        error.message || 'Unable to update status. Please try again.',
        'error'
      );
    }
  };

  const handleDelete = async (questionId) => {
    if (!confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : '';

      const response = await fetch(`${API_BASE_URL}/questions/${questionId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token || ''}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete question.');
      }

      showNotification('Question deleted successfully.', 'success');
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      showNotification(
        error.message || 'Unable to delete question. Please try again.',
        'error'
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <FaSpinner className="w-8 h-8 text-[#1a2b5c] animate-spin" />
          <p className="text-[#1a2b5c] font-medium">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Customer Questions
          </h1>
          <p className="text-gray-600">
            Manage and respond to customer questions
          </p>
        </div>

        {/* Notification */}
        {notification && (
          <div
            className={`mb-6 rounded-lg border px-4 py-3 ${
              notification.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            {notification.message}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent outline-none"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="answered">Answered</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredQuestions.length === 0 ? (
            <div className="p-12 text-center">
              <FaComment className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No questions found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredQuestions.map((question) => (
                <div
                  key={question._id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Left Side - Question Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {question.subject}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_META[question.status]?.chip || STATUS_META.pending.chip}`}
                            >
                              {STATUS_META[question.status]?.label || 'Pending'}
                            </span>
                          </div>
                          {question.car && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                              <FaCar className="w-4 h-4" />
                              <span className="font-medium">
                                {question.car.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                        {question.message}
                      </p>

                      {question.answer && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <FaReply className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold text-blue-900">
                              Answer:
                            </span>
                          </div>
                          <p className="text-blue-800 whitespace-pre-wrap">
                            {question.answer}
                          </p>
                          {question.answeredAt && (
                            <p className="text-xs text-blue-600 mt-2">
                              Answered on {formatDate(question.answeredAt)}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Customer Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaUser className="w-4 h-4" />
                          <span>{question.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaEnvelope className="w-4 h-4" />
                          <span>{question.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaPhoneAlt className="w-4 h-4" />
                          <span>{question.phone}</span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 mt-3">
                        Asked on {formatDate(question.createdAt)}
                      </p>
                    </div>

                    {/* Right Side - Actions */}
                    <div className="flex flex-col gap-2 lg:min-w-[200px]">
                      {question.status === 'pending' && (
                        <button
                          onClick={() => setSelectedQuestion(question)}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                        >
                          <FaReply className="w-4 h-4" />
                          Answer
                        </button>
                      )}
                      <button
                        onClick={() =>
                          handleStatusUpdate(
                            question._id,
                            question.status === 'closed' ? 'pending' : 'closed'
                          )
                        }
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
                      >
                        {question.status === 'closed' ? (
                          <>
                            <FaCheckCircle className="w-4 h-4" />
                            Reopen
                          </>
                        ) : (
                          <>
                            <FaTimesCircle className="w-4 h-4" />
                            Close
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(question._id)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                      >
                        <FaTimesCircle className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Answer Modal */}
      {selectedQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Answer Question
                </h2>
                <button
                  onClick={() => {
                    setSelectedQuestion(null);
                    setAnswerText('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Question:</p>
                <p className="text-gray-900 font-medium mb-2">
                  {selectedQuestion.subject}
                </p>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedQuestion.message}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Answer:
                </label>
                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent outline-none resize-none"
                  placeholder="Type your answer here..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleAnswerSubmit(selectedQuestion._id)}
                  disabled={isSubmittingAnswer || !answerText.trim()}
                  className={`flex-1 px-4 py-2 bg-[#1a2b5c] text-white rounded-lg hover:bg-[#0d1b2a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    isSubmittingAnswer ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmittingAnswer ? 'Submitting...' : 'Submit Answer'}
                </button>
                <button
                  onClick={() => {
                    setSelectedQuestion(null);
                    setAnswerText('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

