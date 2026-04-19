// src/api/authApi.js
import axiosInstance from "./axiosInstance";

export const createRoleApi = async (data) => {
  try {
    const res = await axiosInstance.post("/roles", data);
    return res;
  } catch (error) {
    throw error;
  }
};


export const getAllRoleApi = async () => {
  try {
    const res = await axiosInstance.get("/roles");
    return res;
  } catch (error) {
    throw error;
  }
};


export const getRoleByOrganizationIdApi = async (id) => {
  try {
    const res = await axiosInstance.get(`/roles/organization/${id}`);
    return res;
  } catch (error) {
    throw error;
  }
};


export const updateRoleApi = async (id, data) => {
  try {
    const res = await axiosInstance.put(`/roles/${id}`, data);
    return res;
  } catch (error) {
    throw error;
  }
};


export const deleteRoleApi = async (id) => {
  try {
    const res = await axiosInstance.delete(`/roles/${id}`);
    return res;
  } catch (error) {
    throw error;
  }
};  
