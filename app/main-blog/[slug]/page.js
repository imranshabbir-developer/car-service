import { API_BASE_URL, API_IMAGE_BASE_URL } from '@/config/api';
import { isObjectId } from '@/utils/slug';
import { notFound } from 'next/navigation';
import MainBlogClient from './MainBlogClient';

// Fetch main blog data
async function getMainBlog(param) {
  try {
    if (!param) return null;

    let url;
    if (isObjectId(param)) {
      url = `${API_BASE_URL}/main-blogs/${param}`;
    } else {
      url = `${API_BASE_URL}/main-blogs/slug/${param}`;
    }

    const response = await fetch(url, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok || response.status === 404) {
      return null;
    }

    const data = await response.json();
    const blog = data?.data?.blog;

    // Only return published blogs
    if (!blog || blog.isPublished !== true) {
      return null;
    }

    // Ensure blog has at least a title (required for valid page)
    if (!blog.blogTitle || blog.blogTitle.trim().length === 0) {
      return null;
    }

    return blog;
  } catch (error) {
    return null;
  }
}

export default async function MainBlogDetailPage({ params }) {
  const resolvedParams = await params;
  const paramValue = resolvedParams?.slug || "";

  // Fetch blog data server-side
  const blog = await getMainBlog(paramValue);

  // If blog doesn't exist or isn't published, return 404
  if (!blog) {
    notFound();
  }

  // Build image URL
  let imageUrl = "";
  if (blog.image) {
    const imagePath = blog.image.startsWith('/') ? blog.image : `/${blog.image}`;
    const baseUrl = API_IMAGE_BASE_URL.endsWith('/') 
      ? API_IMAGE_BASE_URL.slice(0, -1) 
      : API_IMAGE_BASE_URL;
    imageUrl = `${baseUrl}${imagePath}`;
  }

  // Extract plain text from HTML for description
  const plainTextDescription = blog.description 
    ? blog.description.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
    : '';

  // Build structured data for SEO (JSON-LD)
  const canonicalSlug = blog.slug || paramValue;
  const canonicalUrl = `https://convoytravels.pk/main-blog/${canonicalSlug}`;
  const publishedTime = blog.createdAt || new Date().toISOString();
  const modifiedTime = blog.updatedAt || blog.createdAt || publishedTime;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.blogTitle,
    "description": plainTextDescription.substring(0, 200) || "Read our latest blog post from Convoy Travels.",
    "image": imageUrl || undefined,
    "datePublished": publishedTime,
    "dateModified": modifiedTime,
    "author": {
      "@type": "Organization",
      "name": "Convoy Travels",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Convoy Travels",
      "logo": {
        "@type": "ImageObject",
        "url": "https://convoytravels.pk/logo.webp",
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    "articleSection": "Travel & Car Rental",
    "keywords": blog.blogTitle || "Travel, Car Rental, Lahore",
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://convoytravels.pk",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://convoytravels.pk/main-blogs",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": blog.blogTitle,
        "item": canonicalUrl,
      },
    ],
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />

      <MainBlogClient blog={blog} />
    </>
  );
}

