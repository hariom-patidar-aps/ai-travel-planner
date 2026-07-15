import { useState } from "react";
import Card from "../common/Card";
import { askTravelAssistant } from "../../services/geminiService";

export default function TravelAssistant({ destination }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    if (!question.trim()) return;

    setLoading(true);

    const result = await askTravelAssistant(
      destination,
      question
    );

    setAnswer(result);

    setLoading(false);
  };

  return (
    <Card title="🤖 AI Travel Assistant">
      <textarea
        rows={4}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder={`Ask anything about ${destination}`}
        className="w-full rounded-xl bg-slate-800 p-4 text-white"
      />

      <button
        className="primary-btn mt-4"
        onClick={ask}
      >
        Ask AI
      </button>

      {loading && (
        <p className="mt-4 text-cyan-300">
          Thinking...
        </p>
      )}

      {answer && (
        <div className="glass rounded-xl p-5 mt-5">
          <p className="text-slate-200 whitespace-pre-wrap">
            {answer}
          </p>
        </div>
      )}
    </Card>
  );
}