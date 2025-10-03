import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import StudentRegistrationForm from "./StudentRegistrationForm";
import { getAuthToken } from "@/hooks/axios/axios";

const getProgrammeDisplayName = (programme) => {
  // If programme is a string (legacy support)
  if (typeof programme === "string") {
    switch (programme) {
      case "nahu":
        return "Nahu Programme";
      case "primary":
        return "Primary Programme";
      case "secondary":
        return "Secondary Programme";
      default:
        return "Programme";
    }
  }

  // If programme is an object with name property
  if (programme && programme.name) {
    return programme.name;
  }

  // Fallback
  return "Programme";
};

const StudentRegistrationFlow = ({ setOpen, selectedProgramme = null }) => {
  const [registrationStatus, setRegistrationStatus] = useState(null); // null, 'success', 'error'
  const [isLoading, setIsLoading] = useState(false);
  const [registrationData, setRegistrationData] = useState(null); // Store the full API response
  console.log("registrationData:", registrationData);
  const handleRegistration = async (formData) => {
    setIsLoading(true);

    try {
      // Prepare payload according to new API structure
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phone_number,
        country: formData.country,
        gender: formData.gender.toUpperCase(), // Convert to uppercase as per API
        date_of_birth: formData.date_of_birth
          ? new Date(formData.date_of_birth).toISOString().split("T")[0]
          : null, // Format as YYYY-MM-DD
        programme_id:
          selectedProgramme?.id ||
          selectedProgramme ||
          "e4881f7d-298f-473d-acd9-012af4edc597", // Use programme ID
        academic_session_id: "1", // Default to session 1, can be made dynamic
      };

      console.log("Sending registration payload:", payload);

      // Make API call to the new endpoint
      const response = await axios.post(
        "https://ihsaanlms.onrender.com/api/auth/register-student-programme/",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Registration response:", response.data);

      // Store the response data for the success screen
      setRegistrationData(response.data);

      // Show success message
      toast.success(
        response.data.message ||
          "Registration successful! Welcome to the programme."
      );
      setRegistrationStatus("success");
    } catch (error) {
      console.error("Registration error:", error);

      // Handle different types of errors
      let errorMessage = "Registration failed. Please try again.";
      let specificErrors = [];

      if (error.response?.data) {
        const errorData = error.response.data;

        // Handle field-specific validation errors
        Object.keys(errorData).forEach((field) => {
          if (Array.isArray(errorData[field])) {
            errorData[field].forEach((errorMsg) => {
              specificErrors.push(`${field.replace("_", " ")}: ${errorMsg}`);
            });
          } else if (typeof errorData[field] === "string") {
            specificErrors.push(
              `${field.replace("_", " ")}: ${errorData[field]}`
            );
          }
        });

        // If we have specific errors, show them
        if (specificErrors.length > 0) {
          errorMessage = specificErrors.join("\n");
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      }

      // Show error message(s)
      if (specificErrors.length > 1) {
        // Show multiple errors
        specificErrors.forEach((error) => {
          toast.error(error);
        });
      } else {
        // Show single error
        toast.error(errorMessage);
      }

      // Don't set error status - keep form open for user to fix issues
      // setRegistrationStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentRedirect = async () => {
    try {
      // First, mark the programme as paid in the backend
      const programmeId =
        selectedProgramme?.id ||
        selectedProgramme ||
        "e4881f7d-298f-473d-acd9-012af4edc597";

      await axios.post(
        "https://ihsaanlms.onrender.com/api/student/mark-programme-paid/",
        {
          programme_id: programmeId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );

      console.log("Programme marked as paid successfully");

      // Then proceed with payment redirect
      if (registrationData?.payment_link?.checkout_url) {
        window.open(registrationData.payment_link.checkout_url, "_blank");
      } else {
        // Fallback if no payment link is available
        toast.error("Payment link not available. Please contact support.");
      }
    } catch (error) {
      console.error("Error marking programme as paid:", error);
      toast.error("Failed to process payment. Please try again.");
    }
  };

  if (registrationStatus === "success") {
    return (
      <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-2xl w-full mx-4">
        <div className="bg-green-500 text-white py-4 px-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Registration Successful!</h2>
        </div>

        <div className="p-6 text-center">
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Welcome to the{" "}
            {registrationData?.programme_pricing?.programme_name ||
              getProgrammeDisplayName(selectedProgramme)}
            !
          </h3>

          <div className="space-y-4 text-gray-700 mb-6">
            <p>
              {registrationData?.message ||
                "Your registration has been completed successfully. You are now enrolled in our programme."}
            </p>

            {registrationData?.payment_required &&
              registrationData?.programme_pricing && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Payment Required
                  </h4>
                  <div className="text-blue-800 space-y-2">
                    <p>
                      <strong>Programme:</strong>{" "}
                      {registrationData.programme_pricing.programme_name} (
                      {registrationData.programme_pricing.programme_code})
                    </p>
                    <p>
                      <strong>Amount:</strong>{" "}
                      {registrationData.programme_pricing.currency}{" "}
                      {registrationData.programme_pricing.price?.toLocaleString()}
                    </p>
                    {registrationData.payment_link?.expires_in && (
                      <p className="text-orange-600">
                        <strong>Payment expires in:</strong>{" "}
                        {registrationData.payment_link.expires_in}
                      </p>
                    )}
                  </div>
                </div>
              )}

            {registrationData?.next_steps &&
              registrationData.next_steps.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-left">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Next Steps:
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    {registrationData.next_steps.map((step, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            {registrationData?.payment_required &&
              registrationData?.payment_link?.checkout_url && (
                <button
                  onClick={handlePaymentRedirect}
                  className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors shadow-md flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="1"
                      y="4"
                      width="22"
                      height="16"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                  Proceed to Payment (
                  {registrationData.programme_pricing?.currency}{" "}
                  {registrationData.programme_pricing?.price?.toLocaleString()})
                </button>
              )}

            <button
              onClick={() => setOpen(false)}
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>

          {registrationData?.payment_required && (
            <div className="mt-6 text-sm text-gray-500">
              {registrationData.payment_link?.payment_reference && (
                <p className="mb-2">
                  <strong>Payment Reference:</strong>{" "}
                  {registrationData.payment_link.payment_reference}
                </p>
              )}
              You can complete your payment later from your dashboard or use the
              payment link sent to your email.
            </div>
          )}
        </div>
      </div>
    );
  }

  if (registrationStatus === "error") {
    return (
      <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-2xl w-full mx-4">
        <div className="bg-red-500 text-white py-4 px-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Registration Failed</h2>
        </div>

        <div className="p-6 text-center">
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Something went wrong
          </h3>

          <p className="text-gray-700 mb-6">
            We encountered an error while processing your registration. Please
            try again.
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setRegistrationStatus(null)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>

            <button
              onClick={() => setOpen(false)}
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-2xl w-full mx-4">
      <div className="bg-primary text-white py-4 px-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Register for {getProgrammeDisplayName(selectedProgramme)}
        </h2>
        <button
          onClick={() => setOpen(false)}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="p-6">
        <div className="mb-4 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Register for {getProgrammeDisplayName(selectedProgramme)}
          </h3>
          <p className="text-gray-600">
            Fill out the form below to register as a student for the{" "}
            {getProgrammeDisplayName(selectedProgramme).toLowerCase()}
          </p>
        </div>

        <StudentRegistrationForm
          onSubmit={handleRegistration}
          isLoading={isLoading}
          selectedProgramme={selectedProgramme}
        />
      </div>
    </div>
  );
};

export default StudentRegistrationFlow;
