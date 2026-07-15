import { useState } from "react";
import TripForm from "./components/planner/TripForm";
import BudgetSummary from "./components/planner/BudgetSummary";
import PlacesList from "./components/planner/PlacesList";
import HotelsList from "./components/planner/HotelsList";
import WeatherCard from "./components/planner/WeatherCard";
import TravelOptions from "./components/planner/TravelOptions";
import Itinerary from "./components/planner/Itinerary";
import SavedTrips from "./components/planner/SavedTrips";

import Navbar from "./components/Navbar";
import Features from "./components/Features";

import useTripPlanner from "./hooks/useTripPlanner";
import useSavedTrips from "./hooks/useSavedTrips";
import TravelTips from "./components/planner/TravelTips";
import LocalFood from "./components/planner/LocalFood";
import { downloadTripPDF } from "./services/pdfService";
import TravelAssistant from "./components/planner/TravelAssistant";
import BudgetOptimizer from "./components/planner/BudgetOptimizer";
import TripAnalytics from "./components/planner/TripAnalytics";
import AIChat from "./components/assistant/AIChat";
import MapView from "./components/map/MapView";
import Favorites from "./components/Favorites";
import TripRating from "./components/TripRating";
import ThemeToggle from "./components/ThemeToggle";
import ExpenseTracker from "./components/expense/ExpenseTracker";
import PackingList from "./components/packing/PackingList";
import FeatureNav from "./components/FeatureNav";
import TravelBot from "./components/assistant/TravelBot";
import TravelScrapbook from "./components/gallery/TravelScrapbook";
import BrochureExporter from "./components/planner/BrochureExporter";

export default function App() {
  const [activeSection, setActiveSection] = useState("planner");
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);

  const {
    savedTrips,
    saveTrip,
    deleteTrip,
  } = useSavedTrips();

  const {
    form,
    setForm,
    plan,
    weather,
    travelOptions,
    loading,
    handlePlanTrip,
    openRouteMap,
    nights,
    travelCost,
    travelTime,
    estimatedBudget,
    totalDistanceKm,
    destinationCoordinates,
  } = useTripPlanner(saveTrip);

  const [expenses, setExpenses] = useState([]);
  
  const downloadPDF = () => {
    downloadTripPDF({
      form,
      plan,
      weather,
      nights,
      travelCost,
      travelTime,
      estimatedBudget,
      totalDistanceKm,
      expenses,
    });
  };

  const scrollToPlanner = () => {
    setActiveSection("planner");
    setTimeout(() => {
      document
        .getElementById("planner")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 100);
  };

  const hasPlan = plan?.itinerary && plan.itinerary.length > 0;
  const hasWeather = !!weather;

  const renderFallback = (featureName, emoji = "🗺️") => (
    <div className="glass p-12 text-center max-w-2xl mx-auto my-8 animate-fade-in">
      <div className="text-6xl mb-4">{emoji}</div>
      <h3 className="text-2xl text-cyan-300 mb-3 font-semibold">
        No {featureName} Available
      </h3>
      <p className="text-slate-200 mb-6 max-w-md mx-auto">
        Please enter your trip details in the Planner and click "Plan Trip" to generate your personalized {featureName.toLowerCase()}.
      </p>
      <button
        onClick={() => {
          setActiveSection("planner");
          document.getElementById("planner")?.scrollIntoView({ behavior: "smooth" });
        }}
        className="primary-btn text-white text-sm px-6 py-3 border-none"
      >
        Go to Planner 🚀
      </button>
    </div>
  );

  return (
    <main className="min-h-screen relative overflow-hidden">
       <ThemeToggle />

      <Navbar />

      {/* Animated Background */}

      <div className="airplane">✈️</div>

      <div
        className="cloud"
        style={{ top: "10%", left: "5%" }}
      ></div>

      <div
        className="cloud"
        style={{
          top: "25%",
          left: "60%",
          animationDelay: "10s",
        }}
      ></div>

      <div
        className="cloud"
        style={{
          top: "70%",
          left: "20%",
          animationDelay: "20s",
        }}
      ></div>

      <div className="star" style={{ top: "15%", left: "10%" }}></div>
      <div className="star" style={{ top: "22%", left: "75%" }}></div>
      <div className="star" style={{ top: "62%", left: "40%" }}></div>
      <div className="star" style={{ top: "80%", left: "90%" }}></div>

      <div className="max-w-7xl mx-auto px-5 pt-28 pb-10">

        {/* HERO */}

        <section className="glass p-10 md:p-16 text-center mb-12">

          <p className="uppercase tracking-[0.3em] text-cyan-300 font-semibold">
            AI Powered Travel Planning
          </p>

          <h1 className="heading mt-5">
            <span className="gradient-text">
              Plan Smarter.
            </span>

            <br />

            Travel Better.
          </h1>

          <p className="mt-6 text-lg text-slate-200 max-w-3xl mx-auto">
            Build intelligent itineraries with AI, compare travel
            options, estimate budgets, discover hotels and
            explore destinations in seconds.
          </p>

          <div className="flex flex-wrap justify-center gap-5 mt-8">

            <button
              onClick={scrollToPlanner}
              className="primary-btn"
            >
              🚀 Start Planning
            </button>

            <button
              onClick={openRouteMap}
              className="secondary-btn"
            >
              🗺 Open Route
            </button>

          </div>

        </section>

        {/* Statistics */}

        <section className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">

          <div className="glass card p-6 text-center">
            <h2 className="text-3xl font-bold text-cyan-300">
              🤖
            </h2>

            <p className="mt-2">
              AI Planning
            </p>
          </div>

          <div className="glass card p-6 text-center">
            <h2 className="text-3xl font-bold text-cyan-300">
              🌍
            </h2>

            <p className="mt-2">
              Multi-City Trips
            </p>
          </div>

          <div className="glass card p-6 text-center">
            <h2 className="text-3xl font-bold text-cyan-300">
              💰
            </h2>

            <p className="mt-2">
              Budget Estimator
            </p>
          </div>

          <div className="glass card p-6 text-center">
            <h2 className="text-3xl font-bold text-cyan-300">
              🌦
            </h2>

            <p className="mt-2">
              Live Weather
            </p>
          </div>

        </section>

        <TravelBot setForm={setForm} scrollToPlanner={scrollToPlanner} />

        <Features />
        <FeatureNav activeSection={activeSection} setActiveSection={setActiveSection} />

        {/* Planner */}

       <section
  id="planner"
  className="space-y-8"
>

  {/* Planner Tab */}
  {activeSection === "planner" && (
    <>
      <TripForm
        form={form}
        setForm={setForm}
        onPlan={handlePlanTrip}
        onOpenMap={openRouteMap}
        loading={loading}
      />
      {travelOptions && travelOptions.length > 0 && (
        <TravelOptions
          options={travelOptions}
          loading={loading}
        />
      )}
      {hasPlan && (
        <>
          <TripRating
            destination={form.destination}
          />
          <TravelAssistant
            destination={form.destination}
          />
        </>
      )}
    </>
  )}

  {/* Budget Tab */}
  {activeSection === "budget" && (
    hasPlan ? (
      <>
        <section id="budget">
          <BudgetSummary
            nights={nights}
            travelCost={travelCost}
            travelTime={travelTime}
            estimatedBudget={estimatedBudget}
            totalDistanceKm={totalDistanceKm}
          />
        </section>

        <BudgetOptimizer
          destination={form.destination}
          days={form.days}
          budget={estimatedBudget}
        />

        <div className="flex justify-center">
          <button
            onClick={downloadPDF}
            className="primary-btn"
          >
            📄 Download Trip PDF
          </button>
        </div>
      </>
    ) : (
      renderFallback("Budget Details", "💰")
    )
  )}

  {/* Weather Tab */}
  {activeSection === "weather" && (
    hasWeather ? (
      <section id="weather">
        <WeatherCard weather={weather} />
      </section>
    ) : (
      renderFallback("Weather Information", "🌦")
    )
  )}

  {/* Packing Tab */}
  {activeSection === "packing" && (
    hasWeather ? (
      <section id="packing">
        <PackingList
          destination={form.destination}
          days={form.days}
          weather={weather}
        />
      </section>
    ) : (
      renderFallback("Packing Checklist", "🎒")
    )
  )}

  {/* Itinerary Tab */}
  {activeSection === "itinerary" && (
    hasPlan ? (
      <section id="itinerary" className="space-y-8">
        <Itinerary
          itinerary={plan?.itinerary ?? []}
        />
        <BrochureExporter
          destination={form.destination}
          days={form.days}
          itinerary={plan?.itinerary ?? []}
          hotels={plan?.hotels ?? []}
          weather={weather}
          tips={plan?.travelTips ?? []}
        />
      </section>
    ) : (
      renderFallback("Trip Itinerary", "📅")
    )
  )}

  {/* Expense Tab */}
  {activeSection === "expense" && (
    hasPlan ? (
      <section id="expense">
        <ExpenseTracker
          destination={form.destination}
          budget={estimatedBudget}
          expenses={expenses}
          setExpenses={setExpenses}
        />
      </section>
    ) : (
      renderFallback("Expense Splitter", "💸")
    )
  )}

  {/* Scrapbook Tab */}
  {activeSection === "scrapbook" && (
    hasPlan ? (
      <section id="scrapbook">
        <TravelScrapbook
          destination={form.destination}
          itinerary={plan?.itinerary ?? []}
        />
      </section>
    ) : (
      renderFallback("Memory Scrapbook", "📸")
    )
  )}

  {/* Map Tab */}
  {activeSection === "map" && (
    destinationCoordinates ? (
      <section id="map">
        <MapView
          destination={form.destination}
          coordinates={destinationCoordinates}
          places={plan?.places ?? []}
          hotels={plan?.hotels ?? []}
          itinerary={plan?.itinerary ?? []}
        />
      </section>
    ) : (
      renderFallback("Interactive Route Map", "🗺")
    )
  )}

  {/* Assistant Tab */}
  {activeSection === "assistant" && (
    <section id="assistant">
      <AIChat
        destination={form.destination}
      />
    </section>
  )}

  {/* Tips Tab */}
  {activeSection === "tips" && (
    hasPlan ? (
      <section id="tips">
        <TravelTips
          tips={plan?.travelTips ?? []}
        />
      </section>
    ) : (
      renderFallback("Travel Tips", "💡")
    )
  )}

  {/* Food Tab */}
  {activeSection === "food" && (
    hasPlan ? (
      <section id="food">
        <LocalFood
          foods={plan?.localFood ?? []}
        />
      </section>
    ) : (
      renderFallback("Food Recommendations", "🍜")
    )
  )}

  {/* Analytics Tab */}
  {activeSection === "analytics" && (
    <section id="analytics">
      <TripAnalytics
        trips={savedTrips}
      />
    </section>
  )}

  {/* Trips Tab */}
  {activeSection === "saved" && (
    <section id="saved">
      <SavedTrips
        trips={savedTrips}
        onDelete={deleteTrip}
      />
    </section>
  )}

  {/* Places Tab */}
  {activeSection === "places" && (
    hasPlan ? (
      <section id="places">
        <PlacesList
          places={plan?.places ?? []}
        />
      </section>
    ) : (
      renderFallback("Tourist Places", "📍")
    )
  )}

  {/* Hotels Tab */}
  {activeSection === "hotels" && (
    hasPlan ? (
      <section id="hotels">
        <HotelsList
          hotels={plan?.hotels ?? []}
        />
      </section>
    ) : (
      renderFallback("Hotel Options", "🏨")
    )
  )}

  {/* Favorites Tab */}
  {activeSection === "favorites" && (
    <section id="favorites">
      <Favorites />
    </section>
  )}

</section>
        {/* How it Works */}

        <section className="mt-20">

          <h2 className="text-4xl font-bold text-center mb-10">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-6">

            <div className="glass card p-6 text-center">
              <h3 className="text-5xl mb-4">📝</h3>

              <h4 className="font-bold">
                Enter Details
              </h4>

              <p className="mt-3 text-slate-300">
                Select source, destination and travel mode.
              </p>

            </div>

            <div className="glass card p-6 text-center">

              <h3 className="text-5xl mb-4">🤖</h3>

              <h4 className="font-bold">
                AI Generates Plan
              </h4>

              <p className="mt-3 text-slate-300">
                Instant itinerary with attractions and hotels.
              </p>

            </div>

            <div className="glass card p-6 text-center">

              <h3 className="text-5xl mb-4">💰</h3>

              <h4 className="font-bold">
                Budget Estimation
              </h4>

              <p className="mt-3 text-slate-300">
                Calculate transport and travel expenses.
              </p>

            </div>

            <div className="glass card p-6 text-center">

              <h3 className="text-5xl mb-4">✈️</h3>

              <h4 className="font-bold">
                Enjoy Your Trip
              </h4>

              <p className="mt-3 text-slate-300">
                Save the itinerary and start exploring.
              </p>

            </div>

          </div>

        </section>

      </div>

      {/* Floating AI Voice Assistant Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {showVoiceAssistant && (
          <div className="w-80 md:w-96 shadow-2xl mb-4 rounded-3xl overflow-hidden glass border border-slate-700/50 flex flex-col transition-all duration-300">
            <div className="bg-slate-800/80 p-4 border-b border-slate-700/50 flex justify-between items-center">
              <h3 className="font-semibold text-white flex items-center gap-2">
                🎙️ Voice Travel Assistant
              </h3>
              <button 
                onClick={() => setShowVoiceAssistant(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            <div className="p-5 bg-slate-900/60 max-h-[420px] overflow-y-auto">
              <AIChat destination={form.destination} compact={true} />
            </div>
          </div>
        )}
        
        <button
          onClick={() => setShowVoiceAssistant(!showVoiceAssistant)}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 ${
            showVoiceAssistant 
              ? "bg-red-500 hover:bg-red-600 scale-95" 
              : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-110 active:scale-95"
          }`}
          title="Voice Assistant"
        >
          {showVoiceAssistant ? (
            <span className="text-xl">✕</span>
          ) : (
            <span className="text-2xl animate-pulse">🎙️</span>
          )}
        </button>
      </div>

    </main>
  );
}