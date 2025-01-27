import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";

const ButtonWithForwardBackWordIcon = ({ text, disabled, showStartIcon, showEndIcon, onClick }) => {
  return (
    <Button
      type="submit"
      variant="contained"
      color="primary"
      disabled={disabled}
      onClick={onClick}
      style={{
        backgroundColor: "#f44336",
        "&:hover": {
          backgroundColor: "#2196f3",
        },
        textTransform: "initial",
        fontSize: "1rem",
      }}
      startIcon={showStartIcon ? <AddIcon /> : null}
      endIcon={showEndIcon ? <ArrowForwardIos /> : null}
    >
      {text}
    </Button>
  );
};

export default ButtonWithForwardBackWordIcon;
