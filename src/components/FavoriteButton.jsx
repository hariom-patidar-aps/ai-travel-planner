import useFavorites from "../hooks/useFavorites";

export default function FavoriteButton({ place }) {
  const {
    toggleFavorite,
    isPlaceFavorite,
  } = useFavorites();

  const favorite = isPlaceFavorite(place.name);

  return (
    <button
      onClick={() => toggleFavorite(place)}
      className={`w-full mt-4 py-2 rounded-xl font-semibold transition ${
        favorite
          ? "bg-red-500 hover:bg-red-600 text-white"
          : "bg-pink-500 hover:bg-pink-600 text-white"
      }`}
    >
      {favorite ? "💔 Remove Favorite" : "❤️ Add to Favorites"}
    </button>
  );
}