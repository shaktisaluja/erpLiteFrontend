import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";   

const FormInput = ({ label, name, register, errors, ...props }) => {
    const autoComplete =
        props.autoComplete ||
        (props.type === "password" ? "new-password" : "off");

    return (
        <TextField
            label={label}
            fullWidth
            autoComplete={autoComplete}
            {...register(name)}
            error={!!errors[name]}
            helperText={errors[name]?.message}
            {...props}
        />
    );
};

export default FormInput;
