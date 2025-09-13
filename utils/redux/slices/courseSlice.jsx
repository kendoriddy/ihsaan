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

      const url = `https://ihsaanlms.onrender.com/course/courses/?${params.toString()}`;
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
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.courses = action.payload.results;
        state.courseCount = action.payload.total;
        state.totalPages = action.payload.total_pages;
        state.nextPageUrl = action.payload.next;
        state.prevPageUrl = action.payload.previous;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch courses";
      });
  },
});

export default courseSlice.reducer;
