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
import { departmentSchema } from "../../schema/department";
import {
    departmentDefaultValues,
    departmentStatusOptions
} from "../../constants/formsColumn/departmentForm";
import FormInput from "../form/FormInput";
import FormSelect from "../form/FormSelect";
import FormButton from "../form/FormButton";

const UpdateDepartmentDialog = ({
    open,
    onClose,
    rowData,
    onUpdate,
    loading,
    organizationOptions = [],
    isSuperAdmin = false,
    defaultOrganization = ""
}) => {
    const formValues = open && rowData ? {
        name: rowData.name || "",
        organization: rowData.organization || defaultOrganization || "",
        description: rowData.description || "",
        status: rowData.status || departmentDefaultValues.status
    } : {
        ...departmentDefaultValues,
        organization: defaultOrganization || departmentDefaultValues.organization
    };

    const {
        register,
        handleSubmit,
        control,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(departmentSchema),
        values: formValues
    });

    const onSubmit = (data) => {
        onUpdate(rowData?._id || rowData?.id, {
            ...data,
            organization: isSuperAdmin ? data.organization : defaultOrganization
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                Edit Department
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <DialogContent dividers>
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

                        <Grid item xs={12}>
                            <FormInput
                                label="Description"
                                name="description"
                                register={register}
                                errors={errors}
                                multiline
                                rows={3}
                            />
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
                    </Grid>
                </DialogContent>

                <Grid container justifyContent="flex-end" sx={{ p: 2 }}>
                    <Grid item xs={12} sm={3}>
                        <FormButton type="submit" loading={loading}>
                            Update Department
                        </FormButton>
                    </Grid>
                </Grid>
            </form>
        </Dialog>
    );
};

export default UpdateDepartmentDialog;
