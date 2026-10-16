🌍 AI Travel Planner — Intelligent Full-Stack Travel Companion

React
Vite
Tailwind CSS
Google Gemini
Node.js
Firebase
Leaflet
License: MIT

An end-to-end AI-powered travel planning web application that synthesizes custom multi-day itineraries, optimizes budgets, visualizes interactive geospatial maps, tracks expenses, and provides hands-free voice assistance.

📌 Overview

Planning trips often requires juggling 5 to 10 different tabs—searching flights, calculating daily budgets, looking up weather forecasts, pinning attractions on maps, and compiling packing checklists. AI Travel Planner unifies this entire workflow into a single, intuitive platform powered by Google Gemini 2.5 Flash and real-time open-source APIs.

By combining an Express API Gateway with client-side reactive components, the application delivers personalized day-by-day itineraries with recommended accommodations, cultural tips, and regional food suggestions in under 3 seconds. It features robust fault tolerance with dynamic offline mock fallbacks, client-side vector PDF generation for offline access, and real-time cloud synchronization via Firebase.

🚀 Key Features
🧠 AI-Powered Itinerary Generator: Generates day-wise travel plans with precise time slots, addresses, durations, and activity descriptions using Google Gemini 2.5 Flash.
🛡️ Fault-Tolerant Fallback Engine: Features an intelligent offline mock generator that seamlessly catches HTTP 429 quota limits or network outages, guaranteeing zero user downtime.
🗺️ Interactive Leaflet GIS Mapping: Renders destination hotspots and hotel markers with a 4-tier geocoding architecture (cache, landmark dictionary, deterministic offset, Nominatim fallback).
🎙️ Hands-Free Voice Assistant: Leverages the native browser Web Speech API (SpeechRecognition) for conversational travel queries without external paid SDKs.
📄 Offline PDF Brochure Export: Compiles vector PDF itineraries, weather metrics, hotel recommendations, and expense logs using client-side jsPDF.
💸 Real-Time Expense Splitter & Budget Tracker: Dynamically aggregates costs across categories, tracking remaining balance against estimated budgets.
🌦️ Zero-Cost Weather & Photos: Integrates the Open-Meteo API for real-time forecasts and Wikimedia Commons for open-license tourist attraction photography.
🔒 Express API Gateway: Hides sensitive Gemini and SerpAPI keys inside server environment variables, sanitizing inputs and preventing prompt injection.
☁️ Firebase Cloud Synchronization: Manages user authentication and persists saved trips, favorite destinations, and packing lists across devices with Cloud Firestore.
🏗️ System Architecture
🛠️ Tech Stack
Domain	Technologies Used
Frontend Core	React 19 (v19.1.0), Vite 5 (v5.4.2), React DOM
Styling & UI	Tailwind CSS (v3.4.14), PostCSS, Autoprefixer, Glassmorphism
AI & LLM	Google Generative AI SDK (@google/generative-ai v0.24.1), Gemini 2.5 Flash
Backend Gateway	Node.js, Express (v4.22.2), CORS (v2.8.6), Dotenv (v17.4.2)
Database & Auth	Google Firebase (v12.15.0) — Firebase Auth & Cloud Firestore
Geospatial & Mapping	Leaflet (v1.9.4), React-Leaflet (v5.0.0), OpenStreetMap, Nominatim
Hardware & Export	Web Speech API (webkitSpeechRecognition), jsPDF (v4.2.1)
External APIs	SerpAPI (Google Flights/Search), Open-Meteo API, Wikimedia Commons API
⚡ Getting Started Locally
Prerequisites
Node.js (v18.0.0 or higher recommended)
npm or yarn
1. Clone the Repository
bash
git clone https://github.com/hariom-patidar-aps/ai-travel-planner.git
cd ai-travel-planner
2. Install Dependencies
bash
npm install
3. Configure Environment Variables

Copy .env.example to create your local .env file:

bash
cp .env.example .env

Open .env and fill in your API keys:

env
# Backend API Keys
PORT=8787
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
SERPAPI_KEY=your_serpapi_key_here
# Frontend Configuration
VITE_API_URL=http://localhost:8787
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

💡 Note: You can get a free Gemini API key from Google AI Studio
.

4. Run the Application

In your first terminal, start the Express Backend Gateway:

bash
npm run server

(Server will start on http://localhost:8787)

In a second terminal, start the Vite Frontend:

bash
npm run dev

(Frontend will be live at http://localhost:5173)

🌐 Live Deployment Guide
Option A: Deploy Frontend on Vercel (Free)
Fork or push this repository to your GitHub account.
Go to Vercel
 and click Add New Project 
→
→ Import your repository.
Framework Preset: Vite.
In Environment Variables, add:
VITE_API_URL = Your deployed backend URL (or leave blank if using client fallback).
VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, etc.
Click Deploy!
Option B: Deploy Backend on Render (Free)
Go to Render
 and click New + 
→
→ Web Service.
Connect your GitHub repository.
Set:
Runtime: Node
Build Command: npm install
Start Command: node server.js
Add your Environment Variables:
GEMINI_API_KEY
SERPAPI_KEY
PORT = 8787
Click Deploy Web Service and copy your live Render URL into your Vercel VITE_API_URL!
📡 Backend API Reference
Method	Endpoint	Description
GET	/api/health	Health check verifying process liveness & API key configurations
GET	/api/travel-options	Fetches real-time flight fares and train ticket search options via SerpAPI
POST	/api/generate-trip	Generates structured day-wise itinerary JSON via Gemini 2.5 Flash
POST	/api/ask-assistant	Handles conversational travel guide Q&A for the destination
POST	/api/optimize-budget	Analyzes budget constraints and returns actionable cost-saving tips
POST	/api/ask-gemini	General-purpose prompt proxy for travel queries
🤝 Contributing

Contributions, issues, and feature requests are welcome!

Fork the Project
Create your Feature Branch (git checkout -b feature/AmazingFeature)
Commit your Changes (git commit -m 'Add some AmazingFeature')
Push to the Branch (git push origin feature/AmazingFeature)
Open a Pull Request
📄 License

Distributed under the MIT License. See LICENSE for more information.

👨‍💻 Author

Hariom Patidar

GitHub: @hariom-patidar-aps
Project Link: https://github.com/hariom-patidar-aps/ai-travel-planne
