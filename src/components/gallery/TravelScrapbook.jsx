import { useEffect, useState } from "react";
import { getPlaceGallery } from "../../services/wikimediaService";

export default function TravelScrapbook({ destination, itinerary = [] }) {
  const [journals, setJournals] = useState(() => {
    const cached = localStorage.getItem(`scrapbook_journals_${destination}`);
    return cached ? JSON.parse(cached) : {};
  });

  const [polaroids, setPolaroids] = useState({});
  const [loading, setLoading] = useState(false);

  // Sync journals to local storage
  const handleJournalChange = (dayNum, text) => {
    const newJournals = { ...journals, [dayNum]: text };
    setJournals(newJournals);
    localStorage.setItem(`scrapbook_journals_${destination}`, JSON.stringify(newJournals));
  };

  // Load photos for each day based on their itinerary activities
  useEffect(() => {
    if (!itinerary.length) return;

    async function loadScrapbookPhotos() {
      setLoading(true);
      const photoMap = {};

      const promises = itinerary.map(async (dayObj) => {
        const activityPlace = dayObj.activities?.[0]?.place;
        if (!activityPlace) return;

        try {
          const imgs = await getPlaceGallery(activityPlace);
          if (imgs && imgs.length > 0) {
            photoMap[dayObj.day] = imgs[0]; // Take the first image
          } else {
            const cityImgs = await getPlaceGallery(destination);
            if (cityImgs && cityImgs.length > 0) {
              photoMap[dayObj.day] = cityImgs[dayObj.day % cityImgs.length];
            } else {
              photoMap[dayObj.day] = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop";
            }
          }
        } catch (e) {
          console.warn("Wikimedia Scrapbook Fetch Error:", e);
          photoMap[dayObj.day] = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop";
        }
      });

      await Promise.all(promises);
      setPolaroids(photoMap);
      setLoading(false);
    }

    loadScrapbookPhotos();
  }, [itinerary, destination]);

  if (!itinerary.length) {
    return (
      <div className="glass rounded-3xl p-8 text-center text-slate-300">
        Generate a trip to start creating your memory scrapbook!
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-6 border border-slate-700/35">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white flex items-center gap-2">
          📸 Memory Scrapbook
        </h2>
        <p className="text-slate-300 text-sm mt-1">
          Write daily diary notes and view live Polaroid snapshot memories from your trip.
        </p>
      </div>

      {loading ? (
        <p className="text-slate-400 text-center py-12">Developing polaroid snaps...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {itinerary.map((dayObj, index) => {
            const tilts = ["-rotate-2", "rotate-3", "-rotate-1", "rotate-2", "-rotate-3"];
            const tilt = tilts[index % tilts.length];
            const imageUrl = polaroids[dayObj.day] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop";

            return (
              <div 
                key={dayObj.day} 
                className={`bg-white text-slate-800 p-4 pb-6 rounded-sm shadow-xl max-w-[280px] w-full transition-transform duration-300 hover:scale-105 hover:rotate-0 z-10 hover:z-20 ${tilt}`}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {/* Polaroid Frame Image */}
                <div className="bg-slate-250 aspect-[4/3] w-full overflow-hidden border border-slate-300 relative shadow-inner">
                  <img 
                    src={imageUrl} 
                    alt={`Day ${dayObj.day}`}
                    className="w-full h-full object-cover grayscale-[15%] sepia-[10%]"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Day {dayObj.day}
                  </div>
                </div>

                {/* Day Theme */}
                <h4 className="text-xs font-bold text-cyan-700 uppercase tracking-wider mt-3 truncate">
                  {dayObj.theme || "Sightseeing & Exploration"}
                </h4>

                {/* Journal text box */}
                <div className="mt-3">
                  <textarea
                    rows="3"
                    value={journals[dayObj.day] || ""}
                    onChange={(e) => handleJournalChange(dayObj.day, e.target.value)}
                    placeholder="Write a memory for this day... (e.g. Visited the markets!)"
                    className="w-full p-2 text-xs bg-cyan-50/50 text-slate-800 placeholder-slate-400 border border-slate-200 rounded outline-none resize-none focus:border-cyan-400 focus:bg-cyan-50/80 transition italic"
                    style={{ fontStyle: "italic", lineHeight: "1.4" }}
                  />
                </div>

                <div className="mt-3 text-center text-[9px] text-slate-400 font-mono tracking-widest uppercase">
                  {destination} memories
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
