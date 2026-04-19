// src/api/authApi.js
import axiosInstance from "./axiosInstance";

const createOrganizationApi = async (data) => {
  const response = await axiosInstance.post("/organizations", data);
return response;
};

const getAllOrganizationApi = async () => {
  return await axiosInstance.get("/organizations");
};

const getOrganizationBasicDetailsApi = async () => {
  return await axiosInstance.get("/organizations/basic-details");
};

const getOrganizationByIdApi = async (id) => {
  return await axiosInstance.get(`/organizations/${id}`);
};

const updateOrganizationApi = async (id, data) => {
  return await axiosInstance.put(`/organizations/${id}`, data);
};

const deleteOrganizationApi = async (id) => {
  return await axiosInstance.delete(`/organizations/${id}`);
};


export default {
  createOrganizationApi,
  getAllOrganizationApi,
  getOrganizationBasicDetailsApi,
  getOrganizationByIdApi,
  updateOrganizationApi,
  deleteOrganizationApi
}

