import { Field, ErrorMessage, useFormikContext } from "formik";
import React from "react";
import { Grid, TextField } from "@mui/material";
import TextError from "./TextError";

const Text = ({ placeholder, name, countError, ...rest }) => {
  const { errors, touched } = useFormikContext();

  return (
    <TextField
      id={`outlined-${name}`}
      error={(!!errors[name] && touched[name]) || countError}
      name={name}
      label={placeholder}
      {...rest}
    />
  );
};

const Input = (props) => {
  const { name, type, ...rest } = props;

  return (
    <Grid container direction="column">
      <Field id={name} name={name} type={type ? type : "text"} {...rest} as={Text} />
      <div className="flex justify-start">
        <ErrorMessage name={name} component={TextError} />
      </div>
    </Grid>
  );
};

export default Input;
