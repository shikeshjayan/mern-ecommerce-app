import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASEURL || "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export default apiClient;
