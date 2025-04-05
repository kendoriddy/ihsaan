import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http, { http2 } from "@/hooks/axios/axios";

export const fetchProgrammeTypes = createAsyncThunk(
  "programmeTypes/fetchProgrammeTypes",
  async ({ page = 1, pageSize = 10 } = {}) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    const response = await http2.get(
      `programme-types?${queryParams.toString()}`
    );
    return response.data;
  }
);

const programmeTypeSlice = createSlice({
  name: "programmeTypes",
  initialState: {
    programmeTypes: [],
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
      .addCase(fetchProgrammeTypes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProgrammeTypes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.programmeTypes = action.payload.results;
        state.pagination = {
          total: action.payload.total,
          totalPages: action.payload.total_pages,
          currentPage: action.payload.current_page,
          pageSize: action.payload.page_size,
        };
      })
      .addCase(fetchProgrammeTypes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default programmeTypeSlice.reducer;
