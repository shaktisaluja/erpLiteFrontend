import { organizationSchema } from "../schema/organization";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CommonTable from "../components/CommonTable";
import organizationColumns from "../constants/formsColumn/organization";
import FormInput from "../components/form/FormInput";
import FormSelect from "../components/form/FormSelect";
import FormButton from "../components/form/FormButton";
import DeleteConfirmDialog from "../components/dialogBox/DeleteConfirmDialog";
import UpdateOrgDialog from "../components/dialogBox/UpdateOrgDialog";
import { Grid, Paper, Typography } from "@mui/material";
import moment from "moment-timezone";
import { useMemo, useState, useEffect } from "react";
import useOrganization from "../hook/useOrganization";

const OrganizationPage = () => {

    const timeZones = useMemo(() => moment.tz.names(), []);

    // 🔥 use custom hook (ALL LOGIC HERE)
    const {
        orgData,
        loading,
        deleteLoading,
        updateLoading,
        setOrgData,
        createOrganization,
        deleteOrganization,
        updateOrganization,
        fetchOrganizations
    } = useOrganization();

    const [openDelete, setOpenDelete] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(organizationSchema),
        defaultValues: {
            name: "",
            industry: "",
            email: "",
            phone: "",
            subscriptionPlan: "",
            status: "ACTIVE",
            timezone: ""
        }
    });

    useEffect(() => {
        fetchOrganizations();
    }, [fetchOrganizations]);

    // 🔥 Create
    const onSubmit = async (data) => {
        const res = await createOrganization(data);
          if (res) {
    reset(); // bas ye hi rakho
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

    // 🔥 Delete
    const handleDelete = async () => {
        const id = selectedRow?._id;

        // 🔥 instant UI update
        setOrgData((prev) => (prev || []).filter((org) => org._id !== id));

        const success = await deleteOrganization(id);

        if (!success) {
            fetchOrganizations(); // rollback
        }

        closeDeleteDialog();
    };

    // 🔥 Update
    const handleUpdate = async (id, data) => {
        const success = await updateOrganization(id, data);
    };

    return (
        <Grid container spacing={3}>

            {/* FORM */}
            <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Create Organization
                    </Typography>

                    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
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
                                    register={register}
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
                                    register={register}
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
                                    register={register}
                                    errors={errors}
                                    options={timeZones.map((tz) => ({
                                        label: tz,
                                        value: tz
                                    }))}
                                />
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <FormButton type="submit" loading={loading}>
                                    Create Organization
                                </FormButton>
                            </Grid>

                        </Grid>
                    </form>
                </Paper>
            </Grid>

            {/* TABLE */}
            <Grid item xs={12}>
                <CommonTable
                    title="Organization List"
                    columns={organizationColumns}
                    data={orgData}
                    searchFields={[
                        "name",
                        "industry",
                        "email",
                        "phone",
                        "subscriptionPlan",
                        "status",
                        "timezone"
                    ]}
                    searchPlaceholder="Search organizations by name, industry, email, phone, plan, status, or timezone"
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

            {/* DELETE */}
            <DeleteConfirmDialog
                open={openDelete}
                onClose={closeDeleteDialog}
                onConfirm={handleDelete}
                loading={deleteLoading}
            />

            {/* UPDATE */}
            <UpdateOrgDialog
                open={openUpdate}
                onClose={closeUpdateDialog}
                rowData={selectedRow}
                onUpdate={handleUpdate}
                loading={updateLoading}
            />

        </Grid>
    );
};

export default OrganizationPage;
