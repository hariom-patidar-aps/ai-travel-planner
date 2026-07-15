import { inr } from "../../utils/format";

function StatCard({ icon, title, value, color }) {
  return (
    <div className="glass card rounded-3xl p-6 relative overflow-hidden">

      <div
        className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-30 ${color}`}
      />

      <div className="flex items-center justify-between">

        <div>
          <p className="text-slate-200 text-sm tracking-wide">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-white mt-2">
            {value}
          </h2>
        </div>

        <div className="text-5xl">
          {icon}
        </div>

      </div>

    </div>
  );
}

export default function BudgetSummary({
  nights,
  estimatedBudget,
  totalDistanceKm,
  travelCost,
  travelTime,
}) {
  return (
    <section className="mt-10">

      {/* Heading */}

      <div className="text-center mb-8">

        <h2 className="text-3xl font-bold text-white">
          📊 Trip Overview
        </h2>

        <p className="text-slate-300 mt-2">
          Everything you need before starting your journey.
        </p>

      </div>

      {/* Main Budget Card */}

      <div className="glass rounded-3xl p-8 mb-8 text-center card">

        <p className="uppercase tracking-[0.3em] text-cyan-300">
          Estimated Total Budget
        </p>

        <h1 className="text-5xl md:text-6xl font-extrabold text-white mt-4">
          {inr(estimatedBudget ?? 0)}
        </h1>

        <p className="mt-4 text-slate-300">
          Includes travel expenses and approximate stay cost.
        </p>

      </div>

      {/* Statistics */}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard
          icon="🌙"
          title="Nights"
          value={nights ?? 0}
          color="bg-indigo-500"
        />

        <StatCard
          icon="📍"
          title="Distance"
          value={`${totalDistanceKm ?? 0} km`}
          color="bg-cyan-500"
        />

        <StatCard
          icon="⏱️"
          title="Travel Time"
          value={travelTime?.text ?? "0h"}
          color="bg-orange-500"
        />

        <StatCard
          icon="🚗"
          title="Travel Cost"
          value={inr(travelCost ?? 0)}
          color="bg-emerald-500"
        />

      </div>

      {/* Travel Tips */}

      <div className="grid md:grid-cols-3 gap-5 mt-8">

        <div className="glass rounded-2xl p-5 card text-center">
          <h3 className="text-4xl">🎒</h3>
          <h4 className="font-semibold mt-3">
            Pack Smart
          </h4>
          <p className="text-slate-300 mt-2 text-sm">
            Carry essentials according to your destination's weather.
          </p>
        </div>

        <div className="glass rounded-2xl p-5 card text-center">
          <h3 className="text-4xl">💳</h3>
          <h4 className="font-semibold mt-3">
            Budget Tip
          </h4>
          <p className="text-slate-300 mt-2 text-sm">
            Keep an extra 10–15% of your budget for emergencies.
          </p>
        </div>

        <div className="glass rounded-2xl p-5 card text-center">
          <h3 className="text-4xl">📱</h3>
          <h4 className="font-semibold mt-3">
            Stay Connected
          </h4>
          <p className="text-slate-300 mt-2 text-sm">
            Download offline maps before beginning your journey.
          </p>
        </div>

      </div>

    </section>
  );
}