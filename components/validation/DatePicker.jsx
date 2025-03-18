import { useState } from "react";
import TextError from "./TextError";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ErrorMessage, Field, useFormikContext } from "formik";
import dayjs from "dayjs";
import { Grid } from "@mui/material";

function BasicDatePicker(props) {
  const { name, value, placeholder } = props;
  // const [selectedDate, setSelectedDate] = useState(dayjs(value));

  const { values, setFieldValue } = useFormikContext();

  const handleDateChange = (newValue) => {
    // setSelectedDate(newValue);
    // Format and set the field value with both date and time
    setFieldValue(name, newValue ? newValue.format("YYYY-MM-DD") : "");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        onChange={handleDateChange}
        label={placeholder}
        value={values[name] ? dayjs(values[name]) : null}
      />
    </LocalizationProvider>
  );
}

const DatePickers = (props) => {
  const { name, ...rest } = props;

  return (
    <Grid container direction="row">
      <Field name={name} {...rest} as={BasicDatePicker} />
      <ErrorMessage name={name} component={TextError} />
    </Grid>
  );
};

export default DatePickers;
