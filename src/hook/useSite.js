import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import siteApi from "../api/siteApi";

const getErrorMessage = (err, fallback) =>
    err?.response?.data?.message || err?.message || fallback;

const useSite = () => {
    const [siteData, setSiteData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);

    const fetchSites = useCallback(async () => {
        try {
            setLoading(true);
            const res = await siteApi.getAllSiteApi();
            setSiteData(res?.data?.data?.items || []);
        } catch (err) {
            toast.error(getErrorMessage(err, "Failed to fetch sites"));
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchSitesByOrganizationId = useCallback(async (orgId) => {
        try {
            setLoading(true);
            const res = await siteApi.getSiteByOrganizationIdApi(orgId);
            setSiteData(res?.data?.data || []);
        } catch (err) {
            toast.error(getErrorMessage(err, "Failed to fetch sites"));
        } finally {
            setLoading(false);
        }
    }, []);

    const createSite = async (data, reset) => {
        try {
            setLoading(true);
            const res = await siteApi.createSiteApi(data);
            setSiteData((prev) => [res.data.data, ...prev]);
            toast.success("Site created successfully!");
            reset && reset();
            return res;
        } catch (err) {
            toast.error(getErrorMessage(err, "Create failed"));
            return null;
        } finally {
            setLoading(false);
        }
    };

    const deleteSite = async (id) => {
        try {
            setDeleteLoading(true);
            await siteApi.deleteSiteApi(id);
            setSiteData((prev) => prev.filter((item) => item._id !== id));
            toast.success("Deleted successfully");
            return true;
        } catch (err) {
            toast.error(getErrorMessage(err, "Delete failed"));
            return false;
        } finally {
            setDeleteLoading(false);
        }
    };

    const updateSite = async (id, data) => {
        try {
            setUpdateLoading(true);
            await siteApi.updateSiteApi(id, data);
            setSiteData((prev) =>
                prev.map((item) => item._id === id ? { ...item, ...data } : item)
            );
            toast.success("Site updated successfully!");
            return true;
        } catch (err) {
            toast.error(getErrorMessage(err, "Update failed"));
            return false;
        } finally {
            setUpdateLoading(false);
        }
    };

    return {
        siteData,
        loading,
        deleteLoading,
        updateLoading,
        setSiteData,
        fetchSites,
        createSite,
        deleteSite,
        updateSite,
        fetchSitesByOrganizationId
    };
};

export default useSite;
