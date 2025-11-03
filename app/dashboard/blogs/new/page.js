import { Suspense } from 'react';
import NewBlogPageClient from './NewBlogPageClient';

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a2b5c]"></div>
    </div>
  );
}

// Server component wrapper - ensures Suspense boundary is recognized
export default function NewBlogPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NewBlogPageClient />
    </Suspense>
  );
}
