"use client";
import CustomModal from "@/components/CustomModal";
import React, { useState, useEffect } from "react";
import { useFetch, usePatch } from "@/hooks/useHttp/useHttp";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
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
    session_id: selectedTerm?.session.id || "",
    name: selectedTerm?.name || "",
    start_date: selectedTerm?.start_date || "",
    end_date: selectedTerm?.end_date || "",
  });
  console.log("term selected", selectedTerm);
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

  const { isLoading, data, refetch, isFetching } = useFetch(
    "academicSession",
    `https://ihsaanlms.onrender.com/academic-sessions/`,
    (data) => {}
  );
  const Sessions = data?.data?.results || [];

  useEffect(() => {
    if (selectedTerm) {
      setEditedTerm({
        session_id: selectedTerm.session.name || "",
        name: selectedTerm.name || "",
        start_date: selectedTerm.start_date || "",
        end_date: selectedTerm.end_date || "",
      });
    }
  }, [selectedTerm]);

  // Function to handle form submission
  const handleUpdateSubmit = () => {
    updateTerm({
      session_id: editedTerm.session_id,
      name: editedTerm.name,
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

  const termsOption = [
    { value: "FIRST", label: "First term" },
    { value: "SECOND", label: "Second term" },
    { value: "THIRD", label: "Third term" },
  ];

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
              <FormControl fullWidth variant="outlined">
                <InputLabel>Terms</InputLabel>
                <Select
                  label="Terms"
                  name="name"
                  value={editedTerm.name}
                  onChange={handleInputChange}
                  disabled={isUpdating}
                >
                  {termsOption.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Course Dropdown */}
              <FormControl fullWidth variant="outlined">
                <InputLabel>Academic Session</InputLabel>
                <Select
                  label="Academic Session"
                  name="session_id"
                  value={editedTerm.session_id}
                  onChange={handleInputChange}
                  disabled={isUpdating || isLoading || isFetching}
                >
                  {/* <MenuItem value="">
                    <em>Select a session</em>
                  </MenuItem> */}
                  {Sessions.map((session) => (
                    <MenuItem key={session.id} value={session.id}>
                      {session.year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
