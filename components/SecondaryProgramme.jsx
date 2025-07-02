import React, { useState } from "react";

const SecondaryProgramme = ({ setOpen }) => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  // Paystack test implementation
  const handlePaystackPayment = () => {
    setIsProcessingPayment(true);

    // Simulate API call to initialize Paystack transaction
    setTimeout(() => {
      // In a real implementation, you would use the Paystack SDK or API
      const testPaystackConfig = {
        key: "pk_test_xxxxxxxxxxxxxxxxxxxx", // This would be your actual public key
        email: "student@example.com",
        amount: 25000, // Amount in kobo (250 NGN)
        ref: "NAHU_" + Math.floor(Math.random() * 1000000000),
        currency: "NGN",
        callback: function (response) {
          setPaymentStatus({
            success: true,
            reference: response.reference,
            message: "Payment complete! Reference: " + response.reference,
          });
          setIsProcessingPayment(false);
        },
        onClose: function () {
          setPaymentStatus({
            success: false,
            message: "Payment window closed.",
          });
          setIsProcessingPayment(false);
        },
      };

      // Simulate successful payment after 2 seconds
      setTimeout(() => {
        setPaymentStatus({
          success: true,
          reference: testPaystackConfig.ref,
          message: "Payment complete! Reference: " + testPaystackConfig.ref,
        });
        setIsProcessingPayment(false);
      }, 2000);
    }, 1000);
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-2xl w-full mx-4">
        {/* Header with decorative Islamic pattern */}
        <div className="bg-primary text-white py-4 px-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Welcome to Secondary Programme</h2>
        </div>

        {/* Decorative divider */}
        <div className="h-2 bg-gradient-to-r from-primary via-primary to-primary"></div>

        {/* Content */}
        <div className="p-6 text-center">
          <div className="mb-6 text-primary font-arabic text-xl">
            بسم الله الرحمن الرحيم
          </div>

          <h3 className="text-2xl font-semibold text-primary mb-4">
            Illuminating Minds Through Classical Arabic Grammar
          </h3>

          <div className="space-y-4 text-gray-700">
            <p>
              The Secondary Programme invites sincere seekers of knowledge to
              embark on a transformative journey through the beautiful
              intricacies of Arabic grammar - the key to unlocking the treasures
              of the Quran and Hadith.
            </p>

            <p>
              Guided by qualified scholars with traditional ijazah chains of
              knowledge, our comprehensive curriculum follows the time-tested
              methods that have preserved Islamic scholarship for centuries.
            </p>

            <div className="my-6 bg-primary p-4 rounded-lg border border-primary">
              <h4 className="font-semibold text-white mb-2">
                Programme Highlights:
              </h4>
              <ul className="text-left space-y-2">
                <li className="flex items-start">
                  <span className="text-white mr-2">•</span>
                  <span className="text-white">
                    Master the fundamentals of Arabic grammar (Nahw) essential
                    for Quranic understanding
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-white mr-2">•</span>
                  <span className="text-white">
                    Study classical texts with proper understanding and context
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-white mr-2">•</span>
                  <span className="text-white">
                    Join a supportive community of dedicated students of
                    knowledge
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-white mr-2">•</span>
                  <span className="text-white">
                    Weekly live sessions with opportunities for questions and
                    discussion
                  </span>
                </li>
              </ul>
            </div>

            <p className="italic">
              "Whoever travels a path in search of knowledge, Allah makes easy
              for them a path to Paradise." - Hadith, Sahih Muslim
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setOpen(true);
              }}
              className="bg-primary hover:bg-primary text-white py-3 px-6 rounded-lg font-medium transition-colors shadow-md flex items-center justify-center"
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
              Register Now
            </button>
            <button
              onClick={handlePaystackPayment}
              disabled={isProcessingPayment}
              className={`border-2 border-primary ${
                isProcessingPayment
                  ? "bg-gray-100 text-gray-500"
                  : "text-primary hover:bg-primary"
              } py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center`}
            >
              {isProcessingPayment ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
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
                  Make Payment
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            Classes begin the first week of Muharam. Limited spaces available.
          </div>

          {/* Payment status message */}
          {paymentStatus && (
            <div
              className={`mt-4 p-3 rounded-md ${
                paymentStatus.success
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
            >
              <div className="flex items-center">
                {paymentStatus.success ? (
                  <svg
                    className="h-5 w-5 mr-2"
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
                ) : (
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                )}
                <span>{paymentStatus.message}</span>
              </div>

              {paymentStatus.success && (
                <div className="mt-2 text-sm">
                  Please save your reference number. You will receive an email
                  with your registration details shortly.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecondaryProgramme;
