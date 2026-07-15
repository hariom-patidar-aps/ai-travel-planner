const features = [
  {
    icon: "🤖",
    title: "AI Trip Planning",
    desc: "Generate intelligent travel plans in seconds.",
  },
  {
    icon: "🌤",
    title: "Live Weather",
    desc: "Check destination weather before you travel.",
  },
  {
    icon: "🏨",
    title: "Hotel Suggestions",
    desc: "Find recommended hotels near attractions.",
  },
  {
    icon: "💰",
    title: "Budget Calculator",
    desc: "Estimate your complete trip cost instantly.",
  },
  {
    icon: "🚗",
    title: "Travel Options",
    desc: "Compare flights, trains, buses and cars.",
  },
  {
    icon: "📍",
    title: "Top Attractions",
    desc: "Discover must-visit places at your destination.",
  },
];

export default function Features() {
  return (
    <section id="features" className="mt-24">

      <h2 className="text-4xl font-bold text-center text-white">
        Why Choose AI Travel Planner?
      </h2>

      <p className="text-center text-slate-300 mt-3 mb-12">
        Everything you need for a perfect trip in one place.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {features.map((feature) => (
          <div
            key={feature.title}
            className="glass card rounded-3xl p-8 text-center"
          >
            <div className="text-6xl mb-5">
              {feature.icon}
            </div>

            <h3 className="text-2xl font-bold text-white">
              {feature.title}
            </h3>

            <p className="text-slate-300 mt-4">
              {feature.desc}
            </p>
          </div>
        ))}

      </div>

    </section>
  );
}