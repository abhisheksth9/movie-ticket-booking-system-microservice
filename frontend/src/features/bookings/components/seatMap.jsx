import { useSeats, useBookedSeats } from "../hooks/useSeats";

export default function SeatMap({ theaterId, showtimeId, selectedSeatIds, onToggleSeat }) {
  const { data, isLoading, isError, error } = useSeats(theaterId);
  const { data: bookedSeatIds = [] } = useBookedSeats(showtimeId);

  console.log('SeatMap:', { theaterId, showtimeId }); 
  
  if (isLoading) return <p className="text-gray-500 text-sm">Loading seats...</p>;

  if (isError) {
    return (
      <p className="text-red-600 text-sm">
        Failed to load seats: {error.response?.data?.message || error.message}
      </p>
    );
  }

  const seats = data?.seats || [];

  return (
    <div>
      <p className="text-sm text-gray-500 mb-3">
        {data?.theater} — {data?.location}
      </p>
      <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-w-lg">
        {seats.map((seat) => {
          const isBooked = bookedSeatIds.includes(seat.id);
          const isSelected = selectedSeatIds.includes(seat.id);
          const isVip = seat.type?.toLowerCase() === "vip";

          return (
            <button
              key={seat.id}
              type="button"
              disabled={isBooked}
              onClick={() => onToggleSeat(seat.id)}
              className={`aspect-square rounded-md text-xs font-medium flex items-center justify-center border transition ${
                isBooked
                  ? "bg-red-200 border-red-200 text-red-400 cursor-not-allowed"
                  : isSelected
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : isVip
                  ? "bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100"
                  : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {seat.seatNumber}
            </button>
          );
        })}
      </div>
      <div className="flex gap-4 mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-gray-50 border border-gray-300 inline-block" /> Standard
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-amber-50 border border-amber-300 inline-block" /> VIP
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-indigo-600 inline-block" /> Selected
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-gray-200 border border-gray-200 inline-block" /> Booked
        </span>
      </div>
    </div>
  );
}