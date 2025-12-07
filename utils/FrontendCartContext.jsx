"use client";

import { createContext, useContext, useState, useEffect } from "react";

const FrontendCartContext = createContext();

export const useFrontendCart = () => {
  const context = useContext(FrontendCartContext);
  if (!context) {
    throw new Error(
      "useFrontendCart must be used within a FrontendCartProvider"
    );
  }
  return context;
};

export const FrontendCartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state to ensure we only access localStorage on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check if user is logged in on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    }
  }, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("frontendCart");
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error("Error parsing cart from localStorage:", error);
        }
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem("frontendCart", JSON.stringify(cartItems));
    }
  }, [cartItems, isLoggedIn]);

  const addToCart = (product) => {
    if (isLoggedIn) return; // Don't use frontend cart if logged in

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        // Item already exists, don't add duplicate
        return prevItems;
      } else {
        // Add new item with quantity 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("frontendCart");
  };

  const getCartItemCount = () => {
    return cartItems.length;
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + parseFloat(item.price) * item.quantity,
      0
    );
  };

  const getCartItems = () => {
    return cartItems;
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getCartItemCount,
    getCartTotal,
    getCartItems,
    isLoggedIn,
    setIsLoggedIn,
  };

  return (
    <FrontendCartContext.Provider value={value}>
      {children}
    </FrontendCartContext.Provider>
  );
};
