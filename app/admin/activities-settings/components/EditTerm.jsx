"use client";
import CustomModal from "@/components/CustomModal";
import React, { useState, useEffect } from "react";
import { usePatch } from "@/hooks/useHttp/useHttp";
import { TextField } from "@mui/material";
import { toast } from "react-toastify";
import DatePickers from "@/components/validation/DatePicker";
import { Formik, Form } from "formik";

const EditTerm = ({
  setOpenUpdateModal,
  openUpdateModal,
  selectedTerm,
  refetchTerms,
}) => {
  const [editedTerm, setEditedTerm] = useState({
    year: selectedTerm?.question_text || "",
    start_date: selectedTerm?.start_date || "",
    end_date: selectedTerm?.end_date || "",
  });

  // Update function with body
  const { mutate: updateTerm, isLoading: isUpdating } = usePatch(
    `https://ihsaanlms.onrender.com/terms/${selectedTerm?.id}/`,
    {
      onSuccess: () => {
        toast.success("Session Updated successfully");
        setOpenUpdateModal(false);
        refetchTerms();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Update failed");
      },
    }
  );

  useEffect(() => {
    if (selectedTerm) {
      setEditedSession({
        year: selectedTerm.year || "",
        start_date: selectedTerm.start_date || "",
        end_date: selectedTerm.end_date || "",
      });
    }
  }, [selectedTerm]);

  // Function to handle form submission
  const handleUpdateSubmit = () => {
    updateTerm({
      year: editedTerm.year,
      start_date: editedTerm.start_date,
      end_date: editedTerm.end_date,
    });
  };

  // Handle input changes
  const handleInputChange = (e) => {
    setEditedTerm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div>
      <CustomModal
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        title="Update Question"
        onConfirm={handleUpdateSubmit}
        confirmText={isUpdating ? "Updating..." : "Update"}
        isLoading={isUpdating}
      >
        <Formik>
          <Form>
            <div className="space-y-4 mt-2">
              <TextField
                fullWidth
                label="Year"
                name="year"
                margin="dense"
                value={editedSession.year}
                onChange={handleInputChange}
              />
              {/* Start Date */}
              <DatePickers
                name="start_date"
                placeholder="Start Date"
                value={editedTerm.start_date}
                onChange={(newDate) =>
                  setEditedTerm((prev) => ({
                    ...prev,
                    start_date: newDate,
                  }))
                }
              />

              {/* End Date */}
              <DatePickers
                name="end_date"
                placeholder="End Date"
                value={editedTerm.end_date}
                onChange={(newDate) =>
                  setEditedTerm((prev) => ({
                    ...prev,
                    end_date: newDate,
                  }))
                }
              />
            </div>
          </Form>
        </Formik>
      </CustomModal>
    </div>
  );
};

export default EditTerm;
