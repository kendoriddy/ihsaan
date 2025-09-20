import Button from "@/components/Button";
import {
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";
import { formatDate } from "@/utils/utilFunctions";

const AssignmentDetails = ({
  handleCloseModal,
  modalOpen,
  selectedAssignment,
}) => {
  const getStatusChip = (assignment) => {
    if (assignment.is_open) {
      return (
        <Chip
          label="Pending"
          sx={{
            backgroundColor: "#1976d2",
            color: "white",
            fontWeight: "medium",
          }}
        />
      );
    } else {
      return (
        <Chip
          label="Closed"
          sx={{
            backgroundColor: "#d32f2f",
            color: "white",
            fontWeight: "medium",
          }}
        />
      );
    }
  };

  const getSubmissionStatusChip = (status) => {
    const statusConfig = {
      pending: { color: "#ed6c02", label: "Pending" },
      submitted: { color: "#2e7d32", label: "Submitted" },
      graded: { color: "#1976d2", label: "Graded" },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <Chip
        label={config.label}
        sx={{
          backgroundColor: config.color,
          color: "white",
          fontWeight: "medium",
        }}
      />
    );
  };

  return (
    <Dialog
      open={modalOpen}
      onClose={handleCloseModal}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" component="div" fontWeight="bold">
          Assignment Details
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {selectedAssignment && (
          <Box>
            {/* Title and Description */}
            <Box mb={3}>
              <Typography
                variant="h6"
                gutterBottom
                color="primary"
                fontWeight="semibold"
              >
                {selectedAssignment.title}
              </Typography>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #e9ecef",
                  borderRadius: 1,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 1.6,
                    color: "#495057",
                    fontStyle: selectedAssignment.description
                      ? "normal"
                      : "italic",
                  }}
                >
                  {selectedAssignment.description || "No description provided"}
                </Typography>
              </Paper>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Assignment Information Grid */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Course Information
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {selectedAssignment.course_title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Code: {selectedAssignment.course_code}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Instructor
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {selectedAssignment.tutor_name}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Assignment Type
                  </Typography>
                  <Chip
                    label={selectedAssignment.type}
                    variant="outlined"
                    sx={{ fontWeight: "medium" }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Question Type
                  </Typography>
                  <Chip
                    label={selectedAssignment.question_type}
                    variant="outlined"
                    sx={{ fontWeight: "medium" }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Scoring
                  </Typography>
                  <Typography variant="body1">
                    <span style={{ fontWeight: "bold" }}>Max Score:</span>{" "}
                    {selectedAssignment.max_score} points
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Passing Score: {selectedAssignment.passing_score} points
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Attempts
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {selectedAssignment.max_attempts} attempt(s) allowed
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Start Date
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDate(selectedAssignment.start_date)}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    End Date
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDate(selectedAssignment.end_date)}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Grade Release Date
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDate(selectedAssignment.grade_release_date)}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Status
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {getStatusChip(selectedAssignment)}
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Additional Information */}
            <Box mt={3}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Additional Information
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                <Chip
                  label={selectedAssignment.is_active ? "Active" : "Inactive"}
                  color={selectedAssignment.is_active ? "success" : "error"}
                  variant="outlined"
                  size="small"
                />
                <Chip
                  label={`Created: ${formatDate(
                    selectedAssignment.created_at
                  )}`}
                  variant="outlined"
                  size="small"
                />
                <Chip
                  label={`Updated: ${formatDate(
                    selectedAssignment.updated_at
                  )}`}
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={handleCloseModal} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignmentDetails;
