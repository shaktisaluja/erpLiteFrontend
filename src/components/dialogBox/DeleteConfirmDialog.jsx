import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from "@mui/material";

const DeleteConfirmDialog = ({
    open,
    onClose,
    onConfirm,
    loading = false
}) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirm Delete</DialogTitle>

            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete? This action cannot be undone.
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} variant="outlined">
                    Cancel
                </Button>

                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color="error"
                    disabled={loading}
                >
                    {loading ? "Deleting..." : "Delete"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirmDialog;