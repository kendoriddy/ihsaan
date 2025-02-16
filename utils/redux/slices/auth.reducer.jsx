"use client";
import { createSlice } from "@reduxjs/toolkit";
let initialState = {
  isLoading: false,
  email: undefined,
  first_name: undefined,
  auth: false,
  authToken: null,
  refreshToken: null,
  roles: [],
};
if (typeof window !== "undefined") {
  initialState = {
    isLoading: false,
    email: localStorage.getItem("email") || undefined,
    first_name: localStorage.getItem("user") || undefined,
    roles: [],
    auth: localStorage.getItem("token") ? true : false,
    authToken: localStorage.getItem("token"),
    refreshToken: localStorage.getItem("refresh-token"),
  };
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUserSuccess(state, details) {
      state.auth = true;
<<<<<<< HEAD
      state.authToken = details.payload.access;
      state.refreshToken = details.payload.refresh;
      state.email = details.payload.email;
      state.roles = details.payload.roles;
      state.first_name = details.payload.first_name;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", details.payload.access);
        localStorage.setItem("refresh-token", details.payload.refresh);
        localStorage.setItem("user", details.payload.first_name);
        localStorage.setItem("email", details.payload.email);
        localStorage.setItem("roles", JSON.stringify(details.payload.roles));
=======
      state.authToken = details.payload.payload.access;
      state.refreshToken = details.payload.payload.refresh;
      state.email = details.payload.payload.email;
      state.roles = details.payload.payload.roles;
      state.first_name = details.payload.payload.first_name;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", details.payload.payload.access);
        localStorage.setItem("refresh-token", details.payload.payload.refresh);
        localStorage.setItem("user", details.payload.payload.first_name);
        localStorage.setItem("email", details.payload.payload.email);
        localStorage.setItem("roles", JSON.stringify(details.payload.payload.roles));
>>>>>>> 18fd2aa (initial)
      }
    },

    logoutUser(state) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh-token");
        localStorage.removeItem("email");
        localStorage.removeItem("roles");
        localStorage.removeItem("user");
      }
      state.auth = false;
      state.email = undefined;
      state.first_name = undefined;
      state.authToken = null;
      state.refreshToken = null;
      state.roles = [];
    },
  },
});

export const { loginUserSuccess, logoutUser } = authSlice.actions;

export const currentlyLoggedInUser = (state) => state.auth.first_name;
export const userRole = (state) => state.auth.roles;
export const currentlyLoggedInUserEmail = (state) => state.auth.email;
export const selectCurrentToken = (state) => state.auth.authToken;
export const selectIsAuth = (state) => state.auth.auth;
export const isMentor = (state) => state.auth.roles?.includes("mentor");
export const isCouncellor = (state) => state.auth.roles?.includes("counsellor");
export default authSlice.reducer;
