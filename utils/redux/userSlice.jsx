"use client";

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    email: null,
    first_name: null,
    cartItems: [],
    roles: [],
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    addCartItem: (state, action) => {
      state.user.cartItems = [...state.user.cartItems, action.payload];
    },
    removeCartItem: (state, action) => {
      state.user.cartItems = state.user.cartItems.filter(
        (item) => item.id !== action.payload
      );
    },
    setUserRoles: (state, action) => {
      state.user.roles = action.payload;
    },
    clearUserRoles: (state) => {
      state.user.roles = [];
    },
  },
});

export const {
  setUser,
  addCartItem,
  removeCartItem,
  setUserRoles,
  clearUserRoles,
} = userSlice.actions;

export default userSlice.reducer;
