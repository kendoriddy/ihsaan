import TextError from "./TextError";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ErrorMessage, Field, useFormikContext } from "formik";
import dayjs from "dayjs";
import { Grid, TextField } from "@mui/material";

// function BasicDatePicker(props) {
//   const { name, value, placeholder } = props;

//   const { values, setFieldValue } = useFormikContext();

//   const handleDateChange = (newValue) => {
//     setFieldValue(name, newValue ? newValue.format("YYYY-MM-DD") : "");
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <DatePicker
//         onChange={handleDateChange}
//         label={placeholder}
//         value={values[name] ? dayjs(values[name]) : null}
//       />
//     </LocalizationProvider>
//   );
// }

// const DatePickers = (props) => {
//   const { name, ...rest } = props;

//   return (
//     <Grid container direction="row">
//       <Field name={name} {...rest} as={BasicDatePicker} />
//       <ErrorMessage name={name} component={TextError} />
//     </Grid>
//   );
// };

// export default DatePickers;

function BasicDatePicker(props) {
  const { name, value, placeholder, onChange } = props;

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
      {/* <BasicDatePicker name={name} {...rest} /> */}
      <Field name={name} {...rest} as={BasicDatePicker} />
      <ErrorMessage name={name} component={TextError} />
    </Grid>
  );
};

export default DatePickers;
