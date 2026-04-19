// src/api/axiosInstance.js
import axios from "axios";
import toast from "react-hot-toast";


const axiosInstance = axios.create({
  baseURL: "https://erplitebackend-2.onrender.com/api",
  timeout: 10000
});

// 🔥 attach token automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";

    // ✅ Toast automatically
    toast.error(message);

    // 🔐 Auth Error Handle
    // if (error?.response?.status === 401) {
    //     localStorage.removeItem("token");

    //     // redirect to login
    //     window.location.href = "/login";
    // }

    return Promise.reject(error);
  }
);

export default axiosInstance;