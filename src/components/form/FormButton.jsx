import { Button } from "@mui/material";

const FormButton = ({
    children,
    loading = false,
    variant = "contained",
    fullWidth = true,
    startIcon,
    sx = {},
    ...props
}) => {
    return (
        <Button
            variant={variant}
            fullWidth={fullWidth}
            disabled={loading || props.disabled}
            startIcon={!loading && startIcon}
            sx={{
                height: "56px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "16px",
                borderRadius: "10px",
                boxShadow: "none",
                background: variant === "contained"
                    ? "linear-gradient(135deg, #1976d2, #42a5f5)"
                    : undefined,
                "&:hover": {
                    background: variant === "contained"
                        ? "linear-gradient(135deg, #1565c0, #1e88e5)"
                        : undefined,
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.15)"
                },
                ...sx
            }}
            {...props}
        >
            {loading ? "Please wait..." : children}
        </Button>
    );
};

export default FormButton;