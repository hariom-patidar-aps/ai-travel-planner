import Card from "../common/Card";
import { inr } from "../../utils/format";

const transportIcons = {
  flight: "✈️",
  train: "🚆",
  bus: "🚌",
  car: "🚗",
};

export default function TravelOptions({ options = [], loading }) {
  if (loading) {
    return (
      <Card
         title="Finding the Best Travel Options"
         icon="🚀"
       >
        <div className="grid md:grid-cols-3 gap-4">

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="glass rounded-3xl p-6 animate-pulse"
            >
              <div className="h-6 bg-white/20 rounded w-2/3 mb-5"></div>
              <div className="h-4 bg-white/20 rounded mb-2"></div>
              <div className="h-4 bg-white/20 rounded mb-2"></div>
              <div className="h-8 bg-white/20 rounded w-1/2 mt-6"></div>
            </div>
          ))}

        </div>
      </Card>
    );
  }

  if (!options.length) {
    return (
      <Card
          title="Travel Options"
          icon="✈️"
      >
        <div className="glass rounded-2xl p-10 text-center">

          <div className="text-6xl mb-4">
            🌍
          </div>

          <h2 className="text-2xl font-bold text-white">
            Ready to Plan?
          </h2>

          <p className="mt-3 text-slate-300">
            Click <strong>Generate AI Trip</strong> to compare travel
            prices, duration and transport options.
          </p>

        </div>
      </Card>
    );
  }

  const cheapest =
    Math.min(...options.map((o) => o.price || Number.MAX_SAFE_INTEGER));

  return (
    <Card
        title="Travel Options"
        icon="✈️"
      >

      <div className="grid lg:grid-cols-2 gap-6">

        {options.map((opt, index) => {

          const isCheapest = opt.price === cheapest;

          return (
            <div
              key={index}
              className="glass card rounded-3xl p-6 relative overflow-hidden"
            >

              {isCheapest && (
                <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                  ⭐ Best Value
                </div>
              )}

              <div className="flex justify-between items-center">

                <div className="flex items-center gap-4">

                  <div className="text-5xl">
                    {transportIcons[opt.type] || "🧳"}
                  </div>

                  <div>

                    <h3 className="text-xl font-bold text-white">
                      {opt.airline ||
                        opt.operator ||
                        opt.type.toUpperCase()}
                    </h3>

                    <p className="text-slate-300 mt-1">
                      {opt.departure} → {opt.arrival}
                    </p>

                  </div>

                </div>

                <div className="text-right">

                  <h2 className="text-3xl font-bold text-emerald-300">
                    {inr(opt.price || 0)}
                  </h2>

                  <p className="text-xs text-slate-300">
                    Estimated Fare
                  </p>

                </div>

              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">

                <div className="glass rounded-xl p-4 text-center">

                  <div className="text-2xl mb-2">
                    ⏱
                  </div>

                  <p className="text-xs uppercase tracking-widest text-slate-300">
                    Duration
                  </p>

                  <p className="font-semibold text-white mt-1">
                    {opt.duration}
                  </p>

                </div>

                <div className="glass rounded-xl p-4 text-center">

                  <div className="text-2xl mb-2">
                    🚏
                  </div>

                  <p className="text-xs uppercase tracking-widest text-slate-300">
                    Stops
                  </p>

                  <p className="font-semibold text-white mt-1">
                    {opt.stops
                      ? `${opt.stops} Stops`
                      : "Direct"}
                  </p>

                </div>

              </div>

              <div className="mt-6 flex justify-end">

                <button className="primary-btn">
                  Select Option
                </button>

              </div>

            </div>
          );
        })}

      </div>

    </Card>
  );
}