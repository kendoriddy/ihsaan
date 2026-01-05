"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourseById } from "@/utils/redux/slices/courseSlice";
import { addItemToCart, checkoutCart } from "@/utils/redux/slices/cartSlice";
import { useFrontendCart } from "@/utils/FrontendCartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IMAGES } from "@/constants";
import { toast } from "react-toastify";
import RegistrationModal from "@/components/RegistrationModal";
import {
  StarIcon,
  ClockIcon,
  UserIcon,
  PlayIcon,
  CheckIcon,
  ArrowLeftIcon,
  HeartIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import {
  StarIcon as StarIconSolid,
  ClockIcon as ClockIconSolid,
  UserIcon as UserIconSolid,
  PlayIcon as PlayIconSolid,
  CheckIcon as CheckIconSolid,
} from "@heroicons/react/24/solid";

export default function CourseDetail({ params }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentCourse, status } = useSelector((state) => state.course);
  const { itemCount, cart } = useSelector((state) => state.cart);
  const {
    addToCart: addToFrontendCart,
    getCartItemCount,
    getCartItems,
    isLoggedIn,
  } = useFrontendCart();

  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState("form"); // form, processing, success, error
  const [paymentReference, setPaymentReference] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      setIsLoading(true);
      try {
        await dispatch(fetchCourseById(params.id)).unwrap();
      } catch (error) {
        toast.error("Failed to fetch course details");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchCourseData();
    }
  }, [dispatch, params.id]);

  // Generate payment reference
  const generatePaymentReference = () => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `PAY-${timestamp}-${random}`;
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (isLoggedIn) {
      // Logged-in user: use backend cart
      const existingItem = cart?.items?.find(
        (item) => item.product?.id === currentCourse.id
      );

      if (existingItem) {
        toast.info("This course is already in your cart!");
        return;
      }

      try {
        await dispatch(
          addItemToCart({ productId: currentCourse.id, quantity: 1 })
        ).unwrap();
        toast.success("Course added to cart successfully!");
      } catch (error) {
        toast.error(error || "Failed to add course to cart");
      }
    } else {
      // Non-logged-in user: use frontend cart
      const frontendCartItems = getCartItems();
      const existingItem = frontendCartItems.find(
        (item) => item.id === currentCourse.id
      );

      if (existingItem) {
        toast.info("This course is already in your cart!");
        return;
      }

      addToFrontendCart(currentCourse);
      toast.success("Course added to cart successfully!");
    }
  };

  // Handle buy now
  const handleBuyNow = () => {
    if (!currentCourse) {
      toast.error("Course information not available");
      return;
    }

    if (!isLoggedIn) {
      // Show registration modal for non-logged-in users
      setShowRegistrationModal(true);
      return;
    }

    // Show payment modal to collect email for logged-in users
    setShowPaymentModal(true);
  };

  // Handle direct payment
  const handleDirectPayment = async (email) => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    if (!currentCourse) {
      toast.error("Course information not available");
      return;
    }

    setIsProcessing(true);
    setPaymentStep("processing");
    const ref = generatePaymentReference();
    setPaymentReference(ref);

    try {
      // Simulate Paystack payment flow
      console.log("Initiating payment...");
      console.log("Payment Reference:", ref);
      console.log("Amount:", currentCourse.price);
      console.log("Customer Email:", email);

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

      // Add the course to cart first
      await dispatch(
        addItemToCart({
          productId: currentCourse.id,
          quantity: 1,
        })
      ).unwrap();

      // Then checkout
      await dispatch(checkoutCart()).unwrap();

      toast.success("Payment successful! Course purchased successfully!");
      router.push("/dashboard/orders");
    } catch (error) {
      setPaymentStep("error");
      toast.error(error || "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Format price
  const formatPrice = (price) => {
    if (!price || Number.parseFloat(price) === 0) return "Free";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(Number.parseFloat(price));
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!currentCourse) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Course Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The course you're looking for doesn't exist.
            </p>
            <Link
              href="/courses"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Back to Courses
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <span>/</span>
            <Link href="/courses" className="hover:text-blue-600">
              Courses
            </Link>
            <span>/</span>
            <span className="text-gray-900">{currentCourse?.title || currentCourse?.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {currentCourse?.title || currentCourse?.name}
                  </h1>
                  <p className="text-gray-600 mb-4">
                    Learn from the best instructors at IHSAAN ACADEMIA
                  </p>

                  {/* Rating and Reviews */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIconSolid
                            key={star}
                            className={`h-5 w-5 ${
                              star <= 4 ? "text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">4.0</span>
                    </div>
                    <span className="text-sm text-gray-500">(0 reviews)</span>
                    <span className="text-sm text-gray-500">
                      0 students enrolled
                    </span>
                  </div>

                  {/* Programme Name */}
                  {currentCourse?.programme_name && (
                    <div className="mb-4">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {currentCourse.programme_name}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Course Image */}
              <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden mb-6">
                <Image
                  src={
                    currentCourse?.image_url?.startsWith("http")
                      ? currentCourse.image_url
                      : IMAGES.course_1
                  }
                  alt={currentCourse?.title || currentCourse?.name || "Course"}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <div className="bg-white rounded-full p-4">
                    <PlayIcon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Course Description */}
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">
                  About this course
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {currentCourse?.description ||
                    "This is a comprehensive course designed to help you master the subject matter. Whether you're a beginner or looking to advance your skills, this course provides the knowledge and tools you need to succeed."}
                </p>
              </div>
            </div>

            {/* What You'll Learn */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">What you'll learn</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Comprehensive understanding of the subject matter",
                  "Practical skills and hands-on experience",
                  "Industry best practices and methodologies",
                  "Real-world applications and case studies",
                  "Problem-solving techniques and strategies",
                  "Advanced concepts and advanced topics",
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckIconSolid className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Requirements */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Requirements</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Basic computer skills</li>
                <li>• Internet connection</li>
                <li>• Dedication to learn</li>
                <li>• No prior experience required</li>
              </ul>
            </div>

            {/* Course Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Course Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-3">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">Duration: 10 hours</span>
                </div>
                <div className="flex items-center space-x-3">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">
                    Instructor: IHSAAN ACADEMIA
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <PlayIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">Lectures: 50+ videos</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">Certificate: Yes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Purchase Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <div className="bg-white rounded-lg shadow-md p-6 border">
                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(currentCourse?.price)}
                    </span>
                    {/* {parseFloat(currentProduct.price) > 0 && (
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(parseFloat(currentProduct.price) * 1.2)}
                      </span>
                    )} */}
                  </div>
                  {/* {parseFloat(currentProduct.price) > 0 && (
                    <span className="text-sm text-green-600 font-medium">
                      17% off
                    </span>
                  )} */}
                </div>

                {/* Add to Cart Section */}
                <div className="space-y-4 mb-6">
                  {(() => {
                    let existingItem;
                    let isInCart;

                    if (isLoggedIn) {
                      // Check backend cart for logged-in users
                      existingItem = cart?.items?.find(
                        (item) => item.product?.id === currentCourse.id
                      );
                      isInCart = !!existingItem;
                    } else {
                      // Check frontend cart for non-logged-in users
                      const frontendCartItems = getCartItems();
                      existingItem = frontendCartItems.find(
                        (item) => item.id === currentCourse.id
                      );
                      isInCart = !!existingItem;
                    }

                    return (
                      <>
                        <button
                          onClick={handleAddToCart}
                          disabled={isInCart}
                          className={`w-full py-3 px-4 rounded-md transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                            isInCart
                              ? "bg-green-600 text-white cursor-not-allowed"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          {isInCart ? "✓ Already in Cart" : "Add to Cart"}
                        </button>

                        <button
                          onClick={handleBuyNow}
                          className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors duration-200 font-medium"
                        >
                          {isLoggedIn ? "Buy Now" : "Buy Now (Register First)"}
                        </button>

                        {isInCart && (
                          <Link
                            href={isLoggedIn ? "/cart" : "/frontend-cart"}
                            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors duration-200 font-medium text-center block"
                          >
                            View Cart (
                            {isLoggedIn ? itemCount : getCartItemCount()} items)
                          </Link>
                        )}
                      </>
                    );
                  })()}
                </div>

                {/* Course Includes */}
                <div className="border-t pt-6">
                  <h4 className="font-medium text-gray-900 mb-3">
                    This course includes:
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckIconSolid className="h-4 w-4 text-green-500" />
                      <span>10 hours on-demand video</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckIconSolid className="h-4 w-4 text-green-500" />
                      <span>Downloadable resources</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckIconSolid className="h-4 w-4 text-green-500" />
                      <span>Full lifetime access</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckIconSolid className="h-4 w-4 text-green-500" />
                      <span>Certificate of completion</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckIconSolid className="h-4 w-4 text-green-500" />
                      <span>Access on mobile and TV</span>
                    </li>
                  </ul>
                </div>

                {/* 30-Day Money-Back Guarantee */}
                <div className="border-t pt-6 mt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      30-Day Money-Back Guarantee
                    </p>
                    <p className="text-xs text-gray-500">
                      Full Lifetime Access
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Complete Your Purchase
              </h3>
              <p className="text-gray-600 mb-6">
                Enter your email address to proceed with payment
              </p>

              <div className="mb-6">
                <div className="text-center mb-4">
                  <h4 className="font-medium text-gray-900">
                    {currentCourse?.title || currentCourse?.name}
                  </h4>
                  <p className="text-2xl font-bold text-green-600">
                    {formatPrice(currentCourse?.price || 0)}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDirectPayment(customerEmail)}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    "Pay Now"
                  )}
                </button>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center space-x-2 text-sm text-blue-700">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Secure payment powered by Paystack</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                Please wait while we process your payment securely...
              </p>
              <div className="bg-gray-100 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Reference:</span>{" "}
                  {paymentReference}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Amount:</span>{" "}
                  {formatPrice(currentCourse?.price || 0)}
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
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Payment Successful!
              </h3>
              <p className="text-gray-600 mb-4">
                Your course has been purchased successfully.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-green-800">
                  <span className="font-medium">Paystack Reference:</span>{" "}
                  {paymentReference}
                </p>
                <p className="text-sm text-green-800">
                  <span className="font-medium">Amount Paid:</span>{" "}
                  {formatPrice(currentCourse?.price || 0)}
                </p>
                <p className="text-sm text-green-800">
                  <span className="font-medium">Status:</span>{" "}
                  <span className="text-green-600 font-medium">Success</span>
                </p>
              </div>
              <p className="text-sm text-gray-500">
                Redirecting to your dashboard...
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
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Payment Failed
              </h3>
              <p className="text-gray-600 mb-4">
                We couldn't process your payment. Please try again.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-red-800">
                  Payment was not completed. Please try again or contact support
                  if the issue persists.
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setPaymentStep("form")}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => {
                    setPaymentStep("form");
                    setShowPaymentModal(false);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onSuccess={() => {
          // After successful registration, user can proceed with payment
          setShowRegistrationModal(false);
          setShowPaymentModal(true);
        }}
      />

      <Footer />
    </div>
  );
}
