import { useMyBookings, useCancelBooking } from "../hooks/useMyBookings";

const statusStyles = {
  confirmed: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-gray-100 text-gray-500 border-gray-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function BookingHistory() {
  const { data: bookings, isLoading, isError, error } = useMyBookings();
  const cancelBooking = useCancelBooking();

  if (isLoading) {
    return <p className="text-gray-500 text-sm">Loading bookings...</p>;
  }

  if (isError) {
    return (
      <p className="text-red-600 text-sm">
        Failed to load bookings: {error.response?.data?.message || error.message}
      </p>
    );
  }

  if (!bookings?.length) {
    return <p className="text-gray-500 text-sm">You haven't made any bookings yet.</p>;
  }

  const sorted = [...bookings].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="space-y-3">
      {sorted.map((booking) => {
        const seatIds = booking.BookingSeats.map((bs) => bs.seatId).join(", ");
        return (
          <div
            key={booking.id}
            className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-medium text-gray-900">
                Showtime #{booking.showtimeId} — Seat(s): {seatIds}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Booked on {new Date(booking.createdAt).toLocaleDateString()} · {booking.totalPrice}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full border capitalize ${
                  statusStyles[booking.status] || "bg-gray-50 text-gray-600 border-gray-200"
                }`}
              >
                {booking.status}
              </span>

              {booking.status === "confirmed" && (
                <button
                  onClick={() => cancelBooking.mutate(booking.id)}
                  disabled={cancelBooking.isPending}
                  className="text-xs text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}