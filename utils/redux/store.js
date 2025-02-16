"use client";
import { configureStore } from "@reduxjs/toolkit";
import statesReducer from "./statesSlice";
import authReducer from "./slices/auth.reducer";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    states: statesReducer,
    user: userReducer,
    auth: authReducer,
  },
});
