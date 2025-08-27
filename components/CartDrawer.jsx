"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrCreateCart,
  removeItemFromCart,
} from "@/utils/redux/slices/cartSlice";
import { toast } from "react-toastify";
import Image from "next/image";
import { IMAGES } from "@/constants";
import { useRouter } from "next/navigation";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function CartDrawer({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { cart, status, itemCount, totalAmount } = useSelector(
    (state) => state.cart
  );

  useEffect(() => {
    if (isOpen) {
      dispatch(getOrCreateCart());
    }
  }, [dispatch, isOpen]);

  const handleRemoveItem = async (productId) => {
    try {
      await dispatch(removeItemFromCart({ productId })).unwrap();
      toast.success("Item removed from cart successfully!");
    } catch (error) {
      toast.error(error || "Failed to remove item from cart");
    }
  };

  const handleCheckout = () => {
    onClose();
    router.push("/checkout");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ShoppingCartIcon className="text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              Shopping Cart ({itemCount})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <CloseIcon className="text-gray-500" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex flex-col h-full">
          {status === "loading" ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : itemCount === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <ShoppingCartIcon className="text-6xl text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 mb-6">
                Looks like you haven't added any items to your cart yet.
              </p>
              <button
                onClick={() => {
                  onClose();
                  router.push("/store");
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {cart?.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      {/* Product Image */}
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

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 text-sm mb-1 truncate">
                          {item.product.title}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
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

                        {/* Price and Quantity */}
                        <div className="flex items-center justify-between mt-2">
                          <div>
                            <p className="font-semibold text-blue-600 text-sm">
                              {formatPrice(item.product.price)}
                            </p>
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemoveItem(item.product.id)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1"
                          >
                            <DeleteIcon className="text-sm" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Summary */}
              <div className="border-t border-gray-200 p-4">
                <div className="space-y-3 mb-4">
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
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-blue-600">
                        {formatPrice(totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout
                    <ArrowForwardIcon className="text-sm" />
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      router.push("/store");
                    }}
                    className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-300 font-medium"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default CartDrawer;
