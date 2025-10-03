"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
} from "@mui/material";
import { useFetch, useDelete } from "@/hooks/useHttp/useHttp";
import Button from "@/components/Button";
import CustomModal from "@/components/CustomModal";
import Loader from "@/components/Loader";
import { toast } from "react-toastify";
import { Delete, Edit } from "@mui/icons-material";
import EditGrade from "./EditGrades";

const Grades = () => {
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [totalGrades, setTotalGrades] = useState(0);

  const { data: sessionData, isFetching: isFetchingSessions } = useFetch(
    "academicSession",
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/academic-sessions/`
  );
  const Sessions = sessionData?.data?.results || [];

  const { data: termData, isFetching: isFetchingTerms } = useFetch(
    "terms",
    selectedSession
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/?session=${selectedSession}`
      : null
  );
  const Terms = termData?.data?.results || [];

  const {
    data: gradeData,
    isFetching: isFetchingGrades,
    refetch: refetchGrades,
  } = useFetch(
    ["grades", selectedSession, selectedTerm, page],
    selectedSession && selectedTerm
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/grades/?session=${selectedSession}&term=${selectedTerm}&page=${page}&page_size=15`
      : null,
    (data) => {
      if (data?.total) setTotalGrades(data.total);
    }
  );

  const Grades = gradeData?.data?.results || [];

  const { mutate: deleteGrade, isLoading: isDeleting } = useDelete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/grades`,
    {
      onSuccess: () => {
        toast.success("Grade deleted successfully");
        refetchGrades();
        setOpenDeleteDialog(false);
      },
      onError: () => toast.error("Failed to delete grade"),
    }
  );

  const handleDelete = () => {
    if (selectedGrade?.id) {
      deleteGrade(`${selectedGrade.id}/`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter Dropdowns */}
      <div className="flex gap-4 items-center">
        <FormControl size="small" fullWidth>
          <InputLabel>Session</InputLabel>
          <Select
            value={selectedSession}
            label="Session"
            onChange={(e) => setSelectedSession(e.target.value)}
          >
            {Sessions.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" fullWidth>
          <InputLabel>Term</InputLabel>
          <Select
            value={selectedTerm}
            label="Term"
            disabled={!selectedSession}
            onChange={(e) => setSelectedTerm(e.target.value)}
          >
            {Terms.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                {t.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course Code</TableCell> <TableCell>Student</TableCell>
              <TableCell>Assessment Score</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Publish Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!selectedSession || !selectedTerm ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <div className="flex justify-center items-center gap-2 py-4">
                    <span className="animate-pulse">
                      Select session and term to get list of grades...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : isFetchingGrades ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <div className="flex justify-center items-center gap-2 py-4">
                    <Loader />
                    <span className="animate-pulse">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : Grades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No grades available
                </TableCell>
              </TableRow>
            ) : (
              Grades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell>{grade.course_code}</TableCell>
                  <TableCell>{grade.student_name}</TableCell>
                  <TableCell>{grade.assessment_max_score}</TableCell>
                  <TableCell>{grade.score}</TableCell>
                  <TableCell>{grade.is_published}</TableCell>
                  <TableCell className="flex flex-col md:flex-row items-center gap-2">
                    <Button
                      color="secondary"
                      onClick={() => {
                        setSelectedGrade(grade);
                        setOpenEditModal(true);
                      }}
                    >
                      <Edit />
                    </Button>
                    {/* <Button
                      onClick={() => {
                        setSelectedGrade(grade);
                        setOpenDeleteDialog(true);
                      }}
                    >
                      <Delete />
                    </Button> */}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Pagination */}
      {Grades.length > 0 && (
        <Pagination
          count={Math.ceil(totalGrades / 15)}
          page={page}
          onChange={(e, val) => setPage(val)}
          color="primary"
          sx={{ mt: 2, display: "flex", justifyContent: "center" }}
        />
      )}
      {/* Delete Confirmation Modal */}
      <CustomModal
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        title="Delete Grade"
        onConfirm={handleDelete}
        confirmText="Delete"
        isLoading={isDeleting}
      >
        <p>Are you sure you want to delete this grade?</p>
      </CustomModal>
      {/* Edit Grade Modal */}
      <EditGrade
        openUpdateModal={openEditModal}
        setOpenUpdateModal={setOpenEditModal}
        selectedGrade={selectedGrade}
        refetchGrades={refetchGrades}
      />
    </div>
  );
};

export default Grades;
