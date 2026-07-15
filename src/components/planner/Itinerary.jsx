import Card from "../common/Card";

export default function Itinerary({ itinerary = [] }) {
  if (!itinerary.length) {
    return (
      <Card title="📅 AI Itinerary">
        <div className="glass rounded-3xl p-10 text-center">

          <div className="text-7xl">
            ✈️
          </div>

          <h2 className="text-3xl font-bold text-white mt-6">
            Generate a Trip
          </h2>

          <p className="text-slate-300 mt-4">
            Your complete AI itinerary will appear here.
          </p>

        </div>
      </Card>
    );
  }

  return (
    <Card title="📅 AI Travel Itinerary">

      <div className="space-y-8">

        {itinerary.map((day, index) => (

          <div
            key={day.day || index}
            className="glass rounded-3xl p-8 hover:scale-[1.01] transition"
          >

            <div className="flex justify-between items-center mb-8">

              <div>

                <h2 className="text-3xl font-bold text-white">
                  Day {day.day}
                </h2>

                <p className="text-cyan-300 mt-2">
                  {day.theme}
                </p>

              </div>

              <div className="bg-cyan-500 rounded-full px-4 py-2 text-white font-bold">

                {day.activities.length} Activities

              </div>

            </div>

            <div className="space-y-5">

              {day.activities.map((activity, i) => (

                <div
                  key={i}
                  className="glass rounded-2xl p-5 border-l-4 border-cyan-400"
                >

                  <div className="flex justify-between">

                    <h3 className="font-bold text-cyan-300">
                      🕒 {activity.time}
                    </h3>

                  </div>

                  <p className="text-white mt-3 leading-7">
                    <h3 className="text-xl font-bold text-white">
                 📍 {activity.place}
                    </h3>

                   <p className="text-slate-300 mt-2">
                     {activity.description}
                   </p>
                  </p>

                  {activity.optional && (

                    <div className="mt-4 rounded-xl bg-yellow-500/10 p-4">

                      <p className="text-yellow-300 font-semibold">
                        ⭐ Optional
                      </p>

                      <p className="text-slate-300 mt-2">
                        {activity.optional}
                      </p>

                    </div>

                  )}

                </div>

              ))}

            </div>

          </div>

        ))}

      </div>

    </Card>
  );
}