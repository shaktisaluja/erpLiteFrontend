import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
    createUserApi,
    getAllUserApi,
    updateUserApi,
    deleteUserApi
} from "../api/userApi";

const getErrorMessage = (err, fallback) =>
    err?.response?.data?.message || err?.message || fallback;

const useUser = () => {
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getAllUserApi();
            setUserData(res?.data?.data?.items || res?.data?.data || []);
        } catch (err) {
            toast.error(getErrorMessage(err, "Failed to fetch users"));
        } finally {
            setLoading(false);
        }
    }, []);

    const createUser = async (data) => {
        try {
            setLoading(true);
            const res = await createUserApi(data);
            setUserData((prev) => [res.data.data, ...prev]);
            toast.success("User created successfully!");
            return res;
        } catch (err) {
            toast.error(getErrorMessage(err, "Create failed"));
            return null;
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id) => {
        try {
            setDeleteLoading(true);
            await deleteUserApi(id);
            setUserData((prev) => prev.filter((item) => (item._id || item.id) !== id));
            toast.success("Deleted successfully");
            return true;
        } catch (err) {
            toast.error(getErrorMessage(err, "Delete failed"));
            return false;
        } finally {
            setDeleteLoading(false);
        }
    };

    const updateUser = async (id, data) => {
        try {
            setUpdateLoading(true);
            await updateUserApi(id, data);
            setUserData((prev) =>
                prev.map((item) => ((item._id || item.id) === id ? { ...item, ...data } : item))
            );
            toast.success("User updated successfully!");
            return true;
        } catch (err) {
            toast.error(getErrorMessage(err, "Update failed"));
            return false;
        } finally {
            setUpdateLoading(false);
        }
    };

    return {
        userData,
        loading,
        deleteLoading,
        updateLoading,
        setUserData,
        fetchUsers,
        createUser,
        deleteUser,
        updateUser
    };
};

export default useUser;
