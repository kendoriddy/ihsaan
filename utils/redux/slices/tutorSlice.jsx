import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http, { apiLink } from "@/hooks/axios/axios";

console.log(apiLink, "apiLink");
export const fetchTutors = createAsyncThunk(
  "tutors/fetchTutors",
  async ({ page = 1, pageSize = 10 }) => {
    const response = await http.get(
      `/all-tutor?page=${page}&page_size=${pageSize}`
    );
    return response.data;
  }
);

const tutorSlice = createSlice({
  name: "tutors",
  initialState: {
    tutors: [],
    status: "idle",
    error: null,
    pagination: {
      total: 0,
      totalPages: 0,
      currentPage: 1,
      pageSize: 10,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTutors.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTutors.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tutors = action.payload.results;
        state.pagination = {
          total: action.payload.total,
          totalPages: action.payload.total_pages,
          currentPage: action.payload.current_page,
          pageSize: action.payload.page_size,
        };
      })
      .addCase(fetchTutors.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default tutorSlice.reducer;
