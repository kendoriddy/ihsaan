"use client";

import React from "react";
import { Formik, Form, Field } from "formik";
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
} from "@mui/material";
import Button from "@/components/Button";
import { usePost, useFetch, usePatch } from "@/hooks/useHttp/useHttp";
import { manualGradeSchema } from "@/components/validationSchemas/ValidationSchema";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const NewsletterForm = ({
  subscriber = null,
  isEdit = false,
  onClose,
  onSuccess,
}) => {
  const { isLoading: loadingCategories, data: categoriesData } = useFetch(
    ["newsletter-categories"],
    `https://ihsaanlms.onrender.com/newsletter/api/categories/`
  );
  const categories = categoriesData?.data?.results || [];

  // Create mutation
  const { mutate: createSubscriber, isLoading: isCreating } = usePost(
    "https://ihsaanlms.onrender.com/newsletter/api/subscribers/"
  );

  // Update mutation
  const { mutate: updateSubscriber, isLoading: isUpdating } = usePatch(
    `https://ihsaanlms.onrender.com/newsletter/api/subscribers/${subscriber?.id}/`
  );

  const initialValues = {
    email: subscriber?.email || "",
    firstname: subscriber?.firstname || "",
    lastname: subscriber?.lastname || "",
    category: subscriber?.category || "",
    country: subscriber?.country || "",
  };

  const handleSubmit = (values, { resetForm }) => {
    const onSuccessCallback = (data) => {
      if (data.status === 200 || data.status === 201) {
        toast.success(
          `Subscriber ${isEdit ? "updated" : "created"} successfully`
        );
        if (!isEdit) resetForm();
        onSuccess?.();
      }
    };

    const onErrorCallback = (error) => {
      const errorData = error.response?.data;
      let message = `Failed to ${isEdit ? "update" : "create"} subscriber`;
      if (typeof errorData === "string") {
        message = errorData;
      } else if (errorData && typeof errorData === "object") {
        message = Object.values(errorData)
          .map((msg) => (Array.isArray(msg) ? msg.join(" ") : msg))
          .join(" ");
      }
      toast.error(message);
    };

    if (isEdit) {
      updateSubscriber(values, {
        onSuccess: onSuccessCallback,
        onError: onErrorCallback,
      });
    } else {
      createSubscriber(values, {
        onSuccess: onSuccessCallback,
        onError: onErrorCallback,
      });
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Box sx={{ pt: 2 }}>
      <Formik
        initialValues={initialValues}
        validationSchema={manualGradeSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched }) => (
          <Form>
            {/* Email */}
            <Field
              as={TextField}
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              type="email"
              disabled={isEdit}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
            />

            {/* Firstname */}
            <Field
              as={TextField}
              fullWidth
              margin="normal"
              label="First Name"
              name="firstname"
              error={touched.firstname && Boolean(errors.firstname)}
              helperText={touched.firstname && errors.firstname}
            />

            {/* Lastname */}
            <Field
              as={TextField}
              fullWidth
              margin="normal"
              label="Last Name"
              name="lastname"
              error={touched.lastname && Boolean(errors.lastname)}
              helperText={touched.lastname && errors.lastname}
            />

            {/* Category */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Field
                as={Select}
                name="category"
                error={touched.category && Boolean(errors.category)}
              >
                {categories?.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Field>
              {touched.category && errors.category && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.category}
                </div>
              )}
            </FormControl>

            {/* Country */}
            <Field
              as={TextField}
              fullWidth
              margin="normal"
              label="Country"
              name="country"
              error={touched.country && Boolean(errors.country)}
              helperText={touched.country && errors.country}
            />

            {/* Score */}
            {/* <Field
              as={TextField}
              fullWidth
              margin="normal"
              type="number"
              label="Score"
              name="score"
              inputProps={{ min: 0, max: 100, step: 0.1 }}
              error={touched.score && Boolean(errors.score)}
              helperText={touched.score && errors.score}
            /> */}

            {/* Submit Buttons */}
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
                  ? "Update Subscriber"
                  : "Create Subscriber"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default NewsletterForm;
