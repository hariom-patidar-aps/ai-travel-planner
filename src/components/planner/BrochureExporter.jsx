import { useRef, useState } from "react";
import html2canvas from "html2canvas";

export default function BrochureExporter({
  destination,
  days,
  itinerary = [],
  hotels = [],
  weather,
  tips = [],
}) {
  const brochureRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const handleExport = async () => {
    if (!brochureRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(brochureRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#0d1b2a",
      });
      
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `${destination.replace(/\s+/g, "_")}_Travel_Brochure.png`;
      link.click();
    } catch (e) {
      console.error("Brochure Export Error:", e);
      alert("Failed to export brochure.");
    }
    setDownloading(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 mt-8">
      <div className="w-full max-w-3xl overflow-x-auto pr-1">
        <div
          ref={brochureRef}
          className="w-[800px] p-10 text-slate-100 flex flex-col justify-between border-4 border-cyan-500/30 rounded-3xl"
          style={{
            background: "linear-gradient(135deg, #091a29 0%, #030e17 100%)",
            minHeight: "1100px",
          }}
        >
          {/* Magazine Cover Heading */}
          <div className="text-center border-b-2 border-cyan-500/20 pb-6 mb-8">
            <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">
              Exclusive Itinerary Catalogue
            </span>
            <h1 className="text-5xl font-extrabold tracking-tight mt-2 text-white font-serif uppercase">
              {destination}
            </h1>
            <p className="text-slate-400 text-xs tracking-wider mt-1 uppercase">
              A curated {days}-day venture plan
            </p>
          </div>

          {/* Core Grid */}
          <div className="grid grid-cols-2 gap-8 flex-1">
            
            {/* Column 1: Daily Timeline */}
            <div className="space-y-6 border-r border-slate-800 pr-6">
              <h3 className="text-lg font-bold text-cyan-300 uppercase tracking-widest font-serif border-b border-slate-800 pb-1">
                ✦ Daily Timeline
              </h3>
              
              {itinerary.slice(0, 3).map((dayObj) => (
                <div key={dayObj.day} className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-white">
                    <span>DAY {dayObj.day}</span>
                    <span className="text-cyan-400 font-normal italic">{dayObj.theme}</span>
                  </div>
                  <div className="space-y-2 pl-2 border-l-2 border-cyan-500/20">
                    {dayObj.activities.slice(0, 2).map((act, idx) => (
                      <div key={idx} className="text-[11px]">
                        <span className="text-slate-400 font-mono block">{act.time} — {act.place}</span>
                        <p className="text-slate-300 leading-normal mt-0.5">{act.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {itinerary.length > 3 && (
                <p className="text-[10px] text-slate-500 italic">
                  + {itinerary.length - 3} more days included in online plan.
                </p>
              )}
            </div>

            {/* Column 2: Lodging, Weather, Tips */}
            <div className="space-y-6">
              
              {/* Hotel Recommendations */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-cyan-300 uppercase tracking-widest font-serif border-b border-slate-800 pb-1">
                  ✦ Selected Lodging
                </h3>
                {hotels.slice(0, 2).map((group, idx) => (
                  <div key={idx} className="text-xs">
                    <span className="font-bold text-white block">{group.category}</span>
                    <span className="text-slate-300 text-[11px]">
                      {group.suggestions?.slice(0, 2).join(" • ")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Weather Info */}
              {weather && (
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-cyan-300 uppercase tracking-widest font-serif border-b border-slate-800 pb-1">
                    ✦ Weather Capsule
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                    <div>
                      <span className="text-slate-400 block text-[10px]">TEMP</span>
                      <strong className="text-white text-sm">{weather.tempC}°C</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">WIND</span>
                      <strong className="text-white text-sm">{weather.windKmh} kmh</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Travel Guidelines */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-cyan-300 uppercase tracking-widest font-serif border-b border-slate-800 pb-1">
                  ✦ Travel Guidelines
                </h3>
                <ul className="space-y-2 text-[11px] text-slate-300 list-disc pl-4 leading-relaxed">
                  {tips.slice(0, 4).map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>

            </div>

          </div>

          {/* Brochure Footer */}
          <div className="border-t border-slate-800 pt-6 mt-8 flex justify-between items-center text-[10px] text-slate-500 font-mono uppercase tracking-widest">
            <span>AI Travel Agency Catalog</span>
            <span>Generated securely offline</span>
          </div>

        </div>
      </div>

      <button
        onClick={handleExport}
        disabled={downloading}
        className="primary-btn px-8 py-3 text-sm font-semibold border-none flex items-center gap-2"
      >
        {downloading ? "📷 Snapping Brochure..." : "🖼️ Download Magazine Brochure (PNG)"}
      </button>
    </div>
  );
}
