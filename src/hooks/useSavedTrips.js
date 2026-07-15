import { useEffect, useState } from "react";
import useAuth from "./useAuth";

import {
  saveTripToFirestore,
  getTripsFromFirestore,
  deleteTripFromFirestore,
} from "../services/firestoreService";

export default function useSavedTrips() {
  const { user } = useAuth();

  const [savedTrips, setSavedTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================
  // Load trips whenever user logs in
  // =====================================
  useEffect(() => {
    async function loadTrips() {
      if (!user) {
        setSavedTrips([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const trips = await getTripsFromFirestore(user.uid);

        setSavedTrips(trips);
      } catch (error) {
        console.error("Load Trips Error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadTrips();
  }, [user]);

  // =====================================
  // Save Trip
  // =====================================
  const saveTrip = async (trip) => {
    if (!user) {
      alert("Please login first.");
      return;
    }

    try {
      const tripId = await saveTripToFirestore(
        user.uid,
        trip
      );

      setSavedTrips((prev) => [
        {
          id: tripId,
          ...trip,
        },
        ...prev,
      ]);
    } catch (error) {
      console.error("Save Trip Error:", error);
    }
  };

  // =====================================
  // Delete Trip
  // =====================================
  const deleteTrip = async (tripId) => {
    if (!user) return;

    try {
      await deleteTripFromFirestore(user.uid, tripId);

      setSavedTrips((prev) =>
        prev.filter((trip) => trip.id !== tripId)
      );
    } catch (error) {
      console.error("Delete Trip Error:", error);
    }
  };

  // =====================================
  // Refresh Trips
  // =====================================
  const refreshTrips = async () => {
    if (!user) return;

    try {
      const trips = await getTripsFromFirestore(user.uid);
      setSavedTrips(trips);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    savedTrips,
    loading,
    saveTrip,
    deleteTrip,
    refreshTrips,
  };
}