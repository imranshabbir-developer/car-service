const BASE_URL = "https://convoytravels.pk";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-cover.jpg`;

const buildRobotsConfig = (robots = { index: true, follow: true }) => {
  const isIndexable = robots.index !== false;
  const isFollowable = robots.follow !== false;

  return {
    index: isIndexable,
    follow: isFollowable,
    googleBot: {
      index: isIndexable,
      follow: isFollowable,
    },
  };
};

const buildAbsoluteUrl = (path = "/") => {
  if (!path) {
    return BASE_URL;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

const buildAbsoluteImage = (image = DEFAULT_OG_IMAGE) => {
  if (!image) {
    return DEFAULT_OG_IMAGE;
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${BASE_URL}${image.startsWith("/") ? image : `/${image}`}`;
};

export function buildPageMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  image = DEFAULT_OG_IMAGE,
  robots,
  type = "website",
}) {
  const absoluteUrl = buildAbsoluteUrl(path);
  const absoluteImage = buildAbsoluteImage(image);
  const robotsConfig = buildRobotsConfig(robots);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: absoluteUrl,
    },
    robots: robotsConfig,
    openGraph: {
      title,
      description,
      url: absoluteUrl,
      siteName: "Convoy Travels Pakistan",
      images: [
        {
          url: absoluteImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_PK",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteImage],
    },
  };
}

export { BASE_URL, DEFAULT_OG_IMAGE };

