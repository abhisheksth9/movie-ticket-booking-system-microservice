import axiosClient from "../../../api/axiosClient";

export const fetchShowtimesByMovie = async (movieId) => {
  const { data } = await axiosClient.get(`/api/catalog/showtimes/movie/${movieId}`);
  return data;
};

export const fetchShowtimeById = async (showtimeId) => {
  const { data } = await axiosClient.get(`/api/catalog/showtimes/${showtimeId}`);
  return data;
};