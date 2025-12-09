import { buildDynamicMetadata, extractSeoData } from "@/utils/dynamicSeo";
import { API_BASE_URL } from "@/config/api";
import { isObjectId } from "@/utils/slug";
import { notFound } from "next/navigation";

// Fetch main blog data for metadata
async function getMainBlogForMetadata(param) {
  try {
    if (!param) return null;

    // If it's an ObjectId, fetch directly
    if (isObjectId(param)) {
      const response = await fetch(`${API_BASE_URL}/main-blogs/${param}`, {
        next: { revalidate: 300 },
      });
      if (!response.ok || response.status === 404) return null;
      const data = await response.json();
      return data?.data?.blog || null;
    }

    // If it's a slug, fetch by slug
    const response = await fetch(`${API_BASE_URL}/main-blogs/slug/${param}`, {
      next: { revalidate: 300 },
    });
    if (!response.ok || response.status === 404) return null;
    const data = await response.json();
    return data?.data?.blog || null;
  } catch (error) {
    console.error('Error fetching main blog for metadata:', error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const paramValue = resolvedParams?.slug || "";
  
  // Fetch blog data from backend
  const blog = await getMainBlogForMetadata(paramValue);
  
  if (!blog) {
    // Return proper 404 metadata
    return {
      title: 'Blog Post Not Found | Convoy Travels',
      description: 'The blog post you are looking for could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // Extract SEO data from backend
  const seoData = extractSeoData(blog);
  
  // Use backend slug for canonical, fallback to param
  const canonicalSlug = blog.slug || paramValue;
  const canonicalPath = `/main-blog/${canonicalSlug}`;
  
  return buildDynamicMetadata({
    ...seoData,
    fallbackTitle: `${blog.blogTitle || 'Blog Post'} | Convoy Travels Blog`,
    fallbackDescription: blog.description || "Read curated travel inspiration, rental advice, and Convoy Travels service updates to plan reliable journeys across Pakistan.",
    fallbackPath: canonicalPath,
    keywords: [
      blog.blogTitle || 'blog',
      "convoy travels blog",
      "travel tips pakistan",
      "rent a car stories",
    ],
    type: "article",
  });
}

export default async function MainBlogDetailLayout({ children, params }) {
  const resolvedParams = await params;
  const paramValue = resolvedParams?.slug || "";
  
  // Check if blog exists - if not, trigger proper 404
  const blog = await getMainBlogForMetadata(paramValue);
  
  if (!blog) {
    notFound();
  }
  
  return <>{children}</>;
}

