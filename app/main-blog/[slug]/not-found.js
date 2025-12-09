import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#1a2b5c] mb-4">Blog Post Not Found</h1>
        <p className="text-gray-600 mb-6">The blog post you are looking for does not exist.</p>
        <Link
          href="/blogs"
          className="inline-block btn-gradient-primary text-white px-6 py-3 rounded-lg font-semibold relative z-10"
        >
          View All Blogs
        </Link>
      </div>
    </main>
  );
}

