import { useEffect, useState } from "react";
import { getPlaceGallery } from "../../services/wikimediaService";

export default function ImageGallery({ place }) {
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function loadImages() {
      setLoading(true);

      const imgs = await getPlaceGallery(place);

      setImages(imgs);
      setCurrent(0);

      setLoading(false);
    }

    loadImages();
  }, [place]);

  function nextImage() {
    if (!images.length) return;

    setCurrent((prev) => (prev + 1) % images.length);
  }

  function previousImage() {
    if (!images.length) return;

    setCurrent((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  }

  if (loading) {
    return (
      <div className="h-64 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400">
        Loading images...
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="h-64 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400">
        No images available.
      </div>
    );
  }

  return (
    <>
      <div className="relative">

        <img
          src={images[current]}
          alt={place}
          className="w-full h-64 object-cover rounded-2xl cursor-pointer"
          onClick={() => setShowModal(true)}
        />

        <button
          onClick={previousImage}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full px-3 py-2"
        >
          ◀
        </button>

        <button
          onClick={nextImage}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full px-3 py-2"
        >
          ▶
        </button>

        <div className="flex justify-center gap-2 mt-4">

          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full ${
                current === i
                  ? "bg-cyan-400"
                  : "bg-slate-500"
              }`}
            />
          ))}

        </div>

        <p className="text-center text-xs text-slate-400 mt-3">
          📷 Images from Wikimedia Commons
        </p>

      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8"
          onClick={() => setShowModal(false)}
        >
          <img
            src={images[current]}
            alt={place}
            className="max-h-full max-w-full rounded-2xl"
          />
        </div>
      )}
    </>
  );
}