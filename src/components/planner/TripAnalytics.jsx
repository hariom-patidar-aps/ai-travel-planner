import Card from "../common/Card";

export default function TripAnalytics({ trips = [] }) {
  if (!trips.length) {
    return (
      <Card title="📊 Trip Analytics">
        <p className="text-slate-500">
          Plan some trips to view analytics.
        </p>
      </Card>
    );
  }

  const totalTrips = trips.length;

  const totalBudget = trips.reduce(
    (sum, trip) => sum + (Number(trip.budget) || 0),
    0
  );

  const averageDays = (
    trips.reduce(
      (sum, trip) => sum + Number(trip.days || 0),
      0
    ) / totalTrips
  ).toFixed(1);

  const destinationCount = {};

  trips.forEach((trip) => {
    destinationCount[trip.destination] =
      (destinationCount[trip.destination] || 0) + 1;
  });

  const favoriteDestination =
    Object.entries(destinationCount).sort(
      (a, b) => b[1] - a[1]
    )[0][0];

  return (
    <Card title="📊 Trip Analytics">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

        <div className="glass rounded-xl p-5 text-center">
          <h2 className="text-3xl font-bold text-cyan-300">
            {totalTrips}
          </h2>
          <p>Total Trips</p>
        </div>

        <div className="glass rounded-xl p-5 text-center">
          <h2 className="text-3xl font-bold text-cyan-300">
            ₹{totalBudget.toLocaleString()}
          </h2>
          <p>Total Budget</p>
        </div>

        <div className="glass rounded-xl p-5 text-center">
          <h2 className="text-3xl font-bold text-cyan-300">
            {averageDays}
          </h2>
          <p>Average Days</p>
        </div>

        <div className="glass rounded-xl p-5 text-center">
          <h2 className="text-xl font-bold text-cyan-300">
            {favoriteDestination}
          </h2>
          <p>Top Destination</p>
        </div>

      </div>
    </Card>
  );
}