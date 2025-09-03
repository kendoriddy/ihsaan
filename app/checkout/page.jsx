"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrCreateCart, checkoutCart } from "@/utils/redux/slices/cartSlice";
import { toast } from "react-toastify";
import Image from "next/image";
import { IMAGES } from "@/constants";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DashboardSidebar from "@/components/DashboardSidebar";
import { usePathname, useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  CreditCardIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import {
  CreditCardIcon as CreditCardIconSolid,
  LockClosedIcon as LockClosedIconSolid,
  ShieldCheckIcon as ShieldCheckIconSolid,
} from "@heroicons/react/24/solid";

// Validation schema for checkout form
const CheckoutSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
});

function Checkout() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [currentRoute, setCurrentRoute] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState("form"); // form, processing, success, error
  const [paymentReference, setPaymentReference] = useState("");

  const { cart, status, itemCount, totalAmount } = useSelector(
    (state) => state.cart
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentRoute(pathname);
    }
  }, [pathname]);

  useEffect(() => {
    dispatch(getOrCreateCart());
  }, [dispatch]);

  // Generate payment reference
  const generatePaymentReference = () => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `PAY-${timestamp}-${random}`;
  };

  const handleCheckout = async (values) => {
    if (itemCount === 0) {
      toast.error("Your cart is empty. Add some items first!");
      return;
    }

    setIsProcessing(true);
    setPaymentStep("processing");
    const ref = generatePaymentReference();
    setPaymentReference(ref);

    try {
      // Simulate Paystack payment flow
      console.log("Initiating Paystack payment...");
      console.log("Payment Reference:", ref);
      console.log("Amount:", totalAmount);
      console.log("Customer Email:", values.email);

      // Simulate payment processing steps
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Initialize payment
      console.log("Payment initialized...");

      await new Promise((resolve) => setTimeout(resolve, 1500)); // Process payment
      console.log("Payment processed...");

      await new Promise((resolve) => setTimeout(resolve, 500)); // Verify payment
      console.log("Payment verified...");

      // Simulate successful payment
      setPaymentStep("success");
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Show success message

      await dispatch(checkoutCart()).unwrap();
      toast.success("Payment successful! Order placed successfully!");
      router.push("/courses/my-courses");
    } catch (error) {
      setPaymentStep("error");
      toast.error(error || "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  if (itemCount === 0) {
    return (
      <div>
        <Header />
        <main className="flex relative">
          <DashboardSidebar currentRoute={currentRoute} />
          <section className="flex flex-col md:flex-row p-4 justify-self-center flex-1 min-h-screen">
            <div className="px-4 w-full py-8 lg:py-0">
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                  Your cart is empty
                </h1>
                <p className="text-gray-600 mb-6">
                  Add some items to your cart before checkout.
                </p>
                <button
                  onClick={() => router.push("/store")}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="flex relative">
        <DashboardSidebar currentRoute={currentRoute} />

        <section className="flex flex-col md:flex-row p-4 justify-self-center flex-1 min-h-screen">
          <div className="px-4 w-full py-8 lg:py-0">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => router.push("/store")}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <ArrowBackIcon />
                  Back to Store
                </button>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Checkout
              </h1>
              <p className="text-gray-600">Complete your purchase</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Payment Information
                  </h2>

                  <Formik
                    initialValues={{
                      firstName: "",
                      lastName: "",
                      email: "",
                      phone: "",
                    }}
                    validationSchema={CheckoutSchema}
                    onSubmit={handleCheckout}
                  >
                    {({ errors, touched }) => (
                      <Form className="space-y-6">
                        {/* Paystack Security Notice */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <ShieldCheckIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <h3 className="text-sm font-medium text-blue-900">
                                Secure Payment with Paystack
                              </h3>
                              <p className="text-sm text-blue-700 mt-1">
                                Your payment will be processed securely through
                                Paystack's payment gateway.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Personal Information */}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Personal Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                First Name
                              </label>
                              <Field
                                name="firstName"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="John"
                              />
                              {errors.firstName && touched.firstName && (
                                <p className="text-red-500 text-xs mt-1">
                                  {errors.firstName}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name
                              </label>
                              <Field
                                name="lastName"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Doe"
                              />
                              {errors.lastName && touched.lastName && (
                                <p className="text-red-500 text-xs mt-1">
                                  {errors.lastName}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email Address
                            </label>
                            <Field
                              name="email"
                              type="email"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="john@example.com"
                            />
                            {errors.email && touched.email && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.email}
                              </p>
                            )}
                          </div>

                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phone Number
                            </label>
                            <Field
                              name="phone"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="+234 123 456 7890"
                            />
                            {errors.phone && touched.phone && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.phone}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Payment Button */}
                        <div className="pt-6">
                          <button
                            type="submit"
                            disabled={isProcessing}
                            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                          >
                            {isProcessing ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>Processing Payment...</span>
                              </>
                            ) : (
                              <>
                                <LockClosedIcon className="h-5 w-5" />
                                <span>
                                  Pay Now - {formatPrice(totalAmount)}
                                </span>
                              </>
                            )}
                          </button>

                          <p className="text-xs text-gray-500 text-center mt-3">
                            By clicking "Pay Now", you agree to our terms of
                            service and privacy policy
                          </p>
                        </div>
                      </Form>
                    )}
                  </Formik>

                  {/* Payment Processing State */}
                  {paymentStep === "processing" && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Processing Payment
                          </h3>
                          <p className="text-gray-600 mb-4">
                            Please wait while we process your payment
                            securely...
                          </p>
                          <div className="bg-gray-100 rounded-lg p-3 mb-4">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Reference:</span>{" "}
                              {paymentReference}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Amount:</span>{" "}
                              {formatPrice(totalAmount)}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                              <span>Initializing payment...</span>
                            </div>
                            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                              <span>Processing with Paystack...</span>
                            </div>
                            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                              <span>Verifying transaction...</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Success State */}
                  {paymentStep === "success" && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircleIcon className="h-8 w-8 text-green-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Payment Successful!
                          </h3>
                          <p className="text-gray-600 mb-4">
                            Your payment has been processed successfully. You
                            will receive a confirmation email shortly.
                          </p>
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                            <p className="text-sm text-green-800">
                              <span className="font-medium">
                                Transaction ID:
                              </span>{" "}
                              {paymentReference}
                            </p>
                            <p className="text-sm text-green-800">
                              <span className="font-medium">Amount Paid:</span>{" "}
                              {formatPrice(totalAmount)}
                            </p>
                          </div>
                          <p className="text-sm text-gray-500">
                            Redirecting to your orders...
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Error State */}
                  {paymentStep === "error" && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <XCircleIcon className="h-8 w-8 text-red-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Payment Failed
                          </h3>
                          <p className="text-gray-600 mb-4">
                            We couldn't process your payment. Please check your
                            payment details and try again.
                          </p>
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                            <p className="text-sm text-red-800">
                              <span className="font-medium">Reference:</span>{" "}
                              {paymentReference}
                            </p>
                          </div>
                          <div className="space-y-3">
                            <button
                              onClick={() => setPaymentStep("form")}
                              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                            >
                              Try Again
                            </button>
                            <button
                              onClick={() => router.push("/cart")}
                              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                            >
                              Back to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Order Summary
                    </h2>
                    <div className="flex items-center space-x-2">
                      <LockClosedIcon className="h-4 w-4 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">
                        Secure
                      </span>
                    </div>
                  </div>

                  {/* Cart Items */}
                  <div className="space-y-4 mb-6">
                    {cart?.items?.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={
                              item.product.image?.startsWith("http")
                                ? item.product.image
                                : IMAGES.course_1
                            }
                            alt={item.product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 text-sm mb-1">
                            {item.product.title}
                          </h4>
                          <p className="text-xs text-gray-600 mb-1">
                            Qty: {item.quantity}
                          </p>
                          <p className="font-semibold text-blue-600 text-sm">
                            {formatPrice(
                              parseFloat(item.product.price) * item.quantity
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">
                        {formatPrice(totalAmount)}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">₦0.00</span>
                    </div>

                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-blue-600">
                          {formatPrice(totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Paystack Security Notice */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-start space-x-3">
                      <ShieldCheckIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          Powered by Paystack
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          Your payment is processed securely by Paystack,
                          Nigeria's leading payment processor.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Checkout;
