"use client";
import CustomModal from "@/components/CustomModal";
import React, { useEffect } from "react";
import { usePatch } from "@/hooks/useHttp/useHttp";
import {
  TextField,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import { toast } from "react-toastify";
import { Formik, Form, Field } from "formik";

const EditGrade = ({
  setOpenUpdateModal,
  openUpdateModal,
  selectedGrade,
  refetchGrades,
}) => {
  const { mutate: updateGrade, isLoading: isUpdating } = usePatch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/grades/${selectedGrade?.id}/`,
    {
      onSuccess: () => {
        toast.success("Grade updated successfully");
        setOpenUpdateModal(false);
        refetchGrades();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Update failed");
      },
    }
  );

  const initialValues = {
    score: selectedGrade?.score || "",
    is_published: selectedGrade?.is_published ?? false,
  };

  const handleSubmit = (values) => {
    updateGrade(values);
  };

  return (
    <CustomModal
      open={openUpdateModal}
      onClose={() => setOpenUpdateModal(false)}
      title="Update Grade"
      showFooter={false}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, handleChange }) => (
          <Form className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Score</label>
              <Field
                as={TextField}
                name="score"
                type="number"
                fullWidth
                size="small"
                value={values.score}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Is Published</label>
              <FormControl fullWidth size="small">
                <Select
                  name="is_published"
                  value={values.is_published}
                  onChange={handleChange}
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : "Update"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </CustomModal>
  );
};

export default EditGrade;
