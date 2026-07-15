const sections = [
  { id: "planner", label: "📝 Planner" },
  { id: "budget", label: "💰 Budget" },
  { id: "weather", label: "🌦 Weather" },
  { id: "packing", label: "🎒 Packing" },
  { id: "itinerary", label: "📅 Itinerary" },
  { id: "map", label: "🗺 Map" },
  { id: "expense", label: "💸 Split Expenses" },
  { id: "scrapbook", label: "📸 Scrapbook" },
  { id: "assistant", label: "🤖 Assistant" },
  { id: "tips", label: "💡 Tips" },
  { id: "food", label: "🍜 Food" },
  { id: "analytics", label: "📊 Analytics" },
  { id: "saved", label: "💾 Trips" },
  { id: "places", label: "📍 Places" },
  { id: "hotels", label: "🏨 Hotels" },
  { id: "favorites", label: "❤️ Favorites" },
];

export default function FeatureNav({ activeSection, setActiveSection }) {
  return (
    <div className="sticky top-16 z-40 glass rounded-2xl p-4 mb-8 overflow-x-auto">

      <div className="flex gap-3 whitespace-nowrap">

        {sections.map((section) => {
          const isActive = section.id === activeSection;
          return (
            <button
              key={section.id}
              className={`${
                isActive
                  ? "primary-btn text-white shadow-lg"
                  : "secondary-btn text-slate-300 hover:text-white"
              } text-sm px-5 py-2 border-none transition-all duration-300`}
              onClick={() => setActiveSection(section.id)}
            >
              {section.label}
            </button>
          );
        })}

      </div>

    </div>
  );
}