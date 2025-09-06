import React, { useState } from "react";
import StudentRegistrationForm from "./StudentRegistrationForm";

const getProgrammeDisplayName = (programme) => {
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
};

const StudentRegistrationFlow = ({ setOpen, selectedProgramme = "nahu" }) => {
  const [registrationStatus, setRegistrationStatus] = useState(null); // null, 'success', 'error'
  const [isLoading, setIsLoading] = useState(false);

  const handleRegistration = async (formData) => {
    setIsLoading(true);

    try {
      // Simulate API call to backend
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate successful registration
      setRegistrationStatus("success");

      // In a real implementation, you would send the formData to your backend
      console.log("Registration data:", formData);
    } catch (error) {
      setRegistrationStatus("error");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentRedirect = () => {
    // Redirect to Flutterwave payment page
    // In a real implementation, you would generate this URL from your backend
    const paymentUrl = `https://checkout.flutterwave.com/v3/hosted/pay/${selectedProgramme}_programme_${Date.now()}`;
    window.open(paymentUrl, "_blank");
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
            Welcome to the {getProgrammeDisplayName(selectedProgramme)}!
          </h3>

          <div className="space-y-4 text-gray-700 mb-6">
            <p>
              Your registration has been completed successfully. You are now
              enrolled in our programme.
            </p>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">
                Next Step: Complete Your Payment
              </h4>
              <p className="text-blue-800">
                To secure your spot in the programme, please complete your
                payment using our secure payment gateway.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
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
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
              Proceed to Payment
            </button>

            <button
              onClick={() => setOpen(false)}
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            You can complete your payment later from your dashboard.
          </div>
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
