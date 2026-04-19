import axiosInstance from "./axiosInstance";


export const createUserApi = async (data) => {
  try {
    const res = await axiosInstance.post("/users", data);
    return res;
  } catch (error) {
    throw error;
  }
};


export const getAllUserApi = async () => {
  try {
    const res = await axiosInstance.get("/users");
    return res;
  } catch (error) {
    throw error;
  }
};


export const getUserByIdApi = async (id) => {
  try {
    const res = await axiosInstance.get(`/users/${id}`);
    return res;
  } catch (error) {
    throw error;
  }
};


export const updateUserApi = async (id, data) => {
  try {
    const res = await axiosInstance.put(`/users/${id}`, data);
    return res;
  } catch (error) {
    throw error;
  }
};


export const deleteUserApi = async (id) => {
  try {
    const res = await axiosInstance.delete(`/users/${id}`);
    return res;
  } catch (error) {
    throw error;
  }
};      
