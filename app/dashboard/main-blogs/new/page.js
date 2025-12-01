import { Suspense } from 'react';
import NewMainBlogPageClient from './NewMainBlogPageClient';

// Force dynamic rendering - prevents static generation
export const dynamic = 'force-dynamic';

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a2b5c]"></div>
    </div>
  );
}

// Server component wrapper - ensures Suspense boundary is recognized
export default function NewMainBlogPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NewMainBlogPageClient />
    </Suspense>
  );
}
