import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { updateUserSchema } from "../../schema/user";
import { userDefaultValues, userStatusOptions } from "../../constants/formsColumn/userForm";
import FormInput from "../form/FormInput";
import FormSelect from "../form/FormSelect";
import FormButton from "../form/FormButton";

const getUserOrganizationId = (rowData, fallback = "") =>
    rowData?.organizationId ||
    rowData?.organization?._id ||
    rowData?.organization?.id ||
    rowData?.organization ||
    fallback;

const getDepartmentId = (rowData) =>
    rowData?.departmentId ||
    rowData?.department?._id ||
    rowData?.department?.id ||
    rowData?.department ||
    "";

const UpdateUserDialog = ({
    open,
    onClose,
    rowData,
    onUpdate,
    loading,
    organizationOptions = [],
    roleOptions = [],
    siteOptions = [],
    departmentOptions = [],
    isSuperAdmin = false,
    defaultOrganizationId = ""
}) => {
    const formValues = open && rowData ? {
        name: rowData.name || "",
        email: rowData.email || "",
        phone: rowData.phone || "",
        employeeCode: rowData.employeeCode || "",
        password: "",
        organizationId: rowData.organizationId || defaultOrganizationId || "",
        roleId: rowData.roleId || "",
        siteId: rowData.siteId || "",
        departmentId: getDepartmentId(rowData),
        status: rowData.status || userDefaultValues.status
    } : {
        ...userDefaultValues,
        organizationId: defaultOrganizationId || userDefaultValues.organizationId
    };

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(updateUserSchema),
        values: formValues
    });

    const selectedOrganizationId = watch("organizationId");
    const isRoleSelectionDisabled = isSuperAdmin && !selectedOrganizationId;

    const filteredRoleOptions = roleOptions.filter((role) => {
        const targetOrganizationId = isSuperAdmin
            ? selectedOrganizationId
            : getUserOrganizationId(rowData, defaultOrganizationId);

        if (!targetOrganizationId) {
            return isSuperAdmin ? false : true;
        }

        return String(role.organizationId || "") === String(targetOrganizationId);
    });

    const filteredSiteOptions = siteOptions.filter((site) => {
        const targetOrganizationId = isSuperAdmin
            ? selectedOrganizationId
            : getUserOrganizationId(rowData, defaultOrganizationId);

        if (!targetOrganizationId) {
            return isSuperAdmin ? false : true;
        }

        return String(site.organizationId || "") === String(targetOrganizationId);
    });

    const filteredDepartmentOptions = departmentOptions.filter((department) => {
        const targetOrganizationId = isSuperAdmin
            ? selectedOrganizationId
            : getUserOrganizationId(rowData, defaultOrganizationId);

        if (!targetOrganizationId) {
            return isSuperAdmin ? false : true;
        }

        return String(department.organizationId || "") === String(targetOrganizationId);
    });

    const handleUpdate = (data) => {
        const payload = data.password ? data : { ...data, password: undefined };
        payload.organizationId = isSuperAdmin ? payload.organizationId : defaultOrganizationId;
        onUpdate(rowData?._id || rowData?.id, payload);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                Edit User
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit(handleUpdate)} autoComplete="off">
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <FormInput label="Full Name" name="name" register={register} errors={errors} />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormInput label="Email" name="email" register={register} errors={errors} />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FormInput label="Phone" name="phone" register={register} errors={errors} />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FormInput label="Employee Code" name="employeeCode" register={register} errors={errors} />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FormInput
                                label="Password"
                                name="password"
                                register={register}
                                errors={errors}
                                type="password"
                            />
                        </Grid>

                        {isSuperAdmin ? (
                            <Grid item xs={12} md={4}>
                                <FormSelect
                                    label="Organization"
                                    name="organizationId"
                                    control={control}
                                    errors={errors}
                                    options={organizationOptions}
                                />
                            </Grid>
                        ) : null}

                        <Grid item xs={12} md={4}>
                            <FormSelect
                                label="Role"
                                name="roleId"
                                control={control}
                                errors={errors}
                                options={filteredRoleOptions}
                                disabled={isRoleSelectionDisabled}
                                emptyOptionLabel={
                                    isRoleSelectionDisabled
                                        ? "Pehle organization select karo"
                                        : "Select Role"
                                }
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FormSelect
                                label="Site"
                                name="siteId"
                                control={control}
                                errors={errors}
                                options={filteredSiteOptions}
                                disabled={isSuperAdmin && !selectedOrganizationId}
                                emptyOptionLabel={
                                    isSuperAdmin && !selectedOrganizationId
                                        ? "Pehle organization select karo"
                                        : "Select Site"
                                }
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FormSelect
                                label="Department"
                                name="departmentId"
                                control={control}
                                errors={errors}
                                options={filteredDepartmentOptions}
                                disabled={isSuperAdmin && !selectedOrganizationId}
                                emptyOptionLabel={
                                    isSuperAdmin && !selectedOrganizationId
                                        ? "Pehle organization select karo"
                                        : "Select Department"
                                }
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FormSelect
                                label="Status"
                                name="status"
                                control={control}
                                errors={errors}
                                options={userStatusOptions}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <Grid container justifyContent="flex-end" sx={{ p: 2 }}>
                    <Grid item xs={12} sm={3}>
                        <FormButton type="submit" loading={loading}>
                            Update User
                        </FormButton>
                    </Grid>
                </Grid>
            </form>
        </Dialog>
    );
};

export default UpdateUserDialog;
