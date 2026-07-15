const destinations = [
  {
    name: "Goa",
    emoji: "🏖️",
    description: "Beaches, nightlife and water sports",
  },
  {
    name: "Manali",
    emoji: "🏔️",
    description: "Snow mountains and adventure",
  },
  {
    name: "Jaipur",
    emoji: "🏰",
    description: "The Pink City of India",
  },
  {
    name: "Kerala",
    emoji: "🌴",
    description: "Backwaters and houseboats",
  },
  {
    name: "Mumbai",
    emoji: "🌆",
    description: "City of dreams",
  },
  {
    name: "Delhi",
    emoji: "🕌",
    description: "Historical monuments",
  },
];

export default function PopularDestinations({ setForm }) {
  const selectDestination = (destination) => {
    setForm((prev) => ({
      ...prev,
      destination,
    }));

    document
      .getElementById("planner")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  return (
    <section className="mt-20">

      <h2 className="text-4xl font-bold text-center text-white mb-3">
        🌍 Popular Destinations
      </h2>

      <p className="text-center text-slate-300 mb-10">
        Choose a destination to start planning instantly.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {destinations.map((item) => (

          <div
            key={item.name}
            onClick={() => selectDestination(item.name)}
            className="glass card rounded-3xl p-8 cursor-pointer hover:scale-105 transition duration-300"
          >

            <div className="text-6xl text-center">
              {item.emoji}
            </div>

            <h3 className="text-2xl font-bold text-white text-center mt-5">
              {item.name}
            </h3>

            <p className="text-slate-300 text-center mt-3">
              {item.description}
            </p>

            <button className="primary-btn w-full mt-6">
              Plan Trip →
            </button>

          </div>

        ))}

      </div>

    </section>
  );
}