import axiosClient from "../../../api/axiosClient";

export const fetchSeatsByTheater = async (theaterId) => {
  const { data } = await axiosClient.get(`/api/catalog/theaters/${theaterId}/seats`);
  return data;
};

export const fetchBookedSeats = async (showtimeId) => {
  const { data } = await axiosClient.get(`/api/bookings/showtime/${showtimeId}/booked-seats`);
  return data.bookedSeatIds;
};

export const createBooking = async ({ userId, showtimeId, seatIds }) => {
  const { data } = await axiosClient.post("/api/bookings/create", {
    userId,
    showtimeId,
    seatIds,
  });
  return data;
};

export const fetchMyBookings = async () => {
  const { data } = await axiosClient.get("/api/bookings/my");
  return data;
};

export const cancelBooking = async () => {
  const { data } = await axiosClient.put("/api/bookings/${bookingId}/cancel");
  return data;
}