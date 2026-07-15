import Card from "../common/Card";

export default function SavedTrips({
  trips = [],
  onDelete,
}) {
  return (
    <Card
      title="Saved Trips"
      icon="💾"
    >
      {!trips.length ? (
        <div className="glass rounded-3xl p-8 text-center">
          <div className="text-5xl">🧳</div>

          <p className="text-slate-300 mt-4">
            No saved trips yet.
          </p>
        </div>
      ) : (
        <div className="space-y-5">

          {trips.map((trip) => (

            <div
              key={trip.id}
              className="glass card rounded-3xl p-6 flex justify-between items-center"
            >

              <div>

                <h2 className="text-xl font-bold text-white">
                  {trip.source} → {trip.destination}
                </h2>

                <p className="text-slate-300 mt-2">
                  {trip.days} Days
                </p>

                <p className="text-slate-400">
                  {trip.date}
                </p>

              </div>

              <button
                onClick={() => onDelete(trip.id)}
                className="secondary-btn"
              >
                🗑 Delete
              </button>

            </div>

          ))}

        </div>
      )}
    </Card>
  );
}