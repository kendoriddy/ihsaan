"use client";
import CustomModal from "@/components/CustomModal";
import React, { useState, useEffect } from "react";
import { usePatch } from "@/hooks/useHttp/useHttp";
import { TextField } from "@mui/material";
import { toast } from "react-toastify";
import DatePickers from "@/components/validation/DatePicker";
import { Formik, Form } from "formik";

const EditSession = ({
  setOpenUpdateModal,
  openUpdateModal,
  selectedSession,
  refetchSessions,
}) => {
  const [editedSession, setEditedSession] = useState({
    year: selectedSession?.question_text || "",
    start_date: selectedSession?.start_date || "",
    end_date: selectedSession?.end_date || "",
  });

  // Update function with body
  const { mutate: updateSession, isLoading: isUpdating } = usePatch(
    `https://ihsaanlms.onrender.com/academic-sessions/${selectedSession?.id}/`,
    {
      onSuccess: () => {
        toast.success("Session Updated successfully");
        setOpenUpdateModal(false);
        refetchSessions();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Update failed");
      },
    }
  );

  useEffect(() => {
    if (selectedSession) {
      setEditedSession({
        year: selectedSession.year || "",
        start_date: selectedSession.start_date || "",
        end_date: selectedSession.end_date || "",
      });
    }
  }, [selectedSession]);

  // Function to handle form submission
  const handleUpdateSubmit = () => {
    updateSession({
      year: editedSession.year,
      start_date: editedSession.start_date,
      end_date: editedSession.end_date,
    });
  };

  // Handle input changes
  const handleInputChange = (e) => {
    setEditedSession((prev) => ({
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
                value={editedSession.start_date}
                onChange={(newDate) =>
                  setEditedSession((prev) => ({
                    ...prev,
                    start_date: newDate,
                  }))
                }
              />

              {/* End Date */}
              <DatePickers
                name="end_date"
                placeholder="End Date"
                value={editedSession.end_date}
                onChange={(newDate) =>
                  setEditedSession((prev) => ({
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

export default EditSession;
