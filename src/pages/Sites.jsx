import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Grid, Paper, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import CommonTable from "../components/CommonTable";
import FormInput from "../components/form/FormInput";
import FormSelect from "../components/form/FormSelect";
import FormButton from "../components/form/FormButton";
import DeleteConfirmDialog from "../components/dialogBox/DeleteConfirmDialog";
import UpdateSiteDialog from "../components/dialogBox/UpdateSiteDialog";
import siteColumns from "../constants/formsColumn/site";
import moment from "moment-timezone";
import {
  siteDefaultValues,
  siteStatusOptions,
} from "../constants/formsColumn/siteForm";
import { siteSchema } from "../schema/site";
import useSite from "../hook/useSite";
import useOrganization from "../hook/useOrganization";

const normalizeRole = (role) => String(role || "").toLowerCase().replace(/\s+/g, "");

const getSiteOrganizationValue = (user) =>
  user?.organizationId ||
  user?.organization?._id ||
  user?.organization?.id ||
  user?.organizationName ||
  user?.organization?.name ||
  user?.organization ||
  "";

const Site = () => {
  const authUser = useSelector((state) => state.auth.user);
  const isSuperAdmin = normalizeRole(authUser?.role) === "superadmin";
  const {
    siteData,
    loading,
    deleteLoading,
    updateLoading,
    setSiteData,
    fetchSites,
    createSite,
    deleteSite,
    updateSite
  } = useSite();
  const { orgData, fetchOrganizationBasicDetails } = useOrganization();

  .log("siteData", siteData);

const timeZones = useMemo(() => moment.tz.names(), []);
const organizationOptions = useMemo(
  () =>
    orgData.map((organization) => ({
      label: organization.orgName,
      value: organization._id
    })),
  [orgData]
);

const [openDelete, setOpenDelete] = useState(false);
const [openUpdate, setOpenUpdate] = useState(false);
const [selectedRow, setSelectedRow] = useState(null);

const {
  register,
  handleSubmit,
  control,
  reset,
  formState: { errors }
} = useForm({
  resolver: zodResolver(siteSchema),
  defaultValues: {
    ...siteDefaultValues,
    organization: isSuperAdmin ? siteDefaultValues.organization : getSiteOrganizationValue(authUser)
  }
});

useEffect(() => {
  fetchSites();
  if (isSuperAdmin) {
    fetchOrganizationBasicDetails();
  }
}, [fetchSites, fetchOrganizationBasicDetails, isSuperAdmin]);

const onSubmit = async (data) => {
  const res = await createSite({
    ...data,
    organization: isSuperAdmin ? data.organization : getSiteOrganizationValue(authUser)
  });

  if (res) {
    reset({
      ...siteDefaultValues,
      organization: isSuperAdmin ? siteDefaultValues.organization : getSiteOrganizationValue(authUser)
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

  setSiteData((prev) => prev.filter((site) => (site._id || site.id) !== id));

  const success = await deleteSite(id);

  if (!success) {
    fetchSites();
  }

  closeDeleteDialog();
};

const handleUpdate = async (id, data) => {
  const success = await updateSite(id, {
    ...data,
    organization: isSuperAdmin ? data.organization : getSiteOrganizationValue(authUser)
  });

  if (success) {
    closeUpdateDialog();
  }
};

return (
  <Grid container spacing={3}>
    {/* FORM */}
    <Grid item xs={12}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Create Site
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
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
              <FormInput
                label="Address"
                name="address"
                register={register}
                errors={errors}
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormInput label="City" name="city" register={register} errors={errors} />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormInput label="State" name="state" register={register} errors={errors} />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormInput label="Country" name="country" register={register} errors={errors} />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <FormSelect
                label="Status"
                name="status"
                control={control}
                errors={errors}
                options={siteStatusOptions}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
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

            <Grid item xs={12} md={3}>
              <FormButton type="submit" loading={loading}>
                Create Site
              </FormButton>
            </Grid>

          </Grid>
        </form>
      </Paper>
    </Grid>

    {/* TABLE */}
    <Grid item xs={12}>
      <CommonTable
        title="Site List"
        columns={siteColumns}
        data={siteData}
        searchFields={[
          "name",
          "code",
          (row) => row.organization?.orgName || row.organization?.name || row.organization || "",
          "location",
          "city",
          "state",
          "country",
          "status",
          "timezone"
        ]}
        searchPlaceholder="Search sites by name, code, organization, location, city, state, country, status, or timezone"
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

    <UpdateSiteDialog
      open={openUpdate}
      onClose={closeUpdateDialog}
      rowData={selectedRow}
      onUpdate={handleUpdate}
      loading={updateLoading}
      organizationOptions={organizationOptions}
      isSuperAdmin={isSuperAdmin}
      defaultOrganization={getSiteOrganizationValue(authUser)}
    />

  </Grid>
);
};

export default Site;
