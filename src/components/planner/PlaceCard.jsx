import FavoriteButton from "../FavoriteButton";
import ImageGallery from "../gallery/ImageGallery";

export default function PlaceCard({ place }) {
  return (
    <div className="glass rounded-3xl overflow-hidden hover:scale-105 transition duration-300">

      {/* Wikimedia Gallery */}
      <ImageGallery place={place.name} />

      <div className="p-6">

        <h2 className="text-2xl font-bold text-white">
          {place.name}
        </h2>

        <span className="inline-block mt-3 px-4 py-1 rounded-full bg-cyan-500 text-white">
          {place.type}
        </span>

        <p className="text-slate-300 mt-5 leading-7">
          {place.description}
        </p>

        <div className="mt-6 space-y-3">

          <button
            className="primary-btn w-full"
            onClick={() =>
              window.open(
                `https://www.google.com/maps/search/${encodeURIComponent(
                  place.name
                )}`,
                "_blank"
              )
            }
          >
            📍 View on Google Maps
          </button>

          <FavoriteButton place={place} />

        </div>

      </div>

    </div>
  );
}