import { useState } from "react";
import Card from "../common/Card";

const ROOM_PRICES = {
  standard: { label: "Standard Room (₹2,500/night)", price: 2500 },
  deluxe: { label: "Deluxe Suite (₹4,500/night)", price: 4500 },
  suite: { label: "Presidential Suite (₹8,500/night)", price: 8500 }
};

export default function HotelsList({ hotels = [] }) {
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    guestName: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    roomType: "standard"
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

  const handleOpenBooking = (hotelName) => {
    setSelectedHotel(hotelName);
    setBookingSuccess(false);
    setBookingRef("");
    // set default checkin/checkout dates to tomorrow and day after
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    
    setBookingForm({
      guestName: "",
      checkIn: tomorrow.toISOString().split("T")[0],
      checkOut: dayAfter.toISOString().split("T")[0],
      guests: 1,
      roomType: "standard"
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({ ...prev, [name]: value }));
  };

  const calculateNights = () => {
    const start = new Date(bookingForm.checkIn);
    const end = new Date(bookingForm.checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const pricePerNight = ROOM_PRICES[bookingForm.roomType].price;
    return pricePerNight * nights;
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!bookingForm.guestName.trim()) {
      alert("Please enter guest name.");
      return;
    }
    const randRef = "BK-" + Math.floor(100000 + Math.random() * 900000);
    setBookingRef(randRef);
    setBookingSuccess(true);
  };

  return (
    <Card title="🏨 Recommended Hotels">
      {!hotels.length ? (
        <p className="text-slate-500">
          Generate a trip to see hotel recommendations.
        </p>
      ) : (
        <div className="space-y-6">
          {hotels.map((group, index) => (
            <div
              key={group.category || index}
              className="glass rounded-2xl p-5"
            >
              <h3 className="text-2xl font-bold text-cyan-300 mb-4">
                ⭐ {group.category}
              </h3>

              <div className="space-y-3">
                {group.suggestions.map((hotel, i) => (
                  <div
                    key={i}
                    className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition"
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">

                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-lg">
                          {hotel}
                        </h4>
                        <p className="text-slate-400 text-sm mt-1">
                          Comfortable stay with great amenities.
                        </p>
                        <span className="text-yellow-400 text-sm block mt-2">
                          ⭐⭐⭐⭐☆
                        </span>
                      </div>

                      <button
                        onClick={() => handleOpenBooking(hotel)}
                        className="primary-btn text-xs px-4 py-2 border-none shadow-md hover:scale-105 active:scale-95 transition-all self-start sm:self-auto"
                      >
                        Book Now 🏨
                      </button>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Glassmorphic Modal overlay */}
      {selectedHotel && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass rounded-3xl w-full max-w-lg border border-slate-700/50 overflow-hidden shadow-2xl animate-fade-in flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-slate-800/80 p-5 border-b border-slate-700/50 flex justify-between items-center">
              <h3 className="font-bold text-white text-lg truncate flex items-center gap-2">
                🏨 {bookingSuccess ? "Booking Confirmed!" : `Book Stay - ${selectedHotel}`}
              </h3>
              <button 
                onClick={() => setSelectedHotel(null)}
                className="text-slate-400 hover:text-white text-xl font-semibold"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-900/60 text-slate-200">
              {bookingSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="text-6xl animate-bounce">🎉</div>
                  <h4 className="text-2xl font-bold text-cyan-300">Thank you for your booking!</h4>
                  <p className="text-slate-300 max-w-md mx-auto">
                    Your stay at <span className="text-white font-semibold">{selectedHotel}</span> has been confirmed.
                  </p>
                  
                  {/* Receipt Box */}
                  <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 text-left max-w-sm mx-auto space-y-2 mt-6">
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Booking Receipt</p>
                    <div className="border-t border-slate-700/50 my-2 pt-2 space-y-1 text-sm">
                      <p><span className="text-slate-400">Confirmation ID:</span> <span className="text-cyan-300 font-bold font-mono">{bookingRef}</span></p>
                      <p><span className="text-slate-400">Guest Name:</span> <span className="text-white">{bookingForm.guestName}</span></p>
                      <p><span className="text-slate-400">Room Type:</span> <span className="text-white">{ROOM_PRICES[bookingForm.roomType].label}</span></p>
                      <p><span className="text-slate-400">Check-in:</span> <span className="text-white">{bookingForm.checkIn}</span></p>
                      <p><span className="text-slate-400">Check-out:</span> <span className="text-white">{bookingForm.checkOut}</span></p>
                      <p><span className="text-slate-400">Duration:</span> <span className="text-white">{calculateNights()} night(s)</span></p>
                      <p><span className="text-slate-400">Guests:</span> <span className="text-white">{bookingForm.guests}</span></p>
                    </div>
                    <div className="border-t border-slate-700/50 pt-2 flex justify-between font-bold text-lg text-white">
                      <span>Total Price:</span>
                      <span>₹{calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedHotel(null)}
                    className="primary-btn text-sm px-6 py-3 border-none mt-6"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleConfirmBooking} className="space-y-4">
                  {/* Guest Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">Lead Guest Name</label>
                    <input 
                      type="text" 
                      name="guestName"
                      required
                      placeholder="e.g. John Doe"
                      value={bookingForm.guestName}
                      onChange={handleInputChange}
                      className="bg-slate-800 border border-slate-700/50 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>

                  {/* Dates Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">Check-in Date</label>
                      <input 
                        type="date" 
                        name="checkIn"
                        required
                        value={bookingForm.checkIn}
                        onChange={handleInputChange}
                        className="bg-slate-800 border border-slate-700/50 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">Check-out Date</label>
                      <input 
                        type="date" 
                        name="checkOut"
                        required
                        value={bookingForm.checkOut}
                        onChange={handleInputChange}
                        className="bg-slate-800 border border-slate-700/50 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      />
                    </div>
                  </div>

                  {/* Guests & Room Types Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">Guests</label>
                      <input 
                        type="number" 
                        name="guests"
                        min={1}
                        max={10}
                        required
                        value={bookingForm.guests}
                        onChange={handleInputChange}
                        className="bg-slate-800 border border-slate-700/50 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">Room Type</label>
                      <select 
                        name="roomType"
                        value={bookingForm.roomType}
                        onChange={handleInputChange}
                        className="bg-slate-800 border border-slate-700/50 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      >
                        <option value="standard">Standard (₹2,500/night)</option>
                        <option value="deluxe">Deluxe (₹4,500/night)</option>
                        <option value="suite">Suite (₹8,500/night)</option>
                      </select>
                    </div>
                  </div>

                  {/* Price Estimator Box */}
                  <div className="bg-slate-800/40 border border-slate-700/30 rounded-2xl p-4 mt-6 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Estimated Cost</p>
                      <p className="text-sm text-slate-300 mt-0.5">
                        ₹{ROOM_PRICES[bookingForm.roomType].price.toLocaleString()} x {calculateNights()} night(s)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">
                        ₹{calculateTotal().toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Modal Footer Actions */}
                  <div className="flex gap-4 pt-4 border-t border-slate-700/30">
                    <button
                      type="button"
                      onClick={() => setSelectedHotel(null)}
                      className="secondary-btn flex-1 text-sm py-3 hover:bg-slate-800 text-slate-300 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="primary-btn flex-1 text-sm py-3 border-none text-white font-bold"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}