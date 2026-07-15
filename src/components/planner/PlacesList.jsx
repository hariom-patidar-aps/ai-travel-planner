import Card from "../common/Card";
import PlaceCard from "./PlaceCard";


export default function PlacesList({ places = [] }) {
  return (
    <Card title="🏛 Top Places to Visit">
      {places.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center">
          <div className="text-6xl mb-4">🏰</div>

          <h2 className="text-2xl font-bold text-white">
            No Places Yet
          </h2>

          <p className="text-slate-300 mt-3">
            Click <strong>"Plan Trip"</strong> to generate AI-recommended
            attractions for your destination.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {places.map((place, index) => (
            <PlaceCard
              key={place.name || index}
              place={place}
            />
          ))}
        </div>
      )}
    </Card>
  );
}