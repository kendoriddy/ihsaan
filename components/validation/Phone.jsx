import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Field, ErrorMessage, useFormikContext } from "formik";
import { Grid } from "@mui/material";
import TextError from "./TextError";

const Text = ({ name }) => {
  const { values, setFieldValue } = useFormikContext();

  const handlePhoneChange = (_value, _country, _event, formattedValue) => {
    setFieldValue(name, formattedValue);
  };

  return (
    <PhoneInput
      inputStyle={{
        width: "100%",
        minHeight: "5.4rem",
        fontFamily: "Inter",
      }}
      inputProps={{
        name,
        onChange: (e) => {
          setFieldValue(name, e.target.value);
        },
        value: values[name] || "", // Use the field name as the key
      }}
      country={"ng"}
      onChange={handlePhoneChange}
      placeholder="company contact number"
    />
  );
};

const Phone = (props) => {
  const { name, type = "text" } = props; // Use a default value for type if not provided

  return (
    <Grid container direction="column">
      <Field id={name} type={type} {...props} as={Text} />
      <ErrorMessage name={name} component={TextError} />
    </Grid>
  );
};

export default Phone;
