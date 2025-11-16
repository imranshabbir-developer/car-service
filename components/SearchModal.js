"use client";

import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { API_BASE_URL } from "@/config/api";

export default function SearchModal({ open, onClose }) {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState(null);

  // Close on ESC
  useEffect(() => {
    if (!open) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose && onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  // Lock body scroll when modal open
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow || "unset";
    };
  }, [open]);

  // Fetch categories when modal opens (once)
  useEffect(() => {
    if (!open) return;
    if (categories.length > 0) return; // already loaded

    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoriesError(null);

        const res = await fetch(`${API_BASE_URL}/categories`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        if (data.success && data.data && data.data.categories) {
          setCategories(data.data.categories);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error("Error fetching categories in SearchModal:", err);
        setCategoriesError("Failed to load categories");
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [open, categories.length]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // hook your search logic here (router push, API call, etc.)
    onClose && onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose && onClose();
        }
      }}
    >
      {/* Dark Overlay Background */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 sm:top-8 sm:right-8 z-[60] text-white hover:text-gray-300 transition-colors"
        aria-label="Close search"
      >
        <FaTimes className="w-8 h-8 sm:w-10 sm:h-10" />
      </button>

      {/* Search Form */}
      <div
        className="relative bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
          {/* Product Name */}
          <div>
            <label
              htmlFor="productName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Product Name
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              placeholder="Enter product name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Select Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Category
            </label>
            <select
              id="category"
              name="category"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent outline-none transition-all appearance-none bg-white cursor-pointer"
            >
              <option value="">
                {categoriesLoading
                  ? "Loading categories..."
                  : categoriesError
                  ? "Failed to load categories"
                  : "Select a category"}
              </option>

              {!categoriesLoading &&
                !categoriesError &&
                categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Pick-up Date */}
          <div>
            <label
              htmlFor="pickupDate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Pick-up Date
            </label>
            <input
              type="date"
              id="pickupDate"
              name="pickupDate"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Drop-off Date */}
          <div>
            <label
              htmlFor="dropoffDate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Drop-off Date
            </label>
            <input
              type="date"
              id="dropoffDate"
              name="dropoffDate"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2b5c] focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full bg-[#1a2b5c] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#0d1b2a] transition-colors duration-300 mt-2"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
}
