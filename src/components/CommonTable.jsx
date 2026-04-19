import React, { memo, useMemo, useState } from "react";
import { Paper, Typography, Box, IconButton, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TableSearchBar from "./TableSearchBar";

const getValueByPath = (row, path) => {
  if (!path) {
    return "";
  }

  return String(
    path.split(".").reduce((current, key) => current?.[key], row) ?? ""
  );
};

const getSearchableValue = (row, field) => {
  if (typeof field === "function") {
    return String(field(row) ?? "");
  }

  return getValueByPath(row, field);
};

const CommonTable = ({
  title,
  columns = [],
  data = [],
  onEdit,
  onDelete,
  searchFields = [],
  searchPlaceholder = "Search records..."
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const rows = useMemo(() => {
    const items = Array.isArray(data) ? data : data?.items || [];
    return items.map((row, index) => ({
      id: row.id || row._id || index,
      ...row
    }));
  }, [data]);

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return rows;
    }

    return rows.filter((row) =>
      searchFields.some((field) =>
        getSearchableValue(row, field).toLowerCase().includes(normalizedSearch)
      )
    );
  }, [rows, searchFields, searchTerm]);

  const gridColumns = useMemo(() => {
    return [
      ...columns.map((col) => ({
        field: col.field,
        headerName: col.headerName,
        flex: 1,
        minWidth: 150,
        renderCell: col.render
          ? (params) => col.render(params.row)
          : undefined
      })),

      {
        field: "actions",
        headerName: "Actions",
        minWidth: 130,
        sortable: false,
        renderCell: (params) => (
          <>
            <Tooltip title="Edit">
              <IconButton
                color="primary"
                onClick={() => onEdit && onEdit(params.row)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton
                color="error"
                onClick={() => onDelete && onDelete(params.row)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </>
        )
      }
    ];
  }, [columns, onEdit, onDelete]);

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      {title && (
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      )}

      <TableSearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder={searchPlaceholder}
      />

      <Box sx={{ height: 450, width: "100%" }}>
        <DataGrid
          rows={filteredRows}
          columns={gridColumns}
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5 }
            }
          }}
          disableRowSelectionOnClick
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f8fafc",
              fontWeight: "bold"
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#f1f5f9"
            }
          }}
        />
      </Box>
    </Paper>
  );
};

// 🔥 memo wrap
export default memo(CommonTable);
