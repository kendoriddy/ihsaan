import React from "react";
import { useFormikContext, Field } from "formik";
import { Box, TextField, FormControlLabel, Checkbox } from "@mui/material";

const ImageUpload = ({ name, avatarUrl, ...rest }) => {
  const { values, setFieldValue } = useFormikContext();

  const handleAvatarSelection = (event) => {
    if (event.target.checked) {
      setFieldValue(name, avatarUrl);
    } else {
      setFieldValue(name, "");
    }
  };

  return (
    <Box>
      <TextField
        type="file"
        name={name}
        onChange={(event) => {
          setFieldValue(name, event.currentTarget.files[0]);
        }}
        fullWidth
        {...rest}
      />
      {values.gender === "female" && (
        <FormControlLabel
          control={<Checkbox name="useAvatar" onChange={handleAvatarSelection} />}
          label="Use Avatar instead"
        />
      )}
    </Box>
  );
};

export default ImageUpload;
