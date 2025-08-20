import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FeedbackForm from "./feedback-form";
import FeedbackDashboard from "./feedback-dashboard";
import AdminFeedbackPanel from "./admin-feedback-panel";
import {
  fetchFeedbacks,
  clearErrors,
} from "@/utils/redux/slices/feedbackSlice";

export default function FeedbackMain({ userRole }) {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.feedback);

  useEffect(() => {
    // Fetch feedbacks when component mounts
    if (userRole !== "admin") {
      dispatch(fetchFeedbacks());
    }

    // Clear errors when component unmounts
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch, userRole]);

  const handleSubmitFeedback = (feedbackData) => {
    console.log("Submitting feedback:", feedbackData);
    // The form component will handle the actual submission
  };

  if (userRole === "admin") {
    return <AdminFeedbackPanel />;
  }

  return (
    <>
      <FeedbackDashboard
        userRole={userRole}
        onCreateFeedback={() => setShowFeedbackForm(true)}
        status={status}
        error={error}
      />
      <FeedbackForm
        isOpen={showFeedbackForm}
        onClose={() => setShowFeedbackForm(false)}
        userRole={userRole}
        onSubmit={handleSubmitFeedback}
      />
    </>
  );
}
