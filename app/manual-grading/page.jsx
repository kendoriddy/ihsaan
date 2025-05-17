"use client";

import { Formik, Form, Field } from "formik";
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
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

  useEffect(() => {
    if (selectedAssessmentId) {
      refetchStudents();
    }
  }, [selectedAssessmentId]);

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
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || "Failed to submit grading"
        );
      },
    });
  };
  const isGroupAssessment = selectedAssessment?.type === "GROUP";

  return (
    <Layout>
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
                      {assessment.title}
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
                        Group {group.id}
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
