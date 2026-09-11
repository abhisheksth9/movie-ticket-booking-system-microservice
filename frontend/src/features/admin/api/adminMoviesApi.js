import axiosClient from "../../../api/axiosClient";

export const createMovie = async (movieData) => {
  const { data } = await axiosClient.post("/api/catalog/movies/create", movieData);
  return data;
};

export const updateMovie = async ({ id, ...movieData }) => {
  const { data } = await axiosClient.put(`/api/catalog/movies/update/${id}`, movieData);
  return data;
};

export const deleteMovie = async (id) => {
  const { data } = await axiosClient.delete(`/api/catalog/movies/del/${id}`);
  return data;
};