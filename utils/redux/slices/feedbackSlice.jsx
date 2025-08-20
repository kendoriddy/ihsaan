import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { http2 } from "@/hooks/axios/axios";

// Async thunk to fetch feedbacks with filters
export const fetchFeedbacks = createAsyncThunk(
  "feedback/fetchFeedbacks",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      // Add filters to query params
      Object.keys(filters).forEach((key) => {
        if (
          filters[key] !== undefined &&
          filters[key] !== null &&
          filters[key] !== ""
        ) {
          params.append(key, filters[key]);
        }
      });

      const response = await http2.get(
        `/feedback-ticket/feedbacks/?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch feedbacks"
      );
    }
  }
);

// Async thunk to fetch single feedback by ID
export const fetchFeedbackById = createAsyncThunk(
  "feedback/fetchFeedbackById",
  async (feedbackId, { rejectWithValue }) => {
    try {
      const response = await http2.get(
        `/feedback-ticket/feedbacks/${feedbackId}/`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch feedback details"
      );
    }
  }
);

// Async thunk to create feedback
export const createFeedback = createAsyncThunk(
  "feedback/createFeedback",
  async (feedbackData, { rejectWithValue, dispatch }) => {
    try {
      const response = await http2.post(
        "/feedback-ticket/feedbacks/",
        feedbackData
      );

      // Refetch feedbacks to get the latest data
      dispatch(fetchFeedbacks());

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create feedback"
      );
    }
  }
);

// Async thunk to update feedback
export const updateFeedback = createAsyncThunk(
  "feedback/updateFeedback",
  async ({ feedbackId, feedbackData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await http2.patch(
        `/feedback-ticket/feedbacks/${feedbackId}/`,
        feedbackData
      );

      // Refetch feedbacks to get the latest data
      dispatch(fetchFeedbacks());

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update feedback"
      );
    }
  }
);

// Async thunk to delete feedback
export const deleteFeedback = createAsyncThunk(
  "feedback/deleteFeedback",
  async (feedbackId, { rejectWithValue, dispatch }) => {
    try {
      await http2.delete(`/feedback-ticket/feedbacks/${feedbackId}/`);

      // Refetch feedbacks to get the latest data
      dispatch(fetchFeedbacks());

      return feedbackId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete feedback"
      );
    }
  }
);

// Async thunk to upload feedback resource
export const uploadFeedbackResource = createAsyncThunk(
  "feedback/uploadFeedbackResource",
  async (resourceData, { rejectWithValue }) => {
    try {
      const response = await http2.post(
        "/resource/feedback-resource/",
        resourceData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload resource"
      );
    }
  }
);

const feedbackSlice = createSlice({
  name: "feedback",
  initialState: {
    feedbacks: [],
    selectedFeedback: null,
    total_count: 0,
    next: null,
    previous: null,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    fetchDetailStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    createStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    updateStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    deleteStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    uploadResourceStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    fetchDetailError: null,
    createError: null,
    updateError: null,
    deleteError: null,
    uploadResourceError: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.fetchDetailError = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
      state.uploadResourceError = null;
    },
    resetFetchDetailStatus: (state) => {
      state.fetchDetailStatus = "idle";
      state.fetchDetailError = null;
    },
    resetCreateStatus: (state) => {
      state.createStatus = "idle";
      state.createError = null;
    },
    resetUpdateStatus: (state) => {
      state.updateStatus = "idle";
      state.updateError = null;
    },
    resetDeleteStatus: (state) => {
      state.deleteStatus = "idle";
      state.deleteError = null;
    },
    resetUploadResourceStatus: (state) => {
      state.uploadResourceStatus = "idle";
      state.uploadResourceError = null;
    },
    clearSelectedFeedback: (state) => {
      state.selectedFeedback = null;
    },
    setFeedbackFilters: (state, action) => {
      // This can be used to store current filters in state if needed
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch feedbacks
      .addCase(fetchFeedbacks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.feedbacks = action.payload.results || action.payload;
        state.total_count = action.payload.count || 0;
        state.next = action.payload.next;
        state.previous = action.payload.previous;
        state.error = null;
      })
      .addCase(fetchFeedbacks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch feedbacks";
      })
      // Fetch feedback by ID
      .addCase(fetchFeedbackById.pending, (state) => {
        state.fetchDetailStatus = "loading";
        state.fetchDetailError = null;
      })
      .addCase(fetchFeedbackById.fulfilled, (state, action) => {
        state.fetchDetailStatus = "succeeded";
        state.selectedFeedback = action.payload;
        state.fetchDetailError = null;
      })
      .addCase(fetchFeedbackById.rejected, (state, action) => {
        state.fetchDetailStatus = "failed";
        state.fetchDetailError =
          action.payload || "Failed to fetch feedback details";
      })
      // Create feedback
      .addCase(createFeedback.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createFeedback.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.createError = null;
      })
      .addCase(createFeedback.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload || "Failed to create feedback";
      })
      // Update feedback
      .addCase(updateFeedback.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateFeedback.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        state.updateError = null;
      })
      .addCase(updateFeedback.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload || "Failed to update feedback";
      })
      // Delete feedback
      .addCase(deleteFeedback.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.deleteError = null;
      })
      .addCase(deleteFeedback.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError = action.payload || "Failed to delete feedback";
      })
      // Upload resource
      .addCase(uploadFeedbackResource.pending, (state) => {
        state.uploadResourceStatus = "loading";
        state.uploadResourceError = null;
      })
      .addCase(uploadFeedbackResource.fulfilled, (state, action) => {
        state.uploadResourceStatus = "succeeded";
        state.uploadResourceError = null;
      })
      .addCase(uploadFeedbackResource.rejected, (state, action) => {
        state.uploadResourceStatus = "failed";
        state.uploadResourceError =
          action.payload || "Failed to upload resource";
      });
  },
});

export const {
  clearErrors,
  resetFetchDetailStatus,
  resetCreateStatus,
  resetUpdateStatus,
  resetDeleteStatus,
  resetUploadResourceStatus,
  clearSelectedFeedback,
  setFeedbackFilters,
} = feedbackSlice.actions;

export default feedbackSlice.reducer;
