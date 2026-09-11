import axiosClient from "../../../api/axiosClient";

export const fetchMovies = async () => {
  const { data } = await axiosClient.get("/api/catalog/movies");
  return data;
};

export const fetchMovieById = async (id) => {
  const { data } = await axiosClient.get(`/api/catalog/movies/${id}`);
  return data;
};