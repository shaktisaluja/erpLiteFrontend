import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    IconButton,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { roleSchema } from "../../schema/role";
import {
    roleDefaultValues,
    roleStatusOptions,
    rolePermissionGroups
} from "../../constants/formsColumn/roleForm";
import FormInput from "../form/FormInput";
import FormSelect from "../form/FormSelect";
import FormButton from "../form/FormButton";
import PermissionSelector from "../PermissionSelector";

const getOrganizationValue = (organization, fallback = "") =>
    organization?._id ||
    organization?.id ||
    organization?.orgName ||
    organization?.name ||
    organization ||
    fallback;

const UpdateRoleDialog = ({
    open,
    onClose,
    rowData,
    onUpdate,
    loading,
    organizationOptions = [],
    isSuperAdmin = false,
    defaultOrganization = "",
    permissionGroups = rolePermissionGroups
}) => {
    const [expanded, setExpanded] = useState(false);
    const formValues = open && rowData ? {
        name: rowData.name || "",
        organization: getOrganizationValue(rowData.organization, defaultOrganization || ""),
        status: String(rowData.status || roleDefaultValues.status).toLowerCase(),
        permissions: rowData.permissions || []
    } : {
        ...roleDefaultValues,
        organization: defaultOrganization || roleDefaultValues.organization
    };

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(roleSchema),
        values: formValues
    });

    const selectedPermissions = watch("permissions") || [];

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

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                Edit Role
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <form
                autoComplete="off"
                onSubmit={handleSubmit((data) =>
                    onUpdate(rowData?._id || rowData?.id, {
                        ...data,
                        organization: isSuperAdmin ? data.organization : defaultOrganization
                    })
                )}
            >
                <DialogContent dividers>
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
                                        permissionGroups={permissionGroups}
                                        selectedPermissions={selectedPermissions}
                                        onToggle={handlePermissionToggle}
                                        onSelectAll={handleSelectAllGroup}
                                    />
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                    </Grid>
                </DialogContent>

                <Grid container justifyContent="flex-end" sx={{ p: 2 }}>
                    <Grid item xs={12} sm={3}>
                        <FormButton type="submit" loading={loading}>
                            Update Role
                        </FormButton>
                    </Grid>
                </Grid>
            </form>
        </Dialog>
    );
};

export default UpdateRoleDialog;
