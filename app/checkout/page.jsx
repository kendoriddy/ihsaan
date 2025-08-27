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

// Validation schema for checkout form
const CheckoutSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  zipCode: Yup.string().required("ZIP code is required"),
  cardNumber: Yup.string()
    .matches(/^\d{16}$/, "Card number must be 16 digits")
    .required("Card number is required"),
  expiryDate: Yup.string()
    .matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Invalid expiry date (MM/YY)")
    .required("Expiry date is required"),
  cvv: Yup.string()
    .matches(/^\d{3,4}$/, "CVV must be 3-4 digits")
    .required("CVV is required"),
});

function Checkout() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [currentRoute, setCurrentRoute] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleCheckout = async (values) => {
    if (itemCount === 0) {
      toast.error("Your cart is empty. Add some items first!");
      return;
    }

    setIsProcessing(true);

    try {
      // Here you would typically integrate with a payment processor
      // For now, we'll just simulate the checkout process
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call

      await dispatch(checkoutCart()).unwrap();
      toast.success("Order placed successfully! Redirecting to orders...");
      router.push("/dashboard/orders");
    } catch (error) {
      toast.error(error || "Failed to process checkout. Please try again.");
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
                      address: "",
                      city: "",
                      state: "",
                      zipCode: "",
                      cardNumber: "",
                      expiryDate: "",
                      cvv: "",
                    }}
                    validationSchema={CheckoutSchema}
                    onSubmit={handleCheckout}
                  >
                    {({ errors, touched }) => (
                      <Form className="space-y-4">
                        {/* Personal Information */}
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

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
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

                        <div>
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

                        {/* Billing Address */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address
                          </label>
                          <Field
                            name="address"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="123 Main Street"
                          />
                          {errors.address && touched.address && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.address}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              City
                            </label>
                            <Field
                              name="city"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Lagos"
                            />
                            {errors.city && touched.city && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.city}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              State
                            </label>
                            <Field
                              name="state"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Lagos"
                            />
                            {errors.state && touched.state && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.state}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              ZIP Code
                            </label>
                            <Field
                              name="zipCode"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="100001"
                            />
                            {errors.zipCode && touched.zipCode && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.zipCode}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Payment Information */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Card Number
                          </label>
                          <Field
                            name="cardNumber"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="1234 5678 9012 3456"
                          />
                          {errors.cardNumber && touched.cardNumber && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.cardNumber}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Expiry Date
                            </label>
                            <Field
                              name="expiryDate"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="MM/YY"
                            />
                            {errors.expiryDate && touched.expiryDate && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.expiryDate}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              CVV
                            </label>
                            <Field
                              name="cvv"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="123"
                            />
                            {errors.cvv && touched.cvv && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.cvv}
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isProcessing}
                          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isProcessing
                            ? "Processing..."
                            : `Pay ${formatPrice(totalAmount)}`}
                        </button>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Order Summary
                  </h2>

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

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">Free</span>
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
