import { Grid, CircularProgress } from "@mui/material";
import { FC } from "react";
const Loader = ({ color = "#6674CC", size = 25, ...rest }) => {
  return (
    <Grid container justifyContent="center" alignItems="center">
      <CircularProgress size={size} thickness={5} {...rest} sx={{ color }} />
    </Grid>
  );
};

export default Loader;
