import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const TableSearchBar = ({
  value,
  onChange,
  placeholder = "Search records..."
}) => {
  return (
    <TextField
      fullWidth
      size="small"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      sx={{ maxWidth: 360, mb: 2 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        )
      }}
    />
  );
};

export default TableSearchBar;
