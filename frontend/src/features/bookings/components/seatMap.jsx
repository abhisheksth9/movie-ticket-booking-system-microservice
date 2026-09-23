import { useSeats, useBookedSeats } from "../hooks/useSeats";

export default function SeatMap({ theaterId, showtimeId, selectedSeatIds, onToggleSeat }) {
  const { data, isLoading, isError, error } = useSeats(theaterId);
  const { data: bookedSeatIds = [] } = useBookedSeats(showtimeId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 text-sm">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <span>Loading seats map...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 px-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm max-w-md mx-auto">
        <p className="font-semibold mb-1">Failed to load seats</p>
        <p className="text-xs text-red-500">{error?.response?.data?.message || error?.message}</p>
      </div>
    );
  }

  const seats = data?.seats || [];

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-gray-800">
          {data?.theater || "Select Your Seats"}
        </h3>
        {data?.location && (
          <p className="text-xs text-gray-500 mt-0.5">{data.location}</p>
        )}
      </div>

      {/* Screen Curved Header */}
      <div className="w-full max-w-md mb-8 flex flex-col items-center">
        <div className="w-4/5 h-2 bg-gradient-to-r from-gray-200 via-indigo-400 to-gray-200 rounded-t-full shadow-md" />
        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mt-2">
          SCREEN
        </span>
      </div>

      {/* Seat Grid Centered */}
      <div className="w-full flex justify-center mb-8 overflow-x-auto py-2">
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-2.5 sm:gap-3 max-w-md mx-auto">
          {seats.map((seat) => {
            const isBooked = bookedSeatIds.includes(seat.id);
            const isSelected = selectedSeatIds.includes(seat.id);

            return (
              <button
                key={seat.id}
                type="button"
                disabled={isBooked}
                onClick={() => onToggleSeat(seat.id)}
                title={`Seat ${seat.seatNumber}${isBooked ? " (Booked)" : ""}`}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-xs font-semibold flex items-center justify-center transition-all duration-200 shadow-sm border ${
                  isBooked
                    ? "bg-red-100 border-red-200 text-gray-400 cursor-not-allowed shadow-none"
                    : isSelected
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-indigo-200 shadow-md ring-2 ring-indigo-300 ring-offset-1 scale-105"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow"
                }`}
              >
                {seat.seatNumber}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-100 w-full text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-md bg-white border border-gray-300 shadow-sm" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-md bg-indigo-600 shadow-sm" />
          <span className="font-medium text-gray-800">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-md bg-red-100 border border-red-200" />
          <span className="text-gray-400">Booked</span>
        </div>
      </div>
    </div>
  );
}