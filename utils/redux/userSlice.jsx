"use client";

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    email: null,
    first_name: null,
    cartItems: [],
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
  },
});

export const { setUser, addCartItem } = userSlice.actions;

export default userSlice.reducer;
