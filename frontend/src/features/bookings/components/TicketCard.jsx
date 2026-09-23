import { useBookingTicket } from "../hooks/useBookingTicket";

const statusStyles = {
  confirmed: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-gray-100 text-gray-500 border-gray-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function TicketCard({ booking, onCancel, isCancelling }) {
  const { isLoading, movieTitle, theaterName, theaterLocation, startTime, seatNumbers } =
    useBookingTicket(booking);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="bg-indigo-600 px-4 py-3 flex items-center justify-between">
        <p className="text-white font-medium">
          {isLoading ? "Loading..." : movieTitle || `Showtime #${booking.showtimeId}`}
        </p>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full border capitalize ${
            statusStyles[booking.status] || "bg-white/10 text-white border-white/30"
          }`}
        >
          {booking.status}
        </span>
      </div>

      <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-gray-400">Date & Time</p>
          <p className="text-sm text-gray-900 font-medium">
            {isLoading ? "..." : startTime ? new Date(startTime).toLocaleString() : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Theater</p>
          <p className="text-sm text-gray-900 font-medium">
            {isLoading ? "..." : theaterName ? `${theaterName}` : "—"}
          </p>
          {theaterLocation && <p className="text-xs text-gray-500">{theaterLocation}</p>}
        </div>
        <div>
          <p className="text-xs text-gray-400">Seats</p>
          <p className="text-sm text-gray-900 font-medium">
            {isLoading ? "..." : seatNumbers.join(", ")}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Total Paid</p>
          <p className="text-sm text-gray-900 font-medium">{booking.totalPrice}</p>
        </div>
      </div>

      <div className="px-4 pb-4 flex items-center justify-between">
        <p className="text-xs text-gray-400">
          Booking #{booking.id} · Booked on {new Date(booking.createdAt).toLocaleDateString()}
        </p>
        {booking.status === "confirmed" && (
          <button
            onClick={() => onCancel(booking.id)}
            disabled={isCancelling}
            className="text-xs text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
          >
            Cancel Booking
          </button>
        )}
      </div>
    </div>
  );
}