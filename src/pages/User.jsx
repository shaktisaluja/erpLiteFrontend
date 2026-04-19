import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Grid, Paper, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import CommonTable from "../components/CommonTable";
import FormInput from "../components/form/FormInput";
import FormSelect from "../components/form/FormSelect";
import FormButton from "../components/form/FormButton";
import DeleteConfirmDialog from "../components/dialogBox/DeleteConfirmDialog";
import UpdateUserDialog from "../components/dialogBox/UpdateUserDialog";
import userColumns from "../constants/formsColumn/user";
import { userDefaultValues, userStatusOptions } from "../constants/formsColumn/userForm";
import { userSchema } from "../schema/user";
import useUser from "../hook/useUser";
import useOrganization from "../hook/useOrganization";
import useSite from "../hook/useSite";
import useRole from "../hook/useRole";
import useDepartment from "../hook/useDepartment";

const normalizeRole = (role) => String(role || "").toLowerCase().replace(/\s+/g, "");

const getUserOrganizationId = (user) =>
    user?.organizationId ||
    user?.organization?._id ||
    user?.organization?.id ||
    user?.organization ||
    "";

const getRoleOrganizationId = (role) =>
    role?.organizationId ||
    role?.organization?._id ||
    role?.organization?.id ||
    role?.organization ||
    "";

const getSiteOrganizationId = (site) =>
    site?.organizationId ||
    site?.organization?._id ||
    site?.organization?.id ||
    site?.organization ||
    "";

const getDepartmentOrganizationId = (department) =>
    department?.organizationId ||
    department?.organization?._id ||
    department?.organization?.id ||
    department?.organization ||
    "";

const User = () => {
    const authUser = useSelector((state) => state.auth.user);
    const isSuperAdmin = normalizeRole(authUser?.role) === "superadmin";

    //form validation
    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(userSchema),
        defaultValues: {
            ...userDefaultValues,
            organizationId: isSuperAdmin ? userDefaultValues.organizationId : getUserOrganizationId(authUser)
        }
    });




    //user related hook
    const { userData, loading, deleteLoading, updateLoading, setUserData, fetchUsers, createUser, deleteUser, updateUser } = useUser();

    //organization related hook
    const { orgData, fetchOrganizationBasicDetails } = useOrganization();

    //site related hook
    const { siteData, fetchSites, fetchSitesByOrganizationId } = useSite();

    //role related hook
    const { roleData, fetchRoles, fetchRolesByOrganizationId } = useRole();

    //department related hook
    const { departmentData, fetchDepartments, fetchDepartmentsByOrganizationId } = useDepartment();

    //state variables
    const [openDelete, setOpenDelete] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    //organization selected by super admin
    const selectedOrganizationId = watch("organizationId");

    //effective organization id
    const effectiveOrgId = isSuperAdmin
        ? selectedOrganizationId
        : getUserOrganizationId(authUser);


useEffect(() => {
    if (!effectiveOrgId) return;
    const fetchDependentData = async () => {
        try {
            // reset dependent fields
            reset((prev) => ({
                ...prev,
                roleId: "",
                departmentId: "",
                siteId: ""
            }));

            // parallel API calls
            await Promise.all([
                fetchRolesByOrganizationId(effectiveOrgId),
                fetchSitesByOrganizationId(effectiveOrgId),
                fetchDepartmentsByOrganizationId(effectiveOrgId)
            ]);

        } catch (err) {
            console.error("Error fetching dependent data", err);
        }
    }
    fetchDependentData();
    }, [effectiveOrgId])



const organizationOptions = useMemo(
    () =>
        orgData.map((organization) => ({
            label: organization.orgName,
            value: organization._id
        })),
    [orgData]
);

const roleOptions = useMemo(
    () =>
        roleData.map((role) => ({
            label: role.name,
            value: role._id || role.id || role.name,
            organizationId: getRoleOrganizationId(role)
        })),
    [roleData]
);

const siteOptions = useMemo(
    () =>
        siteData.map((site) => ({
            label: site.name,
            value: site._id || site.id || site.name,
            organizationId: getSiteOrganizationId(site)
        })),
    [siteData]
);


const departmentOptions = useMemo(
    () =>
        departmentData.map((department) => ({
            label: department.name,
            value: department._id || department.id || department.name,
            organizationId: getDepartmentOrganizationId(department)
        })),
    [departmentData]
);


const isRoleSelectionDisabled = isSuperAdmin && !selectedOrganizationId;

useEffect(() => {
    fetchUsers();
    fetchSites();
    fetchRoles();
    fetchDepartments();
    if (isSuperAdmin) {
        fetchOrganizationBasicDetails();
    }
}, [fetchDepartments, fetchUsers, fetchOrganizationBasicDetails, fetchSites, fetchRoles, isSuperAdmin]);

const onSubmit = async (data) => {
    const res = await createUser({
        ...data,
        organizationId: isSuperAdmin ? data.organizationId : getUserOrganizationId(authUser)
    });


if (res) {
    reset({
        ...userDefaultValues,
        organizationId: isSuperAdmin ? userDefaultValues.organizationId : getUserOrganizationId(authUser)
    });
}
    };

const closeDeleteDialog = () => {
    setOpenDelete(false);
    setSelectedRow(null);
};

const closeUpdateDialog = () => {
    setOpenUpdate(false);
    setSelectedRow(null);
};


const handleDelete = async () => {
const id = selectedRow?._id || selectedRow?.id;

setUserData((prev) => prev.filter((user) => (user._id || user.id) !== id));

const success = await deleteUser(id);

if (!success) {
    fetchUsers();
}

closeDeleteDialog();
    };

const handleUpdate = async (id, data) => {
    const payload = Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== undefined)
    );
    payload.organizationId = isSuperAdmin ? payload.organizationId : getUserOrganizationId(authUser);
    const success = await updateUser(id, payload);

    if (success) {
        closeUpdateDialog();
    }
};

return (
    <Grid container spacing={3}>
        <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Create User
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                            <FormInput label="Full Name" name="name" register={register} errors={errors} />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <FormInput label="Email" name="email" register={register} errors={errors} />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <FormInput label="Phone" name="phone" register={register} errors={errors} />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <FormInput label="Employee Code" name="employeeCode" register={register} errors={errors} />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <FormInput
                                label="Password"
                                name="password"
                                register={register}
                                errors={errors}
                                type="password"
                            />
                        </Grid>

                        {isSuperAdmin ? (
                            <Grid item xs={12} sm={6} md={4}>
                                <FormSelect
                                    label="Organization"
                                    name="organizationId"
                                    control={control}
                                    errors={errors}
                                    options={organizationOptions}
                                />
                            </Grid>
                        ) : null}

                        <Grid item xs={12} sm={6} md={4}>
                            <FormSelect
                                label="Role"
                                name="roleId"
                                control={control}
                                errors={errors}
                                options={roleOptions}
                                disabled={isRoleSelectionDisabled}
                                emptyOptionLabel={
                                    isRoleSelectionDisabled
                                        ? "Pehle organization select karo"
                                        : "Select Role"
                                }
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <FormSelect
                                label="Site"
                                name="siteId"
                                control={control}
                                errors={errors}
                                options={siteOptions}
                                disabled={isSuperAdmin && !selectedOrganizationId}
                                emptyOptionLabel={
                                    isSuperAdmin && !selectedOrganizationId
                                        ? "Pehle organization select karo"
                                        : "Select Site"
                                }
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <FormSelect
                                label="Department"
                                name="departmentId"
                                control={control}
                                errors={errors}
                                options={departmentOptions}
                                disabled={isSuperAdmin && !selectedOrganizationId}
                                emptyOptionLabel={
                                    isSuperAdmin && !selectedOrganizationId
                                        ? "Pehle organization select karo"
                                        : "Select Department"
                                }
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <FormSelect
                                label="Status"
                                name="status"
                                control={control}
                                errors={errors}
                                options={userStatusOptions}
                            />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <FormButton type="submit" loading={loading}>
                                Create User
                            </FormButton>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Grid>

        <Grid item xs={12}>
            <CommonTable
                title="Users List"
                columns={userColumns}
                data={userData}
                searchFields={[
                    "name",
                    "email",
                    "phone",
                    "employeeCode",
                    "roleName",
                    "siteName",
                    "departmentName",
                    "status"
                ]}
                searchPlaceholder="Search by name, email, phone, employee code, role, site, department, or status"
                onEdit={(row) => {
                    setSelectedRow(row);
                    setOpenUpdate(true);
                }}
                onDelete={(row) => {
                    setSelectedRow(row);
                    setOpenDelete(true);
                }}
            />
        </Grid>

        <DeleteConfirmDialog
            open={openDelete}
            onClose={closeDeleteDialog}
            onConfirm={handleDelete}
            loading={deleteLoading}
        />

        <UpdateUserDialog
            open={openUpdate}
            onClose={closeUpdateDialog}
            rowData={selectedRow}
            onUpdate={handleUpdate}
            loading={updateLoading}
            organizationOptions={organizationOptions}
            roleOptions={roleOptions}
            siteOptions={siteOptions}
            departmentOptions={departmentOptions}
            isSuperAdmin={isSuperAdmin}
            defaultOrganizationId={getUserOrganizationId(authUser)}
        />
    </Grid>
);
};

export default User;
