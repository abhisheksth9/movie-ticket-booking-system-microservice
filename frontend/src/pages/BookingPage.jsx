import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { useShowtimeById } from "../features/showtimes/hooks/useShowtimes";
import SeatMap from "../features/bookings/components/seatMap";
import { useCreateBooking } from "../features/bookings/hooks/useCreateBooking";

export default function BookingPage() {
  const { showtimeId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [error, setError] = useState("");

  const { data: showtime, isLoading: showtimeLoading } = useShowtimeById(showtimeId);
  const createBooking = useCreateBooking();

  const toggleSeat = (seatId) => {
    setSelectedSeatIds((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    );
  };

  const handleConfirm = async () => {
    setError("");
    try {
      const result = await createBooking.mutateAsync({
        userId: user.id,
        showtimeId: Number(showtimeId),
        seatIds: selectedSeatIds,
      });
      navigate("/profile", { state: { bookingConfirmed: result.booking } });
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. A seat may already be taken.");
    }
  };

  if (showtimeLoading) {
    return <p className="text-gray-500 text-center py-12">Loading showtime...</p>;
  }

  if (!showtime) {
    return <p className="text-gray-500 text-center py-12">Showtime not found.</p>;
  }

  const totalPrice = selectedSeatIds.length * Number(showtime.price);

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Select Seats</h1>
      <p className="text-gray-500 text-sm mb-4">
        {new Date(showtime.startTime).toLocaleString()} — {showtime.price} per seat
      </p>

      <SeatMap
        theaterId={showtime.theaterId}
        showtimeId={showtimeId}
        selectedSeatIds={selectedSeatIds}
        onToggleSeat={toggleSeat}
      />

      {error && (
        <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 max-w-md">
          {error}
        </p>
      )}

      <div className="mt-6 flex items-center gap-4">
        <p className="text-sm text-gray-600">
          {selectedSeatIds.length} seat{selectedSeatIds.length !== 1 ? "s" : ""} selected
          {selectedSeatIds.length > 0 && ` — Total: ${totalPrice}`}
        </p>
        <button
          onClick={handleConfirm}
          disabled={!selectedSeatIds.length || createBooking.isPending}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          {createBooking.isPending ? "Booking..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}