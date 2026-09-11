import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.VITE_API_BASE_URL || "http://localhost:4000",
    withCredentials: true,
})

export default  axiosClient;