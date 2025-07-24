import { useState } from "react";
import FeedbackForm from "./feedback-form";
import FeedbackDashboard from "./feedback-dashboard";
import AdminFeedbackPanel from "./admin-feedback-panel";

export default function FeedbackMain({ userRole }) {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  const handleSubmitFeedback = (feedbackData) => {
    console.log("Submitting feedback:", feedbackData);
    // Implement API call to submit feedback
  };

  if (userRole === "admin") {
    return <AdminFeedbackPanel />;
  }

  return (
    <>
      <FeedbackDashboard
        userRole={userRole}
        onCreateFeedback={() => setShowFeedbackForm(true)}
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
