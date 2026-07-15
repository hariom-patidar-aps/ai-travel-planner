import { askGemini } from "./geminiService";

/*
==================================
Generate AI Packing List
==================================
*/

export async function generatePackingList({
  destination,
  days,
  weather,
}) {

  const prompt = `

You are a travel expert.

Generate a packing checklist.

Destination:
${destination}

Trip Length:
${days} days

Weather:
${weather?.tempC ?? "Unknown"}°C

Return ONLY a JSON array.

Example:

[
  {
    "item":"Passport",
    "category":"Documents"
  },
  {
    "item":"T-Shirts",
    "category":"Clothing"
  }
]

Categories can be:

Documents
Clothing
Electronics
Health
Accessories
Toiletries
Miscellaneous

`;

  const response = await askGemini(prompt);

  return JSON.parse(response);
}