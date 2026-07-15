import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8787;
const SERPAPI_KEY = process.env.SERPAPI_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

// Initialize Google Generative AI
let genAI = null;
if (GEMINI_API_KEY) {
  console.log("Server: Gemini API Key detected. Initializing genAI client...");
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
} else {
  console.warn("Server: Missing GEMINI_API_KEY in environment. Falling back to local offline mock data.");
}

function getGeminiModel() {
  if (!genAI) return null;
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
}

const AIRPORT_CODES = {
  Delhi: "DEL",
  Jaipur: "JAI",
  Mumbai: "BOM",
  Bengaluru: "BLR",
  Goa: "GOI",
};

app.get("/api/health", (_, res) => {
  res.json({ 
    ok: true, 
    hasSerpKey: Boolean(SERPAPI_KEY), 
    hasGeminiKey: Boolean(GEMINI_API_KEY) 
  });
});

// ==========================================
// SERP FLIGHTS & TRAIN OPTIONS
// ==========================================
app.get("/api/travel-options", async (req, res) => {
  try {
    const { source, destination, mode = "flight" } = req.query;

    if (!SERPAPI_KEY) {
      return res.status(500).json({ error: "Missing SERPAPI_KEY in server .env" });
    }

    if (!source || !destination) {
      return res.status(400).json({ error: "source and destination are required" });
    }

    const src = AIRPORT_CODES[source] || source;
    const dst = AIRPORT_CODES[destination] || destination;
    const date = new Date().toISOString().split("T")[0];

    if (mode === "flight") {
      const url = `https://serpapi.com/search.json?engine=google_flights&departure_id=${encodeURIComponent(
        src
      )}&arrival_id=${encodeURIComponent(
        dst
      )}&outbound_date=${date}&currency=INR&hl=en&api_key=${SERPAPI_KEY}`;

      const r = await fetch(url);
      const data = await r.json();

      if (data.error) return res.status(400).json({ error: data.error });

      const flights = (data.best_flights || data.other_flights || []).map((f) => ({
        type: "flight",
        airline: f.flights?.[0]?.airline || "Flight",
        price: Number(String(f.price || "0").replace(/[^\d]/g, "")) || 0,
        duration: f.total_duration || "N/A",
        departure: f.flights?.[0]?.departure_airport?.time || "N/A",
        arrival: f.flights?.[f.flights.length - 1]?.arrival_airport?.time || "N/A",
        stops: f.flights?.length ? Math.max(f.flights.length - 1, 0) : 0,
      }));

      return res.json({ options: flights });
    }

    // train fallback via normal google search snippets
    const q = `${source} to ${destination} train fare today`;
    const url = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(
      q
    )}&hl=en&gl=in&api_key=${SERPAPI_KEY}`;

    const r = await fetch(url);
    const data = await r.json();

    if (data.error) return res.status(400).json({ error: data.error });

    const trains = (data.organic_results || []).slice(0, 5).map((x) => {
      const txt = `${x.title || ""} ${x.snippet || ""}`;
      const m = txt.match(/₹\s?([\d,]+)/);
      return {
        type: "train",
        operator: x.source || "Rail",
        price: m ? Number(m[1].replace(/,/g, "")) : 0,
        duration: "N/A",
        departure: "N/A",
        arrival: "N/A",
        stops: 0,
        link: x.link,
      };
    });

    return res.json({ options: trains });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || "Server error" });
  }
});

// ==========================================
// SECURE GEMINI AI ROUTE PROXIES
// ==========================================

// 1. Generate Trip Itinerary
app.post("/api/generate-trip", async (req, res) => {
  const { source, destination, days } = req.body;
  if (!source || !destination) {
    return res.status(400).json({ error: "source and destination required" });
  }

  try {
    const model = getGeminiModel();
    if (!model) throw new Error("Gemini AI not initialized on server.");

    const prompt = `
Create a detailed ${days}-day travel plan.

Source: ${source}
Destination: ${destination}

Return ONLY valid JSON.

For every activity include:

- time
- place (exact attraction name)
- address (full address)
- description
- duration
- optional (if applicable)

Example:

{
  "time":"9:00 AM",
  "place":"Amber Fort",
  "address":"Devisinghpura, Amer, Jaipur, Rajasthan",
  "description":"Explore the magnificent fort.",
  "duration":"2 hours",
  "optional":"Elephant ride"
}

{
  "places":[
    {
      "name":"",
      "type":"",
      "description":""
    }
  ],

  "hotels":[
    {
      "category":"",
      "suggestions":[]
    }
  ],

  "itinerary":[
    {
      "day":1,
      "theme":"",
      "activities":[
        {
          "time":"",
          "place":"",
          "address":"",
          "description":"",
          "duration":"",
          "optional":""
        }
      ]
    }
  ],

  "travelTips":[],
  "localFood":[]
}
`;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(text);

    return res.json(data);
  } catch (error) {
    console.warn("Server: generate-trip failed, client fallback recommended.", error.message);
    res.status(500).json({ error: "Gemini server failed: " + error.message });
  }
});

// 2. AI Travel Assistant
app.post("/api/ask-assistant", async (req, res) => {
  const { destination, question } = req.body;
  if (!destination || !question) {
    return res.status(400).json({ error: "destination and question required" });
  }

  try {
    const model = getGeminiModel();
    if (!model) throw new Error("Gemini AI not initialized on server.");

    const prompt = `
You are a professional travel guide.

Destination:
${destination}

Answer this travel question clearly.

Question:
${question}
`;

    const result = await model.generateContent(prompt);
    res.json({ reply: result.response.text() });
  } catch (error) {
    console.warn("Server: ask-assistant failed.", error.message);
    res.status(500).json({ error: "Gemini server failed: " + error.message });
  }
});

// 3. AI Budget Optimizer
app.post("/api/optimize-budget", async (req, res) => {
  const { destination, days, budget } = req.body;
  if (!destination || !days || !budget) {
    return res.status(400).json({ error: "destination, days, and budget required" });
  }

  try {
    const model = getGeminiModel();
    if (!model) throw new Error("Gemini AI not initialized on server.");

    const prompt = `
You are an expert travel budget planner.

Destination:
${destination}

Trip Length:
${days} days

Estimated Budget:
₹${budget}

Suggest:

1. Ways to reduce costs
2. Budget hotels
3. Affordable restaurants
4. Cheapest transport
5. Free attractions

Return ONLY JSON.

{
  "estimatedSavings":"",
  "tips":[]
}
`;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(text);
    res.json(data);
  } catch (error) {
    console.warn("Server: optimize-budget failed.", error.message);
    res.status(500).json({ error: "Gemini server failed: " + error.message });
  }
});

// 4. Generic Chat/Scout Bot
app.post("/api/ask-gemini", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "prompt required" });
  }

  try {
    const model = getGeminiModel();
    if (!model) throw new Error("Gemini AI not initialized on server.");

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    res.json({ reply: text });
  } catch (error) {
    console.warn("Server: ask-gemini failed.", error.message);
    res.status(500).json({ error: "Gemini server failed: " + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Secure Server API running on http://localhost:${PORT}`);
});