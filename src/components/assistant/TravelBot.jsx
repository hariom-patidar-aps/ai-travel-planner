import { useState } from "react";
import { askGemini } from "../../services/geminiService";
import VoiceAssistant from "./VoiceAssistant";

const suggestionChips = [
  { label: "🏖️ Beach Getaway", prompt: "I want a relaxing beach getaway. Recommend some destinations in India." },
  { label: "🏔️ Mountain Trek", prompt: "I want to go trekking in the mountains. Suggest some cool places in India." },
  { label: "🏰 Heritage Tour", prompt: "Recommend historical cities in India with rich cultural heritage." },
  { label: "🌲 Forest & Wildlife", prompt: "Suggest some nature, forest, and wildlife sanctuaries to visit in India." }
];

export default function TravelBot({ setForm, scrollToPlanner }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hey! I'm your Travel Scout. 🗺️ Not sure where to go? Tell me what kind of trip you want (e.g., beaches, historical, adventure) and I'll suggest the perfect cities!"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [recommendedCities, setRecommendedCities] = useState([]);

  const handleVoice = (text) => {
    setQuestion(text);
  };

  const handleSuggest = (promptText) => {
    askScout(promptText);
  };

  const askScout = async (userQuestion) => {
    if (!userQuestion.trim()) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userQuestion }
    ]);
    setQuestion("");
    setLoading(true);
    setRecommendedCities([]);

    const prompt = `
You are an AI Travel Scout, a friendly chatbot helper that recommends cities to visit.

User request: "${userQuestion}"

Task: Recommend 2 or 3 ideal destinations in India. Give a brief, exciting 2-sentence description for each.
At the very end of your response, output a special block listing the recommended cities exactly in this format so the UI can detect them (make sure they match known cities like Goa, Jaipur, Manali, Mumbai, Delhi, Kerala, Agra, Shimla, Udaipur, etc. if possible):
RECOMMENDED_CITIES: [City1, City2, ...]

Keep your response concise, engaging, and under 150 words.
`;

    try {
      const response = await askGemini(prompt);
      
      // Parse out recommended cities
      const match = response.match(/RECOMMENDED_CITIES:\s*\[(.*?)\]/i);
      let parsedCities = [];
      let cleanText = response;

      if (match) {
        if (match[1]) {
          parsedCities = match[1]
            .split(",")
            .map((c) => c.replace(/['"\[\]]/g, "").trim())
            .filter(Boolean);
        }
        // Remove the RECOMMENDED_CITIES block from user display
        cleanText = response.replace(/RECOMMENDED_CITIES:\s*\[.*?\]/i, "").trim();
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: cleanText }
      ]);
      setRecommendedCities(parsedCities);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, my travel database is currently offline. Please try again!" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCity = (city) => {
    setForm((prev) => ({
      ...prev,
      destination: city
    }));
    scrollToPlanner();
  };

  return (
    <div className="glass rounded-3xl p-6 mb-12 border border-slate-700/30">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            💬 AI Travel Scout Bot
          </h2>
          <p className="text-slate-300 text-sm mt-1">
            Let's find the perfect place for your next adventure!
          </p>
        </div>
      </div>

      {/* Suggestion Chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {suggestionChips.map((chip, index) => (
          <button
            key={index}
            onClick={() => handleSuggest(chip.prompt)}
            className="secondary-btn text-xs px-3 py-1.5 border border-slate-600/50 hover:bg-slate-800 text-slate-200 rounded-full"
            disabled={loading}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Chat Display */}
      <div className="h-64 overflow-y-auto space-y-4 mb-6 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 animate-fade-in">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`rounded-2xl p-4 max-w-[85%] ${
              msg.role === "user"
                ? "bg-cyan-600 text-white ml-auto"
                : "bg-slate-800 text-slate-200 mr-auto"
            }`}
          >
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
          </div>
        ))}

        {loading && (
          <div className="bg-slate-800/50 rounded-xl p-4 text-slate-300 mr-auto text-sm animate-pulse">
            Scouting locations... 🕵️‍♂️
          </div>
        )}
      </div>

      {/* Recommended Cities Action Buttons */}
      {recommendedCities.length > 0 && (
        <div className="mb-6 p-4 rounded-xl glass border border-cyan-500/20 bg-cyan-950/10">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300 mb-3">
            ✨ Auto-fill & Plan
          </p>
          <div className="flex flex-wrap gap-3">
            {recommendedCities.map((city, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectCity(city)}
                className="primary-btn text-xs px-4 py-2 hover:scale-105 active:scale-95 transition-all shadow-md"
              >
                ✈️ Plan Trip to {city}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          askScout(question);
        }}
        className="flex gap-3"
      >
        <input
          type="text"
          placeholder="Ask me where to go based on your preferences..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="flex-1 rounded-xl bg-slate-800 text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 border border-slate-700/50"
          disabled={loading}
        />

        <VoiceAssistant onResult={handleVoice} />

        <button
          className="primary-btn text-sm px-6 py-3 border-none flex items-center justify-center font-bold"
          type="submit"
          disabled={loading || !question.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}
