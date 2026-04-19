import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import organizationApi from "../api/orgApi";

const getErrorMessage = (err, fallback) =>
  err?.response?.data?.message || err?.message || fallback;

// 🔥 IMPORTANT: normalize function
const normalizeArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const useOrganization = () => {
  const [orgData, setOrgData] = useState([]); // ✅ always array
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  // 🔥 FETCH ALL
  const fetchOrganizations = useCallback(async () => {
    try {
      setLoading(true);
      const res = await organizationApi.getAllOrganizationApi();

      // ✅ FIXED
      setOrgData(normalizeArray(res?.data?.data));

    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to fetch organizations"));
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔥 FETCH BASIC DETAILS
  const fetchOrganizationBasicDetails = useCallback(async () => {
    try {
      setLoading(true);
      const res = await organizationApi.getOrganizationBasicDetailsApi();

      // ✅ FIXED
      setOrgData(normalizeArray(res?.data?.data));

    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to fetch organizations"));
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔥 CREATE
  const createOrganization = async (data) => {
    try {
      setLoading(true);

      const res = await organizationApi.createOrganizationApi(data);

      // ✅ SAFE UPDATE
      setOrgData((prev) => [
        res?.data?.data,
        ...(Array.isArray(prev) ? prev : [])
      ]);

      toast.success("Organization created successfully!");
      return res;

    } catch (err) {
      toast.error(getErrorMessage(err, "Create failed"));
    } finally {
      setLoading(false);
    }
  };

  // 🔥 DELETE
  const deleteOrganization = async (id) => {
    try {
      setDeleteLoading(true);

      await organizationApi.deleteOrganizationApi(id);

      // ✅ SAFE UPDATE
      setOrgData((prev) =>
        (Array.isArray(prev) ? prev : []).filter((org) => org._id !== id)
      );

      toast.success("Deleted successfully");

    } catch (err) {
      toast.error(getErrorMessage(err, "Delete failed"));
    } finally {
      setDeleteLoading(false);
    }
  };

  // 🔥 UPDATE
  const updateOrganization = async (id, data) => {
    try {
      setUpdateLoading(true);

      await organizationApi.updateOrganizationApi(id, data);

      // ✅ SAFE UPDATE
      setOrgData((prev) =>
        (Array.isArray(prev) ? prev : []).map((item) =>
          item._id === id ? { ...item, ...data } : item
        )
      );

      toast.success("Updated successfully");

    } catch (err) {
      toast.error(getErrorMessage(err, "Update failed"));
    } finally {
      setUpdateLoading(false);
    }
  };

  return {
    orgData,
    loading,
    deleteLoading,
    updateLoading,
    setOrgData,
    fetchOrganizations,
    fetchOrganizationBasicDetails,
    createOrganization,
    deleteOrganization,
    updateOrganization
  };
};

export default useOrganization;