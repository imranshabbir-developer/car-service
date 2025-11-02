import Link from "next/link";
import { blogs } from "@/data/blogs";
import "./blog-section.css";

export default function BlogSection() {

  return (
    <section className="py-16 px-6 md:px-20 bg-white" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-[#1a2b5c] text-4xl md:text-5xl font-bold mb-12">
          Blog Post
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white text-left border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <img
                src={blog.img}
                alt={blog.title}
                className="w-full h-56 object-cover rounded-t-lg"
              />
              <div className="p-6">
                <h3 className="text-[#1a2b5c] font-semibold text-lg mb-2">
                  {blog.title}
                </h3>
                <p className="text-gray-500 text-sm mb-2">{blog.date}</p>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {blog.desc}
                </p>
                <Link
                  href={`/blog/${blog.slug}`}
                  className="read-more-button inline-block bg-[#1a2b5c] text-white text-sm px-4 py-2 rounded hover:bg-[#132045] transition-colors duration-300 relative"
                >
                  <span className="read-more-button-text">Read More</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <a
          href="#"
          className="inline-block bg-[#1a2b5c] text-white font-medium px-6 py-3 rounded hover:bg-[#132045] transition-colors duration-300"
        >
          View All Blogs
        </a>
      </div>
    </section>
  );
}

