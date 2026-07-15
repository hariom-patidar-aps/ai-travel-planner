import { useEffect, useState } from "react";
import useAuth from "./useAuth";

import {
  addFavorite,
  getFavorites,
  removeFavorite,
  isFavorite,
} from "../services/favoritesService";

export default function useFavorites() {
  const { user } = useAuth();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  // ===================================
  // Load Favorites
  // ===================================
  useEffect(() => {
    async function loadFavorites() {
      if (!user) {
        setFavorites([]);
        return;
      }

      setLoading(true);

      try {
        const data = await getFavorites(user.uid);
        setFavorites(data);
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    }

    loadFavorites();
  }, [user]);

  // ===================================
  // Add / Remove Favorite
  // ===================================
  const toggleFavorite = async (place) => {
    if (!user) {
      alert("Please login first.");
      return;
    }

    try {
      const existingId = await isFavorite(
        user.uid,
        place.name
      );

      if (existingId) {
        await removeFavorite(user.uid, existingId);

        setFavorites((prev) =>
          prev.filter((item) => item.id !== existingId)
        );
      } else {
        const id = await addFavorite(user.uid, place);

        setFavorites((prev) => [
          ...prev,
          {
            id,
            ...place,
          },
        ]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ===================================
  // Check Favorite
  // ===================================
  const isPlaceFavorite = (placeName) => {
    return favorites.some(
      (item) => item.name === placeName
    );
  };

  return {
    favorites,
    loading,
    toggleFavorite,
    isPlaceFavorite,
  };
}