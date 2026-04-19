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
import UpdateDepartmentDialog from "../components/dialogBox/UpdateDepartmentDialog";
import departmentColumns from "../constants/formsColumn/department";
import {
    departmentDefaultValues,
    departmentStatusOptions
} from "../constants/formsColumn/departmentForm";
import { departmentSchema } from "../schema/department";
import useDepartment from "../hook/useDepartment";
import useOrganization from "../hook/useOrganization";

const normalizeRole = (role) => String(role || "").toLowerCase().replace(/\s+/g, "");

const getOrganizationId = (user) =>
    user?.organizationId ||
    user?.organization?._id ||
    user?.organization?.id ||
    user?.organization ||
    "";

const Department = () => {
    const authUser = useSelector((state) => state.auth.user);
    const isSuperAdmin = normalizeRole(authUser?.role) === "superadmin";
    const {
        departmentData,
        loading,
        deleteLoading,
        updateLoading,
        setDepartmentData,
        fetchDepartments,
        createDepartment,
        deleteDepartment,
        updateDepartment
    } = useDepartment();
    const { orgData, fetchOrganizationBasicDetails } = useOrganization();

    const [openDelete, setOpenDelete] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const organizationOptions = useMemo(
        () =>
            orgData.map((organization) => ({
                label: organization.orgName,
                value: organization._id || organization.id || ""
            })),
        [orgData]
    );

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(departmentSchema),
        defaultValues: {
            ...departmentDefaultValues,
            organization: isSuperAdmin ? departmentDefaultValues.organization : getOrganizationId(authUser)
        }
    });

    useEffect(() => {
        fetchDepartments();
        if (isSuperAdmin) {
            fetchOrganizationBasicDetails();
        }
    }, [fetchDepartments, fetchOrganizationBasicDetails, isSuperAdmin]);

    const onSubmit = async (data) => {
        const payload = {
            ...data,
            organization: isSuperAdmin ? data.organization : getOrganizationId(authUser)
        };
        const res = await createDepartment(payload);

        if (res) {
            reset({
                ...departmentDefaultValues,
                organization: isSuperAdmin ? departmentDefaultValues.organization : getOrganizationId(authUser)
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

        setDepartmentData((prev) =>
            prev.filter((department) => (department._id || department.id) !== id)
        );

        const success = await deleteDepartment(id);

        if (!success) {
            fetchDepartments();
        }

        closeDeleteDialog();
    };

    const handleUpdate = async (id, data) => {
        const success = await updateDepartment(id, {
            ...data,
            organization: isSuperAdmin ? data.organization : getOrganizationId(authUser)
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
                        Create Department
                    </Typography>

                    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <FormInput label="Department Name" name="name" register={register} errors={errors} />
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
                                <FormInput label="Description" name="description" register={register} errors={errors} />
                            </Grid>


                            <Grid item xs={12} md={6}>
                                <FormSelect
                                    label="Status"
                                    name="status"
                                    control={control}
                                    errors={errors}
                                    options={departmentStatusOptions}
                                />
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <FormButton type="submit" loading={loading}>
                                    Create Department
                                </FormButton>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Grid>

            <Grid item xs={12}>
                <CommonTable
                    title="Departments List"
                    columns={departmentColumns}
                    data={departmentData}
                    searchFields={[
                        "name",
                        "organization",
                        "description",
                        "status"
                    ]}
                    searchPlaceholder="Search departments by name, organization, description, or status"
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

            <UpdateDepartmentDialog
                open={openUpdate}
                onClose={closeUpdateDialog}
                rowData={selectedRow}
                onUpdate={handleUpdate}
                loading={updateLoading}
                organizationOptions={organizationOptions}
                isSuperAdmin={isSuperAdmin}
                defaultOrganization={getOrganizationId(authUser)}
            />
        </Grid>
    );
};

export default Department;
