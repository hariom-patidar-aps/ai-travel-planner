import { useState } from "react";
import { askTravelAssistant } from "../../services/geminiService";
import VoiceAssistant from "./VoiceAssistant";

export default function AIChat({ destination, compact = false }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  function handleVoice(text) {
    setQuestion(text);
  }
  async function handleAsk(e) {
    e.preventDefault();

    if (!question.trim()) return;

    const userQuestion = question;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const answer = await askTravelAssistant(
        destination,
        userQuestion
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: answer,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, I couldn't answer that. Please try again.",
        },
      ]);

      console.error(err);
    }

    setLoading(false);
  }

  return (
    <div className={compact ? "flex flex-col h-full" : "glass rounded-3xl p-6 mt-8"}>

      {!compact && (
        <h2 className="text-3xl font-bold text-white mb-6">
          🤖 AI Travel Assistant
        </h2>
      )}

      <div className={`${compact ? "h-72" : "h-96"} overflow-y-auto space-y-4 mb-6`}>

        {messages.length === 0 && (
          <div className="text-slate-300">
            Ask me anything about your destination.
          </div>
        )}

        {messages.map((msg, index) => (

          <div
            key={index}
            className={`rounded-2xl p-4 ${
              msg.role === "user"
                ? "bg-cyan-600 text-white ml-10"
                : "bg-slate-800 text-slate-200 mr-10"
            }`}
          >
            {msg.text}
          </div>

        ))}

        {loading && (
          <div className="bg-slate-800 rounded-xl p-4 text-slate-300">
            AI is thinking...
          </div>
        )}

      </div>

      <form
        onSubmit={handleAsk}
        className="flex gap-3"
        >

      <input
       type="text"
       placeholder="Ask about your trip..."
       value={question}
       onChange={(e) => setQuestion(e.target.value)}
       className="flex-1 rounded-xl bg-slate-800 text-white p-4"
      />

     <VoiceAssistant
       onResult={handleVoice}
      />

     <button
       className="primary-btn"
      type="submit"
     >
    Ask
     </button>

    </form>
   </div>
  );
}