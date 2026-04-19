import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { organizationSchema } from "../../schema/organization";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment-timezone";
import FormInput from "../form/FormInput";
import FormSelect from "../form/FormSelect";
import FormButton from "../form/FormButton";

const timeZones = moment.tz.names();

const UpdateOrgDialog = ({ open, onClose, rowData, onUpdate, loading }) => {
    const formValues = open && rowData ? {
        name: rowData.name || "",
        industry: rowData.industry || "",
        email: rowData.email || "",
        phone: rowData.phone || "",
        subscriptionPlan: rowData.subscriptionPlan || "",
        status: rowData.status || "active",
        timezone: rowData.timezone || ""
    } : undefined;


const {
    register,
    handleSubmit,
    control,
    formState: { errors }
} = useForm({
    resolver: zodResolver(organizationSchema),
    values: formValues       // react-hook-form syncs this whenever it changes
});

const onSubmit = (data) => {
    onUpdate(rowData?._id || rowData?.id, data);
};

return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            Edit Organization
            <IconButton onClick={onClose} size="small">
                <CloseIcon />
            </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <DialogContent dividers>
                <Grid container spacing={2}>

                    <Grid item xs={12} md={6}>
                        <FormInput label="Organization Name" name="name" register={register} errors={errors} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormInput label="Industry" name="industry" register={register} errors={errors} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormInput label="Email" name="email" register={register} errors={errors} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormInput label="Phone" name="phone" register={register} errors={errors} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <FormSelect
                            label="Subscription Plan"
                            name="subscriptionPlan"
                            control={control}
                            errors={errors}
                            options={[
                                { label: "Free", value: "free" },
                                { label: "Basic", value: "basic" },
                                { label: "Premium", value: "premium" },
                                { label: "Enterprise", value: "enterprise" }
                            ]}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <FormSelect
                            label="Status"
                            name="status"
                            control={control}
                            errors={errors}
                            options={[
                                { label: "Active", value: "active" },
                                { label: "Inactive", value: "inactive" }
                            ]}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <FormSelect
                            label="Time Zone"
                            name="timezone"
                            control={control}
                            errors={errors}
                            options={timeZones.map((tz) => ({
                                label: tz,
                                value: tz
                            }))}
                        />
                    </Grid>

                </Grid>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <FormButton
                    type="button"
                    variant="outlined"
                    fullWidth={false}
                    sx={{ minWidth: 100 }}
                    onClick={onClose}
                >
                    Cancel
                </FormButton>

                <FormButton
                    type="submit"
                    loading={loading}
                    fullWidth={false}
                    sx={{ minWidth: 140 }}
                >
                    Update Organization
                </FormButton>
            </DialogActions>
        </form>
    </Dialog>
);
};

export default UpdateOrgDialog;
