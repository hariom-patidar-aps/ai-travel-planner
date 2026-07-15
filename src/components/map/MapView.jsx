import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";

import { useEffect, useState } from "react";
import L from "leaflet";

import { getCoordinates } from "../../services/mapService";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f97316",
  "#a855f7",
  "#ef4444",
  "#06b6d4",
];

export default function MapView({
  destination,
  coordinates,
  places = [],
  hotels = [],
  itinerary = [],
}) {
  const [markers, setMarkers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [manualOffline, setManualOffline] = useState(false);
  const [hoveredMarker, setHoveredMarker] = useState(null);

  // Stringify complex arrays so useEffect compares values rather than array references.
  const placesStr = JSON.stringify(places);
  const hotelsStr = JSON.stringify(hotels);
  const itineraryStr = JSON.stringify(itinerary);

  useEffect(() => {
    // Event listeners to detect connection changes
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        // 1. Fetch places in parallel
        const placesPromises = (places || []).map(async (place) => {
          const coord = await getCoordinates(place.name, destination, place.address);
          if (coord && active) {
            return {
              ...coord,
              title: place.name,
              description: place.description,
              icon: "📍",
              type: "Place"
            };
          }
          return null;
        });

        // 2. Fetch hotels in parallel
        const hotelsPromises = [];
        (hotels || []).forEach((hotelGroup) => {
          (hotelGroup.suggestions || []).forEach((hotel) => {
            hotelsPromises.push((async () => {
              const coord = await getCoordinates(hotel, destination);
              if (coord && active) {
                return {
                  ...coord,
                  title: hotel,
                  description: hotelGroup.category,
                  icon: "🏨",
                  type: "Hotel"
                };
              }
              return null;
            })());
          });
        });

        // 3. Resolve markers in parallel
        const [resolvedPlaces, resolvedHotels] = await Promise.all([
          Promise.all(placesPromises),
          Promise.all(hotelsPromises)
        ]);
        
        const markerList = [...resolvedPlaces, ...resolvedHotels].filter(Boolean);

        // 4. Resolve Day-wise routes in parallel
        const dayRoutesPromises = (itinerary || []).map(async (dayItinerary, index) => {
          const activityCoordsPromises = (dayItinerary.activities || []).map(async (activity) => {
            const coord = await getCoordinates(activity.place, destination, activity.address);
            return coord ? [coord.lat, coord.lon] : null;
          });
          const resolvedCoords = await Promise.all(activityCoordsPromises);
          const points = resolvedCoords.filter(Boolean);
          
          if (points.length > 1) {
            return {
              day: index + 1,
              color: COLORS[index % COLORS.length],
              points,
            };
          }
          return null;
        });

        const routeList = (await Promise.all(dayRoutesPromises)).filter(Boolean);

        if (active) {
          setMarkers(markerList);
          setRoutes(routeList);
        }
      } catch (err) {
        console.error("MapView geocoding load error:", err);
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [destination, coordinates, placesStr, hotelsStr, itineraryStr]);

  if (!coordinates) return null;

  // Check if we are running in offline mode (either system offline or manual toggle active)
  const useOfflineMode = !isOnline || manualOffline;

  // SVG coordinate projection logic for offline mode
  const getSvgCoords = (lat, lon) => {
    const lats = markers.map(m => m.lat);
    const lons = markers.map(m => m.lon);
    
    lats.push(coordinates.lat);
    lons.push(coordinates.lon);
    
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    
    const latRange = maxLat - minLat || 0.01;
    const lonRange = maxLon - minLon || 0.01;
    
    const padding = 70;
    const width = 800;
    const height = 500;
    
    const x = padding + ((lon - minLon) / lonRange) * (width - 2 * padding);
    const y = height - (padding + ((lat - minLat) / latRange) * (height - 2 * padding));
    
    return { x: Math.round(x), y: Math.round(y) };
  };

  // Pre-calculate SVG coordinates for start/destination
  const destSvg = getSvgCoords(coordinates.lat, coordinates.lon);

  return (
    <div className="glass rounded-3xl p-6 mt-8">
      {/* Header with Connection Toggles */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            🗺️ Travel Map
            {useOfflineMode ? (
              <span className="text-xs bg-red-500/20 text-red-300 border border-red-500/30 px-3 py-1 rounded-full flex items-center gap-1 font-semibold uppercase tracking-wider">
                ● Offline Mode
              </span>
            ) : (
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1 font-semibold uppercase tracking-wider">
                ● Live Map
              </span>
            )}
          </h2>
          <p className="text-slate-300 text-sm mt-1">
            {useOfflineMode 
              ? "Rendering stylized schematic map blueprint (no internet connection required)."
              : "Showing interactive GPS satellite map route planner."
            }
          </p>
        </div>

        {/* Live/Offline Toggle */}
        <button
          onClick={() => setManualOffline(!manualOffline)}
          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-300 ${
            useOfflineMode
              ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20"
              : "bg-slate-800 text-slate-300 border-slate-700 hover:text-white"
          }`}
        >
          {useOfflineMode ? "📡 Switch to Live Map" : "📴 Test Offline Mode"}
        </button>
      </div>

      {/* Map Views Container */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-950/20">
        
        {useOfflineMode ? (
          /* ====================================================
             OFFLINE SCHEMATIC MAP (SVG)
             ==================================================== */
          <div className="relative" style={{ height: "550px" }}>
            <svg 
              viewBox="0 0 800 500" 
              className="w-full h-full text-slate-600"
              style={{ background: "#091d30" }}
            >
              {/* Blueprint Grid Lines */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
                </pattern>
                <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Destination City Glow Circle */}
              <circle cx={destSvg.x} cy={destSvg.y} r="80" fill="url(#glow)" />

              {/* Route lines */}
              {routes.map((route, rIdx) => {
                const points = route.points.map(pt => {
                  const svgPt = getSvgCoords(pt[0], pt[1]);
                  return `${svgPt.x},${svgPt.y}`;
                }).join(" ");
                
                return (
                  <polyline
                    key={rIdx}
                    points={points}
                    fill="none"
                    stroke={route.color}
                    strokeWidth="3"
                    strokeDasharray="6,6"
                  />
                );
              })}

              {/* Destination marker (Center point) */}
              <g 
                className="cursor-pointer"
                onMouseEnter={() => setHoveredMarker({
                  title: destination,
                  type: "Destination City",
                  description: "Center point of your planned trip."
                })}
                onMouseLeave={() => setHoveredMarker(null)}
              >
                <circle cx={destSvg.x} cy={destSvg.y} r="10" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" />
                <circle cx={destSvg.x} cy={destSvg.y} r="16" fill="none" stroke="#06b6d4" strokeWidth="1.5" className="animate-ping opacity-60" />
                <text x={destSvg.x} y={destSvg.y - 18} fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                  🏢 {destination}
                </text>
              </g>

              {/* Other markers (Sights and Hotels) */}
              {markers.map((m, idx) => {
                const coords = getSvgCoords(m.lat, m.lon);
                const isHotel = m.icon === "🏨";
                return (
                  <g 
                    key={idx}
                    className="cursor-pointer hover:scale-110 transition-transform duration-200"
                    onMouseEnter={() => setHoveredMarker(m)}
                    onMouseLeave={() => setHoveredMarker(null)}
                  >
                    <circle 
                      cx={coords.x} 
                      cy={coords.y} 
                      r="7" 
                      fill={isHotel ? "#ef4444" : "#eab308"} 
                      stroke="#ffffff" 
                      strokeWidth="1.5" 
                    />
                    <text x={coords.x} y={coords.y - 12} fill="#94a3b8" fontSize="10" textAnchor="middle">
                      {m.icon}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Offline Tooltip display */}
            {hoveredMarker ? (
              <div className="absolute top-6 left-6 max-w-sm glass p-4 border border-cyan-500/20 bg-slate-900/90 shadow-2xl rounded-2xl animate-fade-in pointer-events-none">
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300 block mb-1">
                  {hoveredMarker.icon ? `${hoveredMarker.icon} ${hoveredMarker.type}` : `🏢 ${hoveredMarker.type}`}
                </span>
                <h4 className="text-md font-bold text-white leading-tight mb-1">{hoveredMarker.title}</h4>
                <p className="text-xs text-slate-300 leading-normal">{hoveredMarker.description}</p>
                {hoveredMarker.lat && (
                  <p className="text-[10px] font-mono text-slate-500 mt-2">
                    Lat: {hoveredMarker.lat.toFixed(4)}, Lon: {hoveredMarker.lon.toFixed(4)}
                  </p>
                )}
              </div>
            ) : (
              <div className="absolute top-6 left-6 glass px-4 py-2 border border-slate-700/50 bg-slate-900/60 text-slate-300 text-xs pointer-events-none">
                🛈 Hover over any marker (🏨/📍) to view place details.
              </div>
            )}

            {/* Offline Legend */}
            <div className="absolute bottom-6 left-6 glass p-4 border border-slate-700/50 bg-slate-900/80 flex flex-col gap-2 text-xs">
              <p className="font-semibold text-white mb-1">Schematic Legend</p>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-cyan-400 border border-white" />
                <span>🏢 Destination Center</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-yellow-500 border border-white" />
                <span>📍 Tourist Attraction</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-red-500 border border-white" />
                <span>🏨 Recommended Hotel</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-6 h-0.5 border-t border-dashed border-cyan-400" />
                <span>--- Day Itinerary Path</span>
              </div>
            </div>

            {/* Offline Notification Badge */}
            <div className="absolute bottom-6 right-6 glass px-4 py-2.5 border border-red-500/20 bg-red-950/20 text-red-300 text-xs flex items-center gap-2">
              <span className="animate-pulse">📴</span>
              <span>Internet disconnected or Offline Mode forced.</span>
            </div>
          </div>
        ) : (
          /* ====================================================
             LIVE GPS MAP (LEAFLET)
             ==================================================== */
          <MapContainer
            center={[coordinates.lat, coordinates.lon]}
            zoom={12}
            style={{
              height: "550px",
              borderRadius: "0px",
            }}
          >
            <TileLayer
              attribution="© OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Destination Center Marker */}
            <Marker
              position={[coordinates.lat, coordinates.lon]}
            >
              <Popup>
                <strong>🏢 {destination} (Center)</strong>
              </Popup>
            </Marker>

            {/* Attractions and Hotels Markers */}
            {markers.map((m, i) => (
              <Marker
                key={i}
                position={[m.lat, m.lon]}
              >
                <Popup>
                  <h3 className="font-bold text-slate-800 text-sm">
                    {m.icon} {m.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">{m.description}</p>
                </Popup>
              </Marker>
            ))}

            {/* Day-wise Routes Polylines */}
            {routes.map((route) => (
              <Polyline
                key={route.day}
                positions={route.points}
                pathOptions={{
                  color: route.color,
                  weight: 6,
                }}
              />
            ))}
          </MapContainer>
        )}
      </div>

      {/* Map Routes Legend */}
      {routes.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-6">
          {routes.map((route) => (
            <div
              key={route.day}
              className="flex items-center gap-2"
            >
              <div
                style={{
                  background: route.color,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                }}
              />
              <span className="text-white text-sm">
                Day {route.day} Path
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}