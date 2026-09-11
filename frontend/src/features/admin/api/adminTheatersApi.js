import axiosClient from "../../../api/axiosClient";

export const fetchTheaters = async () => {
  const { data } = await axiosClient.get("/api/catalog/theaters");
  return data;
};

export const createTheater = async (theaterData) => {
  const { data } = await axiosClient.post("/api/catalog/theaters/create", theaterData);
  return data;
};