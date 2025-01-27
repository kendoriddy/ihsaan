import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

const AuthButton = ({ text, isLoading, disabled }) => {
  return (
    <Button
      type="submit"
      variant="contained"
      color="primary"
      disabled={disabled || isLoading}
      style={{
        backgroundColor: "#f44336",
        "&:hover": {
          backgroundColor: "#2196f3",
        },
        textTransform: "initial",
        fontSize: "1rem",
      }}
    >
      {isLoading ? (
        <CircularProgress size={24} style={{ color: "#fff" }} />
      ) : (
        text
      )}
    </Button>
  );
};

export default AuthButton;
