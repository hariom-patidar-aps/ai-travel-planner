import Card from "./common/Card";

export default function SavedTrips({
  savedTrips = [],
  loading,
  deleteTrip,
}) {
  return (
    <Card title="☁️ Saved Trips">

      {loading ? (
        <div className="text-center text-slate-300 py-10">
          Loading trips...
        </div>
      ) : savedTrips.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">

          <div className="text-6xl mb-5">
            🧳
          </div>

          <h2 className="text-2xl font-bold text-white">
            No Saved Trips
          </h2>

          <p className="text-slate-300 mt-3">
            Plan your first AI trip and it will appear here.
          </p>

        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {savedTrips.map((trip) => (

            <div
              key={trip.id}
              className="glass rounded-2xl p-6 hover:scale-105 transition duration-300"
            >

              <h3 className="text-xl font-bold text-white">
                {trip.source} ➜ {trip.destination}
              </h3>

              <p className="text-slate-300 mt-3">
                🗓 {trip.days} Days
              </p>

              <p className="text-slate-400 mt-2 text-sm">
                {trip.createdAt?.toDate
                  ? trip.createdAt.toDate().toLocaleString()
                  : "Recently Added"}
              </p>

              <div className="flex gap-3 mt-6">

                <button
                  className="primary-btn flex-1"
                  onClick={() =>
                    alert(
                      "Trip details feature will be added in the next update."
                    )
                  }
                >
                  View
                </button>

                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
                  onClick={() => deleteTrip(trip.id)}
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>
      )}

    </Card>
  );
}