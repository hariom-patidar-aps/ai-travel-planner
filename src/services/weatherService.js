export async function getWeatherByCoords(lat, lon) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Weather fetch failed");
    const data = await res.json();

    return {
      tempC: data?.current?.temperature_2m ?? "--",
      windKmh: data?.current?.wind_speed_10m ?? "--",
    };
  } catch (error) {
    console.warn("Weather Service: Fetch failed. Returning default mock weather metrics.", error);
    return { tempC: 26.5, windKmh: 12.4 };
  }
}