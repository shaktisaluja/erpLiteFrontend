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
import { siteSchema } from "../../schema/site";
import {
    siteDefaultValues,
    siteStatusOptions,
    siteTimeZoneOptions
} from "../../constants/formsColumn/siteForm";
import FormInput from "../form/FormInput";
import FormSelect from "../form/FormSelect";
import FormButton from "../form/FormButton";

const UpdateSiteDialog = ({
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
        code: rowData.code || "",
        organization: rowData.organization || defaultOrganization || "",
        location: rowData.location || "",
        address: rowData.address || "",
        city: rowData.city || "",
        state: rowData.state || "",
        country: rowData.country || "",
        status: rowData.status || siteDefaultValues.status,
        timezone: rowData.timezone || ""
    } : {
        ...siteDefaultValues,
        organization: defaultOrganization || siteDefaultValues.organization
    };

    const {
        register,
        handleSubmit,
        control,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(siteSchema),
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
                Edit Site
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <FormInput label="Site Name" name="name" register={register} errors={errors} />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormInput label="Code" name="code" register={register} errors={errors} />
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
                            <FormInput label="Location" name="location" register={register} errors={errors} />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormInput label="Address" name="address" register={register} errors={errors} />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FormInput label="City" name="city" register={register} errors={errors} />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FormInput label="State" name="state" register={register} errors={errors} />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FormInput label="Country" name="country" register={register} errors={errors} />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormSelect
                                label="Status"
                                name="status"
                                control={control}
                                errors={errors}
                                options={siteStatusOptions}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormSelect
                                label="Time Zone"
                                name="timezone"
                                control={control}
                                errors={errors}
                                options={siteTimeZoneOptions}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <Grid container justifyContent="flex-end" sx={{ p: 2 }}>
                    <Grid item xs={12} sm={3}>
                        <FormButton type="submit" loading={loading}>
                            Update Site
                        </FormButton>
                    </Grid>
                </Grid>
            </form>
        </Dialog>
    );
};

export default UpdateSiteDialog;
