export const getFlightPrices = async (source, destination, dateStr) => {
  return [
    {
      name: "Demo Flight",
      price: 5000,
      duration: "2h 30m",
    },
  ];
};

export const getTrainPrices = async (source, destination, dateStr) => {
  return [
    {
      name: "Demo Train",
      price: 1200,
      duration: "8h",
    },
  ];
};
export async function getTravelOptions(source, destination, mode) {
  try {
    const url = `http://localhost:8787/api/travel-options?source=${encodeURIComponent(
      source
    )}&destination=${encodeURIComponent(destination)}&mode=${encodeURIComponent(mode)}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to fetch travel options");
    }

    return data.options || [];
  } catch (error) {
    console.warn("Travel Options Service: Backend server offline. Using fallback mock options.", error);
    return [
      { type: "train", name: "Superfast Express", price: 1200, duration: "6h 30m" },
      { type: "bus", name: "Intercity Volvo AC", price: 800, duration: "8h 15m" },
      { type: "flight", name: "Direct flight (Air India)", price: 4500, duration: "1h 15m" },
      { type: "car", name: "Cab / Self-Drive Sedan", price: 3500, duration: "5h 45m" }
    ];
  }
}