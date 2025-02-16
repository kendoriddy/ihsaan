import { Grid, CircularProgress } from '@mui/material';
import { FC } from 'react';
const Loader = ({ color, size, ...rest }) => {
  return (
    <Grid container justifyContent="center" alignItems="center">
      <CircularProgress size={size} thickness={5} {...rest} sx={{ color }} />
    </Grid>
  );
};
Loader.defaultProps = {
  color: '#6674CC',
  size: 25,
};

export default Loader;
