import { TextField, MenuItem } from "@mui/material";
import { Controller } from "react-hook-form";

const FormSelect = ({
    label,
    name,
    register,
    control,        // if passed, uses Controller (proper controlled select)
    errors = {},
    options = [],
    emptyOptionLabel,
    sx = {},
    ...props
}) => {

    .log("options", options);

const sharedProps = {
    select: true,
    label,
    fullWidth: true,
    autoComplete: "off",
    error: !!errors[name],
    helperText: errors[name]?.message,
    InputLabelProps: { shrink: true },
    sx: {
        minWidth: "200px",
        "& .MuiInputBase-root": { height: "56px" },
        ...sx
    },
    ...props
};

const menuItems = [
    <MenuItem key="default" value="">
        <em>{emptyOptionLabel || `Select ${label}`}</em>
    </MenuItem>,
    ...options.map((opt) => (
            .log("opt", opt),
        <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
        </MenuItem>
    ))
];

// Controlled mode via Controller — needed for reset() to work on selects
if (control) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <TextField {...sharedProps} {...field}>
                    {menuItems}
                </TextField>
            )}
        />
    );
}

// Uncontrolled mode via register (default)
return (
    <TextField {...sharedProps} {...register(name)}>
        {menuItems}
    </TextField>
);
};

export default FormSelect;
