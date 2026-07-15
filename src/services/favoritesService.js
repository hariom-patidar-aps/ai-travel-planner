import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase";

/*
==================================
Save Favorite
==================================
*/
export async function addFavorite(userId, place) {
  try {
    const docRef = await addDoc(
      collection(db, "users", userId, "favorites"),
      {
        ...place,
        createdAt: Date.now(),
      }
    );

    return docRef.id;
  } catch (error) {
    console.error("Add Favorite Error:", error);
    throw error;
  }
}

/*
==================================
Load Favorites
==================================
*/
export async function getFavorites(userId) {
  try {
    const snapshot = await getDocs(
      collection(db, "users", userId, "favorites")
    );

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
}

/*
==================================
Delete Favorite
==================================
*/
export async function removeFavorite(
  userId,
  favoriteId
) {
  try {
    await deleteDoc(
      doc(
        db,
        "users",
        userId,
        "favorites",
        favoriteId
      )
    );
  } catch (error) {
    console.error(error);
  }
}

/*
==================================
Check Favorite
==================================
*/
export async function isFavorite(
  userId,
  placeName
) {
  try {
    const q = query(
      collection(db, "users", userId, "favorites"),
      where("name", "==", placeName)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    return snapshot.docs[0].id;
  } catch (error) {
    console.error(error);
    return null;
  }
}