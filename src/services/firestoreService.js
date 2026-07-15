import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

/*
==================================
Save Trip
==================================
*/
export async function saveTripToFirestore(userId, trip) {
  try {
    const docRef = await addDoc(
      collection(db, "users", userId, "trips"),
      {
        ...trip,
        createdAt: serverTimestamp(),
      }
    );

    return docRef.id;
  } catch (error) {
    console.error("Save Trip Error:", error);
    throw error;
  }
}

/*
==================================
Get All Trips
==================================
*/
export async function getTripsFromFirestore(userId) {
  try {
    const q = query(
      collection(db, "users", userId, "trips"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((trip) => ({
      id: trip.id,
      ...trip.data(),
    }));
  } catch (error) {
    console.error("Load Trips Error:", error);
    return [];
  }
}

/*
==================================
Get Single Trip
==================================
*/
export async function getTrip(userId, tripId) {
  try {
    const ref = doc(db, "users", userId, "trips", tripId);

    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) return null;

    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

/*
==================================
Update Trip
==================================
*/
export async function updateTrip(userId, tripId, data) {
  try {
    const ref = doc(db, "users", userId, "trips", tripId);

    await updateDoc(ref, data);
  } catch (error) {
    console.error("Update Trip Error:", error);
  }
}

/*
==================================
Delete Trip
==================================
*/
export async function deleteTripFromFirestore(
  userId,
  tripId
) {
  try {
    await deleteDoc(
      doc(db, "users", userId, "trips", tripId)
    );
  } catch (error) {
    console.error("Delete Trip Error:", error);
    throw error;
  }
}