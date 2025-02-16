import { Typography } from "@mui/material";

const TextError = ({ children }) => {
  return (
    <Typography variant="subtitle2" color={"error"}>
      {children}
    </Typography>
  );
};

export default TextError;
