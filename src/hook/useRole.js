import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
    createRoleApi,
    getAllRoleApi,
    updateRoleApi,
    deleteRoleApi,
    getRoleByOrganizationIdApi
} from "../api/roleApi";

const getErrorMessage = (err, fallback) =>
    err?.response?.data?.message || err?.message || fallback;

const useRole = () => {
    const [roleData, setRoleData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);

    const fetchRoles = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getAllRoleApi();
            setRoleData(res?.data?.data?.items || []);
        } catch (err) {
            toast.error(getErrorMessage(err, "Failed to fetch roles"));
        } finally {
            setLoading(false);
        }
    }, []);

        const fetchRolesByOrganizationId = useCallback(async (orgId) => {
        try {
            setLoading(true);
            const res = await getRoleByOrganizationIdApi(orgId);
            setRoleData(res?.data?.data?.items || []);
        } catch (err) {
            toast.error(getErrorMessage(err, "Failed to fetch roles"));
        } finally {
            setLoading(false);
        }
    }, []);

    const createRole = async (data) => {
        try {
            setLoading(true);
            const res = await createRoleApi(data);
            setRoleData((prev) => [res.data.data, ...prev]);
            toast.success("Role created successfully!");
            return res;
        } catch (err) {
            toast.error(getErrorMessage(err, "Create failed"));
            return null;
        } finally {
            setLoading(false);
        }
    };

    const deleteRole = async (id) => {
        try {
            setDeleteLoading(true);
            await deleteRoleApi(id);
            setRoleData((prev) => prev.filter((item) => item._id !== id));
            toast.success("Deleted successfully");
            return true;
        } catch (err) {
            toast.error(getErrorMessage(err, "Delete failed"));
            return false;
        } finally {
            setDeleteLoading(false);
        }
    };

    const updateRole = async (id, data) => {
        try {
            setUpdateLoading(true);
            await updateRoleApi(id, data);
            setRoleData((prev) =>
                prev.map((item) => (item._id === id ? { ...item, ...data } : item))
            );
            toast.success("Role updated successfully!");
            return true;
        } catch (err) {
            toast.error(getErrorMessage(err, "Update failed"));
            return false;
        } finally {
            setUpdateLoading(false);
        }
    };

    return {
        roleData,
        loading,
        deleteLoading,
        updateLoading,
        setRoleData,
        fetchRoles,
        createRole,
        deleteRole,
        updateRole,
        fetchRolesByOrganizationId
    };
};

export default useRole;
