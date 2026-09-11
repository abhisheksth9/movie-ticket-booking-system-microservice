import axiosClient from "../../../api/axiosClient";

export const createShowtime = async (showtimeData) => {
  const { data } = await axiosClient.post("/api/catalog/showtimes/create", showtimeData);
  return data;
};

export const deleteShowtime = async (id) => {
  const { data } = await axiosClient.delete(`/api/catalog/showtimes/${id}`);
  return data;
};