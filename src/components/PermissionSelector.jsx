// src/components/PermissionSelector.jsx
import React from "react";
import {
  Box,
  Grid,
  Typography,
  Checkbox,
  FormControlLabel,
  Divider,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip
} from "@mui/material";
import { ChevronDown, Lock } from "lucide-react";

const PermissionSelector = ({
  permissionGroups,
  selectedPermissions,
  onToggle,
  onSelectAll
}) => {
  return (
    <Grid item xs={12}>
      <Accordion
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "8px !important",
          "&:before": { display: "none" }
        }}
      >
        <AccordionSummary
          expandIcon={<ChevronDown size={20} />}
          sx={{
            "&:hover": { bgcolor: "#eef2ff" },
            "&.Mui-expanded": {
              bgcolor: "#eef2ff",
              borderBottom: "1px solid",
              borderColor: "divider"
            },
            transition: "background-color 0.2s"
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
            <Lock size={17} style={{ color: "#64748b" }} />
            <Typography fontWeight="600" sx={{ fontSize: "0.95rem" }}>
              Configure Permissions
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            {selectedPermissions.length > 0 && (
              <Chip
                label={`${selectedPermissions.length} selected`}
                size="small"
                sx={{
                  height: 22,
                  fontSize: "0.72rem",
                  bgcolor: "#4f46e5",
                  color: "white",
                  fontWeight: "600"
                }}
              />
            )}
          </Box>
        </AccordionSummary>

        <AccordionDetails sx={{ px: 2, pb: 2 }}>
          {Object.entries(permissionGroups).map(([group, perms]) => {
            const allSelected = perms.every(p => selectedPermissions.includes(p));

            return (
              <Box key={group} sx={{ mb: 3 }}>
                {/* Group Header */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="700" sx={{ color: "#4338ca" }}>
                    {group}
                  </Typography>

                  <Button
                    type="button"
                    size="small"
                    variant="text"
                    onClick={() => onSelectAll(perms)}
                    sx={{ fontSize: "0.7rem", minWidth: 0, p: 0, textTransform: "none" }}
                  >
                    {allSelected ? "Unselect All" : "Select All"}
                  </Button>
                </Box>

                <Divider sx={{ mb: 1.5 }} />

                {/* Permissions */}
                <Grid container spacing={1}>
                  {perms.map((perm) => (
                    <Grid item xs={12} sm={6} key={perm}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            checked={selectedPermissions.includes(perm)}
                            onChange={() => onToggle(perm)}
                          />
                        }
                        label={
                          <Typography variant="body2" sx={{ fontSize: "0.82rem" }}>
                            {perm.replaceAll("_", " ")}
                          </Typography>
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            );
          })}
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
};

export default PermissionSelector;