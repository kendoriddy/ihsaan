import TextError from "./TextError";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ErrorMessage, Field } from "formik";
import dayjs from "dayjs";
import { Grid, TextField } from "@mui/material";

function BasicDatePicker(props) {
  const { value, placeholder, onChange } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={placeholder}
        value={value ? dayjs(value) : null}
        onChange={(newValue) =>
          onChange(newValue ? newValue.format("YYYY-MM-DD") : "")
        }
        renderInput={(params) => <TextField {...params} fullWidth />}
      />
    </LocalizationProvider>
  );
}

const DatePickers = ({ name, ...rest }) => {
  return (
    <Grid container direction="row">
      <Field name={name} {...rest} as={BasicDatePicker} />
      <ErrorMessage name={name} component={TextError} />
    </Grid>
  );
};

export default DatePickers;
