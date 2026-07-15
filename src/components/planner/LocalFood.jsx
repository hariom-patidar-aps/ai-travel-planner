import Card from "../common/Card";

export default function LocalFood({ foods = [] }) {
  return (
    <Card title="🍽 Must Try Local Food">
      {!foods.length ? (
        <p className="text-slate-500">
          Generate a trip to see local cuisine.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {foods.map((food, index) => {
            const isObject = typeof food === "object" && food !== null;
            const name = isObject ? (food.name || food.foodName || "") : food;
            const description = isObject ? food.description : "";

            return (
              <div
                key={index}
                className="glass rounded-xl p-5 flex flex-col gap-1"
              >
                <div className="font-semibold text-white">
                  🍴 {name}
                </div>
                {description && (
                  <p className="text-slate-300 text-sm mt-1">
                    {description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}