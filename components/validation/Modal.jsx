import {
  Slide,
  useMediaQuery,
  Dialog,
  IconButton,
  DialogContent,
  Button,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import React, { forwardRef } from "react";
import { useTheme, styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/CloseOutlined";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(2),
  },
}));

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Modal = ({
  isOpen,
  title,
  maxWidth,
  handleClose,
  children,
  okLabel,
  okAction,
  cancelAction,
  cancelLabel,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <BootstrapDialog
      maxWidth={maxWidth}
      open={isOpen}
      fullWidth
      onClose={handleClose}
      fullScreen={fullScreen}
      scroll="body"
      TransitionComponent={Transition}
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: { md: "2rem", sm: "1.6rem", xs: "1.4rem" },
        }}
      >
        {title}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon fontSize="large" />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          maxHeight: { xs: "85vh", sm: "80vh" },
          overscrollBehaviorY: "scroll",
        }}
        dividers
      >
        {children}
      </DialogContent>
      <DialogActions>
        {okAction && (
          <Button
            disableElevation
            sx={{ fontSize: "1.2rem", py: 1, fontWeight: 600 }}
            onClick={okAction}
            variant="contained"
            color="primary"
            type="submit"
          >
            {okLabel}
          </Button>
        )}
        {cancelAction && (
          <Button
            sx={{ fontSize: "1.2rem", py: 1, fontWeight: 600 }}
            variant="outlined"
            color="error"
            onClick={cancelAction}
          >
            {cancelLabel}
          </Button>
        )}
      </DialogActions>
    </BootstrapDialog>
  );
};

// Modals.defaultProps = {
//   height: "auto",
// };

export default Modal;
