"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrCreateCart,
  removeItemFromCart,
  checkoutCart,
} from "@/utils/redux/slices/cartSlice";
import { toast } from "react-toastify";
import Image from "next/image";
import { IMAGES } from "@/constants";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DashboardSidebar from "@/components/DashboardSidebar";
import { usePathname, useRouter } from "next/navigation";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { format } from "date-fns";

function Cart() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [currentRoute, setCurrentRoute] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

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

  const handleRemoveItem = async (productId) => {
    try {
      await dispatch(removeItemFromCart({ productId })).unwrap();
      toast.success("Item removed from cart successfully!");
    } catch (error) {
      toast.error(error || "Failed to remove item from cart");
    }
  };

  const handleCheckout = async () => {
    if (itemCount === 0) {
      toast.error("Your cart is empty. Add some items first!");
      return;
    }

    setIsCheckingOut(true);

    try {
      await dispatch(checkoutCart()).unwrap();
      toast.success("Checkout successful! Redirecting to orders...");
      router.push("/courses/my-courses");
    } catch (error) {
      toast.error(error || "Failed to checkout. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

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
                Shopping Cart
              </h1>
              <p className="text-gray-600">
                Review your items and proceed to checkout
              </p>
            </div>

            {status === "loading" ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  {itemCount === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                      <ShoppingCartIcon className="text-6xl text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        Your cart is empty
                      </h3>
                      <p className="text-gray-500 mb-6">
                        Looks like you haven't added any items to your cart yet.
                      </p>
                      <button
                        onClick={() => router.push("/store")}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg shadow-sm">
                      <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">
                          Cart Items ({itemCount})
                        </h2>
                      </div>

                      <div className="divide-y divide-gray-200">
                        {cart?.items?.map((item) => (
                          <div key={item.id} className="p-6">
                            <div className="flex gap-4">
                              {/* Product Image */}
                              <div className="relative w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
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

                              {/* Product Details */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800 mb-1">
                                      {item.product.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                      {item.product.description}
                                    </p>

                                    {/* Product Type Badge */}
                                    <span
                                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                        item.product.type === "COURSE"
                                          ? "bg-blue-100 text-blue-800"
                                          : "bg-green-100 text-green-800"
                                      }`}
                                    >
                                      {item.product.type}
                                    </span>

                                    {/* Category */}
                                    {item.product.category && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        {item.product.category.name}
                                      </p>
                                    )}
                                  </div>

                                  {/* Price */}
                                  <div className="text-right ml-4">
                                    <p className="font-semibold text-lg text-blue-600">
                                      {formatPrice(item.product.price)}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Qty: {item.quantity}
                                    </p>
                                  </div>
                                </div>

                                {/* Item Total */}
                                <div className="flex items-center justify-between mt-4">
                                  <p className="text-sm text-gray-600">
                                    Item Total:{" "}
                                    <span className="font-semibold">
                                      {formatPrice(
                                        parseFloat(item.product.price) *
                                          item.quantity
                                      )}
                                    </span>
                                  </p>

                                  {/* Remove Button */}
                                  <button
                                    onClick={() =>
                                      handleRemoveItem(item.product.id)
                                    }
                                    className="flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors text-sm"
                                  >
                                    <DeleteIcon className="text-sm" />
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                      Order Summary
                    </h2>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Items ({itemCount})
                        </span>
                        <span className="font-medium">
                          {formatPrice(totalAmount)}
                        </span>
                      </div>

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

                    {/* Checkout Button */}
                    <button
                      onClick={handleCheckout}
                      disabled={itemCount === 0 || isCheckingOut}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
                    </button>

                    {/* Continue Shopping */}
                    <button
                      onClick={() => router.push("/store")}
                      className="w-full mt-3 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-300 font-medium"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Cart;
