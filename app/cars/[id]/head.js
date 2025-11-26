import { API_BASE_URL } from '@/config/api';
import { BASE_URL, DEFAULT_OG_IMAGE } from '@/utils/seo';
import { generateSlug, isObjectId } from '@/utils/slug';

const DEFAULT_META = {
  title: 'Vehicle Rental Details | Convoy Travels Lahore',
  description:
    'Explore premium chauffeur and self-drive vehicle rentals in Lahore with Convoy Travels. Transparent pricing, vetted chauffeurs, and 24/7 trip support.',
};

const fetchJson = async (url) => {
  try {
    const response = await fetch(url, {
      next: { revalidate: 300 },
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch car metadata:', error);
    return null;
  }
};

const findCarFromParam = async (param) => {
  if (!param) {
    return null;
  }

  if (isObjectId(param)) {
    const data = await fetchJson(`${API_BASE_URL}/cars/${param}`);
    return data?.data?.car || null;
  }

  const carsResponse = await fetchJson(`${API_BASE_URL}/cars`);
  const cars = carsResponse?.data?.cars || [];
  const targetSlug = param.toLowerCase();

  return (
    cars.find((car) => generateSlug(car?.name || '').toLowerCase() === targetSlug) ||
    null
  );
};

const buildCanonicalPath = (car, param) => {
  if (car?.name) {
    const slug = generateSlug(car.name);
    if (slug) {
      return `/cars/${slug}`;
    }
  }

  return `/cars/${param}`;
};

const buildCarMeta = (car, param) => {
  const canonical = `${BASE_URL}${buildCanonicalPath(car, param)}`;

  if (!car) {
    return {
      title: DEFAULT_META.title,
      description: DEFAULT_META.description,
      canonical,
      image: DEFAULT_OG_IMAGE,
    };
  }

  const carName = car.name || 'Vehicle';

  return {
    title: `${carName} Rent in Lahore | Convoy Travels`,
    description: `Book ${carName} in Lahore with Convoy Travels and enjoy chauffeur or self-drive flexibility, transparent rates, and 24/7 assistance.`,
    canonical,
    image: DEFAULT_OG_IMAGE,
  };
};

export default async function Head({ params }) {
  const paramValue = params?.id;
  const car = await findCarFromParam(paramValue);
  const meta = buildCarMeta(car, paramValue);

  return (
    <>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={meta.canonical} />

      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={meta.canonical} />
      <meta property="og:type" content="article" />
      <meta property="og:image" content={meta.image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.image} />
    </>
  );
}

