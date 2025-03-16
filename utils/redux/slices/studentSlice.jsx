import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http, { apiLink } from "@/hooks/axios/axios";

export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",
  async ({ page = 1, pageSize = 10, status, endpoint }) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });

    if (status) {
      queryParams.append("status", status);
    }
    const response = await http.get(`${endpoint}?${queryParams.toString()}`);
    console.log(response, "come on:");

    return response.data;
  }
);

const studentSlice = createSlice({
  name: "students",
  initialState: {
    students: [],
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
      .addCase(fetchStudents.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.students = action.payload.results;
        state.pagination = {
          total: action.payload.total,
          totalPages: action.payload.total_pages,
          currentPage: action.payload.current_page,
          pageSize: action.payload.page_size,
        };
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default studentSlice.reducer;
