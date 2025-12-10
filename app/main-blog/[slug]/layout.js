import { buildDynamicMetadata, extractSeoData } from "@/utils/dynamicSeo";
import { API_BASE_URL } from "@/config/api";
import { isObjectId } from "@/utils/slug";
import { notFound } from "next/navigation";

// Fetch main blog data for metadata
async function getMainBlogForMetadata(param) {
  try {
    if (!param) return null;

    let url;
    if (isObjectId(param)) {
      url = `${API_BASE_URL}/main-blogs/${param}`;
    } else {
      url = `${API_BASE_URL}/main-blogs/slug/${param}`;
    }

    const response = await fetch(url, {
      next: { revalidate: 300 },
    });
    
    if (!response.ok || response.status === 404) return null;
    
    const data = await response.json();
    const blog = data?.data?.blog;

    // Only return published blogs
    if (!blog || blog.isPublished !== true) {
      return null;
    }

    return blog;
  } catch (error) {
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
  const canonicalUrl = `https://convoytravels.pk${canonicalPath}`;
  
  // Extract plain text from HTML for description
  const plainTextDescription = blog.description 
    ? blog.description.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim().substring(0, 160)
    : "Read curated travel inspiration, rental advice, and Convoy Travels service updates to plan reliable journeys across Pakistan.";
  
  // Build image URL
  let imageUrl = "";
  if (blog.image) {
    const imagePath = blog.image.startsWith('/') ? blog.image : `/${blog.image}`;
    imageUrl = `https://api.convoytravels.pk${imagePath}`;
  }
  
  const publishedTime = blog.createdAt || new Date().toISOString();
  const modifiedTime = blog.updatedAt || blog.createdAt || publishedTime;
  
  const metaTitle = seoData.seoTitle || `${blog.blogTitle || 'Blog Post'} | Convoy Travels Blog`;
  const metaDescription = seoData.seoDescription || plainTextDescription;
  
  return {
    title: metaTitle,
    description: metaDescription,
    keywords: [
      blog.blogTitle || 'blog',
      "convoy travels blog",
      "travel tips pakistan",
      "rent a car stories",
    ],
    alternates: {
      canonical: seoData.canonicalUrl || canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      siteName: "Convoy Travels",
      images: imageUrl ? [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: blog.blogTitle || 'Blog image',
        },
      ] : [],
      locale: "en_US",
      type: "article",
      publishedTime: publishedTime,
      modifiedTime: modifiedTime,
      authors: ["Convoy Travels"],
      section: "Travel & Car Rental",
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: imageUrl ? [imageUrl] : [],
    },
    other: {
      'article:published_time': publishedTime,
      'article:modified_time': modifiedTime,
      'article:author': 'Convoy Travels',
      'article:section': 'Travel & Car Rental',
    },
  };
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

