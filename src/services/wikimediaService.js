const BASE =
  "https://commons.wikimedia.org/w/api.php";

// In-memory cache
const imageCache = new Map();

export async function getPlaceGallery(place) {
  // Return cached images if available
  if (imageCache.has(place)) {
    return imageCache.get(place);
  }

  try {
    const searchURL =
      `${BASE}?origin=*` +
      `&action=query` +
      `&generator=search` +
      `&gsrsearch=${encodeURIComponent(place)}` +
      `&gsrnamespace=6` +
      `&gsrlimit=8` +
      `&prop=imageinfo` +
      `&iiprop=url` +
      `&format=json`;

    const response = await fetch(searchURL);
    const data = await response.json();

    if (!data.query?.pages) {
      imageCache.set(place, []);
      return [];
    }

    const images = Object.values(data.query.pages)
      .map((page) => page.imageinfo?.[0]?.url)
      .filter(Boolean);

    imageCache.set(place, images);

    return images;
  } catch (error) {
    console.error("Wikimedia Error:", error);
    return [];
  }
}