export function generatePlan(source, destination) {
  return {
    places: [
      `${destination} Fort`,
      `${destination} Museum`,
      `${destination} Local Market`,
      `${destination} Sunset Point`,
    ],

    hotels: [
      `${destination} Residency`,
      `${destination} Grand Hotel`,
      `${destination} Comfort Stay`,
    ],

    itinerary: [
      {
        day: 1,
        activities: [
          {
            time: "08:00 AM",
            title: "Breakfast",
            icon: "🍳",
          },
          {
            time: "10:00 AM",
            title: `Visit ${destination} Fort`,
            icon: "🏰",
          },
          {
            time: "01:00 PM",
            title: "Lunch",
            icon: "🍛",
          },
          {
            time: "03:00 PM",
            title: `${destination} Museum`,
            icon: "🏛️",
          },
          {
            time: "06:30 PM",
            title: "Sunset Point",
            icon: "🌅",
          },
        ],
      },

      {
        day: 2,
        activities: [
          {
            time: "09:00 AM",
            title: "Hotel Breakfast",
            icon: "☕",
          },
          {
            time: "11:00 AM",
            title: `${destination} Local Market`,
            icon: "🛍️",
          },
          {
            time: "02:00 PM",
            title: "Street Food Tour",
            icon: "🌮",
          },
          {
            time: "05:00 PM",
            title: "City Walk",
            icon: "🚶",
          },
          {
            time: "08:00 PM",
            title: "Dinner",
            icon: "🍽️",
          },
        ],
      },

      {
        day: 3,
        activities: [
          {
            time: "08:30 AM",
            title: "Breakfast",
            icon: "🥞",
          },
          {
            time: "10:00 AM",
            title: "Shopping",
            icon: "🛒",
          },
          {
            time: "01:00 PM",
            title: "Lunch",
            icon: "🥗",
          },
          {
            time: "03:30 PM",
            title: "Departure",
            icon: "✈️",
          },
        ],
      },
    ],
  };
}