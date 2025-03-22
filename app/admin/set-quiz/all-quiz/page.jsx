"use client";
import React, { useState } from "react";
import { useFetch, useDelete } from "@/hooks/useHttp/useHttp";
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
} from "@mui/material";
import { toast } from "react-toastify";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import CustomModal from "@/components/CustomModal";
import Loader from "@/components/Loader";
import EditQuizQuestion from "../components/EditQuiz";

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
              {isFetching && (
                <div className="flex pl-6 py-3 items-center justify-center gap-2">
                  <Loader />
                  <p className="animate-pulse">Loading...</p>
                </div>
              )}
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
        <EditQuizQuestion
          openUpdateModal={openUpdateModal}
          setOpenUpdateModal={setOpenUpdateModal}
          selectedQuestion={selectedQuestion}
          refetchQuestions={() => refetch()}
        />
      </div>
    </Layout>
  );
};

export default AllQuiz;
