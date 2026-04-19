import axiosInstance from "./axiosInstance";

const createDepartmentApi = async (data) => {
    return await axiosInstance.post("/departments", data);
};

const getAllDepartmentApi = async () => {
    return await axiosInstance.get("/departments");
};

const getDepartmentByIdApi = async (id) => {
    return await axiosInstance.get(`/departments/${id}`);
};

const updateDepartmentApi = async (id, data) => {
    return await axiosInstance.put(`/departments/${id}`, data);
};

const deleteDepartmentApi = async (id) => {
    return await axiosInstance.delete(`/departments/${id}`);
};

const getDepartmentByOrganizationIdApi = async (orgId) => {
    return await axiosInstance.get(`/departments/organization/${orgId}`);
};

export default {
    createDepartmentApi,
    getAllDepartmentApi,
    getDepartmentByIdApi,
    updateDepartmentApi,
    deleteDepartmentApi,
    getDepartmentByOrganizationIdApi
};
