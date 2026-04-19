import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import departmentApi from "../api/departmentApi";

const getErrorMessage = (err, fallback) =>
    err?.response?.data?.message || err?.message || fallback;

const useDepartment = () => {
    const [departmentData, setDepartmentData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);

    const fetchDepartments = useCallback(async () => {
        try {
            setLoading(true);
            const res = await departmentApi.getAllDepartmentApi();
            setDepartmentData(res?.data?.data?.items || []);
        } catch (err) {
            toast.error(getErrorMessage(err, "Failed to fetch departments"));
        } finally {
            setLoading(false);
        }
    }, []);

    const createDepartment = async (data) => {
        try {
            setLoading(true);
            const res = await departmentApi.createDepartmentApi(data);
            setDepartmentData((prev) => [res.data.data, ...prev]);
            toast.success("Department created successfully!");
            return res;
        } catch (err) {
            toast.error(getErrorMessage(err, "Create failed"));
            return null;
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartmentsByOrganizationId = useCallback(async (orgId) => {
        try {
            setLoading(true);
            const res = await departmentApi.getDepartmentByOrganizationIdApi(orgId);
            setDepartmentData(res?.data?.data || []);
        } catch (err) {
            toast.error(getErrorMessage(err, "Failed to fetch departments"));
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteDepartment = async (id) => {
        try {
            setDeleteLoading(true);
            await departmentApi.deleteDepartmentApi(id);
            setDepartmentData((prev) => prev.filter((item) => item._id !== id));
            toast.success("Deleted successfully");
            return true;
        } catch (err) {
            toast.error(getErrorMessage(err, "Delete failed"));
            return false;
        } finally {
            setDeleteLoading(false);
        }
    };

    const updateDepartment = async (id, data) => {
        try {
            setUpdateLoading(true);
            await departmentApi.updateDepartmentApi(id, data);
            setDepartmentData((prev) =>
                prev.map((item) => (item._id === id ? { ...item, ...data } : item))
            );
            toast.success("Department updated successfully!");
            return true;
        } catch (err) {
            toast.error(getErrorMessage(err, "Update failed"));
            return false;
        } finally {
            setUpdateLoading(false);
        }
    };

    return {
        departmentData,
        loading,
        deleteLoading,
        updateLoading,
        setDepartmentData,
        fetchDepartments,
        createDepartment,
        deleteDepartment,
        updateDepartment,
        fetchDepartmentsByOrganizationId
    };
};

export default useDepartment;
