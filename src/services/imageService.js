export async function getPlaceImage(placeName) {
  try {
    // Search Wikimedia Commons
    const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
      placeName
    )}&gsrnamespace=6&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json&origin=*`;

    const response = await fetch(searchUrl);
    const data = await response.json();

    if (!data.query?.pages) return null;

    const page = Object.values(data.query.pages)[0];

    return page.imageinfo?.[0]?.thumburl || null;
  } catch (err) {
    console.error("Image Error:", err);
    return null;
  }
}