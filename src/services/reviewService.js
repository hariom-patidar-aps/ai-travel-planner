import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { db } from "../firebase";

/*
====================================
Save Review
====================================
*/
export async function saveReview(
  destination,
  user,
  rating,
  review
) {
  try {
    await addDoc(collection(db, "reviews"), {
      destination,
      rating,
      review,
      userId: user.uid,
      userName: user.displayName || "Anonymous",
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Save Review Error:", error);
    throw error;
  }
}

/*
====================================
Load Reviews
====================================
*/
export async function getReviews(destination) {
  try {
    const q = query(
      collection(db, "reviews"),
      where("destination", "==", destination),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

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
====================================
Average Rating
====================================
*/
export function calculateAverage(reviews) {
  if (!reviews.length) return 0;

  const total = reviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );

  return (total / reviews.length).toFixed(1);
}