import Card from "../common/Card";

function getWeatherTheme(temp) {
  if (temp <= 10)
    return {
      icon: "❄️",
      title: "Cold Weather",
      color: "from-cyan-500 to-blue-700",
    };

  if (temp <= 25)
    return {
      icon: "⛅",
      title: "Pleasant Weather",
      color: "from-sky-500 to-cyan-500",
    };

  return {
    icon: "☀️",
    title: "Warm Weather",
    color: "from-orange-400 to-red-500",
  };
}

export default function WeatherCard({ weather }) {
  if (!weather) {
    return (
      <Card
         title="Destination Weather"
         icon="🌦"
        >
        <div className="glass rounded-3xl p-10 text-center">

          <div className="text-6xl mb-4">
            🌎
          </div>

          <h2 className="text-2xl font-bold text-white">
            Weather Information
          </h2>

          <p className="text-slate-300 mt-3">
            Generate your itinerary to view the latest weather forecast.
          </p>

        </div>
      </Card>
    );
  }

  const theme = getWeatherTheme(weather.tempC);

  return (
    <Card title="🌤 Destination Weather">

      <div
        className={`rounded-3xl bg-gradient-to-r ${theme.color} p-8 shadow-xl`}
      >

        <div className="flex flex-col lg:flex-row justify-between items-center">

          {/* Left */}

          <div className="text-center lg:text-left">

            <div className="text-7xl">
              {theme.icon}
            </div>

            <h2 className="text-5xl font-bold text-white mt-3">
              {weather.tempC}°C
            </h2>

            <p className="text-xl text-white/90 mt-2">
              {theme.title}
            </p>

          </div>

          {/* Right */}

          <div className="grid grid-cols-2 gap-5 mt-8 lg:mt-0">

            <div className="glass rounded-2xl p-5 text-center">

              <div className="text-3xl">
                💨
              </div>

              <p className="text-xs uppercase tracking-wider text-white/80 mt-2">
                Wind Speed
              </p>

              <h3 className="text-2xl font-bold text-white mt-2">
                {weather.windKmh}
              </h3>

              <p className="text-white/80 text-sm">
                km/h
              </p>

            </div>

            <div className="glass rounded-2xl p-5 text-center">

              <div className="text-3xl">
                🌡️
              </div>

              <p className="text-xs uppercase tracking-wider text-white/80 mt-2">
                Feels Like
              </p>

              <h3 className="text-2xl font-bold text-white mt-2">
                {weather.tempC}°
              </h3>

              <p className="text-white/80 text-sm">
                Celsius
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Travel Advice */}

      <div className="grid md:grid-cols-3 gap-5 mt-6">

        <div className="glass rounded-2xl p-5 text-center card">
          <div className="text-4xl">
            👕
          </div>

          <h3 className="font-semibold mt-3 text-white">
            Clothing
          </h3>

          <p className="text-sm text-slate-300 mt-2">
            {weather.tempC > 28
              ? "Wear light cotton clothes."
              : weather.tempC > 15
              ? "Carry a light jacket."
              : "Bring warm winter clothing."}
          </p>
        </div>

        <div className="glass rounded-2xl p-5 text-center card">
          <div className="text-4xl">
            🥤
          </div>

          <h3 className="font-semibold mt-3 text-white">
            Travel Tip
          </h3>

          <p className="text-sm text-slate-300 mt-2">
            {weather.tempC > 30
              ? "Stay hydrated throughout the day."
              : "Perfect weather for sightseeing."}
          </p>
        </div>

        <div className="glass rounded-2xl p-5 text-center card">
          <div className="text-4xl">
            🎒
          </div>

          <h3 className="font-semibold mt-3 text-white">
            Essentials
          </h3>

          <p className="text-sm text-slate-300 mt-2">
            Carry sunscreen, a power bank and a reusable water bottle.
          </p>
        </div>

      </div>

    </Card>
  );
}