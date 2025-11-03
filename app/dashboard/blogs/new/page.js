'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import nextDynamic from 'next/dynamic';
import {
  FaArrowLeft,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimes,
  FaSave,
} from 'react-icons/fa';
import { API_BASE_URL } from '@/config/api';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = nextDynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

function NewBlogPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [notification, setNotification] = useState(null);
  const [quillMounted, setQuillMounted] = useState(false);

  // Mount Quill after component mounts
  useEffect(() => {
    setQuillMounted(true);
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        const data = await response.json();
        
        if (data.success) {
          setCategories(data.data.categories || []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch blog data if editing
  useEffect(() => {
    if (editId) {
      const fetchBlog = async () => {
        try {
          setFetching(true);
          const response = await fetch(`${API_BASE_URL}/blogs/${editId}`);
          const data = await response.json();
          
          if (data.success && data.data.blog) {
            const blog = data.data.blog;
            setTitle(blog.title || '');
            setCategory(blog.category?._id || blog.category || '');
            setContent(blog.content || '');
            setPublished(blog.published || false);
          } else {
            showNotification('Failed to fetch blog details', 'error');
            router.push('/dashboard/blogs');
          }
        } catch (error) {
          console.error('Error fetching blog:', error);
          showNotification('Error fetching blog details', 'error');
          router.push('/dashboard/blogs');
        } finally {
          setFetching(false);
        }
      };

      fetchBlog();
    }
  }, [editId, router]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      showNotification('Please enter a blog title', 'error');
      return;
    }
    
    if (!category) {
      showNotification('Please select a category', 'error');
      return;
    }
    
    if (!content.trim() || content === '<p><br></p>') {
      showNotification('Please enter blog content', 'error');
      return;
    }

    try {
      setLoading(true);
      
      const submitData = {
        title: title.trim(),
        category,
        content,
        published,
      };

      const url = editId
        ? `${API_BASE_URL}/blogs/${editId}`
        : `${API_BASE_URL}/blogs`;
      
      const method = editId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (data.success) {
        showNotification(
          editId ? 'Blog updated successfully!' : 'Blog created successfully!',
          'success'
        );
        setTimeout(() => {
          router.push('/dashboard/blogs');
        }, 1500);
      } else {
        showNotification(data.message || 'Failed to save blog', 'error');
      }
    } catch (error) {
      showNotification('Error saving blog', 'error');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Quill editor modules configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image', 'video'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background',
    'align'
  ];

  if (fetching) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <FaSpinner className="animate-spin text-[#1a2b5c] text-4xl" />
      </div>
    );
  }

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

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/dashboard/blogs')}
              className="flex items-center space-x-2 text-gray-600 hover:text-[#1a2b5c] transition-colors"
            >
              <FaArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Blogs</span>
            </button>
            <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a2b5c]">
              {editId ? 'Edit Blog' : 'Create New Blog'}
            </h1>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Blog Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title..."
              required
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent transition-all"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent bg-white transition-all appearance-none cursor-pointer"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* React Quill Editor */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Blog Content *
            </label>
            {quillMounted && (
              <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Start writing your blog content..."
                  className="blog-editor"
                  style={{
                    minHeight: '400px',
                    fontFamily: 'Roboto, sans-serif',
                  }}
                />
              </div>
            )}
            {!quillMounted && (
              <div className="w-full h-[400px] border border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                <FaSpinner className="animate-spin text-[#1a2b5c] text-2xl" />
              </div>
            )}
          </div>

          {/* Published Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Published
              </label>
              <p className="text-xs text-gray-500">
                {published ? 'This blog will be visible to all users' : 'This blog will be saved as draft'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPublished(!published)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a2b5c] focus:ring-offset-2 ${
                published ? 'bg-[#1a2b5c]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  published ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.push('/dashboard/blogs')}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center space-x-2 px-6 py-3 text-sm font-medium text-white bg-[#1a2b5c] rounded-lg hover:bg-[#0d1b2a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FaSave />
                  <span>{editId ? 'Update Blog' : 'Create Blog'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx global>{`
        .blog-editor .ql-container {
          min-height: 400px;
          font-family: 'Roboto', sans-serif;
          font-size: 16px;
        }
        
        .blog-editor .ql-editor {
          min-height: 400px;
          padding: 20px;
        }
        
        .blog-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        
        .blog-editor .ql-toolbar {
          border-top: 1px solid #e5e7eb;
          border-left: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
          border-bottom: none;
          background: #f9fafb;
          padding: 12px;
        }
        
        .blog-editor .ql-container {
          border-bottom: 1px solid #e5e7eb;
          border-left: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
          border-top: none;
        }
        
        .blog-editor .ql-toolbar .ql-stroke {
          stroke: #374151;
        }
        
        .blog-editor .ql-toolbar .ql-fill {
          fill: #374151;
        }
        
        .blog-editor .ql-toolbar button:hover,
        .blog-editor .ql-toolbar button:focus,
        .blog-editor .ql-toolbar button.ql-active {
          color: #1a2b5c;
        }
        
        .blog-editor .ql-toolbar button:hover .ql-stroke,
        .blog-editor .ql-toolbar button:focus .ql-stroke,
        .blog-editor .ql-toolbar button.ql-active .ql-stroke {
          stroke: #1a2b5c;
        }
        
        .blog-editor .ql-toolbar button:hover .ql-fill,
        .blog-editor .ql-toolbar button:focus .ql-fill,
        .blog-editor .ql-toolbar button.ql-active .ql-fill {
          fill: #1a2b5c;
        }
        
        @media (max-width: 640px) {
          .blog-editor .ql-toolbar {
            padding: 8px;
          }
          
          .blog-editor .ql-toolbar .ql-formats {
            margin-right: 4px;
          }
        }
      `}</style>
    </div>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <FaSpinner className="animate-spin text-[#1a2b5c] text-4xl" />
    </div>
  );
}

// Main export with Suspense boundary
export default function NewBlogPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NewBlogPageContent />
    </Suspense>
  );
}
