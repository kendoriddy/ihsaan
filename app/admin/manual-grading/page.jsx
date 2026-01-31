"use client";

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  MenuItem,
  Menu,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Tabs,
  Tab,
  Typography,
  Stack,
  Tooltip,
} from "@mui/material";
import { MoreVert, Add } from "@mui/icons-material";

import AdminLayout from "@/components/AdminLayout";
import Button from "@/components/Button";
import CustomModal from "@/components/CustomModal";
import Loader from "@/components/Loader";
import ManualGradeForm from "@/app/manual-grading/components/ManualGradeForm";
import Reasons from "./components/Reasons";
import { useFetch, useDelete } from "@/hooks/useHttp/useHttp";

const AdminManualGrading = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [currentTab, setCurrentTab] = useState("grades");

  // Modal States
  const [modals, setModals] = useState({
    create: false,
    update: false,
    delete: false,
    reason: false,
  });

  const toggleModal = (key, val) => setModals((prev) => ({ ...prev, [key]: val }));

  const { isLoading, data, refetch, isFetching } = useFetch(
    "manual-grades",
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/manual-grades/?page_size=15&page=${page}`,
    (data) => {
      // Optional: Handle side effects here
    }
  );

  const manualGrades = data?.data?.results || [];
  const totalGrades = data?.total || 0;

  const { mutate: deleteGrade, isLoading: isDeleting } = useDelete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/manual-grades`,
    {
      onSuccess: () => {
        toast.success("Manual grade deleted successfully");
        queryClient.invalidateQueries(["manual-grades"]);
        refetch();
        toggleModal("delete", false);
      },
      onError: (err) => toast.error(err.response?.data?.message || "Deletion failed"),
    }
  );

  const handleMenuOpen = (e, grade) => {
    setSelectedGrade(grade);
    setMenuAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => setMenuAnchorEl(null);

  return (
    <AdminLayout>
      <Box className="w-full space-y-6">
        {/* Header Section */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" fontWeight="bold">
            Manual Grading
          </Typography>
          
          <Button
            color="secondary"
            variant="contained"
            startIcon={<Add />}
            onClick={() => currentTab === "grades" ? toggleModal("create", true) : toggleModal("reason", true)}
          >
            {currentTab === "grades" ? "Create Manual Grade" : "Create Reason"}
          </Button>
        </Stack>

        {/* Navigation Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={currentTab}
            onChange={(_, val) => setCurrentTab(val)}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab value="grades" label="Manual Grades" />
            <Tab value="reasons" label="Management Reasons" />
          </Tabs>
        </Box>

        {currentTab === "grades" ? (
          <Box className="space-y-4">
            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {["Admin", "Student", "Course", "Code", "Reason", "Score", "Date", "Actions"].map((head) => (
                      <TableCell key={head} sx={{ fontWeight: "bold", bgcolor: "#f9fafb" }}>
                        {head}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isFetching ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                        <Loader />
                        <Typography sx={{ mt: 2 }} color="textSecondary">Loading grades...</Typography>
                      </TableCell>
                    </TableRow>
                  ) : manualGrades.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                        No manual grades found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    manualGrades.map((grade) => (
                      <TableRow key={grade.id} hover>
                        <TableCell>{grade.created_by_name}</TableCell>
                        <TableCell>{grade.student_name}</TableCell>
                        <TableCell>{grade.course_title}</TableCell>
                        <TableCell>{grade.course_code}</TableCell>
                        <TableCell>{grade.reason_name}</TableCell>
                        <TableCell><b className="text-blue-600">{grade.score}</b></TableCell>
                        <TableCell>{new Date(grade.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <IconButton onClick={(e) => handleMenuOpen(e, grade)}>
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Stack alignItems="center">
              <Pagination
                count={Math.ceil(totalGrades / 15)}
                page={page}
                onChange={(_, p) => setPage(p)}
                color="primary"
              />
            </Stack>
          </Box>
        ) : (
          <Reasons
            openReasonCreateModal={modals.reason}
            setReasonOpenCreateModal={(val) => toggleModal("reason", val)}
          />
        )}

        {/* Context Menu */}
        <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => { toggleModal("update", true); handleMenuClose(); }}>Edit</MenuItem>
          <MenuItem onClick={() => { toggleModal("delete", true); handleMenuClose(); }} sx={{ color: "error.main" }}>
            Delete
          </MenuItem>
        </Menu>

        {/* Modals */}
        <CustomModal
          open={modals.delete}
          onClose={() => toggleModal("delete", false)}
          title="Confirm Deletion"
          onConfirm={() => deleteGrade(selectedGrade?.id)}
          isLoading={isDeleting}
          confirmText="Delete"
        >
          <Typography>
            Are you sure you want to delete the grade for <b>{selectedGrade?.student_name}</b>? This action cannot be undone.
          </Typography>
        </CustomModal>

        {/* Create/Update Dialogs */}
        <GradeDialog 
          open={modals.create} 
          onClose={() => toggleModal("create", false)} 
          title="Create Manual Grade" 
          refetch={refetch} 
        />

        <GradeDialog 
          open={modals.update} 
          onClose={() => toggleModal("update", false)} 
          title="Edit Manual Grade" 
          grade={selectedGrade} 
          isEdit 
          refetch={refetch} 
        />
      </Box>
    </AdminLayout>
  );
};

// Reusable Dialog Wrapper to keep the main component lean
const GradeDialog = ({ open, onClose, title, grade, isEdit = false, refetch }) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle sx={{ fontWeight: 'bold' }}>{title}</DialogTitle>
    <DialogContent>
      <ManualGradeForm
        grade={grade}
        isEdit={isEdit}
        onClose={onClose}
        onSuccess={() => { onClose(); refetch(); }}
      />
    </DialogContent>
  </Dialog>
);

export default AdminManualGrading;