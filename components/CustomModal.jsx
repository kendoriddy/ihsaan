import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Button from "@/components/Button";

const CustomModal = ({
  open,
  onClose,
  title,
  children,
  onConfirm,
  confirmText,
  isLoading,
  showCancel = true,
}) => {
  return (
    <Dialog open={open} onClose={onClose} className="no-scrollbar">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        {showCancel && (
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
        )}
        {onConfirm && (
          <Button onClick={onConfirm} color="primary" disabled={isLoading}>
            {isLoading ? "Processing..." : confirmText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CustomModal;
