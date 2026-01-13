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

// Async thunk to fetch feedbacks using current state filters
export const fetchFeedbacksWithCurrentFilters = createAsyncThunk(
  "feedback/fetchFeedbacksWithCurrentFilters",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { filters } = state.feedback;

      // Check cache first
      const cacheKey = JSON.stringify(filters);
      const cached = state.feedback.cache[cacheKey];

      // Return cached data if it's less than 5 minutes old
      if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
        return {
          results: cached.feedbacks,
          count: cached.total_count,
          next: cached.next,
          previous: cached.previous,
          fromCache: true,
        };
      }

      const params = new URLSearchParams();

      // Add filters to query params, excluding 'all' values
      Object.keys(filters).forEach((key) => {
        const value = filters[key];
        if (
          value !== undefined &&
          value !== null &&
          value !== "" &&
          value !== "all"
        ) {
          // Handle special cases
          if (key === "is_resolved") {
            params.append(key, value === "resolved");
          } else {
            params.append(key, value);
          }
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

// Async thunk to mark feedback as resolved
export const markFeedbackAsResolved = createAsyncThunk(
  "feedback/markFeedbackAsResolved",
  async ({ feedbackId, feedbackData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await http2.post(
        `/feedback-ticket/feedbacks/${feedbackId}/mark_as_resolved/`,
        feedbackData
      );

      // Refetch feedbacks to get the latest data
      dispatch(fetchFeedbacksWithCurrentFilters());

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark feedback as resolved"
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
    current_page: 1,
    total_pages: 1,
    page_size: 10,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    fetchDetailStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    createStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    updateStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    markAsResolvedStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    deleteStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    uploadResourceStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    fetchDetailError: null,
    createError: null,
    updateError: null,
    markAsResolvedError: null,
    deleteError: null,
    uploadResourceError: null,
    // Filter state management
    filters: {
      subject: "all", // 'all' | 'course' | 'book' | 'platform' | 'tutor' | 'other'
      is_resolved: "all", // 'all' | 'resolved' | 'active'
      search: "",
      page: 1,
      page_size: 10,
    },
    // Cache for different filter combinations
    cache: {},
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.fetchDetailError = null;
      state.createError = null;
      state.updateError = null;
      state.markAsResolvedError = null;
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
    resetMarkAsResolvedStatus: (state) => {
      state.markAsResolvedStatus = "idle";
      state.markAsResolvedError = null;
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
      state.filters = { ...state.filters, ...action.payload };
    },
    setSubjectFilter: (state, action) => {
      state.filters.subject = action.payload;
      state.filters.page = 1; // Reset to first page when filter changes
    },
    setStatusFilter: (state, action) => {
      state.filters.is_resolved = action.payload;
      state.filters.page = 1; // Reset to first page when filter changes
    },
    setSearchFilter: (state, action) => {
      state.filters.search = action.payload;
      state.filters.page = 1; // Reset to first page when filter changes
    },
    setPage: (state, action) => {
      state.filters.page = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        subject: "all",
        is_resolved: "all",
        search: "",
        page: 1,
        page_size: 10,
      };
    },
    clearCache: (state) => {
      state.cache = {};
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
        state.feedbacks = action.payload.results || [];
        state.total_count = action.payload.total || 0;
        state.next = action.payload.links?.next;
        state.previous = action.payload.links?.previous;
        state.current_page = action.payload.current_page || 1;
        state.total_pages = action.payload.total_pages || 1;
        state.page_size = action.payload.page_size || 10;
        state.error = null;

        // Cache the results for this filter combination
        const cacheKey = JSON.stringify(state.filters);
        state.cache[cacheKey] = {
          feedbacks: action.payload.results || [],
          total_count: action.payload.total || 0,
          next: action.payload.links?.next,
          previous: action.payload.links?.previous,
          current_page: action.payload.current_page || 1,
          total_pages: action.payload.total_pages || 1,
          page_size: action.payload.page_size || 10,
          timestamp: Date.now(),
        };
      })
      .addCase(fetchFeedbacks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch feedbacks";
      })
      // Fetch feedbacks with current filters
      .addCase(fetchFeedbacksWithCurrentFilters.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFeedbacksWithCurrentFilters.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.feedbacks = action.payload.results || [];
        state.total_count = action.payload.total || 0;
        state.next = action.payload.links?.next;
        state.previous = action.payload.links?.previous;
        state.current_page = action.payload.current_page || 1;
        state.total_pages = action.payload.total_pages || 1;
        state.page_size = action.payload.page_size || 10;
        state.error = null;

        // Only cache if not from cache
        if (!action.payload.fromCache) {
          const cacheKey = JSON.stringify(state.filters);
          state.cache[cacheKey] = {
            feedbacks: action.payload.results || [],
            total_count: action.payload.total || 0,
            next: action.payload.links?.next,
            previous: action.payload.links?.previous,
            current_page: action.payload.current_page || 1,
            total_pages: action.payload.total_pages || 1,
            page_size: action.payload.page_size || 10,
            timestamp: Date.now(),
          };
        }
      })
      .addCase(fetchFeedbacksWithCurrentFilters.rejected, (state, action) => {
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
      // Mark feedback as resolved
      .addCase(markFeedbackAsResolved.pending, (state) => {
        state.markAsResolvedStatus = "loading";
        state.markAsResolvedError = null;
      })
      .addCase(markFeedbackAsResolved.fulfilled, (state, action) => {
        state.markAsResolvedStatus = "succeeded";
        state.markAsResolvedError = null;
      })
      .addCase(markFeedbackAsResolved.rejected, (state, action) => {
        state.markAsResolvedStatus = "failed";
        state.markAsResolvedError =
          action.payload || "Failed to mark feedback as resolved";
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
  resetMarkAsResolvedStatus,
  resetDeleteStatus,
  resetUploadResourceStatus,
  clearSelectedFeedback,
  setFeedbackFilters,
  setSubjectFilter,
  setStatusFilter,
  setSearchFilter,
  setPage,
  clearFilters,
  clearCache,
} = feedbackSlice.actions;

export default feedbackSlice.reducer;
