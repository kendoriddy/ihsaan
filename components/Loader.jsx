import { Grid, CircularProgress } from "@mui/material";
const Loader = ({ color = "#6674CC", size = 25, ...rest }) => {
  return (
    <Grid justifyContent="" alignItems="">
      <CircularProgress size={size} thickness={5} {...rest} sx={{ color }} />
    </Grid>
  );
};

export default Loader;
