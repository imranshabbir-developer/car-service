import { notFound } from "next/navigation";
import { API_BASE_URL, API_IMAGE_BASE_URL } from "@/config/api";
import BlogDetailClient from "./BlogDetailClient";

// Force dynamic rendering for API fetch
export const dynamic = 'force-dynamic';
export const revalidate = 60;

// Fetch blog data on server for SEO
async function getBlogBySlug(slug) {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs/slug/${slug}`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success && data.data && data.data.blog) {
      return data.data.blog;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const blog = await getBlogBySlug(params.slug);

  if (!blog) {
    return {
      title: "Blog Post Not Found - Convoy Travels",
      description: "The blog post you are looking for could not be found.",
    };
  }

  const metaTitle = blog.metaTitle || blog.title;
  const metaDescription = blog.metaDescription || blog.description || 
    blog.content?.replace(/<[^>]*>/g, '').substring(0, 160) || 
    `${blog.title} - Read more about ${blog.category?.name || 'travel'} on Convoy Travels blog.`;
  
  const imageUrl = blog.featuredImage 
    ? `${API_IMAGE_BASE_URL}${blog.featuredImage}`
    : `${API_IMAGE_BASE_URL}/images/default-blog.jpg`;
  
  const publishedTime = blog.createdAt || new Date().toISOString();
  const modifiedTime = blog.updatedAt || publishedTime;
  const url = `https://convoytravels.pk/blog/${blog.slug}`;

  return {
    title: `${metaTitle} - Convoy Travels Blog`,
    description: metaDescription,
    keywords: blog.category?.name ? `${blog.category.name}, ${metaTitle}, travel blog, car rental, convoy travels` : undefined,
    authors: blog.createdBy?.name ? [{ name: blog.createdBy.name }] : undefined,
    
    // Open Graph
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: url,
      siteName: 'Convoy Travels',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedTime,
      modifiedTime: modifiedTime,
      authors: blog.createdBy?.name ? [blog.createdBy.name] : undefined,
      section: blog.category?.name,
      tags: blog.category?.name ? [blog.category.name] : undefined,
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [imageUrl],
      creator: blog.createdBy?.name ? `@${blog.createdBy.name.replace(/\s+/g, '')}` : undefined,
    },
    
    // Additional SEO
    alternates: {
      canonical: url,
    },
    
    // Article specific
    other: {
      'article:published_time': publishedTime,
      'article:modified_time': modifiedTime,
      'article:author': blog.createdBy?.name || 'Convoy Travels',
      'article:section': blog.category?.name || 'Travel',
      'article:tag': blog.category?.name || 'Travel',
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const blog = await getBlogBySlug(params.slug);

  if (!blog) {
    notFound();
  }

  // Generate structured data for SEO (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.description || blog.content?.replace(/<[^>]*>/g, '').substring(0, 200),
    "image": blog.featuredImage ? `${API_IMAGE_BASE_URL}${blog.featuredImage}` : undefined,
    "datePublished": blog.createdAt,
    "dateModified": blog.updatedAt || blog.createdAt,
    "author": {
      "@type": "Person",
      "name": blog.createdBy?.name || "Convoy Travels",
      "email": blog.createdBy?.email || undefined,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Convoy Travels",
      "logo": {
        "@type": "ImageObject",
        "url": "https://convoytravels.pk/wp-content/uploads/2021/07/CONVAY-TRAVELS.png",
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://convoytravels.pk/blog/${blog.slug}`,
    },
    "articleSection": blog.category?.name || "Travel",
    "keywords": blog.category?.name || "Travel, Car Rental",
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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
                "item": "https://convoytravels.pk/blog",
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": blog.title,
                "item": `https://convoytravels.pk/blog/${blog.slug}`,
              },
            ],
          }),
        }}
      />

      <BlogDetailClient blog={blog} />
    </>
  );
}
