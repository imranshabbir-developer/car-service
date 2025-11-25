// Generate SVG placeholder image (works offline, no external dependency)
export const generatePlaceholderImage = (text = 'Vehicle Image') => {
  const svg = `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="600" fill="#f3f4f6"/><text x="50%" y="50%" font-family="Arial, sans-serif" font-size="20" fill="#6b7280" text-anchor="middle" dominant-baseline="middle">${text}</text></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

