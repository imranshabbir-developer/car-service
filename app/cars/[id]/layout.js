import { buildDynamicMetadata, extractSeoData } from "@/utils/dynamicSeo";
import { API_BASE_URL } from "@/config/api";
import { isObjectId, generateSlug } from "@/utils/slug";

// Fetch car data for metadata
async function getCarForMetadata(param) {
  try {
    if (!param) return null;

    // If it's an ObjectId, fetch directly
    if (isObjectId(param)) {
      const response = await fetch(`${API_BASE_URL}/cars/${param}`, {
        next: { revalidate: 300 },
      });
      if (!response.ok) return null;
      const data = await response.json();
      return data?.data?.car || null;
    }

    // If it's a slug, find by slug
    const response = await fetch(`${API_BASE_URL}/cars`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return null;
    const data = await response.json();
    
    if (data.success && data.data?.cars) {
      // First try to find by slug field from backend
      const bySlug = data.data.cars.find(car => car.slug === param);
      if (bySlug) return bySlug;
      
      // Fallback: find by generated slug from name
      const targetSlug = param.toLowerCase();
      return data.data.cars.find(car => {
        const carSlug = car.slug || generateSlug(car?.name || '');
        return carSlug.toLowerCase() === targetSlug;
      }) || null;
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const paramValue = resolvedParams?.id || "";
  
  // Fetch car data from backend
  const car = await getCarForMetadata(paramValue);
  
  if (!car) {
    return {
      title: 'Vehicle Not Found | Convoy Travels',
      description: 'The vehicle you are looking for could not be found.',
    };
  }

  // Extract SEO data from backend
  const seoData = extractSeoData(car);
  
  // Use backend slug for canonical, fallback to generated slug
  const canonicalSlug = car.slug || generateSlug(car.name);
  const canonicalPath = `/cars/${canonicalSlug}`;
  
  return buildDynamicMetadata({
    ...seoData,
    fallbackTitle: `${car.name || 'Vehicle'} Rent in Lahore | Convoy Travels`,
    fallbackDescription: `Book ${car.name || 'this vehicle'} in Lahore with Convoy Travels. ${car.rentPerDay ? `Starting at Rs ${car.rentPerDay} per day.` : 'Affordable car rental service.'} Chauffeur and self-drive options available.`,
    fallbackPath: canonicalPath,
    keywords: [
      `rent ${car.name || 'car'} Lahore`,
      `${car.brand || ''} ${car.model || ''} rental`.trim(),
      'convoy travels',
      'car rental Lahore',
    ].filter(Boolean),
  });
}

export default function CarDetailLayout({ children }) {
  return <>{children}</>;
}

