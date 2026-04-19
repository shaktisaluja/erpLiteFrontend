const siteColumns = [
    { field: "name", headerName: "Site Name" },
    { field: "code", headerName: "Code" },
    { field: "organization", headerName: "Organization", render: (row) => row.organization?.orgName || row.organization?.name || row.organization || "" },
    { field: "location", headerName: "Location" },
    { field: "city", headerName: "City" },
    { field: "state", headerName: "State" },
    { field: "country", headerName: "Country" },
    { field: "status", headerName: "Status" },
    { field: "timezone", headerName: "Timezone" }
];

export default siteColumns;
