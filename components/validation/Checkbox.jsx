import { Checkbox, FormControlLabel, Grid } from '@mui/material';
import { ErrorMessage, Field } from 'formik';
import TextError from './TextError';

const Switchs = ({ label, name, ...rest }) => {
  return (
    <FormControlLabel
      label={label}
      sx={{
        '& .MuiFormControlLabel-label': {
          fontSize: { xs: '0.8rem' },
          fontWeight: 600,
        },
      }}
      control={
        <Checkbox
          name={name}
          {...rest}
          sx={{
            '& .MuiSvgIcon-root': {
              fontSize: 20,
            },
          }}
        />
      }
    />
  );
};

const CheckBox = (props) => {
  const { name, value, ...rest } = props;

  return (
    <Grid container direction="column">
      <Field id={name} type="checkbox" value={value} name={name} as={Switchs} {...rest} />
      <ErrorMessage name={name} component={TextError} />
    </Grid>
  );
};

export default CheckBox;
