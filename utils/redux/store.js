"use client";
import { configureStore } from "@reduxjs/toolkit";
import statesReducer from "./statesSlice";
import authReducer from "./slices/auth.reducer";
import userReducer from "./userSlice";
import tutorReducer from "./slices/tutorSlice";
import studentReducer from "./slices/studentSlice";
import programmeReducer from "./slices/programmeSlice";
import programmeTypeReducer from "./slices/programmeTypeSlice";
import classesReducer from "./slices/classesSlice";
import levelsReducer from "./slices/levelsSlice";
import courseReducer from "./slices/courseSlice";
import blogReducer from "./slices/blogSlice";
import announcementReducer from "./slices/announcementSlice";
import notificationReducer from "./slices/notificationSlice";
import feedbackReducer from "./slices/feedbackSlice";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import studentDashboardReducer from "./slices/studentDashboardSlice";
import assessmentReducer from "./slices/assessmentSlice";

export const store = configureStore({
  reducer: {
    states: statesReducer,
    user: userReducer,
    auth: authReducer,
    tutor: tutorReducer,
    student: studentReducer,
    programme: programmeReducer,
    programmeType: programmeTypeReducer,
    classes: classesReducer,
    levels: levelsReducer,
    course: courseReducer,
    blog: blogReducer,
    announcements: announcementReducer,
    notifications: notificationReducer,
    feedback: feedbackReducer,
    products: productReducer,
    cart: cartReducer,
    studentDashboard: studentDashboardReducer,
    assessments: assessmentReducer,
  },
});
