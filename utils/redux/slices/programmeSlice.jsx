import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http, { http2 } from "@/hooks/axios/axios";

export const fetchProgrammes = createAsyncThunk(
  "programmes/fetchProgrammes",
  async ({ page = 1, pageSize = 10 } = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      });
      // Use trailing slash to match API spec: /programmes/
      const response = await http2.get(`/programmes/?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      // Provide more detailed error information
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          error.message || 
                          "Failed to fetch programmes";
      return rejectWithValue(errorMessage);
    }
  }
);

const programmeSlice = createSlice({
  name: "programmes",
  initialState: {
    programmes: [],
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
      .addCase(fetchProgrammes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProgrammes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.programmes = action.payload.results;
        state.pagination = {
          total: action.payload.total,
          totalPages: action.payload.total_pages,
          currentPage: action.payload.current_page,
          pageSize: action.payload.page_size,
        };
      })
      .addCase(fetchProgrammes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default programmeSlice.reducer;
