import useFavorites from "../hooks/useFavorites";

export default function Favorites() {
  const {
    favorites,
    loading,
    toggleFavorite,
  } = useFavorites();

  if (loading) {
    return (
      <div className="glass rounded-3xl p-8 mt-8">
        <h2 className="text-3xl font-bold text-white">
          ❤️ My Favorite Places
        </h2>

        <p className="text-slate-300 mt-4">
          Loading favorites...
        </p>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-8 mt-8">

      <h2 className="text-3xl font-bold text-white mb-8">
        ❤️ My Favorite Places
      </h2>

      {favorites.length === 0 ? (
        <div className="text-center py-12">

          <div className="text-6xl">
            💔
          </div>

          <p className="text-slate-300 mt-4">
            No favorite places yet.
          </p>

        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {favorites.map((place) => (

            <div
              key={place.id}
              className="glass rounded-2xl p-6"
            >

              <h3 className="text-xl font-bold text-white">
                {place.name}
              </h3>

              <span className="inline-block mt-2 bg-cyan-500 px-3 py-1 rounded-full text-white">
                {place.type}
              </span>

              <p className="text-slate-300 mt-4">
                {place.description}
              </p>

              <div className="space-y-3 mt-6">

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
                  📍 Open in Google Maps
                </button>

                <button
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold"
                  onClick={() =>
                    toggleFavorite(place)
                  }
                >
                  🗑 Remove Favorite
                </button>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}