import { useState } from "react";
import Card from "../common/Card";
import { optimizeBudget } from "../../services/geminiService";

export default function BudgetOptimizer({
  destination,
  days,
  budget,
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const optimize = async () => {
    setLoading(true);

    const data = await optimizeBudget(
      destination,
      days,
      budget
    );

    setResult(data);

    setLoading(false);
  };

  return (
    <Card title="💰 AI Budget Optimizer">

      <button
        className="primary-btn"
        onClick={optimize}
      >
        Optimize Budget
      </button>

      {loading && (
        <p className="mt-4">
          AI is analyzing your trip...
        </p>
      )}

      {result && (
        <div className="mt-6">

          <h3 className="text-xl font-bold text-cyan-300">
            Estimated Savings
          </h3>

          <p className="mb-6">
            {result.estimatedSavings}
          </p>

          <h3 className="text-xl font-bold text-cyan-300">
            AI Suggestions
          </h3>

          <ul className="space-y-3 mt-4">
            {result.tips.map((tip, i) => (
              <li
                key={i}
                className="glass rounded-xl p-4"
              >
                💡 {tip}
              </li>
            ))}
          </ul>

        </div>
      )}

    </Card>
  );
}