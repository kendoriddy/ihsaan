"use client";

import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import {
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import Button from "@/components/Button";
import { usePost, useFetch } from "@/hooks/useHttp/useHttp";
import { toast } from "react-toastify";
import { bulkUploadSchema } from "@/components/validationSchemas/ValidationSchema";

const BulkUploadForm = ({ onClose, onSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch categories
  const { isLoading: loadingCategories, data: categoriesData } = useFetch(
    ["newsletter-categories"],
    `https://ihsaanlms.onrender.com/newsletter/api/categories/`
  );
  const categories = categoriesData?.data?.results || [];

  // Create mutation for bulk upload
  const { mutate: uploadBulk, isLoading: isUploading } = usePost(
    "https://ihsaanlms.onrender.com/newsletter/api/subscribers/bulk_upload/"
  );

  const initialValues = {
    category: "",
    csv_file: null,
  };

  const handleFileChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        setSelectedFile(file);
        setFieldValue("csv_file", file);
      } else {
        toast.error("Please upload a valid CSV file");
        event.target.value = null;
      }
    }
  };

  const handleSubmit = (values, { resetForm }) => {
    const formData = new FormData();
    formData.append("csv_file", values.csv_file);
    formData.append("category", values.category);

    uploadBulk(formData, {
      onSuccess: (data) => {
        if (data.status === 200 || data.status === 201) {
          toast.success("Bulk upload completed successfully");
          resetForm();
          setSelectedFile(null);
          onSuccess?.();
        }
      },
      onError: (error) => {
        const errorData = error.response?.data;
        let message = "Failed to upload subscribers";

        if (typeof errorData === "string") {
          message = errorData;
        } else if (errorData && typeof errorData === "object") {
          message = Object.values(errorData)
            .map((msg) => (Array.isArray(msg) ? msg.join(" ") : msg))
            .join(" ");
        }

        toast.error(message);
      },
    });
  };

  return (
    <Box sx={{ pt: 2 }}>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>CSV Format Requirements:</strong>
          <br />
          Your CSV file should contain columns: email, firstname, lastname,
          country
          <br />
          Maximum file size: 5MB
        </Typography>
      </Alert>

      <Formik
        initialValues={initialValues}
        validationSchema={bulkUploadSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, setFieldValue, values }) => (
          <Form>
            {/* File Upload Box - moved above category */}
            <Box sx={{ mb: 3 }}>
              <input
                type="file"
                accept=".csv"
                id="csv-file-input"
                style={{ display: "none" }}
                onChange={(event) => handleFileChange(event, setFieldValue)}
              />

              <label htmlFor="csv-file-input">
                <Box
                  sx={{
                    border: "2px dashed #ccc",
                    borderRadius: 2,
                    p: 4,
                    textAlign: "center",
                    cursor: "pointer",
                    bgcolor: "#fafafa",
                    "&:hover": {
                      bgcolor: "#f0f0f0",
                      borderColor: "primary.main",
                    },
                  }}
                >
                  <CloudUpload sx={{ fontSize: 40, color: "primary.main" }} />
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {selectedFile
                      ? "Change CSV File"
                      : "Click or Drag & Drop CSV File Here"}
                  </Typography>
                  {selectedFile && (
                    <Typography variant="caption" color="text.secondary">
                      {selectedFile.name} (
                      {(selectedFile.size / 1024).toFixed(2)} KB)
                    </Typography>
                  )}
                </Box>
              </label>

              {touched.csv_file && errors.csv_file && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.csv_file}
                </div>
              )}
            </Box>

            {/* Category Dropdown */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Category *</InputLabel>
              <Field
                as={Select}
                name="category"
                error={touched.category && Boolean(errors.category)}
                disabled={loadingCategories}
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

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                color="secondary"
                variant="outlined"
                onClick={onClose}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUploading || !values.csv_file || !values.category}
                color="primary"
              >
                {isUploading ? "Uploading..." : "Upload Subscribers"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default BulkUploadForm;
