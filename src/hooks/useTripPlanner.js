import { useMemo, useState } from "react";
import cities from "../data/cities";
import { haversineDistanceKm } from "../utils/geo";
import {
  AVG_FOOD_PER_DAY,
  AVG_HOTEL_PER_NIGHT,
  AVG_LOCAL_TRAVEL_PER_DAY,
} from "../utils/constants";

import { generateAITrip } from "../services/geminiService";
import { getWeatherByCoords } from "../services/weatherService";
import { getTravelOptions } from "../services/travelDataService";

const TRAVEL_COST_PER_KM = {
  bus: 1.5,
  train: 2.2,
  car: 6,
  flight: 10,
};

const AVG_SPEED_KMPH = {
  bus: 45,
  train: 65,
  car: 50,
  flight: 700,
};

export default function useTripPlanner(saveTrip) {
  const [form, setForm] = useState({
    source: "Delhi",
    destination: "Jaipur",
    days: 3,
    travelMode: "train",
  });

  const [plan, setPlan] = useState({
    places: [],
    hotels: [],
    itinerary: [],
    travelTips: [],
    localFood: [],
  });

  const [weather, setWeather] = useState(null);
  const [travelOptions, setTravelOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sourceCity = useMemo(
    () => cities.find((c) => c.name === form.source),
    [form.source]
  );

  const destCity = useMemo(
    () => cities.find((c) => c.name === form.destination),
    [form.destination]
  );

  const totalDistanceKm = useMemo(() => {
    if (!sourceCity || !destCity) return 0;

    return Math.round(
      haversineDistanceKm(
        sourceCity.lat,
        sourceCity.lon,
        destCity.lat,
        destCity.lon
      )
    );
  }, [sourceCity, destCity]);

  const nights = Math.max(Number(form.days) - 1, 1);

  const travelCost = useMemo(() => {
    if (travelOptions.length > 0) {
      const selected = travelOptions.find(
        (t) => t.type === form.travelMode
      );

      if (selected?.price) {
        return selected.price * 2;
      }
    }

    return Math.round(
      totalDistanceKm *
        (TRAVEL_COST_PER_KM[form.travelMode] || 2)
    );
  }, [travelOptions, totalDistanceKm, form.travelMode]);

  const travelTime = useMemo(() => {
    if (!totalDistanceKm)
      return {
        hours: 0,
        text: "0h",
      };

    const speed =
      AVG_SPEED_KMPH[form.travelMode] || 50;

    const totalHours =
      form.travelMode === "flight"
        ? totalDistanceKm / speed + 2.5
        : totalDistanceKm / speed;

    const h = Math.floor(totalHours);
    const m = Math.round((totalHours - h) * 60);

    return {
      hours: totalHours,
      text: `${h}h ${m}m`,
    };
  }, [totalDistanceKm, form.travelMode]);

  const estimatedBudget = useMemo(() => {
    const days = Number(form.days);

    return (
      nights * AVG_HOTEL_PER_NIGHT +
      days * AVG_FOOD_PER_DAY +
      days * AVG_LOCAL_TRAVEL_PER_DAY +
      travelCost
    );
  }, [travelCost, form.days, nights]);

  const handlePlanTrip = async () => {
    try {
      setLoading(true);
      setError("");

      const aiTrip = await generateAITrip(
        form.source,
        form.destination,
        form.days
      );

      setPlan({
        places: aiTrip.places || [],
        hotels: aiTrip.hotels || [],
        itinerary: aiTrip.itinerary || [],
        travelTips: aiTrip.travelTips || [],
        localFood: aiTrip.localFood || [],
      });

      if (saveTrip) {
        saveTrip({
         id: Date.now(),
        source: form.source,
         destination: form.destination,
         days: Number(form.days),
         budget: estimatedBudget,
         travelMode: form.travelMode,
         createdAt: new Date().toLocaleString(),
       });
      }

      if (destCity) {
        const weatherData = await getWeatherByCoords(
          destCity.lat,
          destCity.lon
        );

        setWeather(weatherData);
      }

      const date = new Date()
        .toISOString()
        .split("T")[0];

      try {
        const options = await getTravelOptions(
          form.source,
          form.destination,
          date
        );

        setTravelOptions(options || []);
      } catch (err) {
        console.error("Travel Options Error:", err);
        setTravelOptions([]);
      }

    } catch (err) {
      console.error("Trip Planning Error:", err);

      setError(
        "Unable to generate AI itinerary. Please try again."
      );

      setPlan({
        places: [],
        hotels: [],
        itinerary: [],
        travelTips: [],
        localFood: [],
      });

    } finally {
      setLoading(false);
    }
  };

  const openRouteMap = () => {
    const url = `https://www.google.com/maps/dir/${encodeURIComponent(
      form.source
    )}/${encodeURIComponent(form.destination)}`;

    window.open(url, "_blank");
  };

  return {
    error,
    form,
    setForm,
    plan,
    weather,
    travelOptions,
    loading,
    handlePlanTrip,
    openRouteMap,
    nights,
    travelCost,
    travelTime,
    estimatedBudget,
    totalDistanceKm,
    destinationCoordinates: destCity
    ? {
      lat: destCity.lat,
      lon: destCity.lon,
    }
    : null,
  };
}