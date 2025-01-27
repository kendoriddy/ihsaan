import React, { useState } from "react";
import { TextField, Chip, Box, IconButton } from "@mui/material";
import { Field, ErrorMessage, useFormikContext } from "formik";
import CloseIcon from "@mui/icons-material/Close";

const TagInput = ({ name, placeholder, ...rest }) => {
  const { setFieldValue, values } = useFormikContext();
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      if (inputValue.trim()) {
        const tags = values[name] || [];
        setFieldValue(name, [...tags, inputValue.trim()]);
        setInputValue("");
      }
    }
  };

  const handleDelete = (indexToRemove) => {
    const tags = values[name] || [];
    const updatedTags = tags.filter((_, index) => index !== indexToRemove);
    setFieldValue(name, updatedTags);
  };

  return (
    <Box container>
      <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
        {(values[name] || []).map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            onDelete={() => handleDelete(index)}
            deleteIcon={
              <IconButton size="small" aria-label="remove tag">
                <CloseIcon />
              </IconButton>
            }
          />
        ))}
      </Box>
      <TextField
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        fullWidth
        {...rest}
      />
      <ErrorMessage name={name} component="div" />
    </Box>
  );
};

export default TagInput;
