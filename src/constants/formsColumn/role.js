const roleColumns = [
    { field: "name", headerName: "Role Name" },
    { field: "organization", headerName: "Organization",
        render: (row) => row.organization?.orgName || row.organization?.name || row.organization || ""
    },
    { field: "status", headerName: "Status" },
    {
        field: "permissions",
        headerName: "Permissions Count",
        render: (row) => `${row.permissions?.length || 0} Permissions`
    }
];

export default roleColumns;
