import { getAuthToken } from "@/hooks/axios/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch courses
export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (
    { page = 1, page_size = 10, programme = null, search = null },
    { rejectWithValue }
  ) => {
    const token = getAuthToken();

    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("page_size", page_size);

      if (programme) {
        params.append("programme", programme);
      }

      if (search) {
        params.append("search", search);
      }

      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/course/courses/?${params.toString()}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data, "response wow:");
      return response.data; // Return the fetched data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch courses"
      );
    }
  }
);

// Slice for courses
const courseSlice = createSlice({
  name: "courses",
  initialState: {
    courses: [],
    courseCount: 0,
    totalPages: 0,
    nextPageUrl: null,
    prevPageUrl: null,
    status: "idle", // idle, loading, succeeded, failed
    isRefreshing: false, // For background refresh
    error: null,
    lastFetchedParams: null, // Store last fetch params to avoid unnecessary refetches
  },
  reducers: {
    setRefreshing: (state, action) => {
      state.isRefreshing = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        // Only set status to loading if we don't have cached data
        if (state.courses.length === 0) {
          state.status = "loading";
        } else {
          // If we have cached data, just mark as refreshing
          state.isRefreshing = true;
        }
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isRefreshing = false;
        state.courses = action.payload.results;
        state.courseCount = action.payload.total;
        state.totalPages = action.payload.total_pages;
        state.nextPageUrl = action.payload.next;
        state.prevPageUrl = action.payload.previous;
        state.error = null;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        // Only set status to failed if we don't have cached data
        if (state.courses.length === 0) {
          state.status = "failed";
        }
        state.isRefreshing = false;
        state.error = action.payload || "Failed to fetch courses";
      });
  },
});

export const { setRefreshing } = courseSlice.actions;

export default courseSlice.reducer;
