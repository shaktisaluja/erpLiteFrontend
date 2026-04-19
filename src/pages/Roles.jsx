import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Grid,
    Paper,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSelector } from "react-redux";
import { roleSchema } from "../schema/role";
import CommonTable from "../components/CommonTable";
import PermissionSelector from "../components/PermissionSelector";
import FormInput from "../components/form/FormInput";
import FormSelect from "../components/form/FormSelect";
import FormButton from "../components/form/FormButton";
import DeleteConfirmDialog from "../components/dialogBox/DeleteConfirmDialog";
import UpdateRoleDialog from "../components/dialogBox/UpdateRoleDialog";
import roleColumns from "../constants/formsColumn/role";
import {
    roleDefaultValues,
    roleStatusOptions,
    rolePermissionGroups
} from "../constants/formsColumn/roleForm";
import useRole from "../hook/useRole";
import useOrganization from "../hook/useOrganization";

const normalizeRole = (role) => String(role || "").toLowerCase().replace(/\s+/g, "");

const getRoleOrganizationValue = (user) =>
    user?.organizationId ||
    user?.organization?._id ||
    user?.organization?.id ||
    user?.organizationName ||
    user?.organization?.name ||
    user?.organization ||
    "";

const Roles = () => {
    const authUser = useSelector((state) => state.auth.user);
    const isSuperAdmin = normalizeRole(authUser?.role) === "superadmin";
    const {
        roleData,
        loading,
        deleteLoading,
        updateLoading,
        setRoleData,
        fetchRoles,
        createRole,
        deleteRole,
        updateRole
    } = useRole();

    const { orgData, fetchOrganizationBasicDetails } = useOrganization();

    .log("orgData inside fxn ", orgData);

const [expanded, setExpanded] = useState(false);
const [openDelete, setOpenDelete] = useState(false);
const [openUpdate, setOpenUpdate] = useState(false);
const [selectedRow, setSelectedRow] = useState(null);

const organizationOptions = useMemo(
    () =>
        orgData.map((organization) => ({
            label: organization.orgName,
            value: organization._id
        })),
    [orgData]
);

const visiblePermissionGroups = useMemo(() => {
    if (isSuperAdmin) {
        return rolePermissionGroups;
    }

    const { Organizations, ...restGroups } = rolePermissionGroups;
    return restGroups;
}, [isSuperAdmin]);

const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors }
} = useForm({
    resolver: zodResolver(roleSchema),
    defaultValues: {
        ...roleDefaultValues,
        organization: isSuperAdmin ? roleDefaultValues.organization : getRoleOrganizationValue(authUser)
    }
});

const selectedPermissions = watch("permissions") || [];

useEffect(() => {
    fetchRoles();
    if (isSuperAdmin) {
        fetchOrganizationBasicDetails();
    }
}, [fetchRoles, fetchOrganizationBasicDetails, isSuperAdmin]);

const handlePermissionToggle = (permission) => {
    const current = [...selectedPermissions];
    const index = current.indexOf(permission);

    if (index > -1) {
        current.splice(index, 1);
    } else {
        current.push(permission);
    }

    setValue("permissions", current, { shouldValidate: true });
};

const handleSelectAllGroup = (groupPermissions) => {
    const allSelected = groupPermissions.every((permission) =>
        selectedPermissions.includes(permission)
    );

    const nextPermissions = allSelected
        ? selectedPermissions.filter((permission) => !groupPermissions.includes(permission))
        : Array.from(new Set([...selectedPermissions, ...groupPermissions]));

    setValue("permissions", nextPermissions, { shouldValidate: true });
};

const onSubmit = async (data) => {
    const payload = {
        ...data,
        organization: isSuperAdmin ? data.organization : getRoleOrganizationValue(authUser)
    };
    const res = await createRole(payload);

    if (res) {
        reset({
            ...roleDefaultValues,
            organization: isSuperAdmin ? roleDefaultValues.organization : getRoleOrganizationValue(authUser)
        });
        setExpanded(false);
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

    setRoleData((prev) => prev.filter((role) => (role._id || role.id) !== id));

    const success = await deleteRole(id);

    if (!success) {
        fetchRoles();
    }

    closeDeleteDialog();
};

const handleUpdate = async (id, data) => {
    const success = await updateRole(id, {
        ...data,
        organization: isSuperAdmin ? data.organization : getRoleOrganizationValue(authUser)
    });

    if (success) {
        closeUpdateDialog();
    }
};

return (
    <Grid container spacing={3}>
        <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Create Role
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <FormInput label="Role Name" name="name" register={register} errors={errors} />
                        </Grid>

                        {isSuperAdmin ? (
                            <Grid item xs={12} md={6}>
                                <FormSelect
                                    label="Organization"
                                    name="organization"
                                    control={control}
                                    errors={errors}
                                    options={organizationOptions}
                                />
                            </Grid>
                        ) : null}

                        <Grid item xs={12} md={6}>
                            <FormSelect
                                label="Status"
                                name="status"
                                control={control}
                                errors={errors}
                                options={roleStatusOptions}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Accordion expanded={expanded} onChange={() => setExpanded((prev) => !prev)}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography fontWeight={600}>
                                        Permissions ({selectedPermissions.length} selected)
                                    </Typography>
                                </AccordionSummary>

                                <AccordionDetails>
                                    <PermissionSelector
                                        permissionGroups={visiblePermissionGroups}
                                        selectedPermissions={selectedPermissions}
                                        onToggle={handlePermissionToggle}
                                        onSelectAll={handleSelectAllGroup}
                                    />
                                </AccordionDetails>
                            </Accordion>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <FormButton type="submit" loading={loading}>
                                Create Role
                            </FormButton>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Grid>

        <Grid item xs={12}>
            <CommonTable
                title="Roles List"
                columns={roleColumns}
                data={roleData}
                searchFields={[
                    "name",
                    (row) => row.organization?.orgName || row.organization?.name || row.organization || "",
                    "status",
                    (row) => row.permissions?.join(" ") || ""
                ]}
                searchPlaceholder="Search roles by role name, organization, status, or permissions"
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

        <UpdateRoleDialog
            open={openUpdate}
            onClose={closeUpdateDialog}
            rowData={selectedRow}
            onUpdate={handleUpdate}
            loading={updateLoading}
            organizationOptions={organizationOptions}
            isSuperAdmin={isSuperAdmin}
            defaultOrganization={getRoleOrganizationValue(authUser)}
            permissionGroups={visiblePermissionGroups}
        />
    </Grid>
);
};

export default Roles;
