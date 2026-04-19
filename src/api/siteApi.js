import axiosInstance from "./axiosInstance";

const createSiteApi = async (data) => {
    return await axiosInstance.post("/sites", data);
};

const getAllSiteApi = async () => {
    return await axiosInstance.get("/sites");
};

const getSiteByIdApi = async (id) => {
    return await axiosInstance.get(`/sites/${id}`);
};

const updateSiteApi = async (id, data) => {
    return await axiosInstance.put(`/sites/${id}`, data);
};

const deleteSiteApi = async (id) => {
    return await axiosInstance.delete(`/sites/${id}`);
};

const getSiteByOrganizationIdApi = async (orgId) => {
    return await axiosInstance.get(`/sites/organization/${orgId}`);
};

export default {
    createSiteApi,
    getAllSiteApi,
    getSiteByIdApi,
    updateSiteApi,
    deleteSiteApi,
    getSiteByOrganizationIdApi
};
