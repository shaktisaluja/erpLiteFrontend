import axiosInstance from "./axiosInstance";

const getDashboardStatsApi = async () => {
    return await axiosInstance.get("/dashboard/stats");
};

export default {
    getDashboardStatsApi
};
