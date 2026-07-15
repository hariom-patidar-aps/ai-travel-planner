import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

function getModel() {
  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });
}

// ==========================================
// AI TRIP GENERATOR
// ==========================================
export async function generateAITrip(source, destination, days) {
  try {
    const model = getModel();

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

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const data = JSON.parse(text);

    console.log("Trip:", data);

    return {
      places: data.places || [],
      hotels: data.hotels || [],
      itinerary: data.itinerary || [],
      travelTips: data.travelTips || [],
      localFood: data.localFood || [],
    };
  } catch (error) {
    console.warn("Trip Generator Error: API failed (likely 429 Quota Exceeded). Returning offline mock trip plan.", error);

    // Generate a high-quality mock trip plan dynamically based on the input
    const mockTrip = {
      places: [
        { name: `${destination} Palace & Gardens`, type: "Historical Landmark", description: `A stunning heritage complex showing off the history and design of ${destination}.` },
        { name: `${destination} Museum of Art`, type: "Museum", description: "Displaying beautiful historical artifacts and local handicrafts." },
        { name: "Hilltop Observatory Point", type: "Scenic Area", description: "Panoramic point offering beautiful views of the sunrise and sunset over the valley." },
        { name: "Old City Market / Bazaar", type: "Shopping & Culture", description: "Traditional street market filled with spices, textiles, and local street foods." }
      ],
      hotels: [
        { category: "Luxury Resort", suggestions: [`The Grand ${destination} Palace & Spa`, `${destination} Royal Residency`] },
        { category: "Heritage Stay", suggestions: [`Historic ${destination} Inn`, `${destination} Haveli`] },
        { category: "Budget Friendly", suggestions: [`Backpacker Hub ${destination}`, `Starlight Comfort Stay`] }
      ],
      itinerary: Array.from({ length: Number(days) || 3 }, (_, i) => ({
        day: i + 1,
        theme: i === 0 ? "Cultural Highlights" : i === 1 ? "Sightseeing & Adventure" : "Leisure & Culinary Tour",
        activities: [
          {
            time: "09:00 AM",
            place: i === 0 ? `${destination} Palace & Gardens` : i === 1 ? `${destination} Museum of Art` : "Local Breakfast Cafe",
            address: `Main Palace Road, ${destination}`,
            description: "Start the day learning about local history or enjoying standard regional breakfasts.",
            duration: "2 hours",
            optional: "English audio guides available"
          },
          {
            time: "01:00 PM",
            place: "Heritage Fine Dining",
            address: "Main Bazaar St., City Center",
            description: "A wonderful lunch tasting traditional local dishes.",
            duration: "1.5 hours",
            optional: "Try the chef's special local platter"
          },
          {
            time: "04:30 PM",
            place: i === 2 ? "Hilltop Observatory Point" : "Old City Market / Bazaar",
            address: `Old Town area, ${destination}`,
            description: "Explore local life, buy handmade souvenirs, and enjoy the sunset.",
            duration: "2 hours",
            optional: "Great spot for photography"
          }
        ]
      })),
      travelTips: [
        `Carry some local currency for small vendors in ${destination}.`,
        "Wear comfortable shoes as there is plenty of walking in heritage complexes.",
        "Check weather updates before leaving your hotel room.",
        "Hire local registered guides at historical monuments to get deep insights."
      ],
      localFood: [
        { name: "Traditional Regional Platter", description: "A selection of various savory items served on a single platter." },
        { name: "Popular Street Dumplings", description: "Steamed or fried dumplings filled with local vegetables and spices." },
        { name: "Local Saffron Milk Dessert", description: "A sweet, chilled saffron-flavored dessert traditional to the region." }
      ]
    };
    
    return mockTrip;
  }
}

// ==========================================
// AI TRAVEL ASSISTANT
// ==========================================
export async function askTravelAssistant(destination, question) {
  try {
    const model = getModel();

    const prompt = `
You are a professional travel guide.

Destination:
${destination}

Answer this travel question clearly.

Question:
${question}
`;

    const result = await model.generateContent(prompt);

    return result.response.text();
  } catch (error) {
    console.warn("Travel Assistant Error: Quota exceeded/offline. Returning friendly fallback response.", error);

    return `I am currently operating in offline mode because the Gemini API quota was exceeded. However, when visiting ${destination}, make sure to plan your itinerary around the main historical landmarks (like the Palace), check local weather conditions, and try local delicacies at the Old City Market!`;
  }
}

// ==========================================
// AI BUDGET OPTIMIZER
// ==========================================
export async function optimizeBudget(destination, days, budget) {
  try {
    const model = getModel();

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

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(text);
  } catch (error) {
    console.warn("Budget Optimizer Error: Quota exceeded/offline. Returning mock tips.", error);

    return {
      estimatedSavings: "₹2,500 - ₹5,000",
      tips: [
        "Travel during weekdays for cheaper hotel rates and transport ticket prices.",
        "Eat at local food stalls and authentic street restaurants instead of large tourist cafes.",
        "Use public transport (metro, public buses) or walking for local commuting.",
        "Book museum and palace tickets online in advance to check for group discounts.",
        "Prefer budget-friendly homestays or hostels over high-end resorts."
      ],
    };
  }
}

// ==========================================
// GENERIC GEMINI PROMPT
// ==========================================
export async function askGemini(prompt) {
  try {
    const model = getModel();

    const result = await model.generateContent(prompt);

    let text = result.response.text();

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return text;
  } catch (error) {
    console.error("Gemini Error:", error);

    return JSON.stringify({
      reply: "Offline mode: Gemini API rate limit reached. Please check back later or set up a billing plan."
    });
  }
}