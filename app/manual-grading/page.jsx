"use client";

import { Formik, Form, Field } from "formik";
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CardContent,
  Typography,
  Card,
  Box,
} from "@mui/material";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import Button from "@/components/Button";
import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { usePost, useFetch } from "@/hooks/useHttp/useHttp";
import { toast } from "react-toastify";
import { manualGradingSchema } from "@/components/validationSchemas/ValidationSchema";

const ManualGrading = () => {
  const [selectedAssessmentId, setSelectedAssessmentId] = useState("");
  const [fetchAll, setFetchAll] = useState(false);
  const [totalCourses, setTotalCourses] = useState(10);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [grades, setGrades] = useState([]);

  const isGroupAssessment = selectedAssessment?.type === "GROUP";

  // Fetch grades for selected assessment (individual only)
  const {
    isLoading: loadingGrades,
    data: GradesList,
    refetch: refetchGrades,
  } = useFetch(
    "grades",
    selectedAssessment && selectedAssessment.type !== "GROUP"
      ? `https://ihsaanlms.onrender.com/assessment/grades/?assessment=${selectedAssessment.id}`
      : null,
    (data) => setGrades(data.results || []),
    (error) => setGrades([])
  );

  useEffect(() => {
    if (!selectedAssessment || selectedAssessment.type === "GROUP") {
      setGrades([]);
    }
  }, [selectedAssessment]);

  const {
    isLoading: courseLoading,
    data: EnrolledList,
    refetch: refetchStudents,
  } = useFetch(
    "courses",
    `https://ihsaanlms.onrender.com/course/courses/${selectedAssessmentId}/enrolled_students/`,
    (data) => {}
  );

  const {
    isLoading: loadingGroup,
    data: GroupList,
    refetch: refetchGroup,
  } = useFetch(
    "courses",
    `https://ihsaanlms.onrender.com/assessment/groups/?assessment=${selectedAssessment?.id}`,
    (data) => {}
  );
  console.log(GroupList, "group list");
  const {
    isLoading,
    data: AssessmentsList,
    refetch,
  } = useFetch(
    "assessments",
    `https://ihsaanlms.onrender.com/assessment/base/?page_size=${
      fetchAll ? totalCourses : 10
    }`,
    (data) => {
      if (data?.total && !fetchAll) {
        setTotalCourses(data.total);
        setFetchAll(true);
        refetch();
      }
    }
  );

  const Assessments = AssessmentsList?.data?.results || [];

  const filteredAssessment = Assessments.filter(
    (assessment) => assessment.question_type !== "MCQ"
  );

  const { mutate: submitGrade, isLoading: submittingGrade } = usePost(
    "https://ihsaanlms.onrender.com/assessment/grades/"
  );

  const initialValues = {
    score: "",
    assessment: "",
    student: "",
    group: "",
    feedback: "",
    is_published: false,
  };

  const handleSubmit = (values, { resetForm }) => {
    let payload;

    // Check if student already graded (for individual assessments)
    if (selectedAssessment?.type !== "GROUP") {
      const alreadyGraded = grades.find((g) => g.student === values.student);
      if (alreadyGraded) {
        const proceed = window.confirm(
          `Warning: ${alreadyGraded.student_name} has already been graded (Score: ${alreadyGraded.score}). Do you want to override?`
        );
        if (!proceed) return;
      }
    }

    if (selectedAssessment?.type === "GROUP") {
      // Find the selected group and its leader
      const selectedGroup = GroupList?.data?.results?.find(
        (group) => group.id === values.group
      );
      const leaderId = selectedGroup?.leader;

      payload = {
        score: values.score,
        assessment: values.assessment,
        group: values.group,
        student: leaderId,
        feedback: values.feedback,
        is_published: values.is_published,
      };
    } else {
      payload = {
        score: values.score,
        assessment: values.assessment,
        student: values.student,
        feedback: values.feedback,
        is_published: values.is_published,
      };
    }

    submitGrade(payload, {
      onSuccess: () => {
        toast.success("Assignment graded successfully");
        resetForm();
        // Refetch grades after grading
        if (selectedAssessment && selectedAssessment.type !== "GROUP") {
          refetchGrades();
        }
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || "Failed to submit grading"
        );
      },
    });
  };

  return (
    <Layout>
      {/* Show grades table if not group assessment */}
      {!isGroupAssessment && selectedAssessment && (
        <Paper sx={{ mb: 4, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Existing Grades
          </Typography>
          {loadingGrades ? (
            <Typography>Loading grades...</Typography>
          ) : grades.length === 0 ? (
            <Typography>No grades yet.</Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Max Score</TableCell>
                  <TableCell>Percentage</TableCell>
                  <TableCell>Feedback</TableCell>
                  <TableCell>Graded By</TableCell>
                  <TableCell>Published</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {grades.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell>{g.student_name}</TableCell>
                    <TableCell>{g.score}</TableCell>
                    <TableCell>{g.assessment_max_score}</TableCell>
                    <TableCell>{g.percentage_score}%</TableCell>
                    <TableCell>{g.feedback}</TableCell>
                    <TableCell>{g.graded_by_name}</TableCell>
                    <TableCell>{g.is_published ? "Yes" : "No"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      )}

      {/* Form */}
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={manualGradingSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, values }) => (
          <Form>
            <FormControl fullWidth margin="normal">
              <InputLabel>Select Assessment</InputLabel>
              <Field
                as={Select}
                name="assessment"
                onChange={(e) => {
                  const selectedAssessmentId = e.target.value;
                  const selected = filteredAssessment.find(
                    (a) => a.id === selectedAssessmentId
                  );
                  setSelectedAssessment(selected);
                  setSelectedAssessmentId(selected?.course);
                  values.assessment = selectedAssessmentId;
                }}
              >
                {filteredAssessment.length > 0 ? (
                  filteredAssessment.map((assessment) => (
                    <MenuItem key={assessment.id} value={assessment.id}>
                      <Box display="flex" flexDirection="column" width="100%">
                        <Typography variant="h6" fontWeight="bold">
                          {assessment.title}
                        </Typography>
                        <Card
                          variant="outlined"
                          sx={{
                            mt: 1,
                            p: 2,
                            backgroundColor: "#f9f9f9",
                            borderRadius: "8px",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <CardContent>
                            <Typography variant="body2" color="textSecondary">
                              <strong>Course:</strong> {assessment.course_title}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              <strong>Max Score:</strong> {assessment.max_score}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              <strong>Passing Score:</strong>{" "}
                              {assessment.passing_score}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Box>
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No courses available</MenuItem>
                )}
              </Field>
            </FormControl>

            {!isGroupAssessment && (
              <FormControl fullWidth margin="normal">
                <InputLabel>Select Student</InputLabel>
                <Field as={Select} name="student">
                  {EnrolledList?.data?.students?.length > 0 ? (
                    EnrolledList.data.students.map((student) => (
                      <MenuItem key={student.id} value={student.id}>
                        {student.fullname}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No students found</MenuItem>
                  )}
                </Field>
              </FormControl>
            )}
            {isGroupAssessment && (
              <FormControl fullWidth margin="normal">
                <InputLabel>Select Group</InputLabel>
                <Field as={Select} name="group">
                  {GroupList?.data?.results?.length > 0 ? (
                    GroupList.data.results.map((group) => (
                      <MenuItem key={group.id} value={group.id}>
                        Group {group.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No groups found</MenuItem>
                  )}
                </Field>
              </FormControl>
            )}
            <Field
              as={TextField}
              fullWidth
              margin="normal"
              label="Score"
              name="score"
              type="number"
              error={touched.score && Boolean(errors.score)}
              helperText={touched.score && errors.score}
            />
            {/* Reason */}
            <Field
              as={TextField}
              fullWidth
              margin="normal"
              label="Reason for Grading"
              name="feedback"
              type="text"
              error={touched.feedback && Boolean(errors.feedback)}
              helperText={touched.feedback && errors.feedback}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Publish grade now?</InputLabel>
              <Field as={Select} name="is_published">
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </Field>
            </FormControl>
            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                color="secondary"
                disabled={submittingGrade}
                size="large"
              >
                {submittingGrade ? "Grading..." : "Grade"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default ManualGrading;
