import ALL_PERMISSIONS from "../allPermission";

export const roleDefaultValues = {
    name: "",
    organization: "",
    status: "active",
    permissions: []
};

export const roleStatusOptions = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" }
];

export const groupPermissions = (permissions) => ({
    Users: permissions.filter((permission) => permission.startsWith("USER_")),
    Organizations: permissions.filter((permission) => permission.startsWith("ORG_")),
    Roles: permissions.filter((permission) => permission.startsWith("ROLE_")),
    Departments: permissions.filter((permission) => permission.startsWith("DEPARTMENT_")),
    Sites: permissions.filter((permission) => permission.startsWith("SITE_")),
    Dashboard: permissions.filter((permission) => permission.startsWith("DASHBOARD_"))
});

export const rolePermissionGroups = groupPermissions(ALL_PERMISSIONS);
