import cities from "../../data/cities";

export default function TripForm({
   form,
   setForm,
   onPlan,
   onOpenMap,
   loading,
   })  {
    const onSubmit = (e) => {
    e.preventDefault();
    onPlan();
   };

  return (
    <form
      onSubmit={onSubmit}
      className="glass rounded-3xl p-8 shadow-2xl border border-white/20"
    >
      {/* Heading */}

      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white">
          ✈️ Plan Your Journey
        </h2>

        <p className="text-slate-200 mt-2">
          Select your trip details and let AI prepare your travel plan.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Source */}

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            📍 Starting City
          </label>

          <select
           className="input-modern w-full text-black placeholder:text-gray-500"
            value={form.source}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                source: e.target.value,
              }))
            }
          >
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Destination */}

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            🌎 Destination
          </label>

          <select
            className="input-modern w-full text-black placeholder:text-gray-500"
            value={form.destination}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                destination: e.target.value,
              }))
            }
          >
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Days */}

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            📅 Number of Days
          </label>

          <input
            type="number"
            min="1"
          className="input-modern w-full text-black placeholder:text-gray-500"
            value={form.days}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                days: Number(e.target.value),
              }))
            }
          />
        </div>

        {/* Travel Mode */}

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            🚍 Travel Mode
          </label>

          <select
           className="input-modern w-full text-black placeholder:text-gray-500"
            value={form.travelMode}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                travelMode: e.target.value,
              }))
            }
          >

            <option value="flight">✈️ Flight</option>
            <option value="train">🚆 Train</option>
            <option value="bus">🚌 Bus</option>
            <option value="car">🚗 Car</option>
          </select>
        </div>

      </div>

      {/* Quick Info */}

      <div className="grid md:grid-cols-3 gap-4 mt-8">

        <div className="glass p-4 rounded-2xl text-center">
          <h3 className="text-2xl">🌦</h3>
          <p className="mt-2 text-sm text-white">
            Live Weather
          </p>
        </div>

        <div className="glass p-4 rounded-2xl text-center">
          <h3 className="text-2xl">🏨</h3>
          <p className="mt-2 text-sm text-white">
            Hotel Suggestions
          </p>
        </div>

        <div className="glass p-4 rounded-2xl text-center">
          <h3 className="text-2xl">💰</h3>
          <p className="mt-2 text-sm text-white">
            Budget Estimate
          </p>
        </div>

      </div>

      {/* Buttons */}

      <div className="flex flex-wrap justify-center gap-5 mt-10">

        <button
          type="submit"
          className="primary-btn"
        >
          ✨ Generate AI Trip
        </button>

        <button
          type="button"
          onClick={onOpenMap}
          className="secondary-btn"
        >
          🗺 View Route
        </button>
        <button
         type="submit"
         disabled={loading}
          className="btn-primary w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
        {loading ? "Planning..." : "🚀 Plan Trip"}
        </button>

      </div>
    </form>
  );
}