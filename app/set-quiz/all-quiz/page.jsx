"use client";
import React, { useState } from "react";
import { useFetch, useDelete, usePatch } from "@/hooks/useHttp/useHttp";
import { useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import CustomModal from "@/components/CustomModal";

const AllQuiz = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const { isLoading, data, refetch, isFetching } = useFetch(
    "questions",
    `https://ihsaanlms.onrender.com/assessment/mcquestions/?page_size=15&page=${page}`,
    (data) => {
      if (data?.total) {
        setTotalQuestions(data.total);
      }
    }
  );

  const questions = data?.data?.results || [];

  // DELETE QUESTION
  const { mutate: questionDelete, isLoading: isDeleting } = useDelete(
    `https://ihsaanlms.onrender.com/assessment/mcquestions`,
    {
      onSuccess: () => {
        toast.success("Deleted successfully");
        queryClient.invalidateQueries("questions");
        setOpenDeleteDialog(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to delete");
      },
    }
  );

  // UPDATE QUESTION
  const { mutate: updateQuestion, isLoading: isUpdating } = usePatch(
    `https://ihsaanlms.onrender.com/assessment/mcquestions/${selectedQuestion?.id}/`,
    {
      onSuccess: () => {
        toast.success("Updated successfully");
        setOpenUpdateModal(false);
        queryClient.invalidateQueries("questions");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Update failed");
        console.log("update error", error);
      },
    }
  );

  // Handle Page Change
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    refetch();
  };

  const handleDelete = () => {
    if (selectedQuestion?.id) {
      questionDelete(`${selectedQuestion.id}/`);
    }
  };

  return (
    <Layout>
      <div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Question</TableCell>
                <TableCell>Options</TableCell>
                <TableCell>Correct Answer</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isFetching && <p>Getting next page</p>}
              {!isFetching && (
                <>
                  {questions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell>{question.question_text}</TableCell>
                      <TableCell className="flex gap-2 flex-wrap text-nowrap">
                        {Object.entries(question.options).map(
                          ([key, value]) => (
                            <div key={key}>
                              <strong>{key}:</strong> {value}
                            </div>
                          )
                        )}
                      </TableCell>
                      <TableCell>{question.correct_answer}</TableCell>
                      <TableCell className="flex flex-col md:flex-row items-center justify-center gap-3">
                        <Button
                          color="secondary"
                          onClick={() => {
                            setSelectedQuestion(question);
                            setOpenUpdateModal(true);
                          }}
                        >
                          Update
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedQuestion(question);
                            setOpenDeleteDialog(true);
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Pagination
          count={Math.ceil(totalQuestions / 15)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          sx={{ mt: 2, display: "flex", justifyContent: "center" }}
        />

        {/* Delete Confirmation Modal */}
        <CustomModal
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          title="Confirm Delete"
          onConfirm={handleDelete}
          confirmText="Delete"
          isLoading={isDeleting}
        >
          <p>Are you sure you want to delete this question?</p>
        </CustomModal>

        {/* Update Question Modal */}
        <CustomModal
          open={openUpdateModal}
          onClose={() => setOpenUpdateModal(false)}
          title="Update Question"
          onConfirm={updateQuestion}
          confirmText="Update"
          isLoading={isUpdating}
        >
          <TextField
            fullWidth
            label="Question"
            margin="dense"
            defaultValue={selectedQuestion?.question_text}
          />
          {selectedQuestion?.options &&
            Object.entries(selectedQuestion.options).map(([key, value]) => (
              <TextField
                key={key}
                fullWidth
                label={`Option ${key}`}
                margin="dense"
                defaultValue={value}
              />
            ))}
          <TextField
            fullWidth
            label="Correct Answer"
            margin="dense"
            defaultValue={selectedQuestion?.correct_answer}
          />
        </CustomModal>
      </div>
    </Layout>
  );
};

export default AllQuiz;
