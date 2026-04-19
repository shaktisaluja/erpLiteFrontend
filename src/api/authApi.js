// src/api/authApi.js
import axiosInstance from "./axiosInstance";

export const loginApi = async (data) => {
  try {
    const res = await axiosInstance.post("/auth/login", data);
    return res;
  } catch (error) {
    throw error;
  }
};
