"use client";

import React from "react";
import { Formik, Form, Field } from "formik";
import { TextField, Paper, Typography, MenuItem } from "@mui/material";
import Button from "@/components/Button";
import { usePost, usePatch } from "@/hooks/useHttp/useHttp";
import { categorySchema } from "@/components/validationSchemas/ValidationSchema";
import Swal from "sweetalert2";

const CategoriesForm = ({
  category = null,
  isEdit = false,
  onClose,
  onSuccess,
}) => {
  const { mutate: createCategory, isLoading: isCreating } = usePost(
    "https://ihsaanlms.onrender.com/newsletter/api/categories/"
  );

  const { mutate: updateCategory, isLoading: isUpdating } = usePatch(
    `https://ihsaanlms.onrender.com/newsletter/api/categories/${category?.id}/`
  );

  const initialValues = {
    name: category?.name || "",
    description: category?.description || "",
    frequency: category?.frequency || "DAILY", // default to daily
  };

  const handleSubmit = (values, { resetForm }) => {
    const submitData = { ...values };

    const onSuccessCallback = () => {
      Swal.fire({
        title: `Category ${isEdit ? "updated" : "created"} successfully`,
        icon: "success",
        customClass: { confirmButton: "my-confirm-btn" },
      });
      if (!isEdit) resetForm();
      onSuccess?.();
    };

    const onErrorCallback = (error) => {
      const errorData = error.response?.data;
      let messages = "Something went wrong";
      if (typeof errorData === "string") {
        messages = errorData;
      } else if (errorData && typeof errorData === "object") {
        messages = Object.values(errorData)
          .map((msg) => (Array.isArray(msg) ? msg.join(" ") : msg))
          .join(" ");
      }
      Swal.fire({
        title: messages,
        icon: "error",
        customClass: { confirmButton: "my-confirm-btn" },
      });
    };

    if (isEdit) {
      updateCategory(submitData, {
        onSuccess: onSuccessCallback,
        onError: onErrorCallback,
      });
    } else {
      createCategory(submitData, {
        onSuccess: onSuccessCallback,
        onError: onErrorCallback,
      });
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        {isEdit ? "Edit Category" : "Create Category"}
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={categorySchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            {/* Name */}
            <Field
              as={TextField}
              fullWidth
              margin="normal"
              label="Name"
              name="name"
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
            />

            {/* Description */}
            <Field
              as={TextField}
              fullWidth
              margin="normal"
              multiline
              rows={4}
              label="Description"
              name="description"
              error={touched.description && Boolean(errors.description)}
              helperText={touched.description && errors.description}
            />

            {/* Frequency Dropdown */}
            <Field
              as={TextField}
              select
              fullWidth
              margin="normal"
              label="Frequency"
              name="frequency"
              error={touched.frequency && Boolean(errors.frequency)}
              helperText={touched.frequency && errors.frequency}
            >
              <MenuItem value="DAILY">Daily</MenuItem>
              <MenuItem value="WEEKLY">Weekly</MenuItem>
              <MenuItem value="MONTHLY">Monthly</MenuItem>
            </Field>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                color="secondary"
                variant="outlined"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} color="primary">
                {isLoading
                  ? isEdit
                    ? "Updating..."
                    : "Creating..."
                  : isEdit
                  ? "Update Category"
                  : "Create Category"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default CategoriesForm;
