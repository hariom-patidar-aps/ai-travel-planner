import Card from "../common/Card";

export default function TravelTips({ tips = [] }) {
  return (
    <Card title="💡 AI Travel Tips">
      {!tips.length ? (
        <p className="text-slate-500">
          Generate a trip to receive travel tips.
        </p>
      ) : (
        <div className="space-y-3">
          {tips.map((tip, index) => (
            <div
              key={index}
              className="glass rounded-xl p-4"
            >
              <p className="text-white">
                ✅ {tip}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}