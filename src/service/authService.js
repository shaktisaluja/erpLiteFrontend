// src/services/authService.js
import { loginApi } from "../api/authApi";

export const loginService = async (data) => {
  try {
    const res = await loginApi(data);
    return res.data;
  } catch (error) {
    throw error;
  }
};
