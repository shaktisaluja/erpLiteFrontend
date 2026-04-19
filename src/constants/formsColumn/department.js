const departmentColumns = [
    { field: "name", headerName: "Department Name" },
    { field: "organization", headerName: "Organization",  render: (row) => row.organization?.orgName || row.organization?.name || row.organization || "" },
    { field: "description", headerName: "Description" },
    { field: "status", headerName: "Status" }
];

export default departmentColumns;
