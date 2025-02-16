"use client";
import { configureStore } from "@reduxjs/toolkit";
import statesReducer from "./statesSlice";
import authReducer from "./slices/auth.reducer";
import userReducer from "./userSlice";
<<<<<<< HEAD
import tutorReducer from "./slices/tutorSlice";
=======
>>>>>>> 18fd2aa (initial)

export const store = configureStore({
  reducer: {
    states: statesReducer,
    user: userReducer,
    auth: authReducer,
<<<<<<< HEAD
    tutor: tutorReducer,
=======
>>>>>>> 18fd2aa (initial)
  },
});
