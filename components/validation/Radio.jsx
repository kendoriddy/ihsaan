import { FormControlLabel, Grid, Radio } from "@mui/material";
import { ErrorMessage, Field } from "formik";
import TextError from "./TextError";

const RadioButton = ({ label, name, value, ...rest }) => {
  return (
    <FormControlLabel
      label={label}
      sx={{
        "& .MuiFormControlLabel-label": {
          fontSize: { xs: "1.2rem", md: "1.4rem" },
          fontWeight: 400,
        },
      }}
      control={
        <Radio
          name={name}
          value={value}
          {...rest}
          sx={{
            "& .MuiSvgIcon-root": {
              fontSize: 25,
            },
          }}
        />
      }
    />
  );
};

const RadioGroup = (props) => {
  const { label, value, name, ...rest } = props;

  return (
    <Grid container direction="column">
      <Field
        id={name}
        type="radio"
        label={label ? label : null}
        name={name}
        as={RadioButton}
        value={value}
        {...rest}
      />
      <ErrorMessage name={name} component={TextError} />
    </Grid>
  );
};

export default RadioGroup;
